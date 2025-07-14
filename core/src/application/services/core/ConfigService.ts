import { RecordShape } from "neo4j-driver";
import { RawRuleOf, MongoAbility } from "@casl/ability";
import { Config as ConfigType, ConfigTypes, User } from "@elucidario/mdorim";

import { Hooks, AuthContext } from "@/types";
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
        super(validator, query, auth, graph, hooks);
        this.register();
    }

    /**
     * ## Registers the service hooks for authorization rules.
     * This method adds a filter to the "authorization.rules" hook
     * to set abilities based on the user's role.
     */
    protected register() {
        this.hooks.filters.add<RawRuleOf<MongoAbility>[], [AuthContext]>(
            "authorization.rules",
            (abilities, context) => this.setAbilities(abilities, context),
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
        context: AuthContext,
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
     * ## Retrieves the main configuration from the database.
     * This method queries the database to find the main configuration node
     * and returns it along with its associated sysadmins.
     *
     * @returns The main configuration or null if not found.
     * @throws Error if the query fails.
     */
    public async getMainConfig(): Promise<ConfigType<ConfigTypes>> {
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

        const config = await this.graph.executeQuery<
            ConfigType<ConfigTypes> | undefined
        >(
            ({ records }) => {
                if (records.length === 0) {
                    return undefined;
                }

                const [first] = records;

                const config = first.get("c");

                if (!config) {
                    return undefined;
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

        const model = new Config(config);
        return model.get();
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

            const config = await this.graph.executeQuery<
                ConfigType<ConfigTypes>
            >(
                (res) => {
                    if (res.records.length === 0) {
                        throw this.error("Failed to create config", 500);
                    }
                    const [first] = res.records;

                    const config = this.graph.parseNode<
                        ConfigType<ConfigTypes>
                    >(first.get("c"));

                    const sysadmin = this.graph.parseNode<User>(first.get("u"));

                    config.sysadmins = [sysadmin];
                    return config;
                },
                cypher,
                params,
            );

            model.set(config);

            return model.get();
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
