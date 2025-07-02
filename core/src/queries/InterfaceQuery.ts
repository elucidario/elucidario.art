import { Cypher } from "@/db";
import { UUID } from "@elucidario/mdorim";
import { Clause, LabelExpr } from "@neo4j/cypher-builder";
import { NodeRef } from "node_modules/@neo4j/cypher-builder/dist/references/NodeRef";

export type BaseParams<T> = {
    labels?: string | string[] | LabelExpr | undefined;
    node?: string | NodeRef;
    optionalMatch?: boolean;
    returnClause?: boolean;
    labelRelation?: "AND" | "OR";
} & T;

export type CreateQueryParams<T extends Record<string, unknown>> = Omit<
    BaseParams<{
        data: Partial<T>;
    }>,
    "optionalMatch"
>;

export type ReadQueryParams<T extends Record<string, unknown>> = BaseParams<{
    data: Partial<T>;
}>;

export type ListQueryParams = BaseParams<{
    limit?: number;
    offset?: number;
}>;

export type UpdateQueryParams<T extends Record<string, unknown>> = BaseParams<{
    uuid: UUID;
    data: Partial<T>;
}>;

export type DeleteQueryParams = BaseParams<{
    uuid: UUID;
}>;

export default interface InterfaceQuery<T extends Record<string, unknown>> {
    cypher: Cypher;

    create(params: CreateQueryParams<T>): Clause;

    read(params: ReadQueryParams<T>): Clause;

    list(params: ListQueryParams): Clause;

    update(params: UpdateQueryParams<T>): Clause;

    delete(params: DeleteQueryParams): Clause;
}
