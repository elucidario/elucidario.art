import { MongoAbility, RawRuleOf } from "@casl/ability";
import {
    isMdorimError,
    MdorimBase,
    HistoryAction,
    MdorimError,
    LinkedArtBase,
} from "@elucidario/mdorim";

import IQuery from "@/application/queries/IQuery";
import { Graph } from "@/application/Graph";
import {
    GraphError,
    isGraphError,
    isNeo4jError,
    isServiceError,
    ServiceError,
} from "@/domain/errors";
import { Hooks, AuthContext } from "@/types";
import { Validator } from "@/application/Validator";
import { Auth } from "@/application/auth/Auth";
import { ManagedTransaction } from "neo4j-driver";
import { Clause } from "@neo4j/cypher-builder";

/**
 * # AbstractService
 * This abstract class provides a base for services in the application.
 * Services extending this class must implement the `setAbilities` and `register` methods.
 */
export default abstract class AService<
    TType extends MdorimBase,
    TQuery extends IQuery<TType>,
> {
    /**
     * ## The auth context for the service.
     */
    protected context?: AuthContext;

    /**
     * # AbstractService constructor
     *
     * @param validator - The Validator instance used for validating data.
     * @param query - The query instance used for database operations.
     * @param auth - The Auth instance used for managing user permissions.
     * @param graph - The Graph instance used for interacting with the graph database.
     * @param hooks - The Hooks instance used for managing application hooks.
     */
    constructor(
        protected validator: Validator,
        protected query: TQuery,
        protected auth: Auth,
        protected graph: Graph,
        protected hooks: Hooks,
    ) { }

    /**
     * ## Sets the authentication context for the service.
     * This method is used to set the context that contains user and role information.
     *
     * @param context - The authentication context containing user and role information.
     */
    setContext(context: AuthContext): void {
        this.context = context;
    }

    /**
     * ## Gets the authentication context for the service.
     * This method returns the current authentication context if set.
     *
     * @returns The authentication context or undefined if not set.
     */
    getContext(): AuthContext | undefined {
        return this.context;
    }

    /**
     * ## Sets the abilities for the user based on their role.
     * This method modifies the abilities array to include management permissions.
     *
     * @param abilities - The current abilities array.
     * @param context - The authentication context containing user and role information.
     * @returns The modified abilities array.
     */
    protected abstract setAbilities(
        abilities: RawRuleOf<MongoAbility>[],
        context: AuthContext,
    ): RawRuleOf<MongoAbility>[];

    /**
     * ## Registers the service hooks for authorization rules.
     * This method adds a filter to the "authorization.rules" hook
     * to set abilities based on the user's role.
     */
    protected abstract register(): void;

    /**
     * ## Retrieves the permissions for the user based on their context.
     *
     * @returns The MongoAbility instance containing the user's permissions.
     * @throws ServiceError if the authorization context is not set.
     */
    getPermissions(): MongoAbility {
        try {
            if (typeof this.context === "undefined") {
                throw this.error("Auth context is not set", 500);
            }
            return this.auth.permissions(this.context);
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Records the history of changes made to an entity.
     * @param tx - The transaction to use.
     * @param action - The action performed (CREATE, UPDATE, DELETE).
     * @param entity - The entity that was changed.
     * @param userUuid - The UUID of the user who performed the action.
     */
    protected async history<T extends MdorimBase | LinkedArtBase>(
        tx: ManagedTransaction,
        action: HistoryAction,
        entity: T,
        userUuid?: string,
    ) {
        if (!["CREATE", "UPDATE", "DELETE"].includes(action)) {
            throw this.error("Invalid action for history", 400);
        }

        if (!entity || !userUuid) {
            throw this.error("Entity and user UUID are required", 400);
        }

        const cypher = this.query.cypher;

        const entityNode = cypher.NamedNode("entity");
        const userNode = cypher.NamedNode("user");
        const historyNode = cypher.NamedNode("history");
        const previousNode = cypher.NamedNode("previous");

        const clauses: Array<Clause | undefined> = [];

        const { uuid, type } = entity;

        const matchEntity = cypher
            .OptionalMatch(
                cypher.Pattern(entityNode, {
                    labels: [type],
                    properties: {
                        uuid: cypher.Param(uuid),
                    },
                }),
            )
            .with(entityNode);
        clauses.push(matchEntity);

        const matchUser = cypher
            .OptionalMatch(
                cypher.Pattern(userNode, {
                    labels: ["User"],
                    properties: {
                        uuid: cypher.Param(userUuid),
                    },
                }),
            )
            .with(entityNode, userNode);
        clauses.push(matchUser);

        const optionalMatchPrevious = cypher
            .OptionalMatch(
                cypher.Pattern(previousNode, {
                    labels: ["HistoryEvent"],
                    properties: {
                        entityUuid: cypher.Param(uuid),
                    },
                }),
            )
            .orderBy([previousNode.property("timestamp"), "DESC"])
            .limit(1)
            .with(previousNode, entityNode, userNode);
        clauses.push(optionalMatchPrevious);

        const createHistory = cypher
            .Create(
                cypher.Pattern(historyNode, {
                    labels: ["HistoryEvent"],
                    properties: {
                        uuid: cypher.Uuid(),
                        action: cypher.Param(action),
                        timestamp: cypher.Timestamp(),
                        entityUuid: cypher.Param(uuid),
                        snapshot: cypher.Param(JSON.stringify(entity)),
                    },
                }),
            )
            .with(entityNode, userNode, previousNode, historyNode);
        clauses.push(createHistory);

        const createRelationshipIfEntityNotNull = cypher
            .Foreach(cypher.Variable())
            .in(
                cypher
                    .Case()
                    .when(cypher.notNull(entityNode))
                    .then(cypher.Param([cypher.Literal(1)]))
                    .else(cypher.Param([])),
            )
            .do(
                cypher.Create(
                    cypher
                        .Pattern(historyNode)
                        .related(cypher.Relationship(), {
                            type: "HISTORY_OF",
                        })
                        .to(entityNode),
                ),
            )
            .with(historyNode, previousNode, entityNode, userNode);
        clauses.push(createRelationshipIfEntityNotNull);

        const createUserRelationshipIfUserNotNull = cypher
            .Foreach(cypher.Variable())
            .in(
                cypher
                    .Case()
                    .when(cypher.notNull(userNode))
                    .then(cypher.Param([cypher.Literal(1)]))
                    .else(cypher.Param([])),
            )
            .do(
                cypher.Create(
                    cypher
                        .Pattern(userNode)
                        .related(cypher.Relationship(), {
                            type: "EXECUTED",
                        })
                        .to(historyNode),
                ),
            )
            .with(historyNode, previousNode, entityNode, userNode);
        clauses.push(createUserRelationshipIfUserNotNull);

        if (["UPDATE", "DELETE"].includes(action)) {
            const mergePreviousIfNotNull = cypher
                .Foreach(cypher.Variable())
                .in(
                    cypher
                        .Case()
                        .when(cypher.notNull(previousNode))
                        .then(cypher.Param([cypher.Literal(1)]))
                        .else(cypher.Param([])),
                )
                .do(
                    cypher.Merge(
                        cypher
                            .Pattern(historyNode)
                            .related(cypher.Relationship(), {
                                type: "PREVIOUS",
                            })
                            .to(previousNode),
                    ),
                )
                .with(historyNode, previousNode, entityNode, userNode);
            clauses.push(mergePreviousIfNotNull);
        }

        const returnClause = cypher.Return(
            historyNode,
            previousNode,
            entityNode,
            userNode,
        );
        clauses.push(returnClause);

        const { cypher: cypherQuery, params } = cypher
            .concat(...clauses)
            .build();

        await tx.run(cypherQuery, params);
    }

    /**
     * ## Handles errors that occur within the service.
     * This method takes an error object and returns a standardized error response.
     *
     * @param e - The error object to handle.
     * @param statusCode - The HTTP status code to use for the response.
     * @returns A standardized error response.
     */
    error(
        e: unknown,
        statusCode?: number,
    ): ServiceError | MdorimError | GraphError {
        if (typeof e === "string") {
            return new ServiceError(e, statusCode);
        }

        if (isServiceError(e)) {
            return e;
        }

        if (isNeo4jError(e) || isGraphError(e)) {
            return this.graph.error(e, undefined, statusCode);
        }

        if (isMdorimError(e)) {
            return e;
        }

        return new ServiceError(String(e), statusCode);
    }
}
