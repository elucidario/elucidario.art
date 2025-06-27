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
        request: FastifyRequest<Params<TParams> & ListQueryStrings>,
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
    ): ListQueryStrings["Querystring"] {
        return request.query as ListQueryStrings["Querystring"];
    }

    getParams(request: FastifyRequest<Params<TParams>>) {
        return request.params;
    }

    error(err: unknown) {
        if (isNeo4jError(err) || isGraphError(err)) {
            return this.graph.error(err, {
                mdorim: {
                    ConstraintValidationFailed: {
                        message: "Email address already in use",
                        details: {
                            email: "Email address already in use",
                        },
                    },
                },
            });
        }

        if (isMdorimError(err)) {
            return err;
        }

        return new ServiceError(String(err), err);
    }
}
