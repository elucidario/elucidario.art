import { Graph } from "@/db";
import { isGraphError, isNeo4jError, ServiceError } from "@/errors";
import InterfaceModel from "@/model/InterfaceModel";
import InterfaceQuery from "@/queries/InterfaceQuery";
import { Hooks, ListQueryStrings, Body, Params } from "@/types";
import { isMdorimError, User } from "@elucidario/mdorim";
import { FastifyReply, FastifyRequest } from "fastify";

export default abstract class AbstractService<
    TType extends Record<string, unknown>,
    TModel extends InterfaceModel<TType>,
    TQuery extends InterfaceQuery<TType>,
    TParams = Record<string, string>,
    TQueryStrings = Record<string, unknown>,
> {
    protected model: TModel;
    protected query: TQuery;
    protected graph: Graph;
    protected hooks: Hooks;

    constructor(model: TModel, query: TQuery, graph: Graph, hooks: Hooks) {
        this.model = model;
        this.query = query;
        this.graph = graph;
        this.hooks = hooks;
    }

    abstract create(
        request: FastifyRequest<Body<TType>>,
        reply: FastifyReply,
    ): Promise<TType>;

    abstract read(
        request: FastifyRequest<Params<TParams>>,
        reply: FastifyReply,
    ): Promise<TType | null>;

    abstract update(
        request: FastifyRequest<Params<TParams>>,
        reply: FastifyReply,
    ): Promise<TType>;

    abstract delete(
        request: FastifyRequest<Params<TParams>>,
        reply: FastifyReply,
    ): Promise<boolean>;

    abstract list(
        request: FastifyRequest<
            Params<TParams> & ListQueryStrings<TQueryStrings>
        >,
        reply: FastifyReply,
    ): Promise<TType[]>;

    parseBodyRequest(request: FastifyRequest): Partial<TType> {
        return request.body as Partial<TType>;
    }

    getUser(request: FastifyRequest): User | undefined {
        return request.user;
    }

    getListQueryStrings(
        request: FastifyRequest,
    ): ListQueryStrings<TQueryStrings>["Querystring"] {
        return request.query as ListQueryStrings<TQueryStrings>["Querystring"];
    }

    getParams(request: FastifyRequest<Params<TParams>>) {
        return request.params;
    }

    error(
        e: unknown,
        statusCode?: number,
    ): ServiceError | MdorimError | GraphError {
        if (typeof e === "string") {
            e = new ServiceError(e, statusCode);
        }

        if (isServiceError(e)) {
            return e;
        }

        if (isNeo4jError(e) || isGraphError(e)) {
            return this.graph.error(e, undefined, statusCode);
        }

        if (isMdorimError(e)) {
            return e;
        }

        return new ServiceError(String(e), statusCode);
    }
}
