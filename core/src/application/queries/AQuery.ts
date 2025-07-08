import { Clause, Expr, Pattern, SetParam } from "@neo4j/cypher-builder";
import { int } from "neo4j-driver";
import { NodeRef } from "node_modules/@neo4j/cypher-builder/dist/references/NodeRef";
import { MdorimBase, SchemaObject, UUID } from "@elucidario/mdorim";

import { Cypher } from "@/application/Cypher";
import {
    CreateQueryParams,
    DeleteQueryParams,
    ListQueryParams,
    ReadQueryParams,
    UpdateQueryParams,
} from "@/types";
import { QueryError } from "@/domain/errors";
import IQuery from "./IQuery";

/**
 * # AbstractQuery
 * This is an abstract class that provides a base for all query classes in the application.
 * It defines methods for creating, reading, listing, updating, and deleting entities in the database
 */
export abstract class AQuery<T extends Partial<MdorimBase>>
    implements IQuery<T>
{
    /**
     * ## Query.cypher
     * This property holds the Cypher instance used for building Cypher queries.
     * It is initialized in the constructor and used for executing queries.
     */
    cypher: Cypher;

    /**
     * # AbstractQuery
     * This is an abstract class that provides a base for all query classes in the application.
     * It defines methods for creating, reading, listing, updating, and deleting entities in the database.
     *
     * @param cypher - The instance of the Cypher class used for building Cypher queries.
     * @param hooks - The instance of the Hooks class used for managing filters and actions.
     */
    constructor(cypher: Cypher) {
        this.cypher = cypher;
        // this.register();
    }

    // /**
    //  * ## register
    //  * This method registers the constraints defined in the `constraints` property
    //  * to the Neo4j database using the `graph.setConstraints` filter.
    //  */
    // register() {
    //     this.hooks.filters.add(
    //         "graph.setConstraints",
    //         (constraints: PropertyConstraint[]) => [
    //             ...constraints,
    //             ...((this.constructor as typeof Query).constraints || []),
    //         ],
    //     );
    // }

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
        labelRelation = "AND",
        optionalMatch = false,
        returnClause = true,
    }: ListQueryParams): Clause {
        return this.cypher.builder((Cypher) => {
            const n =
                typeof node === "string" ? new Cypher.NamedNode(node) : node;
            let pattern: Pattern;
            if (labelRelation === "AND") {
                pattern = new Cypher.Pattern(n, {
                    labels,
                });
            } else {
                const orConditions = (
                    Array.isArray(labels) ? labels : [labels]
                ).map((label) => {
                    return n.hasLabel(label as string);
                });
                pattern = new Cypher.Pattern(n).where(
                    Cypher.or(...orConditions),
                );
            }
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
        labelRelation = "AND",
        optionalMatch = false,
        returnClause = true,
    }: DeleteQueryParams): Clause {
        return this.cypher.builder((Cypher) => {
            const n =
                typeof node === "string" ? new Cypher.NamedNode(node) : node;
            let pattern: Pattern;
            if (labelRelation === "AND") {
                pattern = new Cypher.Pattern(n, {
                    labels,
                });
            } else {
                const orConditions = (
                    Array.isArray(labels) ? labels : [labels]
                ).map((label) => {
                    return n.hasLabel(label as string);
                });
                pattern = new Cypher.Pattern(n).where(
                    Cypher.or(...orConditions),
                );
            }
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

    /**
     * ██████╗ ██████╗  ██████╗ ██████╗ ███████╗
     * ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝
     * ██████╔╝██████╔╝██║   ██║██████╔╝███████╗
     * ██╔═══╝ ██╔══██╗██║   ██║██╔═══╝ ╚════██║
     * ██║     ██║  ██║╚██████╔╝██║     ███████║
     * ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝
     *
     * Queries to be used within transactions.
     */

    belongsToWorkspace(node: NodeRef, workspaceUUID: UUID) {
        const workspaceNode = this.cypher.NamedNode("workspace");
        const matchWorkspace = this.cypher.Match(
            this.cypher.Pattern(workspaceNode, {
                labels: ["Workspace"],
                properties: {
                    uuid: this.cypher.Param(workspaceUUID),
                },
            }),
        );

        const nodeBelongsToWorkspace = this.cypher
            .Create(
                this.cypher
                    .Pattern(node)
                    .related(this.cypher.Relationship(), {
                        type: "BELONGS_TO",
                    })
                    .to(workspaceNode),
            )
            .with(node, workspaceNode);

        return this.cypher.concat(matchWorkspace, nodeBelongsToWorkspace);
    }

    relationshipProperties(
        from: NodeRef,
        schema: SchemaObject,
        data: Partial<T>,
    ) {
        // Loop through the schema properties, filtering out non-relationship properties
        // and create the cypher clauses for relationships
        const clauses: Array<Clause | undefined> = [];
        const filteredProperties = Object.keys(schema.properties).filter(
            (key) =>
                ![
                    "@context",
                    "id",
                    "type",
                    "_label",
                    "content",
                    "value",
                    "notation",
                ].includes(key),
        );
        for (const key of filteredProperties) {
            if (key in data) {
                const clause = this.addMultiRelationship(
                    from,
                    key.toUpperCase(),
                    data[key as keyof T] as MdorimBase[],
                );
                clauses.push(clause);
            }
        }
        return clauses;
    }

    addMultiRelationship<T extends MdorimBase>(
        from: NodeRef,
        related: string,
        to: T[],
        returnClause = false,
    ) {
        try {
            const clauses: Array<Clause | undefined> = [];
            to.forEach((item, i) => {
                this.checkRequiredRefProperties(item, i, related);

                const toNode = this.cypher.Node();

                const matchTo = this.cypher.Match(
                    this.cypher.Pattern(toNode, {
                        labels: [item.type],
                        properties: {
                            uuid: this.cypher.Param(item.uuid),
                        },
                    }),
                );
                clauses.push(matchTo);

                const mergeTo = this.cypher
                    .Merge(
                        this.cypher
                            .Pattern(from)
                            .related(this.cypher.Relationship(), {
                                type: related,
                            })
                            .to(toNode),
                    )
                    .with(toNode, from);
                clauses.push(mergeTo);
            });

            return this.cypher.concat(
                ...clauses,
                returnClause ? this.cypher.Return(from) : undefined,
            );
        } catch (error) {
            console.log(error);
            throw this.error("Could not create relationships query.", error);
        }
    }

    checkRequiredRefProperties(
        data: Record<string, unknown>,
        i: number,
        label: string,
    ) {
        if (!data.uuid) {
            throw this.error(
                `Must have a UUID, check index ${i} from "to" parameter in ${label} relationship`,
            );
        }
        if (!data.type) {
            throw this.error(
                `Must have a type, check index ${i} from "to" parameter in ${label} relationship`,
            );
        }
    }

    error(message: string, details?: unknown) {
        return new QueryError(message, details);
    }
}
