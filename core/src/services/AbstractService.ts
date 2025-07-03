import { Graph } from "@/db";
import {
    GraphError,
    isGraphError,
    isNeo4jError,
    isServiceError,
    ServiceError,
} from "@/errors";
import InterfaceModel from "@/model/InterfaceModel";
import InterfaceQuery from "@/queries/InterfaceQuery";
import {
    Hooks,
    QueryStrings,
    ParamsWithWorkspace,
    Body,
    AuthContext,
} from "@/types";
import { MongoAbility, RawRuleOf } from "@casl/ability";
import {
    isMdorimError,
    MdorimBase,
    MdorimError,
    TeamMember,
    TeamMemberRole,
    User,
    Workspace,
} from "@elucidario/mdorim";
import { FastifyInstance, FastifyRequest } from "fastify";

/**
 * # AbstractService
 * This abstract class provides a base for services in the application.
 * It includes methods for handling authentication, authorization, and request processing.
 * Services extending this class must implement the `setAbilities` and `register` methods.
 */
export default abstract class AbstractService<
    TType extends MdorimBase,
    TModel extends InterfaceModel<TType>,
    TQuery extends InterfaceQuery<TType>,
    TParams = Record<string, string>,
    TQueryStrings = Record<string, unknown>,
> {
    context?: AuthContext<TType>;

    body?: Partial<TType>;
    params?: ParamsWithWorkspace<TParams>["Params"];
    queryStrings?: QueryStrings<TQueryStrings>["Querystring"];

    model: TModel;
    query: TQuery;

    protected graph: Graph;
    protected hooks: Hooks;
    protected fastify: FastifyInstance;

    /**
     * # AbstractService constructor
     * @param model - The service model
     * @param query - The service query
     * @param graph - The graph database instance
     * @param hooks - The service hooks
     */
    constructor(
        model: TModel,
        query: TQuery,
        graph: Graph,
        hooks: Hooks,
        fastify: FastifyInstance,
    ) {
        this.model = model;
        this.query = query;
        this.graph = graph;
        this.hooks = hooks;
        this.fastify = fastify;
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
        context: AuthContext<TType>,
    ): RawRuleOf<MongoAbility>[];

    /**
     * ## Registers the service hooks for authorization rules.
     * This method adds a filter to the "authorization.rules" hook
     * to set abilities based on the user's role.
     */
    protected abstract register(): void;

    /**
     * ## Processes the request by parsing the body, params, and query strings.
     * This method is called before executing any action to ensure that the request
     * is properly prepared with the necessary data.
     *
     * @param request - The Fastify request object containing the body, params, and query strings.
     */
    async processRequest(
        request: FastifyRequest<
            ParamsWithWorkspace<TParams> &
                Body<TType> &
                QueryStrings<TQueryStrings>
        >,
    ) {
        this.body = this.parseBodyRequest(request);
        this.params = this.getParams(request);
        this.queryStrings = this.getQueryStrings(request);

        await this.getAuthContext(request);
    }

    /**
     * ## Retrieves the authentication context for the user.
     * This method extracts the user information from the request and determines
     * the user's role within the workspace context.
     *
     * @param request - The Fastify request object containing the user information.
     * @returns The authentication context for the user.
     * @throws ServiceError if the user is not authenticated.
     */
    async getAuthContext(
        request: FastifyRequest<
            ParamsWithWorkspace<TParams> &
                Body<TType> &
                QueryStrings<TQueryStrings>
        >,
    ): Promise<AuthContext<TType>> {
        const user = this.getUser(request);
        if (!user) {
            throw new ServiceError("User not authenticated", 401);
        }

        let role: TeamMemberRole | "sysadmin" = "anonymous";

        if (this.params?.workspaceUUID) {
            // If a workspace UUID is provided, we need to check if the user is a member of that workspace.
            // This is essential for actions that require a workspace context, such as creating or modifying entities
            // that are tied to a specific workspace.
            const workspaceNode = this.query.cypher.NamedNode("workspace");
            const memberNode = this.query.cypher.NamedNode("member");
            const memberOf = this.query.cypher.NamedRelationship("memberOf");

            const matchWorkspace = this.query.cypher.Match(
                this.query.cypher.Pattern(workspaceNode, {
                    labels: ["Workspace"],
                    properties: {
                        uuid: this.query.cypher.Param(
                            this.params.workspaceUUID,
                        ),
                    },
                }),
            );

            const matchRelationship = this.query.cypher
                .OptionalMatch(
                    this.query.cypher
                        .Pattern(this.query.cypher.Node(), {
                            labels: ["User"],
                            properties: {
                                uuid: this.query.cypher.Param(user.uuid),
                            },
                        })
                        .related(this.query.cypher.Relationship(), {
                            type: "SAME_AS",
                        })
                        .to(memberNode)
                        .related(memberOf, {
                            type: "MEMBER_OF",
                        })
                        .to(workspaceNode),
                )
                .with(memberNode, memberOf, workspaceNode)
                .return(memberNode, memberOf, workspaceNode);

            const { cypher, params } = this.query.cypher
                .concat(matchWorkspace, matchRelationship)
                .build();

            const { workspace, role: memberRole } =
                await this.graph.executeQuery(
                    ({ records }) => {
                        // If no records are found, the user is not a member of the workspace
                        if (records.length === 0) {
                            throw new ServiceError(
                                "User is not a member of the workspace",
                                403,
                            );
                        }

                        const [first] = records;
                        const workspace = this.graph.parseNode<Workspace>(
                            first.get("workspace"),
                        );
                        const member = this.graph.parseNode<TeamMember>(
                            first.get("member"),
                        );

                        if (!member) {
                            throw new ServiceError(
                                "User is not a member of the workspace",
                                403,
                            );
                        }

                        return { workspace, role: member.role };
                    },
                    cypher,
                    params,
                );
            request.workspace = workspace;
            role = memberRole as TeamMemberRole;
        } else {
            // If no workspace is provided, check if the user is a sysadmin
            // This is a fallback for when the user is not part of any workspace
            // and we need to determine if they are a sysadmin.
            // This is useful for global configurations or actions that do not require a workspace context.
            const sysAdminRelationship =
                this.query.cypher.NamedRelationship("sysadminOf");

            const { cypher, params } = this.query.cypher
                .OptionalMatch(
                    this.query.cypher
                        .Pattern(this.query.cypher.Node(), {
                            labels: ["User"],
                            properties: {
                                uuid: this.query.cypher.Param(user.uuid),
                            },
                        })
                        .related(sysAdminRelationship, {
                            type: "SYSADMIN",
                        })
                        .to(this.query.cypher.NamedNode("sysadmin"), {
                            labels: ["MainConfig"],
                        }),
                )
                .return(sysAdminRelationship)
                .build();

            role = await this.graph.executeQuery(
                ({ records }) => {
                    if (records.length === 0) {
                        // If no records are found, the user is not a sysadmin
                        return "anonymous";
                    }
                    const [first] = records;
                    const sysAdmin = first.get("sysadminOf");
                    if (sysAdmin.type.includes("SYSADMIN")) {
                        return "sysadmin";
                    } else {
                        throw new ServiceError("User is not a sysadmin", 403);
                    }
                },
                cypher,
                params,
            );
        }

        this.context = {
            user: user as User,
            role: role as TeamMemberRole,
            workspace: request.workspace || null,
            entity: this.model.data as TType,
        };

        return this.context;
    }

    /**
     * ## Retrieves the permissions for the user based on their context.
     *
     * @returns The MongoAbility instance containing the user's permissions.
     * @throws ServiceError if the authorization context is not set.
     */
    getPermissions(): MongoAbility {
        try {
            if (typeof this.context === "undefined") {
                throw new ServiceError("Authorization context is not set", 500);
            }
            return this.fastify.auth.z.permissions<TType>(this.context);
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * ## Parses the body of the request.
     * This method extracts the body from the Fastify request and returns it as a partial type.
     *
     * @param request - The Fastify request object containing the body.
     * @returns The parsed body as a partial type of TType.
     */
    parseBodyRequest(request: FastifyRequest): Partial<TType> {
        return request.body as Partial<TType>;
    }

    /**
     * ## Retrieves the user from the request.
     * This method extracts the user information from the Fastify request object.
     *
     * @param request - The Fastify request object containing the user information.
     * @returns The user object if available, otherwise undefined.
     */
    getUser(request: FastifyRequest): User | undefined {
        return request.user;
    }

    /**
     * ## Retrieves the query strings from the request.
     * This method extracts the query strings from the Fastify request object.
     *
     * @param request - The Fastify request object containing the query strings.
     * @returns The query strings as a QueryStrings type.
     */
    getQueryStrings(
        request: FastifyRequest,
    ): QueryStrings<TQueryStrings>["Querystring"] {
        return request.query as QueryStrings<TQueryStrings>["Querystring"];
    }

    /**
     * ## Retrieves the parameters from the request.
     * This method extracts the parameters from the Fastify request object.
     *
     * @param request - The Fastify request object containing the parameters.
     * @returns The parameters as a Params type.
     */
    getParams(
        request: FastifyRequest<ParamsWithWorkspace<TParams>>,
    ): ParamsWithWorkspace<TParams>["Params"] {
        return request.params as ParamsWithWorkspace<TParams>["Params"];
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
            e = new ServiceError(e, statusCode);
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
