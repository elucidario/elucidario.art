import { Hooks, ParamsWithWorkspace } from "@/types";
import { User } from "@elucidario/mdorim";
import { FastifyReply, FastifyRequest } from "fastify";

export type AuthenticationStrategy = (
    request: FastifyRequest<ParamsWithWorkspace>,
    reply: FastifyReply,
) => Promise<Partial<User> | null>;

export abstract class AAuthenticationProvider {
    abstract authenticate: AuthenticationStrategy;

    constructor(protected hooks: Hooks) {
        this.register();
    }

    protected register() {
        this.hooks.filters.add<
            AuthenticationStrategy[],
            [FastifyRequest<ParamsWithWorkspace>, FastifyReply]
        >("auth.strategies", (strategies) => [
            ...strategies,
            this.authenticate.bind(this),
        ]);
    }
}
