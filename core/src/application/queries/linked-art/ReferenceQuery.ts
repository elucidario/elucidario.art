import { AQuery } from "../AQuery";
import { Reference, GenericType, SchemaObject, UUID } from "@elucidario/mdorim";
import { Clause, ProjectionColumn } from "@neo4j/cypher-builder";

export class ReferenceQuery extends AQuery<Reference<GenericType>> {
    createReference(
        data: Partial<Reference<GenericType>>,
        workspaceUUID: UUID,
        schema?: SchemaObject,
    ) {
        const node = this.cypher.NamedNode("reference");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { equivalent, ...referenceProps } = data;

        const createReference = this.create({
            data: {
                ...referenceProps,
            },
            labels: ["Reference", data.type!],
            node,
            returnClause: false,
        });

        const belongToWorkspace = this.belongsToWorkspace(node, workspaceUUID);

        const clauses: Array<Clause | undefined> = [
            createReference,
            this.cypher.With(node),
            belongToWorkspace,
        ];

        const returnClauses: Array<"*" | ProjectionColumn> = [node];

        if (typeof schema !== "undefined") {
            const properties = this.relationshipProperties(node, schema, data);
            clauses.push(...properties);
        }

        const returnClause = this.cypher.Return(...returnClauses);

        clauses.push(returnClause);

        return this.cypher.concat(...clauses);
    }
}
