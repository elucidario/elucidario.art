import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

import { Hooks, Body } from "@/types";
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
     * ConfigService constructor
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
    }

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

    protected async setMainConfig(
        data: Partial<ConfigType<ConfigTypes>>,
    ): Promise<ConfigType<ConfigTypes>> {
        const mainConfig = await this.getMainConfig();
        if (mainConfig) {
            throw this.error(
                "Main config already exists. Use update method to modify it.",
                409,
            );
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

    async create(
        request: FastifyRequest<Body<ConfigType<ConfigTypes>>>,
        reply: FastifyReply,
    ): Promise<ConfigType<ConfigTypes>> {
        try {
            const data = this.parseBodyRequest(request);

            const response = await this.setMainConfig(data);

            this.model.set(response);
            return reply.code(201).send(this.model.get());
        } catch (e) {
            console.info("create", e);
            throw this.error(e);
        }
    }

    async read(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<ConfigType<ConfigTypes> | null> {
        try {
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
