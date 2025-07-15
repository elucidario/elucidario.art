import { FastifyReply, FastifyRequest } from "fastify";
import { AController } from "../AController";
import { Workspace as WorkspaceType } from "@elucidario/mdorim";
import { Workspace } from "@/domain/models";
import { WorkspaceQuery } from "@/application/queries";
import { WorkspaceService } from "@/application/services";
import { Auth } from "@/application/auth";
import { ParamsWithWorkspace, QueryStrings, Body } from "@/types";
import { ControllerError } from "@/domain/errors";

type WorkspaceQueryStrings = Record<string, unknown>;

export class WorkspacesController extends AController<
    WorkspaceType,
    Workspace,
    WorkspaceQuery,
    WorkspaceService
> {
    endpoint: string = "workspaces";

    constructor(
        model: Workspace,
        service: WorkspaceService,
        auth: Auth,
        routeParam?: string,
    ) {
        super(model, service, auth, routeParam);
    }

    async getHandler(
        request: FastifyRequest<
            ParamsWithWorkspace &
            Body<WorkspaceType> &
            QueryStrings<WorkspaceQueryStrings>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        this.service.setContext(request.authContext);

        const { workspaceUUID } = this.getParams(request);

        const workspace = await this.service.read({ uuid: workspaceUUID });

        return reply.status(200).send({ data: workspace });
    }

    async listHandler(
        request: FastifyRequest<
            ParamsWithWorkspace &
            Body<WorkspaceType> &
            QueryStrings<WorkspaceQueryStrings>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        this.service.setContext(request.authContext);

        const queryStrings = this.getQueryStrings(request);

        const workspaces = await this.service.list(queryStrings);

        return reply.status(200).send({ data: workspaces });
    }

    async getLAHandler(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _request: FastifyRequest<
            ParamsWithWorkspace &
            Body<WorkspaceType> &
            QueryStrings<WorkspaceQueryStrings>
        >,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        throw new ControllerError("Workspace is not a Linked Art Entity.", 400);
    }

    async listLAHandler(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _request: FastifyRequest<
            ParamsWithWorkspace &
            Body<WorkspaceType> &
            QueryStrings<WorkspaceQueryStrings>
        >,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        throw new ControllerError("Workspace is not a Linked Art Entity.", 400);
    }

    async postHandler(
        request: FastifyRequest<
            ParamsWithWorkspace &
            Body<WorkspaceType> &
            QueryStrings<WorkspaceQueryStrings>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        this.service.setContext(request.authContext);

        const data = this.getBody(request);

        const workspace = await this.service.create(data);

        return reply.status(201).send({ data: workspace });
    }

    async updateHandler(
        request: FastifyRequest<
            ParamsWithWorkspace &
            Body<WorkspaceType> &
            QueryStrings<WorkspaceQueryStrings>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        this.service.setContext(request.authContext);

        const { workspaceUUID } = this.getParams(request);

        if (!workspaceUUID) {
            return reply.status(400).send({
                success: false,
                message: "Workspace UUID is required for update.",
            });
        }

        const data = this.getBody(request);

        const workspace = await this.service.update(workspaceUUID, data);

        return reply.status(200).send({ data: workspace });
    }

    async deleteHandler(
        request: FastifyRequest<
            ParamsWithWorkspace &
            Body<WorkspaceType> &
            QueryStrings<WorkspaceQueryStrings>
        >,
        reply: FastifyReply,
    ): Promise<Record<string, unknown>> {
        this.service.setContext(request.authContext);

        const { workspaceUUID } = this.getParams(request);

        if (!workspaceUUID) {
            return reply.status(400).send({
                success: false,
                message: "Workspace UUID is required for deletion.",
            });
        }

        const deleted = await this.service.delete(workspaceUUID);

        return deleted ? reply.status(204).send({
            success: true,
            message: "Workspace deleted successfully.",
        }) : reply.status(404).send();
    }
}
