import fp from "fastify-plugin";

import {
    Config as ConfigType,
    ConfigTypes,
    User as UserType,
    Workspace as WorkspaceType,
} from "@elucidario/mdorim";
import { ConfigController, UsersController, WorkspacesController } from "@/api/rest/core";
import { Config, User, Workspace } from "@/domain/models";
import { ConfigService, UserService, WorkspaceService } from "@/application/services";
import { ConfigQuery, UserQuery, WorkspaceQuery } from "@/application/queries";
import { Router } from "@/api/rest/Router";

export const restPlugin = fp(async (fastify) => {
    const mdorim = fastify.lcdr.mdorim;

    const refs = mdorim.getSchemasRefs();
    while (refs.length > 0) {
        const ref = refs.shift();
        if (ref) {
            const schema = mdorim.getSchema(ref);
            fastify.addSchema(schema);
        }
    }
    fastify.register(import("@fastify/accepts"));

    /**
     * ░█▀▀░█▀█░█▀█░█▀▀░▀█▀░█▀▀
     * ░█░░░█░█░█░█░█▀▀░░█░░█░█
     * ░▀▀▀░▀▀▀░▀░▀░▀░░░▀▀▀░▀▀▀
     */
    const configRoutes = new Router<
        ConfigType<ConfigTypes>,
        Config,
        ConfigQuery,
        ConfigService,
        ConfigController
    >(fastify, "config", Config, ConfigQuery, ConfigService, ConfigController);
    configRoutes.registerPostRoute();
    configRoutes.registerGetRoute({ authenticate: true });

    /**
     * ░█░█░█▀▀░█▀▀░█▀▄░█▀▀
     * ░█░█░▀▀█░█▀▀░█▀▄░▀▀█
     * ░▀▀▀░▀▀▀░▀▀▀░▀░▀░▀▀▀
     */
    const userRoutes = new Router<
        UserType,
        User,
        UserQuery,
        UserService,
        UsersController
    >(
        fastify,
        "users",
        User,
        UserQuery,
        UserService,
        UsersController,
        "userUUID",
    );
    userRoutes.registerPostRoute();
    userRoutes.registerGetRoute({ authenticate: true });
    userRoutes.registerListRoute({ authenticate: true });
    userRoutes.registerUpdateRoute({ authenticate: true });
    userRoutes.registerDeleteRoute({ authenticate: true });

    /**
     * ░█░█░█▀█░█▀▄░█░█░█▀▀░█▀█░█▀█░█▀▀░█▀▀░█▀▀
     * ░█▄█░█░█░█▀▄░█▀▄░▀▀█░█▀▀░█▀█░█░░░█▀▀░▀▀█
     * ░▀░▀░▀▀▀░▀░▀░▀░▀░▀▀▀░▀░░░▀░▀░▀▀▀░▀▀▀░▀▀▀
     */
    const workspaceRoutes = new Router<
        WorkspaceType,
        Workspace,
        WorkspaceQuery,
        WorkspaceService,
        WorkspacesController
    >(
        fastify,
        "workspaces",
        Workspace,
        WorkspaceQuery,
        WorkspaceService,
        WorkspacesController,
        "workspaceUUID",
    );
    workspaceRoutes.registerPostRoute({ authenticate: true });
    workspaceRoutes.registerGetRoute({ authenticate: true });
    workspaceRoutes.registerListRoute({ authenticate: true });
    workspaceRoutes.registerUpdateRoute({ authenticate: true });
    workspaceRoutes.registerDeleteRoute({ authenticate: true });
});
