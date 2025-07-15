import { FastifyReply, FastifyRequest } from "fastify";
import { AController } from "../AController";
import { User as UserType, UUID } from "@elucidario/mdorim";
import { User } from "@/domain/models";
import { UserQuery } from "@/application/queries";
import { UserService } from "@/application/services";
import { Auth } from "@/application/auth";
import { ParamsWithWorkspace, QueryStrings, Body } from "@/types";
import { ControllerError } from "@/domain/errors";

type UserParams = {
    userUUID: UUID;
};

type UserQueryStrings = Record<string, unknown>;

export class UsersController extends AController<
    UserType,
    User,
    UserQuery,
    UserService,
    UserParams
> {
    endpoint: string = "users";

    constructor(
        model: User,
        service: UserService,
        auth: Auth,
        routeParam?: string,
    ) {
        super(model, service, auth, routeParam);
    }

    async getHandler(
        request: FastifyRequest<
            ParamsWithWorkspace<UserParams> &
            Body<UserType> &
            QueryStrings<UserQueryStrings>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        this.service.setContext(request.authContext);

        const { userUUID } = this.getParams(request);

        const user = await this.service.read({ uuid: userUUID });

        return reply.status(200).send({ data: user });
    }

    async listHandler(
        request: FastifyRequest<
            ParamsWithWorkspace<UserParams> &
            Body<UserType> &
            QueryStrings<UserQueryStrings>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        this.service.setContext(request.authContext);

        const queryStrings = this.getQueryStrings(request);

        const users = await this.service.list(queryStrings);

        return reply.status(200).send({ data: users });
    }

    async getLAHandler(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _request: FastifyRequest<
            ParamsWithWorkspace<UserParams> &
            Body<UserType> &
            QueryStrings<UserQueryStrings>
        >,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        throw new ControllerError(
            "User is not a Linked Art Entity.",
            400,
        );
    }

    async listLAHandler(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _request: FastifyRequest<
            ParamsWithWorkspace<UserParams> &
            Body<UserType> &
            QueryStrings<UserQueryStrings>
        >,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        throw new ControllerError(
            "User is not a Linked Art Entity.",
            400,
        );
    }

    async postHandler(
        request: FastifyRequest<
            ParamsWithWorkspace<UserParams> &
            Body<UserType> &
            QueryStrings<UserQueryStrings>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        this.service.setContext(request.authContext);

        const data = this.getBody(request);

        const user = await this.service.create(data);

        return reply.status(201).send({ data: user });
    }

    async updateHandler(
        request: FastifyRequest<
            ParamsWithWorkspace<UserParams> &
            Body<UserType> &
            QueryStrings<UserQueryStrings>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        this.service.setContext(request.authContext);

        const { userUUID } = this.getParams(request);
        const data = this.getBody(request);

        const user = await this.service.update(userUUID, data);

        return reply.status(200).send({ data: user });
    }

    async deleteHandler(
        request: FastifyRequest<
            ParamsWithWorkspace<UserParams> &
            Body<UserType> &
            QueryStrings<UserQueryStrings>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        this.service.setContext(request.authContext);

        const { userUUID } = this.getParams(request);

        const deleted = await this.service.delete(userUUID);

        return deleted ? reply.status(204).send() : reply.status(404).send();
    }
}
