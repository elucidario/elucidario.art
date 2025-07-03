import fp from "fastify-plugin";

import { FastifyReply, FastifyRequest } from "fastify";
import { User, Workspace } from "@elucidario/mdorim";
import { ParamsWithWorkspace } from "@/types";
import { Clause, ProjectionColumn } from "@neo4j/cypher-builder";
import { Authorization } from "./Authorization";

export type AuthType = {
    prefix: string;
    endpoints: {
        register: string;
        login: string;
        authenticate: string;
    };
};

declare module "fastify" {
    interface FastifyInstance {
        auth: {
            n: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
            z: Authorization;
        };
    }
    interface FastifyRequest {
        user?: User;
        workspace?: Workspace;
    }
}

export function getWorkspaceUUIDFromRequest(
    request: FastifyRequest,
): string | null {
    return (
        (request.params as ParamsWithWorkspace["Params"]).workspaceUUID ?? null
    );
}

const users = {
    admin: {
        username: "username_admin",
        email: "admin@example.com",
    },
    editor: {
        username: "editor",
        email: "editor@example.com",
    },
    assistant: {
        username: "assistant",
        email: "assistant@example.com",
    },
    researcher: {
        username: "researcher",
        email: "researcher@example.com",
    },
};

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
        // alguma lógica de autenticação
        const graph = request.server.lcdr.graph;

        const workspaceUUID = getWorkspaceUUIDFromRequest(request);

        const { cypher, params } = graph.cypher
            .builder((Cypher) => {
                const user = new Cypher.NamedNode("user");
                const workspace = new Cypher.NamedNode("workspace");
                const relationship = new Cypher.NamedRelationship("r");

                const clauses: Array<Clause | undefined> = [
                    new Cypher.Match(
                        new Cypher.Pattern(user, {
                            labels: ["User"],
                            properties: {
                                email: new Cypher.Param(users.admin.email),
                            },
                        }),
                    ),
                    ...(workspaceUUID
                        ? [
                              new Cypher.OptionalMatch(
                                  new Cypher.Pattern(workspace, {
                                      labels: ["Workspace"],
                                      properties: {
                                          uuid: new Cypher.Param(workspaceUUID),
                                      },
                                  }),
                              ),
                              new Cypher.OptionalMatch(
                                  new Cypher.Pattern(user)
                                      .related(relationship, {
                                          type: "MEMBER_OF",
                                      })
                                      .to(workspace),
                              ).with(user, workspace, relationship),
                          ]
                        : [undefined]),
                ];

                const returnNodes: Array<"*" | ProjectionColumn> = [
                    user,
                    ...(workspaceUUID ? [workspace, relationship] : []),
                ];

                const returnClause = new Cypher.Return(...returnNodes);

                return Cypher.utils.concat(...clauses, returnClause);
            })
            .build();

        const user = await graph.executeQuery<User>(
            (response) => {
                if (response.records.length === 0) {
                    throw new Error("User not found");
                }
                return response.records[0].get("user").properties;
            },
            cypher,
            params,
        );

        request.user = user;
    } catch (error) {
        console.log(error);
        reply.status(401).send({ error: "Unauthorized" });
        return;
    }
}

export const authPlugin = fp(async (fastify) => {
    fastify.decorate("auth", {
        n: authenticate,
        z: new Authorization(fastify.lcdr.hooks),
    });
});
