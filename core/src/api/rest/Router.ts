import { API_PREFIX } from "@/constants";
import { Body, Hooks, ParamsWithWorkspace, QueryStrings } from "@/types";
import { MdorimBase } from "@elucidario/mdorim";
import {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifySchema,
} from "fastify";
import { AController } from "./AController";
import AService from "@/application/services/AService";
import { Auth } from "@/application/auth";
import { Validator } from "@/application/Validator";
import { Graph } from "@/application/Graph";
import { AQuery } from "@/application/queries/AQuery";
import { Cypher } from "@/application/Cypher";
import AModel from "@/domain/models/AModel";

declare module "fastify" {
    interface FastifyRequest {
        controller?: Record<
            string,
            AController<
                MdorimBase,
                AModel<MdorimBase>,
                AQuery<MdorimBase>,
                AService<MdorimBase, AQuery<MdorimBase>>,
                Record<string, unknown>,
                Record<string, unknown>
            >
        >;
    }
}

export type RouteOptions = {
    authenticate?: boolean;
};

/**
 * # Router
 * This class provides a base for creating RESTful API routers in the application.
 * It handles the registration of routes and the creation of controllers.
 *
 * @template TType - The type of the model used in the router.
 * @template TParams - The parameters for the routes.
 * @template TQueryStrings - The query strings for the routes.
 */
export class Router<
    TType extends MdorimBase,
    TModel extends AModel<TType>,
    TQuery extends AQuery<TType>,
    TService extends AService<TType, TQuery>,
    TController extends AController<
        TType,
        TModel,
        TQuery,
        TService,
        TParams,
        TQueryStrings
    >,
    TParams extends Record<string, unknown> = Record<string, unknown>,
    TQueryStrings extends Record<string, unknown> = Record<string, unknown>,
> {
    /**
     * ## The prefix for the controller's routes.
     * /api
     */
    protected readonly prefix: string = API_PREFIX;

    /**
     * ## The version of the API that this controller is associated with.
     * v1
     */
    protected readonly version: string = "v1";

    /**
     * ## Constructor for the Router class.
     * This constructor initializes the router with the necessary dependencies.
     * @param fastify - The Fastify instance to which this router will be registered.
     * @param endpoint - The endpoint for the router.
     * @param Model - The model class associated with the router.
     * @param Query - The query class associated with the router.
     * @param Service - The service class associated with the router.
     * @param Controller - The controller class associated with the router.
     */
    constructor(
        protected fastify: FastifyInstance,
        protected endpoint: string,
        protected Model: new () => TModel,
        protected Query: new (cypher: Cypher) => TQuery,
        protected Service: new (
            validator: Validator,
            query: TQuery,
            auth: Auth,
            graph: Graph,
            hooks: Hooks,
        ) => TService,
        protected Controller: new (
            model: TModel,
            service: TService,
            auth: Auth,
            routeParam?: string,
        ) => TController,
        protected routeParam?: string,
    ) { }

    /**
     * ## Creates an instance of the controller associated with this router.
     * @returns AController instance
     * This method creates an instance of the controller associated with this router.
     * It initializes the controller with the model, service, and authentication context.
     */
    public controllerFactory(): TController {
        const lcdr = this.fastify.lcdr;
        const model = new this.Model();
        const service = new this.Service(
            new Validator(lcdr.mdorim, model),
            new this.Query(lcdr.cypher),
            lcdr.auth,
            lcdr.graph,
            lcdr.hooks,
        );
        return new this.Controller(model, service, lcdr.auth, this.routeParam);
    }

    /**
     * ## Gets the prefix for the controller's routes.
     * This method returns the prefix that should be used for the controller's routes.
     * @returns The route prefix.
     */
    public getPrefix(): string {
        return `/${this.prefix}/${this.getVersion()}`;
    }

    /**
     * ## Gets the REST version.
     * @returns The version of the API that this controller is associated with.
     */
    public getVersion(): string {
        return this.version;
    }

    /**
     * ## Gets the endpoint for the controller.
     * @param param An optional parameter to include in the endpoint URL.
     * @returns The full endpoint URL for the controller.
     */
    public getEndpoint(withParam?: boolean): string {
        return `${this.getPrefix()}/${this.endpoint}${withParam && this.routeParam ? `/:${this.routeParam}` : ""}`;
    }

    /**
     * ## Pre-handler for the controller's routes.
     * This method is called before the route handler to perform authentication and other pre-processing.
     * @param request - The Fastify request object.
     * @param reply - The Fastify reply object.
     * @param args - Optional arguments for the pre-handler, such as authentication options.
     */
    public async preHandler(
        request: FastifyRequest<
            ParamsWithWorkspace<TParams> &
            Body<TType> &
            QueryStrings<TQueryStrings>
        >,
        reply: FastifyReply,
        args?: RouteOptions,
    ): Promise<void> {
        if (args?.authenticate) {
            await this.fastify.lcdr.auth.authenticateRequest(request, reply);
        }

        const Controller = this.controllerFactory();

        if (typeof request.controller === "undefined") {
            request.controller = {};
        }

        // Register the controller instance in the request object
        // so that it can be accessed in the handler.
        // This allows the controller to handle the request and provide the necessary response.
        request.controller[this.endpoint] = Controller;
    }

    /**
     * ███████╗ ██████╗██╗  ██╗███████╗███╗   ███╗ █████╗
     * ██╔════╝██╔════╝██║  ██║██╔════╝████╗ ████║██╔══██╗
     * ███████╗██║     ███████║█████╗  ██╔████╔██║███████║
     * ╚════██║██║     ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══██║
     * ███████║╚██████╗██║  ██║███████╗██║ ╚═╝ ██║██║  ██║
     * ╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝
     */
    /**
     * ## Gets the schema for the GET request.
     * @returns The schema for the GET request.
     * This schema defines the expected response structure for GET requests.
     * It includes a response with a 200 status code and a reference to the model's schema.
     */
    public schemaForGet(list?: boolean): FastifySchema {
        return {
            response: {
                200: this.getResponseSchema(list),
            },
        };
    }

    /**
     * ## Gets the schema for the POST request.
     * @returns The schema for the POST request.
     * This schema defines the expected request body and response structure for POST requests.
     * It includes a body reference to the model's schema and a response with a 201 status code.
     */
    public schemaForPost(): FastifySchema {
        const model = new this.Model();
        return {
            body: { $ref: model.schemaName() },
            response: {
                201: this.getResponseSchema(),
            },
        };
    }

    /**
     * ## Gets the response schema for the controller.
     * @returns The response schema for the controller.
     * This schema defines the structure of the response data, including a reference to the model's schema.
     */
    public getResponseSchema(
        list?: boolean,
    ): FastifySchema | Record<string, unknown> {
        const model = new this.Model();

        if (list) {
            return {
                type: "object",
                properties: {
                    data: {
                        type: "array",
                        items: { $ref: model.schemaName() },
                    },
                },
            };
        }

        return {
            type: "object",
            properties: {
                data: { $ref: model.schemaName() },
            },
        };
    }

    /**
     * ██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
     * ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
     * ██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
     * ██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
     * ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
     * ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
     */
    /**
     * ## Registers a GET route for the controller.
     * This method registers a GET route with the specified handler and options.
     * @param opts - The options for the route, including the handler function.
     */
    public registerGetRoute(args?: RouteOptions): void {
        this.fastify.route<
            ParamsWithWorkspace<TParams> &
            Body<TType> &
            QueryStrings<TQueryStrings>
        >({
            method: "GET",
            url: this.getEndpoint(true),
            schema: this.schemaForGet(),
            preHandler: (request, reply) =>
                this.preHandler(request, reply, args),
            handler: (request, reply) =>
                request.controller?.[this.endpoint].contentNegotiation(
                    request,
                    reply,
                ),
        });
    }

    /**
     * ## Registers a GET route for the controller.
     * This method registers a GET route with the specified handler and options.
     * @param opts - The options for the route, including the handler function.
     */
    public registerListRoute(args?: RouteOptions): void {
        this.fastify.route<
            ParamsWithWorkspace<TParams> &
            Body<TType> &
            QueryStrings<TQueryStrings>
        >({
            method: "GET",
            url: this.getEndpoint(),
            schema: this.schemaForGet(true),
            preHandler: (request, reply) =>
                this.preHandler(request, reply, args),
            handler: (request, reply) =>
                request.controller?.[this.endpoint].contentNegotiation(
                    request,
                    reply,
                ),
        });
    }

    /**
     * ## Registers a POST route for the controller.
     * This method registers a POST route with the specified handler and options.
     * @param args - Optional arguments for the route, including authentication and validation options.
     */
    public registerPostRoute(args?: RouteOptions): void {
        this.fastify.route<
            ParamsWithWorkspace<TParams> &
            Body<TType> &
            QueryStrings<TQueryStrings>
        >({
            method: "POST",
            url: this.getEndpoint(),
            schema: this.schemaForPost(),
            preHandler: (request, reply) =>
                this.preHandler(request, reply, args),
            handler: (request, reply) =>
                request.controller?.[this.endpoint].postHandler(request, reply),
        });
    }

    /**
     * ## Registers a PUT route for the controller.
     * This method registers a PUT route with the specified handler and options.
     * @param param - The route parameter to be included in the URL.
     * @param args - Optional arguments for the route, including authentication and validation options.
     */
    public registerUpdateRoute(args?: RouteOptions): void {
        this.fastify.route<
            ParamsWithWorkspace<TParams> &
            Body<TType> &
            QueryStrings<TQueryStrings>
        >({
            method: "PUT",
            url: this.getEndpoint(true),
            schema: this.schemaForPost(),
            preHandler: (request, reply) =>
                this.preHandler(request, reply, args),
            handler: (request, reply) =>
                request.controller?.[this.endpoint].updateHandler(
                    request,
                    reply,
                ),
        });
    }

    /**
     * ## Registers a DELETE route for the controller.
     * This method registers a DELETE route with the specified handler and options.
     * @param param - The route parameter to be included in the URL.
     * @param args - Optional arguments for the route, including authentication options.
     */
    public registerDeleteRoute(args?: RouteOptions): void {
        this.fastify.route<
            ParamsWithWorkspace<TParams> &
            Body<TType> &
            QueryStrings<TQueryStrings>
        >({
            method: "DELETE",
            url: this.getEndpoint(true),
            preHandler: (request, reply) =>
                this.preHandler(request, reply, args),
            handler: (request, reply) =>
                request.controller?.[this.endpoint].deleteHandler(
                    request,
                    reply,
                ),
        });
    }
}
