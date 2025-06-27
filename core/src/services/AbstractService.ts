import { Graph } from "@/db";
import { isGraphError, isNeo4jError, ServiceError } from "@/errors";
import InterfaceModel from "@/model/InterfaceModel";
import InterfaceQuery from "@/queries/InterfaceQuery";
import { Hooks, ListQueryStrings } from "@/types";
import { isMdorimError, User } from "@elucidario/mdorim";
import { FastifyReply, FastifyRequest } from "fastify";

export default abstract class AbstractService<
    T extends Record<string, unknown>,
> {
    protected model: InterfaceModel<T>;
    protected query: InterfaceQuery<T>;
    protected graph: Graph;
    protected hooks: Hooks;

    constructor(
        model: InterfaceModel<T>,
        query: InterfaceQuery<T>,
        graph: Graph,
        hooks: Hooks,
    ) {
        this.model = model;
        this.query = query;
        this.graph = graph;
        this.hooks = hooks;
    }

    abstract create(request: FastifyRequest, reply: FastifyReply): Promise<T>;

    abstract read(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<T | null>;

    abstract update(request: FastifyRequest, reply: FastifyReply): Promise<T>;

    abstract delete(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<boolean>;

    abstract list(request: FastifyRequest, reply: FastifyReply): Promise<T[]>;

    parseBodyRequest(request: FastifyRequest): Partial<T> {
        return request.body as Partial<T>;
    }

    getUser(request: FastifyRequest): User | undefined {
        return request.user;
    }

    getListQueryStrings(
        request: FastifyRequest,
    ): ListQueryStrings["Querystring"] {
        return request.query as ListQueryStrings["Querystring"];
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
