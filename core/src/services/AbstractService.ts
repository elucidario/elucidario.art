import { Graph } from "@/db";
import {
    GraphError,
    isGraphError,
    isNeo4jError,
    isServiceError,
    ServiceError,
} from "@/errors";
import InterfaceModel from "@/model/InterfaceModel";
import InterfaceQuery from "@/queries/InterfaceQuery";
import { Hooks, QueryStrings, Params } from "@/types";
import { isMdorimError, MdorimError, User } from "@elucidario/mdorim";
import { FastifyInstance, FastifyRequest } from "fastify";

export default abstract class AbstractService<
    TType extends Record<string, unknown>,
    TModel extends InterfaceModel<TType>,
    TQuery extends InterfaceQuery<TType>,
    TParams = Record<string, string>,
    TQueryStrings = Record<string, unknown>,
> {
    model: TModel;
    query: TQuery;
    protected graph: Graph;
    protected hooks: Hooks;
    protected fastify: FastifyInstance;

    constructor(
        model: TModel,
        query: TQuery,
        graph: Graph,
        hooks: Hooks,
        fastify: FastifyInstance,
    ) {
        this.model = model;
        this.query = query;
        this.graph = graph;
        this.hooks = hooks;
        this.fastify = fastify;
    }

    parseBodyRequest(request: FastifyRequest): Partial<TType> {
        return request.body as Partial<TType>;
    }

    getUser(request: FastifyRequest): User | undefined {
        return request.user;
    }

    getQueryStrings(
        request: FastifyRequest,
    ): QueryStrings<TQueryStrings>["Querystring"] {
        return request.query as QueryStrings<TQueryStrings>["Querystring"];
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
