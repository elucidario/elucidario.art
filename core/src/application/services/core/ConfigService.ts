import { RecordShape } from "neo4j-driver";
import { Config as ConfigType, ConfigTypes, User } from "@elucidario/mdorim";

import { Hooks } from "@/types";
import { Config } from "@/domain/models/core";
import { ConfigQuery, UserQuery } from "@/application/queries/core";
import { Graph } from "@/application/Graph";

import AService from "@/application/services/AService";
import { Validator } from "@/application/Validator";
import { Auth } from "@/application/auth/Auth";
import { ServiceError } from "@/domain/errors";

/**
 * # ConfigService
 * This service class provides methods to manage configurations in the application.
 * It extends the AbstractService class and implements methods for creating,
 * reading, updating, deleting, and listing configurations.
 */
export class ConfigService extends AService<
    ConfigType<ConfigTypes>,
    ConfigQuery
> {
    /**
     * # ConfigService constructor
     */
    constructor(
        protected validator: Validator,
        protected query: ConfigQuery,
        protected auth: Auth,
        protected graph: Graph,
        protected hooks: Hooks,
    ) {
        super(Config, validator, query, auth, graph, hooks);
    }

    /**
     * ## Retrieves a configuration by its label.
     * This method queries the database to find a configuration node with the specified label
     * and returns it along with its associated sysadmins.
     *
     * @param label - The label of the configuration to retrieve.
     * @returns The configuration or null if not found.
     * @throws Error if unauthorized or if the configuration is not found.
     */
    protected async getConfig(label: string): Promise<ConfigType<ConfigTypes>> {
        const cypher = this.query.cypher;
        const configNode = cypher.NamedNode("c");
        const userNode = cypher.NamedNode("u");
        const matchMainConfig = cypher.Match(
            cypher
                .Pattern(configNode, {
                    labels: label,
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

        const config = await this.graph.executeQuery<
            ConfigType<ConfigTypes> | undefined
        >(
            ({ records }) => {
                if (records.length === 0) {
                    return undefined;
                }

                const [first] = records;

                const config = this.graph.parseNode<ConfigType<ConfigTypes>>(
                    first.get("c"),
                );

                if (!config) {
                    return undefined;
                }

                const sysadmins = first
                    .get("sysadmins")
                    .map((node: RecordShape) =>
                        this.graph.parseNode<User>(node),
                    );

                return {
                    ...config,
                    sysadmins: sysadmins.length > 0 ? sysadmins : undefined,
                };
            },
            cypherQuery,
            params,
        );

        if (!config) {
            throw this.error(`${label} config not found`, 404);
        }

        const model = new Config(config);
        return model.get() as ConfigType<ConfigTypes>;
    }

    /**
     * ## Retrieves the main configuration from the database.
     * This method queries the database to find the main configuration node
     * and returns it along with its associated sysadmins.
     *
     * @returns The main configuration or null if not found.
     * @throws Error if the query fails.
     */
    public async getMainConfig(): Promise<ConfigType<ConfigTypes>> {
        if (this.getPermissions().cannot("read", new Config())) {
            throw this.error("Unauthorized to read config", 403);
        }

        return await this.getConfig("MainConfig");
    }

    /**
     * ## Checks if the main configuration exists in the database.
     * This method queries the database to determine if a main configuration node exists.
     *
     * @returns True if the main configuration exists, false otherwise.
     * @throws Error if the query fails.
     */
    protected async hasMainConfig(): Promise<boolean> {
        try {
            const config = await this.getConfig("MainConfig");
            return !!config;
        } catch (error) {
            if ((error as ServiceError).statusCode === 404) {
                return false;
            }
            throw this.error(error);
        }
    }

    /**
     * ## Sets the main configuration in the database.
     * This method creates a new main configuration node and associates it with the first sysadmin.
     *
     * @param data - The configuration data to set.
     * @returns The created configuration.
     * @throws Error if unauthorized or if validation fails.
     */
    public async setMainConfig(
        data: Partial<ConfigType<ConfigTypes>>,
    ): Promise<ConfigType<ConfigTypes>> {
        try {
            if (await this.hasMainConfig()) {
                // throw 401 unauthorized if config already exists
                throw this.error("Main config already exists.", 401);
            }

            const model = new Config();

            this.validator.setModel(model);
            await this.validator.validateEntity({ data });

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
            const userQuery = new UserQuery(this.query.cypher);
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

            const config = await this.graph.writeTransaction(async (tx) => {
                const res = await tx.run(cypher, params);
                if (res.records.length === 0) {
                    throw this.error("Failed to create config", 500);
                }
                const [first] = res.records;

                const config = this.graph.parseNode<ConfigType<ConfigTypes>>(
                    first.get("c"),
                );

                if (!config) {
                    throw this.error("Could not create config", 500);
                }

                const sysadmin = this.graph.parseNode<User>(first.get("u"));

                if (!sysadmin) {
                    throw this.error("Could not create sysadmin", 500);
                }

                await this.history(tx, "CREATE", config, sysadmin.uuid!);

                await this.history(tx, "CREATE", sysadmin, sysadmin.uuid!);

                config.sysadmins = [sysadmin];
                return config;
            });

            model.set(config);

            return model.get() as ConfigType<ConfigTypes>;
        } catch (error) {
            throw this.error(error);
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
