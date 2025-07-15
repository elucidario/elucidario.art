import { FastifyReply, FastifyRequest } from "fastify";
import { AController } from "../AController";

import { Body, QueryStrings, Params, ParamsWithWorkspace } from "@/types";
import { Config as ConfigType, ConfigTypes } from "@elucidario/mdorim";
import { Config } from "@/domain/models";
import { ConfigService } from "@/application/services";
import { ConfigQuery } from "@/application/queries";
import { ControllerError } from "@/domain/errors";
import { Auth } from "@/application/auth";

export class ConfigController extends AController<
    ConfigType<ConfigTypes>,
    Config,
    ConfigQuery,
    ConfigService
> {
    endpoint: string = "config";

    constructor(
        model: Config,
        service: ConfigService,
        auth: Auth,
        routeParam?: string,
    ) {
        super(model, service, auth, routeParam);
    }

    async getHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        return this.error(
            new ControllerError("List config is not supported.", 406),
            reply,
        );
    }

    async postHandler(
        request: FastifyRequest<
            Body<ConfigType<ConfigTypes>> & QueryStrings & Params
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        try {
            const data = this.getBody(request);

            const config = await this.service.setMainConfig(data);

            return reply.status(201).send({ data: config });
        } catch (error) {
            return this.error(error, reply);
        }
    }

    async listHandler(
        request: FastifyRequest<
            ParamsWithWorkspace & QueryStrings & Body<ConfigType<ConfigTypes>>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        try {
            this.service.setContext(request.authContext);

            const config = await this.service.getMainConfig();

            return { data: config };
        } catch (error) {
            return this.error(error, reply);
        }
    }

    async getLAHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        return this.error(
            new ControllerError(
                "Linked Art profile is not accepted for Config endpoint.",
                406,
            ),
            reply,
        );
    }

    async listLAHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        return this.error(
            new ControllerError(
                "Linked Art profile is not accepted for Config endpoint.",
                406,
            ),
            reply,
        );
    }

    async updateHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        return this.error(
            new ControllerError("Update config is not supported.", 406),
            reply,
        );
    }

    async deleteHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        return this.error(
            new ControllerError("Delete config is not supported.", 406),
            reply,
        );
    }
}
