import Core from "@/Core";
import Fastify from "fastify";
import cookie from "@fastify/cookie";

import { restPlugin } from "./plugins";
import { UsernamePassword } from "@/application/auth/strategies/UsernamePassword";

declare module "fastify" {
    interface FastifyInstance {
        lcdr: Core;
    }
}

/**
 * Creates a Fastify instance with elucidario.art core functionality.
 * @param logging - Enable or disable logging
 * @returns Fastify instance with elucidario.art core functionality
 */
export async function lcdr(logging: boolean = true) {
    const fastify = Fastify({
        logger: logging && {
            transport: {
                target: "pino-pretty",
            },
            level: "debug",
        },
    });

    fastify.register(cookie);

    fastify.decorate("lcdr", new Core());

    new UsernamePassword(fastify.lcdr.hooks);

    fastify.register(restPlugin);

    fastify.setErrorHandler((error, request, reply) => {
        reply.status(error.statusCode || 500).send(error);
    });

    fastify.after(async () => {
        await fastify.lcdr.setup();
    });

    return fastify;
}
