import { Clause } from "@neo4j/cypher-builder";
import { MdorimBase } from "@elucidario/mdorim";

import { Cypher } from "@/application/Cypher";
import {
    CreateQueryParams,
    DeleteQueryParams,
    ListQueryParams,
    ReadQueryParams,
    UpdateQueryParams,
} from "@/types";

export default interface IQuery<T extends Partial<MdorimBase>> {
    cypher: Cypher;

    create(params: CreateQueryParams<T>): Clause;

    read(params: ReadQueryParams<T>): Clause;

    list(params: ListQueryParams): Clause;

    update(params: UpdateQueryParams<T>): Clause;

    delete(params: DeleteQueryParams): Clause;
}
