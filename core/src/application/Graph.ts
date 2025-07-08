import {
    Driver,
    EagerResult,
    Neo4jError,
    ManagedTransaction,
    isInt,
    isDate,
    isDateTime,
    isTime,
    isLocalDateTime,
    isLocalTime,
    isDuration,
    RecordShape,
} from "neo4j-driver";
import { MdorimBase } from "@elucidario/mdorim";

import { isGraphError, GraphError, isNeo4jError } from "@/domain/errors";
import { MapNeo4jError, PropertyConstraint, Hooks } from "@/types";
import { Cypher } from "./Cypher";

export class Graph {
    /**
     * Cypher instance used for building Cypher queries.
     * This is initialized in the constructor and used for executing queries.
     */
    cypher: Cypher;

    /**
     * Hooks type used for managing filters and actions.
     * This is initialized in the constructor and used for applying filters.
     */
    hooks: Hooks;

    /**
     * The Neo4j driver instance used to interact with the database.
     * This is initialized in the constructor and used for executing queries.
     */
    protected driver: Driver;

    /**
     * @param cypher Cypher instance used for building Cypher queries.
     *               This is initialized in the constructor and used for executing queries.
     * @param hooks Hooks instance used for managing filters and actions.
     */
    constructor(driver: Driver, cypher: Cypher, hooks: Hooks) {
        this.driver = driver;
        this.cypher = cypher;
        this.hooks = hooks;
    }

    async setup() {
        await this.setConstraints();
    }

    /**
     * ██████╗ ██████╗ ██╗██╗   ██╗███████╗██████╗
     * ██╔══██╗██╔══██╗██║██║   ██║██╔════╝██╔══██╗
     * ██║  ██║██████╔╝██║██║   ██║█████╗  ██████╔╝
     * ██║  ██║██╔══██╗██║╚██╗ ██╔╝██╔══╝  ██╔══██╗
     * ██████╔╝██║  ██║██║ ╚████╔╝ ███████╗██║  ██║
     * ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
     */
    /**
     * Executes a Cypher query and parses the response.
     * @param responseParser A function to parse the response.
     * @param cypher The Cypher query to execute.
     * @param params Optional parameters for the query.
     * @returns The parsed response.
     */
    async executeQuery<T>(
        responseParser: (response: EagerResult) => T,
        cypher: string,
        params?: Record<string, unknown>,
    ): Promise<T> {
        const driver = this.driver;
        if (!driver) {
            throw new GraphError("Driver is not initialized", null, 500);
        }
        try {
            await driver.getServerInfo(); // Ensure the driver is connected
            const response = await driver.executeQuery(cypher, params);
            return responseParser(response);
        } catch (error) {
            throw this.error(
                error,
                {
                    mdorim: {
                        ConstraintValidationFailed: {
                            message: "Entity already exists.",
                        },
                    },
                },
                (error as GraphError).statusCode || 409,
            );
        }
    }

    /**
     * Executes a write transaction.
     * @param callback A function that receives a ManagedTransaction and returns a Promise of type T.
     * @returns A Promise that resolves to the result of the callback function.
     * @throws GraphError if the driver is not initialized or if an error occurs during the transaction.
     */
    async writeTransaction<T>(
        callback: (tx: ManagedTransaction) => Promise<T>,
    ) {
        try {
            const driver = this.driver;
            if (!driver) {
                throw new GraphError("Driver is not initialized", null, 500);
            }
            const session = driver.session();
            const response = await session.executeWrite(callback);
            await session.close();
            return response;
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Retrieves the current constraints in the database.
     * @returns A Promise that resolves to an array of constraints.
     * @throws GraphError if an error occurs while retrieving the constraints.
     */
    async getConstraints() {
        try {
            return await this.executeQuery(({ records }) => {
                if (records.length === 0) {
                    return [];
                }
                return records.map((record) => record.toObject());
            }, `SHOW CONSTRAINTS`);
        } catch (error) {
            throw this.error(`Failed to get constraints: ${error}`);
        }
    }

    /**
     * Sets the constraints in the database.
     *
     * This method retrieves constraints from the filter "graph.setConstraints"
     *
     * @throws GraphError if an error occurs while setting the constraints.
     */
    private async setConstraints() {
        try {
            await this.writeTransaction(async (tx) => {
                const constraints = this.hooks.filters.apply<
                    Array<PropertyConstraint>
                >("graph.setConstraints", Array<PropertyConstraint>());

                if (!Array.isArray(constraints)) {
                    throw new GraphError(
                        "The filter 'graph.setConstraints' must return an array of constraints.",
                    );
                }

                if (constraints.length === 0) {
                    return;
                }

                await Promise.all(
                    constraints.map(async (constraint) => {
                        const constraintQuery = this.cypher
                            .PropertyConstraint(constraint)
                            .build();
                        await tx.run(
                            constraintQuery.cypher,
                            constraintQuery.params,
                        );
                    }),
                );
            });
        } catch (error) {
            throw this.error(`Failed to set constraints: ${error}`);
        }
    }

    /**
     * ██████╗  █████╗ ██████╗ ███████╗███████╗██████╗
     * ██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗
     * ██████╔╝███████║██████╔╝███████╗█████╗  ██████╔╝
     * ██╔═══╝ ██╔══██║██╔══██╗╚════██║██╔══╝  ██╔══██╗
     * ██║     ██║  ██║██║  ██║███████║███████╗██║  ██║
     * ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝
     */
    /**
     * Converts Neo4j values to native JavaScript types.
     * - Converts Neo4j Int to number
     * - Converts Neo4j Date, DateTime, Time, LocalDateTime, LocalTime, Duration to string
     * - Converts Neo4j List to array
     * - Converts Neo4j Map to object
     *
     * @param value - The value to convert
     * @returns The converted value
     */
    private neo4jValueToNativeType(value: unknown): unknown {
        if (Array.isArray(value)) {
            value = value.map((innerValue) =>
                this.neo4jValueToNativeType(innerValue),
            );
        } else if (isInt(value)) {
            value = value.toNumber();
        } else if (
            isDate(value) ||
            isDateTime(value) ||
            isTime(value) ||
            isLocalDateTime(value) ||
            isLocalTime(value) ||
            isDuration(value)
        ) {
            value = value.toString();
        } else if (
            typeof value === "object" &&
            value !== undefined &&
            value !== null
        ) {
            value = Object.entries(value).reduce((acc, [key, val]) => {
                (acc as Record<string, unknown>)[key] =
                    this.neo4jValueToNativeType(val);
                return acc;
            }, {});
        }
        return value;
    }

    /**
     * Parses a Node from Neo4j to specific type.
     *
     * @param data - Data to parse
     * @param filter - Optional array of keys to filter out from the response
     *                 - Defaults to ["password"].
     * @returns Parsed data
     */
    parseNode<T extends Partial<MdorimBase>>(data: RecordShape): T {
        const type = data.labels![0] as string;
        return Object.entries(data.properties).reduce(
            (acc, [key, value]) => {
                (acc as Record<string, unknown>)[key] =
                    this.neo4jValueToNativeType(value);
                return acc;
            },
            {
                type,
            } as T,
        );
    }

    /**
     * Parses a Relationship from Neo4j to specific type.
     *
     * @param data - Data to parse
     * @returns Parsed data
     */
    parseRelationship<T extends Record<string, unknown>>(data: RecordShape): T {
        return Object.entries(data.properties).reduce((acc, [key, value]) => {
            (acc as Record<string, unknown>)[key] =
                this.neo4jValueToNativeType(value);
            return acc;
        }, {} as T);
    }

    /**
     * ███████╗██████╗ ██████╗  ██████╗ ██████╗
     * ██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
     * █████╗  ██████╔╝██████╔╝██║   ██║██████╔╝
     * ██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗
     * ███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║
     * ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
     */

    /**
     * Handles errors that occur during database operations.
     * @param err The error object.
     * @param map Optional mapping of error codes to user-friendly messages.
     * @returns A GraphError instance.
     */
    error(err: unknown, map?: MapNeo4jError, statusCode?: number): GraphError {
        if (isGraphError(err)) {
            return err;
        }

        if (isNeo4jError(err)) {
            if (map?.mdorim) {
                const mapped = Object.entries(map.mdorim).find(([key]) =>
                    (err as Neo4jError).code.includes(key),
                );
                if (mapped) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [_, { message, details }] = mapped;
                    const error = new GraphError(message, details, statusCode);
                    return this.error(error);
                }
            }

            if (map?.graph) {
                const mapped = Object.entries(map.graph).find(([key]) =>
                    (err as Neo4jError).code.includes(key),
                );
                if (mapped) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [_, { message, details }] = mapped;
                    const error = new GraphError(message, details, statusCode);
                    return this.error(error);
                }
            }
        }

        return new GraphError(
            err instanceof Error ? err.message : String(err),
            {
                error: err,
            },
            statusCode,
        );
    }
}
