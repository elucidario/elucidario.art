import { TeamMemberRole, User, Workspace } from "@elucidario/mdorim";
import { createMongoAbility, MongoAbility, RawRuleOf } from "@casl/ability";

import { AuthContext, Hooks, ParamsWithWorkspace } from "@/types";
import { Cypher } from "../Cypher";
import { Graph } from "../Graph";
import { ServiceError } from "@/domain/errors";
import { Param } from "@neo4j/cypher-builder";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticationStrategy } from "./AuthenticationStrategy";

declare module "fastify" {
    interface FastifyRequest {
        authContext: AuthContext;
    }
}

/**
 * # Auth
 */
export class Auth {
    constructor(
        protected cypher: Cypher,
        protected graph: Graph,
        protected hooks: Hooks,
    ) { }

    /**
     * Authenticate a request using the defined authentication strategies.
     * @param request The Fastify request object.
     * @param reply The Fastify reply object.
     * @returns The authentication context if successful, otherwise throws an error.
     */
    async authenticateRequest(
        request: FastifyRequest<ParamsWithWorkspace>,
        reply: FastifyReply,
    ): Promise<AuthContext> {
        const { workspaceUUID } = request.params;

        // Apply filters to get the authentication strategies
        // This allows for dynamic strategies to be added or modified
        // without changing the core authentication logic.
        // The strategies are expected to return a user query or null.
        // If no strategies are defined, an error is thrown.
        const strategies = this.hooks.filters.apply<
            AuthenticationStrategy[],
            [FastifyRequest<ParamsWithWorkspace>, FastifyReply]
        >("auth.strategies", [], request, reply);

        if (!strategies.length) {
            throw new ServiceError(
                "No authentication strategies defined.",
                500,
            );
        }

        for (const strategy of strategies) {
            const userQuery = await strategy(request, reply);
            if (userQuery) {
                const authenticated = await this.authenticate(
                    userQuery,
                    workspaceUUID ? { uuid: workspaceUUID } : undefined,
                );

                if (authenticated) {
                    request.authContext = authenticated;
                    return authenticated;
                }

                throw new ServiceError(
                    "Authentication failed. User not found or not authorized.",
                    401,
                );
            }
        }

        throw new ServiceError("Authentication failed.", 401);
    }

    /**
     * Authenticate a user based on the provided user query and optional workspace query.
     * @param userQuery The user query parameters.
     * @param workspaceQuery The workspace query parameters, if any.
     * @returns The authentication context if successful, otherwise null.
     */
    async authenticate(
        userQuery: Partial<User>,
        workspaceQuery?: Partial<Workspace>,
    ): Promise<AuthContext | null> {
        if (!userQuery) {
            throw new Error("User is required for Auth context.");
        }

        const auth = workspaceQuery
            ? await this.authenticateForWorkspace(userQuery, workspaceQuery)
            : await this.authenticateSysadmin(userQuery);

        return auth;
    }

    /**
     * Authenticate a user for a specific workspace.
     * @param userQuery The user query parameters.
     * @param workspaceQuery The workspace query parameters.
     * @returns The authentication context if successful, otherwise throws an error.
     */
    private async authenticateForWorkspace(
        userQuery: Partial<User>,
        workspaceQuery: Partial<Workspace>,
    ): Promise<AuthContext> {
        // If a workspace UUID is provided, we need to check if the user is a member of that workspace.
        // This is essential for actions that require a workspace context, such as creating or modifying entities
        // that are tied to a specific workspace.
        const userNode = this.cypher.NamedNode("user");
        const workspaceNode = this.cypher.NamedNode("workspace");
        const memberNode = this.cypher.NamedNode("member");
        const memberOf = this.cypher.NamedRelationship("memberOf");

        const matchRelationship = this.cypher
            .OptionalMatch(
                this.cypher
                    .Pattern(userNode, {
                        labels: ["User"],
                        properties: Object.entries(userQuery).reduce(
                            (acc, [keys, value]) => {
                                acc[keys] = this.cypher.Param(value);
                                return acc;
                            },
                            {} as Record<string, Param>,
                        ),
                    })
                    .related(this.cypher.Relationship(), {
                        type: "SAME_AS",
                    })
                    .to(memberNode, {
                        labels: ["TeamMember"],
                    })
                    .related(memberOf, {
                        type: "MEMBER_OF",
                    })
                    .to(workspaceNode, {
                        labels: ["Workspace"],
                        properties: Object.entries(workspaceQuery).reduce(
                            (acc, [keys, value]) => {
                                acc[keys] = this.cypher.Param(value);
                                return acc;
                            },
                            {} as Record<string, Param>,
                        ),
                    }),
            )
            .with(userNode, memberNode, memberOf, workspaceNode)
            .return(userNode, memberNode, memberOf, workspaceNode);

        const { cypher, params } = matchRelationship.build();

        return await this.graph.executeQuery(
            ({ records }) => {
                if (records.length === 0) {
                    throw new ServiceError(
                        "Access denied. User may not exist or is not a member of this workspace.",
                        403,
                    );
                }

                const [first] = records;
                const user = this.graph.parseNode<User>(first.get("user"));
                const workspace = this.graph.parseNode<Workspace>(
                    first.get("workspace"),
                );
                const role = first.get("role") as TeamMemberRole;

                if (!user || !workspace || !role) {
                    throw new ServiceError(
                        "Failed to retrieve authentication details.",
                        500,
                    );
                }

                return { user, workspace, role };
            },
            cypher,
            params,
        );
    }

    /**
     * Authenticate a user as a sysadmin.
     * @param userQuery The user query parameters.
     * @returns The authentication context if successful, otherwise null.
     */
    private async authenticateSysadmin(
        userQuery: Partial<User>,
    ): Promise<AuthContext | null> {
        // If no workspace is provided, check if the user is a sysadmin
        // This is a fallback for when the user is not part of any workspace
        // and we need to determine if they are a sysadmin.
        // This is useful for global configurations or actions that do not require a workspace context.
        const userNode = this.cypher.NamedNode("user");

        const sysAdminRelationship =
            this.cypher.NamedRelationship("sysadminOf");

        const matchUser = this.cypher.Match(
            this.cypher.Pattern(userNode, {
                labels: ["User"],
                properties: Object.entries(userQuery).reduce(
                    (acc, [keys, value]) => {
                        acc[keys] = this.cypher.Param(value);
                        return acc;
                    },
                    {} as Record<string, Param>,
                ),
            }),
        );

        const sysAdmin = this.cypher
            .OptionalMatch(
                this.cypher
                    .Pattern(userNode)
                    .related(sysAdminRelationship, {
                        type: "SYSADMIN",
                    })
                    .to(this.cypher.NamedNode("sysadmin"), {
                        labels: ["MainConfig"],
                    }),
            )
            .return(userNode, sysAdminRelationship);

        const { cypher, params } = this.cypher
            .concat(matchUser, sysAdmin)
            .build();

        return await this.graph.executeQuery(
            ({ records }) => {
                if (records.length === 0) {
                    // If no records are found, the user is not a sysadmin
                    return null;
                }
                const [first] = records;
                const user = this.graph.parseNode<User>(first.get("user"));
                const sysAdmin = first.get("sysadminOf");

                if (!user) {
                    throw new ServiceError("User not found.", 404);
                }

                const role = sysAdmin.type.includes("SYSADMIN")
                    ? "sysadmin"
                    : "anonymous";

                return {
                    user,
                    role,
                    workspace: undefined, // No workspace context for sysadmin
                } as AuthContext;
            },
            cypher,
            params,
        );
    }

    /**
     * Get the permissions for the current context.
     * @param context The authentication context.
     * @returns The permissions as a MongoAbility instance.
     */
    permissions(context: AuthContext): MongoAbility {
        return createMongoAbility(
            this.hooks.filters.apply<RawRuleOf<MongoAbility>[], [AuthContext]>(
                "authorization.rules",
                [],
                context,
            ),
        );
    }

    /**
     * Get the roles available for team members.
     * @returns List of roles available for team members.
     */
    getRoles(): TeamMemberRole[] {
        return this.hooks.filters.apply<TeamMemberRole[]>(
            "authorization.roles",
            ["admin", "editor", "assistant", "researcher"],
        );
    }
}
