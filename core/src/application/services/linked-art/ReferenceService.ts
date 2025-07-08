import { MongoAbility, RawRuleOf } from "@casl/ability";
import {
    GenericType,
    Reference as ReferenceType,
    UUID,
} from "@elucidario/mdorim";

import { AuthContext, Hooks, ListParams } from "@/types";
import { Graph } from "@/application/Graph";
import AService from "../AService";
import { ReferenceQuery } from "@/application/queries/linked-art";
import { Reference } from "@/domain/models/linked-art";
import { Authorization } from "@/application/Authorization";
import { Validator } from "@/application/Validator";
import { Param } from "@neo4j/cypher-builder";

/**
 * # ReferenceService
 * This service class provides methods to manage references in the application.
 * It extends the AService class and implements methods for creating,
 * reading, updating, deleting, and listing references  .
 */
export class ReferenceService extends AService<
    ReferenceType<GenericType>,
    ReferenceQuery
> {
    /**
     * ReferenceService constructor
     * @param model - The reference model
     * @param query - The reference query
     * @param graph - The graph database instance
     * @param hooks - The service hooks
     * @param fastify - The Fastify instance
     */
    constructor(
        protected validator: Validator,
        protected query: ReferenceQuery,
        protected authorization: Authorization,
        protected graph: Graph,
        protected hooks: Hooks,
    ) {
        super(validator, query, authorization, graph, hooks);
        this.register();
    }

    /**
     * ## Registers the service hooks for authorization rules.
     *
     * This method adds a filter to the "authorization.rules" hook to set
     * abilities based on the user's role in the context.
     */
    protected register() {
        this.hooks.filters.add<
            RawRuleOf<MongoAbility>[],
            [AuthContext<ReferenceType<GenericType>>]
        >("authorization.rules", (abilities, context) =>
            this.setAbilities(abilities, context),
        );
    }

    /**
     * ## Sets abilities for the Reference service based on the user's role.
     *
     * This method modifies the abilities array to include management permissions.
     *
     * @param abilities - The current abilities array.
     * @param context - The authentication context containing user and role information.
     * @returns The modified abilities array.
     */
    protected setAbilities(
        abilities: RawRuleOf<MongoAbility>[],
        context: AuthContext<ReferenceType<GenericType>>,
    ): RawRuleOf<MongoAbility>[] {
        const { role } = context;

        if (["admin", "sysadmin"].includes(role)) {
            abilities.push({
                action: "manage",
                subject: "Reference",
            });
        }

        return abilities;
    }

    /**
     * ## Creates a new Reference in the database.
     *
     * @param params The parameters for the Reference to create.
     * @returns The created Reference.
     * @throws Error if the creation fails.
     */
    async create<T extends GenericType>(
        data: Partial<ReferenceType<T>>,
    ): Promise<ReferenceType<T>> {
        try {
            const model = new Reference();

            if (!this.getPermissions().can("create", model)) {
                throw this.error("Unauthorized", 403);
            }

            const context = this.getContext();

            if (!context?.workspace) {
                throw this.error("Workspace is required", 400);
            }

            this.validator.setModel(model);

            await this.validator.validateEntity({ data });

            const schema = this.validator.getSchema();

            model.set(
                await this.graph.writeTransaction(async (tx) => {
                    const { cypher, params: cypherParams } = this.query
                        .createReference(data, context.workspace!.uuid!, schema)
                        .build();

                    const result = await tx.run(cypher, cypherParams);

                    if (result.records.length === 0) {
                        throw this.error("Failed to create Reference", 500);
                    }

                    return result.records.reduce((acc, record) => {
                        const nodes = record.keys.reduce(
                            (acc, key) => {
                                const node = record.get(key);
                                if (node && node.properties) {
                                    acc[key as string] =
                                        this.graph.parseNode<
                                            ReferenceType<GenericType>
                                        >(node);
                                }
                                return acc;
                            },
                            {} as Record<string, ReferenceType<GenericType>>,
                        );

                        acc = !acc.uuid
                            ? (nodes.reference as ReferenceType<T>)
                            : acc;

                        if (nodes.equivalent) {
                            if (!acc.equivalent) {
                                acc.equivalent = [];
                            }
                            acc.equivalent.push(
                                nodes.equivalent as ReferenceType<GenericType>,
                            );
                        }

                        return acc;
                    }, {} as ReferenceType<T>);
                }),
            );

            return model.get() as ReferenceType<T>;
        } catch (error) {
            console.log(error);
            throw this.error(error);
        }
    }

    /**
     * ## Reads a Reference from the database.
     *
     * @param uuid The UUID of the Reference to read.
     * @returns The found Reference.
     * @throws Error if the read fails.
     */
    async read(data: Partial<ReferenceType<GenericType>>) {
        try {
            const model = new Reference();
            if (!this.getPermissions().can("read", model)) {
                throw this.error("Unauthorized", 403);
            }

            this.validator.setModel(model);
            await this.validator.validateEntity({ data });

            const referenceNode = this.query.cypher.NamedNode("reference");
            const equivalentNode = this.query.cypher.NamedNode("equivalent");

            const matchQuery = this.query.read({
                data,
                labels: "Reference",
                node: referenceNode,
                optionalMatch: false,
                returnClause: false,
            });

            const matchEquivalent = this.query.cypher.OptionalMatch(
                this.query.cypher
                    .Pattern(referenceNode, {
                        labels: ["Reference"],
                        properties: Object.keys(data).reduce(
                            (acc, key) => {
                                acc[key] = this.query.cypher.Param(
                                    data[
                                        key as keyof ReferenceType<GenericType>
                                    ],
                                );
                                return acc;
                            },
                            {} as Record<string, Param>,
                        ),
                    })
                    .related(this.query.cypher.Relationship(), {
                        type: "EQUIVALENT",
                    })
                    .to(equivalentNode, {
                        labels: ["Reference"],
                    }),
            );

            const returnClause = this.query.cypher.Return(
                referenceNode,
                equivalentNode,
            );

            const { cypher, params } = this.query.cypher
                .concat(matchQuery, matchEquivalent, returnClause)
                .build();

            model.set(
                await this.graph.executeQuery(
                    ({ records }) => {
                        if (records.length === 0) {
                            throw this.error("Reference not found", 404);
                        }
                        return records.reduce((acc, record) => {
                            const node = record.get("reference");
                            if (
                                node &&
                                node.properties &&
                                (!acc.uuid || acc.uuid !== node.properties.uuid)
                            ) {
                                acc =
                                    this.graph.parseNode<
                                        ReferenceType<GenericType>
                                    >(node);
                            }
                            const equivalentNode = record.get("equivalent");
                            if (equivalentNode && equivalentNode.properties) {
                                if (!acc.equivalent) {
                                    acc.equivalent = [];
                                }
                                acc.equivalent.push(
                                    this.graph.parseNode<
                                        ReferenceType<GenericType>
                                    >(equivalentNode),
                                );
                            }

                            return acc;
                        }, {} as ReferenceType<GenericType>);
                    },
                    cypher,
                    params,
                ),
            );

            return model.get();
        } catch (error) {
            console.log(error);
            throw this.error(error);
        }
    }

    /**
     * ## Updates a Reference in the database.
     *
     * IMPORTANT: This method does not update relationships between References,
     * you should use appropriate methods to manage relationships separately.
     *
     * @param uuid The UUID of the Reference to update.
     * @param params The new data for the Reference.
     * @returns The updated Reference.
     */
    async update(
        referenceUUID: UUID,
        data: Partial<ReferenceType<GenericType>>,
    ) {
        try {
            const model = new Reference();
            if (!this.getPermissions().can("update", model)) {
                throw this.error("Unauthorized", 403);
            }

            await this.validator.validateUUID(referenceUUID);
            await this.validator.validateEntity({ data });

            const referenceNode = this.query.cypher.NamedNode("reference");

            const { cypher, params: queryParams } = this.query
                .update({
                    uuid: referenceUUID,
                    data,
                    labels: "Reference",
                    node: referenceNode,
                })
                .build();

            model.set(
                await this.graph.executeQuery(
                    ({ records }) => {
                        if (records.length === 0) {
                            throw this.error("Reference not found", 404);
                        }

                        const [first] = records;
                        return this.graph.parseNode<ReferenceType<GenericType>>(
                            first.get("reference"),
                        );
                    },
                    cypher,
                    queryParams,
                ),
            );

            return model.get();
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * ## Deletes a Reference from the database.
     *
     * @param uuid The UUID of the Reference to delete.
     * @returns A boolean indicating whether the deletion was successful.
     * @throws Error if the deletion fails.
     */
    async delete(referenceUUID: UUID): Promise<boolean> {
        try {
            const model = new Reference();
            if (!this.getPermissions().can("delete", model)) {
                throw this.error("Unauthorized", 403);
            }

            await this.validator.validateUUID(referenceUUID);

            const { cypher, params } = this.query
                .delete({
                    uuid: referenceUUID,
                    labels: "Reference",
                })
                .build();

            const removed = await this.graph.executeQuery(
                ({ records }) => {
                    if (records.length === 0) {
                        throw this.error("Reference not found", 404);
                    }

                    const [first] = records;
                    return first.get("removed") as boolean;
                },
                cypher,
                params,
            );

            return removed;
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * ## Lists all References in the database.
     *
     * @param request The Fastify request object containing query parameters.
     * @returns An array of ReferenceType instances.
     * @throws Error if the listing fails.
     */
    async list(args?: ListParams): Promise<ReferenceType<GenericType>[]> {
        try {
            const model = new Reference();
            if (!this.getPermissions().can("read", model)) {
                throw this.error("Unauthorized", 403);
            }

            await this.validator.validateNumber(args?.limit);
            await this.validator.validateNumber(args?.offset);

            const { cypher, params } = this.query
                .list({
                    limit: args?.limit || 10,
                    offset: args?.offset || 0,
                    labels: args?.type ? args.type : "Reference",
                })
                .build();

            return this.processList(
                await this.graph.executeQuery<ReferenceType<GenericType>[]>(
                    (response) => {
                        const { records } = response;

                        if (records.length === 0) {
                            return [];
                        }

                        return records.map((record) => {
                            return this.graph.parseNode<
                                ReferenceType<GenericType>
                            >(record.get("u"));
                        });
                    },
                    cypher,
                    params,
                ),
            );
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Processes a list of references, filtering out null and undefined values,
     * and initializing each reference with the Reference model instance before returning
     * its properties.
     *
     * @param list - The list of references to process.
     * @returns An array of ReferenceType instances.
     */
    processList(
        list: Array<ReferenceType<GenericType> | null | undefined>,
    ): Array<ReferenceType<GenericType>> {
        return list
            .filter(
                (user): user is ReferenceType<GenericType> =>
                    user !== null && user !== undefined,
            )
            .map(
                (user) =>
                    new Reference(user).get() as ReferenceType<GenericType>,
            );
    }
}
