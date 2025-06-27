import { Clause, Expr, SetParam } from "@neo4j/cypher-builder";
import { int } from "neo4j-driver";
import { NodeRef } from "node_modules/@neo4j/cypher-builder/dist/references/NodeRef";

import { Cypher } from "@/db";
import InterfaceQuery, {
    CreateQueryParams,
    DeleteQueryParams,
    ListQueryParams,
    ReadQueryParams,
    UpdateQueryParams,
} from "./InterfaceQuery";
import { Hooks, PropertyConstraint } from "@/types";

/**
 * # AbstractQuery
 * This is an abstract class that provides a base for all query classes in the application.
 * It defines methods for creating, reading, listing, updating, and deleting entities in the database
 */
export abstract class AbstractQuery<T extends Record<string, unknown>>
    implements InterfaceQuery<T>
{
    /**
     * ## AbstractQuery.cypher
     * This property holds the Cypher instance used for building Cypher queries.
     * It is initialized in the constructor and used for executing queries.
     */
    cypher: Cypher;

    /**
     * ## AbstractQuery.hooks
     * This property holds the hooks used for managing filters and actions in the application.
     * It is initialized in the constructor and used for applying filters to the Cypher queries.
     */
    protected hooks: Hooks;

    /**
     * ## AbstractModel.constraints
     * This static property holds an array of Cypher constraints that should be applied to the model.
     * These constraints are used to ensure data integrity and uniqueness in the database.
     */
    abstract constraints: PropertyConstraint[];

    /**
     * # AbstractQuery
     * This is an abstract class that provides a base for all query classes in the application.
     * It defines methods for creating, reading, listing, updating, and deleting entities in the database.
     *
     * @param cypher - The instance of the Cypher class used for building Cypher queries.
     * @param hooks - The instance of the Hooks class used for managing filters and actions.
     */
    constructor(cypher: Cypher, hooks: Hooks) {
        this.cypher = cypher;
        this.hooks = hooks;
        this.register();
    }

    /**
     * ## register
     * This method registers the constraints defined in the `constraints` property
     * to the Neo4j database using the `graph.setConstraints` filter.
     */
    register() {
        this.hooks.filters.add(
            "graph.setConstraints",
            (constraints: PropertyConstraint[]) => [
                ...constraints,
                ...this.constraints,
            ],
        );
    }

    /**
     * ## A Cypher query to create a new entity in the database.
     *
     * @param data - Data to create the entity
     * @param labels - Labels to assign to the entity
     * @param node - Name or NodeRef of the node in the Cypher query
     * @param returnClause - If true, the query will return the node
     *                      If false, the query will not return the node
     * @returns Clause
     * @throws MdorimError if the schema is not found or if there is an error in the query
     */
    create({
        data,
        labels,
        node = "u",
        returnClause = true,
    }: CreateQueryParams<T>): Clause {
        return this.cypher.builder((Cypher) => {
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
     * @param data - Data to filter the entity
     * @param labels - Labels to filter the entity
     * @param node - Name or NodeRef of the node in the Cypher query
     * @param optionalMatch - If true, the query will use OPTIONAL MATCH instead of MATCH
     * @param returnClause - If true, the query will return the node
     *                       If false, the query will not return the node
     * @returns Clause
     * @throws MdorimError if the schema is not found or if there is an error in the query
     */
    read({
        data,
        labels,
        node = "u",
        optionalMatch = false,
        returnClause = true,
    }: ReadQueryParams<T>): Clause {
        return this.cypher.builder((Cypher) => {
            const n =
                typeof node === "string"
                    ? new Cypher.NamedNode(node)
                    : node instanceof NodeRef
                      ? node
                      : new Cypher.Node();
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
     * @param limit - Maximum number of entities to return
     * @param offset - Number of entities to skip
     * @param labels - Labels to filter the entities
     * @param node - Name or NodeRef of the node in the Cypher query
     * @param optionalMatch - If true, the query will use OPTIONAL MATCH instead of MATCH
     * @param returnClause - If true, the query will return the node
     *                       If false, the query will not return the node
     * @returns Clause
     */
    list({
        limit,
        offset,
        labels,
        node = "u",
        optionalMatch = false,
        returnClause = true,
    }: ListQueryParams): Clause {
        return this.cypher.builder((Cypher) => {
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
     * @param uuid - UUID of the entity to update
     * @param data - Data to update the entity
     * @param labels - Labels to filter the entity
     * @param node - Name or NodeRef of the node in the Cypher query
     * @param optionalMatch - If true, the query will use OPTIONAL MATCH instead of MATCH
     * @param returnClause - If true, the query will return the node
     *                       If false, the query will not return the node
     * @returns Clause
     * @throws MdorimError if the schema is not found or if there is an error in the query
     */
    update({
        uuid,
        data,
        labels,
        node = "u",
        optionalMatch = false,
        returnClause = true,
    }: UpdateQueryParams<T>): Clause {
        return this.cypher.builder((Cypher) => {
            const n =
                typeof node === "string" ? new Cypher.NamedNode(node) : node;

            const pattern = new Cypher.Pattern(n, {
                labels,
                properties: {
                    uuid: new Cypher.Param(uuid),
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
     * @param uuid - UUID of the entity to delete
     * @param labels - Labels to filter the entity
     * @param node - Name or NodeRef of the node in the Cypher query
     * @param optionalMatch - If true, the query will use OPTIONAL MATCH instead of MATCH
     * @param returnClause - If true, the query will return the node
     *                       If false, the query will not return the node
     * @returns Clause
     * @throws MdorimError if the schema is not found or if there is an error in the query
     */
    delete({
        uuid,
        labels,
        node = "u",
        optionalMatch = false,
        returnClause = true,
    }: DeleteQueryParams): Clause {
        return this.cypher.builder((Cypher) => {
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
                    uuid: new Cypher.Param(uuid),
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
}
