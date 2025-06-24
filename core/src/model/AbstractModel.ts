import {
    isInt,
    isDate,
    isDateTime,
    isTime,
    isLocalDateTime,
    isLocalTime,
    isDuration,
    int,
} from "neo4j-driver";
import { LabelExpr, Expr, SetParam, Clause } from "@neo4j/cypher-builder";
import { NodeRef } from "node_modules/@neo4j/cypher-builder/dist/references/NodeRef";

import { isMdorimError, MdorimError } from "@elucidario/mdorim";

import { MapNeo4jError, PropertyConstraint } from "@/types";
import Core from "@/Core";
import { addFilter } from "@/hooks";
import { InterfaceModel } from "./InterfaceModel";

/**
 * # AbstractModel
 * This abstract class provides a base for all models in the application.
 */
export default abstract class AbstractModel<T extends Record<string, unknown>>
    implements InterfaceModel<T>
{
    /**
     * ## AbstractModel.constraints
     * This static property holds an array of Cypher constraints that should be applied to the model.
     * These constraints are used to ensure data integrity and uniqueness in the database.
     */
    static constraints: PropertyConstraint[] = [];

    /**
     * ## AbstractModel.core
     * This property holds the core instance of the application, which provides access to the Cypher builder, Mdorim and other utilities.
     */
    protected core: Core;

    /**
     * ## AbstractModel.schema
     * This property holds the schema for the model.
     * It can be a string representing a single schema or a Map of strings representing multiple schemas.
     * The schema is used to validate the data before saving it to the database.
     */
    protected schema: string | Map<string, string>;

    /**
     * # AbstractModel
     * This is an abstract class that provides a base for all models in the application.
     *
     * @param schema - The schema to use for the model. It can be a string or a Array of strings.
     * @param core - The core instance of the application, which provides access to the Cypher builder and other utilities.
     */
    constructor(schema: string | string[], core: Core) {
        this.core = core;
        this.schema = Array.isArray(schema)
            ? new Map(schema.map((s) => [s, s]))
            : schema;
        this.checkSchemaType();
    }

    /**
     * ## register
     * This static method registers the constraints defined in the `constraints` property
     * to the Neo4j database using the `graph.setConstraints` filter.
     * It should be called once during the application startup to ensure that the constraints are applied.
     * And it should be called before Core.getInstance() to ensure that the constraints are applied at the database set up.
     */
    static register() {
        addFilter<string[]>("graph.setConstraints", (constraints) => [
            ...constraints,
            ...this.constraints,
        ]);
    }

    /**
     * ## checkSchemaType
     * This method checks the type of the schema property.
     * It throws an error if the schema is not a string or a Map.
     *
     * @returns "single" if the schema is a string, "multiple" if it is a Map
     * @throws MdorimError if the schema is not a string or a Map
     */
    private checkSchemaType(): "single" | "multiple" {
        if (typeof this.schema === "string") {
            return "single";
        } else if (this.schema instanceof Map) {
            return "multiple";
        } else {
            throw new MdorimError(
                `Schema must be a string or a Map, got ${typeof this.schema}`,
            );
        }
    }

    /**
     * ## schemaName
     * This method returns the schema name based on the schema type.
     * If the schema is a string, it returns the string.
     * If the schema is a Map, it returns the value for the provided ID.
     *
     * @param id - ID to get the schema name for (required if schema is a Map)
     * @returns Schema name as a string
     * @throws MdorimError if the schema type is invalid or if the ID is not found in the Map
     */
    private schemaName(id?: string): string {
        try {
            if (this.checkSchemaType() === "single") {
                return this.schema as string;
            } else if (this.checkSchemaType() === "multiple") {
                if (!id) {
                    throw new MdorimError(
                        "ID is required for multiple schemas",
                    );
                }
                const schemaName = (this.schema as Map<string, string>).get(id);
                if (!schemaName) {
                    throw new MdorimError(
                        `Schema for ID "${id}" not found in the provided Map.`,
                    );
                }
                return schemaName;
            }
            throw new MdorimError("Invalid schema type");
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     *  ██████╗ ██╗   ██╗███████╗██████╗ ██╗███████╗███████╗
     * ██╔═══██╗██║   ██║██╔════╝██╔══██╗██║██╔════╝██╔════╝
     * ██║   ██║██║   ██║█████╗  ██████╔╝██║█████╗  ███████╗
     * ██║▄▄ ██║██║   ██║██╔══╝  ██╔══██╗██║██╔══╝  ╚════██║
     * ╚██████╔╝╚██████╔╝███████╗██║  ██║██║███████╗███████║
     *  ╚══▀▀═╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
     */
    /**
     * ## A Cypher query to create a new entity in the database.
     *
     * **IMPORTANT**: This method does not validate the data against the schema.
     * It is recommended to validate the data before calling this method.
     *
     * @param data - Data to create the entity
     * @param labels - Labels to assign to the entity
     * @param node - Name or NodeRef of the node in the Cypher query
     * @param returnClause - If true, the query will return the node
     *                      If false, the query will not return the node
     * @returns Clause
     * @throws MdorimError if the schema is not found or if there is an error in the query
     */
    queryCreate(
        data: Partial<T>,
        labels?: string | string[] | LabelExpr | undefined,
        node: string | NodeRef = "u",
        returnClause: boolean = true,
    ): Clause {
        return this.core.cypher.builder((Cypher) => {
            const n =
                typeof node === "string" ? new Cypher.NamedNode(node) : node;
            const pattern = new Cypher.Pattern(n, {
                labels,
                properties: Object.keys(data).reduce(
                    (acc, key) => {
                        if (data[key as keyof T] !== undefined) {
                            acc[key] = new Cypher.Param(data[key as keyof T]);
                        }
                        return acc;
                    },
                    {
                        uuid: Cypher.randomUUID(),
                    } as Record<string, Expr>,
                ),
            });
            const merge = new Cypher.Merge(pattern);
            if (returnClause) {
                merge.return(n);
            }
            return merge;
        });
    }

    /**
     * ## A Cypher query to read an entity from the database.
     *
     * **IMPORTANT**: This method does not validate the data against the schema.
     * It is recommended to validate the data before calling this method.
     *
     * @param data - Data to filter the entity
     * @param labels - Labels to filter the entity
     * @param node - Name or NodeRef of the node in the Cypher query
     * @param optionalMatch - If true, the query will use OPTIONAL MATCH instead of MATCH
     * @param returnClause - If true, the query will return the node
     *                       If false, the query will not return the node
     * @returns Clause
     * @throws MdorimError if the schema is not found or if there is an error in the query
     */
    queryRead(
        data: Partial<T>,
        labels?: string | string[] | LabelExpr | undefined,
        node: string | NodeRef = "u",
        optionalMatch: boolean = false,
        returnClause: boolean = true,
    ): Clause {
        return this.core.cypher.builder((Cypher) => {
            const n =
                typeof node === "string" ? new Cypher.NamedNode(node) : node;
            const pattern = new Cypher.Pattern(n, {
                labels,
                properties: Object.keys(data).reduce(
                    (acc, key) => {
                        if (data[key as keyof T] !== undefined) {
                            acc[key] = new Cypher.Param(data[key as keyof T]);
                        }
                        return acc;
                    },
                    {} as Record<string, Expr>,
                ),
            });
            const match = !optionalMatch
                ? new Cypher.Match(pattern)
                : new Cypher.OptionalMatch(pattern);
            if (returnClause) {
                match.return(n);
            }
            return match;
        });
    }

    /**
     * ## A Cypher query to list entities from the database.
     *
     * **IMPORTANT**: This method does not validate the data against the schema.
     * It is recommended to validate the data before calling this method.
     *
     * @param limit - Maximum number of entities to return
     * @param offset - Number of entities to skip
     * @param labels - Labels to filter the entities
     * @param node - Name or NodeRef of the node in the Cypher query
     * @param optionalMatch - If true, the query will use OPTIONAL MATCH instead of MATCH
     * @param returnClause - If true, the query will return the node
     *                       If false, the query will not return the node
     * @returns Clause
     */
    queryList(
        limit?: number,
        offset?: number,
        labels?: string | string[] | LabelExpr | undefined,
        node: string | NodeRef = "u",
        optionalMatch: boolean = false,
        returnClause: boolean = true,
    ): Clause {
        return this.core.cypher.builder((Cypher) => {
            const n =
                typeof node === "string" ? new Cypher.NamedNode(node) : node;
            const pattern = new Cypher.Pattern(n, {
                labels,
            });
            const match = !optionalMatch
                ? new Cypher.Match(pattern)
                : new Cypher.OptionalMatch(pattern);
            if (returnClause) {
                match.return(n);
            }
            if (offset) {
                match.skip(new Cypher.Param(int(offset)));
            }
            if (limit) {
                match.limit(new Cypher.Param(int(limit)));
            }
            return match;
        });
    }

    /**
     * ## A Cypher query to update an entity in the database.
     *
     * **IMPORTANT**: This method does not validate the data against the schema.
     * It is recommended to validate the data before calling this method.
     *
     * @param id - ID of the entity to update
     * @param data - Data to update the entity
     * @param labels - Labels to filter the entity
     * @param node - Name or NodeRef of the node in the Cypher query
     * @param optionalMatch - If true, the query will use OPTIONAL MATCH instead of MATCH
     * @param returnClause - If true, the query will return the node
     *                       If false, the query will not return the node
     * @returns Clause
     * @throws MdorimError if the schema is not found or if there is an error in the query
     */
    queryUpdate(
        id: string,
        data: Partial<T>,
        labels?: string | string[] | LabelExpr | undefined,
        node: string | NodeRef = "u",
        optionalMatch: boolean = false,
        returnClause: boolean = true,
    ): Clause {
        return this.core.cypher.builder((Cypher) => {
            const n =
                typeof node === "string" ? new Cypher.NamedNode(node) : node;

            const pattern = new Cypher.Pattern(n, {
                labels,
                properties: {
                    uuid: new Cypher.Param(id),
                },
            });

            const match = (
                !optionalMatch
                    ? new Cypher.Match(pattern)
                    : new Cypher.OptionalMatch(pattern)
            ).set(
                ...Object.entries(data).map(([key, value]) => {
                    return [
                        n.property(key),
                        "=",
                        new Cypher.Param(value),
                    ] as unknown as SetParam;
                }),
            );
            if (returnClause) {
                match.return(n);
            }
            return match;
        });
    }

    /**
     * ## A Cypher query to delete an entity from the database.
     *
     * **IMPORTANT**: This method does not validate the ID against the schema.
     * It is recommended to validate the ID before calling this method.
     *
     * @param id - ID of the entity to delete
     * @param labels - Labels to filter the entity
     * @param node - Name or NodeRef of the node in the Cypher query
     * @param optionalMatch - If true, the query will use OPTIONAL MATCH instead of MATCH
     * @param returnClause - If true, the query will return the node
     *                       If false, the query will not return the node
     * @returns Clause
     * @throws MdorimError if the schema is not found or if there is an error in the query
     */
    queryDelete(
        id: string,
        labels?: string | string[] | LabelExpr | undefined,
        node: string | NodeRef = "u",
        optionalMatch: boolean = false,
        returnClause: boolean = true,
    ): Clause {
        return this.core.cypher.builder((Cypher) => {
            const n =
                typeof node === "string" ? new Cypher.NamedNode(node) : node;
            const pattern = new Cypher.Pattern(n, {
                labels,
            });
            const match = (
                !optionalMatch
                    ? new Cypher.Match(pattern)
                    : new Cypher.OptionalMatch(pattern)
            )
                .where(n, {
                    uuid: new Cypher.Param(id),
                })
                .detachDelete(n);

            if (!returnClause) {
                return match;
            }

            const rtn = new Cypher.Return([
                new Cypher.Literal(true),
                "removed",
            ]);
            const query = Cypher.utils.concat(match, rtn);

            return query;
        });
    }

    // async historyTransaction(
    //     tx: ManagedTransaction,
    //     entityId: UUID,
    //     userId: UUID,
    //     transactionType: "CREATION" | "EDITION" | "DELETION",
    //     data?: Record<string, unknown>,
    // ): Promise<void> {
    //     const userNode = this.core.cypher.NamedNode("user");
    //     const matchUser = this.core.cypher
    //         .Match(
    //             this.core.cypher.Pattern(userNode, {
    //                 labels: "User",
    //                 properties: {
    //                     uuid: this.core.cypher.Param(userId),
    //                 },
    //             }),
    //         )
    //         .return(userNode)
    //         .build();

    //     const userResponse = await tx.run(matchUser.cypher, matchUser.params);

    //     if (userResponse.records.length === 0) {
    //         throw this.error(
    //             `User with ID ${userId} not found for transaction history.`,
    //         );
    //     }

    //     const { cypher, params } = this.core.cypher
    //         .builder((Cypher) => {
    //             const userNode = new Cypher.NamedNode("user");
    //             const entityNode = new Cypher.NamedNode("entity");
    //             const historyNode = new Cypher.NamedNode("history");
    //             const previousNode = new Cypher.NamedNode("previous");

    //             const matchUser = new Cypher.Match(
    //                 new Cypher.Pattern(userNode, {
    //                     labels: "User",
    //                     properties: {
    //                         uuid: new Cypher.Param(userId),
    //                     },
    //                 }),
    //             );

    //             const matchEntity = new Cypher.Match(
    //                 new Cypher.Pattern(entityNode, {
    //                     properties: {
    //                         uuid: new Cypher.Param(entityId),
    //                     },
    //                 }),
    //             );

    //             const matchPreviousHistory = new Cypher.OptionalMatch(
    //                 new Cypher.Pattern(previousNode, {
    //                     labels: "History",
    //                 })
    //                     .related(new Cypher.Relationship(), {
    //                         type: "COMMIT",
    //                     })
    //                     .to(entityNode),
    //             )
    //                 .orderBy([previousNode.property("timestamp"), "DESC"])
    //                 .limit(1);

    //             const createHistory = new Cypher.Create(
    //                 new Cypher.Pattern(userNode)
    //                     .related(new Cypher.Relationship(), {
    //                         type: "PERFORMED_BY",
    //                         direction: "left",
    //                     })
    //                     .to(historyNode, {
    //                         labels: "History",
    //                         properties: {
    //                             type: new Cypher.Param(transactionType),
    //                             timestamp: Cypher.timestamp(),
    //                             ...(data
    //                                 ? {
    //                                       snapshot: new Cypher.Param(
    //                                           JSON.stringify(data),
    //                                       ),
    //                                   }
    //                                 : {}),
    //                         },
    //                     })
    //                     .related(new Cypher.Relationship(), {
    //                         type: "COMMIT",
    //                     })
    //                     .to(entityNode),
    //             );

    //             const withClause = new Cypher.With(
    //                 entityNode,
    //                 previousNode,
    //                 userNode,
    //                 historyNode,
    //             );

    //             const createPreviousRelationship = new Cypher.Foreach(
    //                 new Cypher.Variable(),
    //             )
    //                 .in(
    //                     new Cypher.Case()
    //                         .when(Cypher.isNotNull(previousNode))
    //                         .then(new Cypher.Param([new Cypher.Literal(1)]))
    //                         .else(new Cypher.Param([])),
    //                 )
    //                 .do(
    //                     new Cypher.Create(
    //                         new Cypher.Pattern(historyNode)
    //                             .related(new Cypher.Relationship(), {
    //                                 type: "PREVIOUS",
    //                             })
    //                             .to(previousNode),
    //                     ),
    //                 );

    //             const concat = Cypher.utils.concat(
    //                 matchUser,
    //                 matchEntity,
    //                 matchPreviousHistory,
    //                 createHistory,
    //                 withClause,
    //                 createPreviousRelationship,
    //             );

    //             return concat;
    //         })
    //         .build();

    //     await tx.run(cypher, params);
    // }

    /**
     * ██████╗  █████╗ ██████╗ ███████╗███████╗██████╗
     * ██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗
     * ██████╔╝███████║██████╔╝███████╗█████╗  ██████╔╝
     * ██╔═══╝ ██╔══██║██╔══██╗╚════██║██╔══╝  ██╔══██╗
     * ██║     ██║  ██║██║  ██║███████║███████╗██║  ██║
     * ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝
     */
    /**
     * Parses the response from Neo4j to a native type.
     * Converts Neo4j types to native JavaScript types.
     * - Converts Neo4j Int to number
     * - Converts Neo4j Date, DateTime, Time, LocalDateTime, LocalTime, Duration to string
     * - Converts Neo4j List to array
     * - Converts Neo4j Map to object
     *
     * It also filters out any keys that are in the provided filter array.
     *
     * @param data - Data to parse
     * @param filter - Optional array of keys to filter out from the response
     *                 - Defaults to ["password"].
     * @returns Parsed data
     */
    parseResponse<T>(
        data: Record<string, unknown>,
        filter: string[] = ["password"],
    ): T {
        const valueToNativeType = (value: unknown) => {
            if (Array.isArray(value)) {
                value = value.map((innerValue) =>
                    valueToNativeType(innerValue),
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
                value = this.parseResponse(value as Record<string, unknown>);
            }

            return value;
        };
        return Object.fromEntries(
            Object.keys(data)
                .filter((key) => !filter?.includes(key))
                .map((key) => {
                    const value = valueToNativeType(data[key]);
                    return [key, value];
                }),
        ) as T;
    }

    /**
     * ██╗   ██╗ █████╗ ██╗     ██╗██████╗  █████╗ ████████╗ ██████╗ ██████╗
     * ██║   ██║██╔══██╗██║     ██║██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
     * ██║   ██║███████║██║     ██║██║  ██║███████║   ██║   ██║   ██║██████╔╝
     * ╚██╗ ██╔╝██╔══██║██║     ██║██║  ██║██╔══██║   ██║   ██║   ██║██╔══██╗
     *  ╚████╔╝ ██║  ██║███████╗██║██████╔╝██║  ██║   ██║   ╚██████╔╝██║  ██║
     *   ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
     */
    /**
     * Validates the entity against the schema.
     * This method should be used to validate the entity before saving it to the database.
     * For example, it can be used to validate the User entity before creating or updating it.
     *
     * @param data - Entity to validate
     * @returns true if the entity is valid, throws an MdorimError if it is not
     * @throws MdorimError
     */
    async validateEntity(
        data: Record<string, unknown>,
        schemaName?: string,
    ): Promise<boolean> {
        try {
            const isValid = await this.core.mdorim.validate(
                this.schemaName(schemaName),
                data,
            );
            if (isMdorimError(isValid)) {
                throw isValid;
            }
            return isValid;
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Validates the ID against the UUID schema.
     * This method should be used to validate the ID before using it in a query.
     * For example, it can be used to validate the User ID before getting or deleting it.
     *
     * @param id - ID to validate
     * @returns true if the ID is valid, throws an MdorimError if it is not or
     *          if the schema for UUID is not found
     * @throws MdorimError
     */
    async validateUUID(id: unknown) {
        const isValid = await this.core.mdorim.validate(
            "/core/Definitions#/$defs/uuid",
            id,
        );

        if (isMdorimError(isValid)) {
            throw isValid;
        }

        return isValid;
    }

    /**
     * Validates the email against the email schema.
     * This method should be used to validate the email before using it in a query.
     * For example, it can be used to validate the User email before getting or deleting it.
     *
     * @param email - Email to validate
     * @returns true if the email is valid, throws an MdorimError if it is not
     *          or if the schema for email is not found
     * @throws MdorimError
     */
    async validateEmail(email: unknown) {
        const isValid = await this.core.mdorim.validate(
            "/core/Definitions#/$defs/email",
            email,
        );

        if (isMdorimError(isValid)) {
            throw isValid;
        }

        return isValid;
    }

    async validateLabel(label: unknown) {
        const isValid = await this.core.mdorim.validate(
            "/linked-art/Core#/$defs/labelProp",
            label,
        );

        if (isMdorimError(isValid)) {
            throw isValid;
        }

        return isValid;
    }

    /**
     * Validates the number against the number schema.
     * This method should be used to validate the number before using it in a query.
     * For example, it can be used to validate the pagination properties before getting a list of entities.
     *
     * @param number - Number to validate
     * @param acceptUndefined - If true, the method will validate undefined as a valid number
     * @returns true if the number is valid, throws an MdorimError if it is not
     *          or if the schema for number is not found
     * @throws MdorimError
     */
    async validateNumber(number: unknown, acceptUndefined?: boolean) {
        if (typeof number === "undefined" && acceptUndefined) {
            return Promise.resolve(true);
        }
        const isValid = await this.core.mdorim.validate(
            "/core/Definitions#/$defs/number",
            number,
        );

        if (isMdorimError(isValid)) {
            throw isValid;
        }

        return isValid;
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
     * Creates a new error based on the type and message.
     * @param type - Type of error to create
     *              - "mdorim" for MdorimError
     *              - "service" for ServiceError
     * @param message - Error message
     * @param data - Additional data to attach to the error
     * @returns MdorimError or ServiceError
     */
    error(error: unknown, mapErrors?: MapNeo4jError) {
        if (isMdorimError(error)) {
            return error as MdorimError;
        }

        return this.core.graph.error(error, mapErrors);
    }
}
