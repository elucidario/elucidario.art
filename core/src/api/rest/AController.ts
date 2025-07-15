import { Body, ParamsWithWorkspace, QueryStrings } from "@/types";
import { isMdorimError, MdorimBase } from "@elucidario/mdorim";
import { FastifyReply, FastifyRequest } from "fastify";

import AService from "@/application/services/AService";
import {
    isControllerError,
    isGraphError,
    isModelError,
    isQueryError,
    isServiceError,
} from "@/domain/errors";
import { Auth } from "@/application/auth";
import AModel from "@/domain/models/AModel";
import { AQuery } from "@/application/queries/AQuery";

/**
 * # AController
 * ## Abstract base class for REST controllers in the Elucidario API.
 * This class provides a foundation for creating RESTful controllers with common functionality.
 * It defines methods for handling requests, content negotiation, and error handling.
 *
 * @template TType - The type of the model handled by the controller.
 * @template TModel - The model interface that the controller interacts with.
 * @template TQuery - The query interface used by the controller.
 * @template TService - The service interface that the controller uses to perform operations.
 * @template TParams - The type of parameters expected in the request.
 * @template TQueryStrings - The type of query strings expected in the request.
 */
export abstract class AController<
    TType extends MdorimBase,
    TModel extends AModel<TType>,
    TQuery extends AQuery<TType>,
    TService extends AService<TType, TQuery>,
    TParams extends Record<string, unknown> = Record<string, unknown>,
    TQueryStrings extends Record<string, unknown> = Record<string, unknown>,
> {
    /**
     * ## The Linked Art profile for the controller.
     */
    static readonly laProfile: string =
        'application/ld+json;profile="https://linked.art/ns/v1/linked-art.json"';

    /**
     * ## The endpoint for the controller.
     * This is an abstract property that must be defined in subclasses.
     * It represents the specific endpoint for this controller.
     */
    abstract endpoint: string;

    /**
     * ## Constructor for the AController class.
     * @param fastify - The Fastify instance to which this controller will be registered.
     */
    constructor(
        protected model: TModel,
        protected service: TService,
        protected auth: Auth,
        protected routeParam?: string,
    ) { }

    /**
     *  █████╗ ██████╗ ███████╗████████╗██████╗  █████╗  ██████╗████████╗
     * ██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝
     * ███████║██████╔╝███████╗   ██║   ██████╔╝███████║██║        ██║
     * ██╔══██║██╔══██╗╚════██║   ██║   ██╔══██╗██╔══██║██║        ██║
     * ██║  ██║██████╔╝███████║   ██║   ██║  ██║██║  ██║╚██████╗   ██║
     * ╚═╝  ╚═╝╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝   ╚═╝
     *
     * ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗██████╗ ███████╗
     * ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝
     * ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗  ██████╔╝███████╗
     * ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝  ██╔══██╗╚════██║
     * ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║  ██║███████║
     * ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
     */
    abstract getHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>>;

    abstract listHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>>;

    abstract getLAHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>>;

    abstract listLAHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>>;

    abstract postHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>>;

    abstract updateHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>>;

    abstract deleteHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>>;

    /**
     * ## Parses the body of the request.
     * This method extracts the body from the Fastify request and returns it as a partial type.
     *
     * @param request - The Fastify request object containing the body.
     * @returns The parsed body as a partial type of TType.
     */
    getBody(
        request: FastifyRequest<
            ParamsWithWorkspace<TParams> &
            Body<TType> &
            QueryStrings<TQueryStrings>
        >,
    ): Partial<TType> {
        return request.body as Partial<TType>;
    }

    /**
     * ## Retrieves the parameters from the request.
     * This method extracts the parameters from the Fastify request object.
     *
     * @param request - The Fastify request object containing the parameters.
     * @returns The parameters as a Params type.
     */
    getParams(
        request: FastifyRequest<
            ParamsWithWorkspace<TParams> &
            Body<TType> &
            QueryStrings<TQueryStrings>
        >,
    ): ParamsWithWorkspace<TParams>["Params"] {
        return request.params as ParamsWithWorkspace<TParams>["Params"];
    }

    /**
     * ## Retrieves the query strings from the request.
     * This method extracts the query strings from the Fastify request object.
     *
     * @param request - The Fastify request object containing the query strings.
     * @returns The query strings as a QueryStrings type.
     */
    getQueryStrings(
        request: FastifyRequest<
            ParamsWithWorkspace<TParams> &
            Body<TType> &
            QueryStrings<TQueryStrings>
        >,
    ): TQueryStrings {
        return request.query as TQueryStrings;
    }

    /**
     * ## Checks if the request has a route parameter.
     * @param request - The Fastify request object containing the parameters.
     * @returns A boolean indicating whether the request has a route parameter.
     * This method checks if the routeParam is defined and if it exists in the request parameters.
     * If routeParam is not defined, it returns false.
     */
    private hasRouteParam(
        request: FastifyRequest<ParamsWithWorkspace<TParams>>,
    ): boolean {
        if (!this.routeParam) {
            return false;
        }
        return Object.prototype.hasOwnProperty.call(
            request.params,
            this.routeParam,
        );
    }

    /**
     * ## Handles content negotiation for the request.
     * This method determines the appropriate handler based on the requested content type.
     * It supports both Linked Art profile and JSON responses.
     *
     * @param request - The Fastify request object containing the body, params, and query strings.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to a record containing the response data.
     */
    async contentNegotiation(
        request: FastifyRequest<
            ParamsWithWorkspace<TParams> &
            QueryStrings<TQueryStrings> &
            Body<TType>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        try {
            const accepts = request.accepts();

            const isSingleResource = this.hasRouteParam(request);

            switch (accepts.type(["application/json", AController.laProfile])) {
                case AController.laProfile: {
                    return isSingleResource
                        ? await this.getLAHandler(request, reply)
                        : await this.listLAHandler(request, reply);
                }

                case "application/json": {
                    return isSingleResource
                        ? await this.getHandler(request, reply)
                        : await this.listHandler(request, reply);
                }
            }

            return reply.status(406).send({
                error: "Not Acceptable",
                message: `The requested content type is not supported. Supported types are: ${AController.laProfile}, application/json`,
            });
        } catch (error) {
            return this.error(error, reply);
        }
    }

    /**
     * ## Handles errors by sending an appropriate response.
     * This method checks the type of error and sends a response with the appropriate status code and message.
     * If the error is not recognized, it sends a generic internal server error response.
     *
     * @param err - The error object to be handled.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A Fastify reply with the error response.
     */
    public error(err: unknown, reply: FastifyReply) {
        if (
            isMdorimError(err) ||
            isGraphError(err) ||
            isServiceError(err) ||
            isQueryError(err) ||
            isControllerError(err) ||
            isModelError(err)
        ) {
            return reply.status(err.statusCode).send(err);
        }

        return reply.status(500).send({
            error: "Internal Server Error",
            message: String(err),
        });
    }
}
