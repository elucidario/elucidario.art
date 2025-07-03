import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { RawRuleOf, MongoAbility } from "@casl/ability";

import {
    Hooks,
    Body,
    AuthContext,
    QueryStrings,
    ParamsWithWorkspace,
} from "@/types";
import { Config as ConfigType, ConfigTypes, User } from "@elucidario/mdorim";
import { ConfigQuery } from "@/queries";
import { Graph } from "@/db";

import AbstractService from "../AbstractService";
import { Config } from "@/model";
import { RecordShape } from "neo4j-driver";

/**
 * # ConfigService
 * This service class provides methods to manage configurations in the application.
 * It extends the AbstractService class and implements methods for creating,
 * reading, updating, deleting, and listing configurations.
 */
export class ConfigService extends AbstractService<
    ConfigType<ConfigTypes>,
    Config,
    ConfigQuery
> {
    /**
     * # ConfigService constructor
     * @param model - The membership model
     * @param query - The membership query
     * @param graph - The graph database instance
     * @param hooks - The service hooks
     * @param fastify - The Fastify instance
     */
    constructor(
        model: Config,
        query: ConfigQuery,
        graph: Graph,
        hooks: Hooks,
        fastify: FastifyInstance,
    ) {
        super(model, query, graph, hooks, fastify);
        this.register();
    }

    /**
     * ## Registers the service hooks for authorization rules.
     * This method adds a filter to the "authorization.rules" hook
     * to set abilities based on the user's role.
     */
    protected register() {
        this.hooks.filters.add<
            RawRuleOf<MongoAbility>[],
            [AuthContext<ConfigType<ConfigTypes>>]
        >("authorization.rules", (abilities, context) =>
            this.setAbilities(abilities, context),
        );
    }

    /**
     * ## Sets the abilities for the user based on their role.
     * This method modifies the abilities array to include management permissions.
     *
     * @param abilities - The current abilities array.
     * @param context - The authentication context containing user and role information.
     * @returns The modified abilities array.
     */
    protected setAbilities(
        abilities: RawRuleOf<MongoAbility>[],
        context: AuthContext<ConfigType<ConfigTypes>>,
    ): RawRuleOf<MongoAbility>[] {
        const { role } = context;

        if (role === "sysadmin") {
            abilities.push({
                action: "manage",
                subject: "Config",
            });
        }

        return abilities;
    }

    /**
     * ## Creates a new configuration.
     * This method processes the request to create a new configuration
     * and returns the created configuration.
     *
     * @param request - The Fastify request object containing the configuration data.
     * @param reply - The Fastify reply object to send the response.
     * @returns The created configuration.
     * @throws Error if the creation fails or if unauthorized.
     */
    async create(
        request: FastifyRequest<
            ParamsWithWorkspace & Body<ConfigType<ConfigTypes>> & QueryStrings
        >,
        reply: FastifyReply,
    ): Promise<ConfigType<ConfigTypes>> {
        try {
            const data = this.parseBodyRequest(request);

            const response = await this.setMainConfig(data);

            this.model.set(response);
            return reply.code(201).send(this.model.get());
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * ## Reads a configuration.
     * This method processes the request to read a configuration
     * and returns the found configuration.
     *
     * @param request - The Fastify request object containing the configuration data.
     * @param reply - The Fastify reply object to send the response.
     * @returns The found configuration.
     * @throws Error if the read fails or if unauthorized.
     */
    async read(
        request: FastifyRequest<
            ParamsWithWorkspace & Body<ConfigType<ConfigTypes>> & QueryStrings
        >,
        reply: FastifyReply,
    ): Promise<ConfigType<ConfigTypes> | null> {
        try {
            await this.processRequest(request);

            if (!this.getPermissions().can("read", this.model)) {
                throw this.error("Unauthorized", 403);
            }

            const mainConfig = await this.getMainConfig();
            if (!mainConfig) {
                throw this.error("Main config not found", 404);
            }
            this.model.set(mainConfig);
            return reply.send(this.model.get());
        } catch (e) {
            throw this.error(e);
        }
    }

    /**
     * ## Retrieves the main configuration from the database.
     * This method queries the database to find the main configuration node
     * and returns it along with its associated sysadmins.
     *
     * @returns The main configuration or null if not found.
     * @throws Error if the query fails.
     */
    protected async getMainConfig(): Promise<ConfigType<ConfigTypes> | null> {
        const cypher = this.query.cypher;
        const configNode = cypher.NamedNode("c");
        const userNode = cypher.NamedNode("u");
        const matchMainConfig = cypher.Match(
            cypher
                .Pattern(configNode, {
                    labels: "MainConfig",
                })
                .related(cypher.Relationship(), {
                    type: "SYSADMIN",
                    direction: "left",
                })
                .to(userNode, {
                    labels: "User",
                }),
        );

        const returnConfig = cypher.Return(configNode, [
            cypher.collect(userNode),
            "sysadmins",
        ]);

        const { cypher: cypherQuery, params } = this.query.cypher
            .concat(matchMainConfig, returnConfig)
            .build();

        return this.graph.executeQuery<ConfigType<ConfigTypes> | null>(
            ({ records }) => {
                if (records.length === 0) {
                    return null;
                }

                const [first] = records;

                const config = first.get("c");

                if (!config) {
                    return null;
                }

                const sysadmins = first
                    .get("sysadmins")
                    .map((node: RecordShape) =>
                        this.graph.parseNode<User>(node),
                    );

                return {
                    ...this.graph.parseNode<ConfigType<ConfigTypes>>(config),
                    sysadmins: sysadmins.length > 0 ? sysadmins : undefined,
                };
            },
            cypherQuery,
            params,
        );
    }

    /**
     * ## Sets the main configuration in the database.
     * This method creates a new main configuration node and associates it with the first sysadmin.
     *
     * @param data - The configuration data to set.
     * @returns The created configuration.
     * @throws Error if unauthorized or if validation fails.
     */
    protected async setMainConfig(
        data: Partial<ConfigType<ConfigTypes>>,
    ): Promise<ConfigType<ConfigTypes>> {
        const mainConfig = await this.getMainConfig();
        if (mainConfig) {
            throw this.error("Unauthorized.", 403);
        }

        await this.model.validateEntity(data);

        if (data.sysadmins?.length === 0) {
            throw this.error("At least one sysadmin is required.", 400);
        }

        const configNode = this.query.cypher.NamedNode("c");

        const createConfig = this.query.cypher.Create(
            this.query.cypher.Pattern(configNode, {
                labels: "MainConfig",
                properties: {
                    uuid: this.query.cypher.Uuid(),
                    type: this.query.cypher.Param(data.type),
                },
            }),
        );

        const userNode = this.query.cypher.NamedNode("u");
        const userQuery = this.fastify.services.user.query;
        const createFirsUser = userQuery.create({
            data: data.sysadmins![0],
            labels: "User",
            returnClause: false,
            node: userNode,
        });

        const createSysadmins = this.query.cypher
            .Create(
                this.query.cypher
                    .Pattern(userNode)
                    .related(this.query.cypher.Relationship(), {
                        type: "SYSADMIN",
                    })
                    .to(configNode),
            )
            .with(userNode, configNode)
            .return(userNode, configNode);

        const { cypher, params } = this.query.cypher
            .concat(createConfig, createFirsUser, createSysadmins)
            .build();

        return await this.graph.executeQuery<ConfigType<ConfigTypes>>(
            (res) => {
                if (res.records.length === 0) {
                    throw this.error("Failed to create config", 500);
                }
                const [first] = res.records;

                const config = this.graph.parseNode<ConfigType<ConfigTypes>>(
                    first.get("c"),
                );

                const sysadmin = this.graph.parseNode<User>(first.get("u"));

                config.sysadmins = [sysadmin];
                return config;
            },
            cypher,
            params,
        );
    }

    /**
     * Updates a user in the database.
     * @param id - The user's ID.
     * @param args - The fields to update.
     * @returns The updated user.
     * @throws MdorimError if the user is invalid or update fails.
     */
    async update(): Promise<ConfigType<ConfigTypes>> {
        throw this.error("not implemented yet", 501);
    }
}
