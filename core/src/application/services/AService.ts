import { MongoAbility, RawRuleOf } from "@casl/ability";
import { isMdorimError, MdorimBase, MdorimError } from "@elucidario/mdorim";

import IQuery from "@/application/queries/IQuery";
import { Graph } from "@/application/Graph";
import {
    GraphError,
    isGraphError,
    isNeo4jError,
    isServiceError,
    ServiceError,
} from "@/domain/errors";
import { Hooks, AuthContext } from "@/types";
import { Validator } from "@/application/Validator";
import { Auth } from "@/application/auth/Auth";

/**
 * # AbstractService
 * This abstract class provides a base for services in the application.
 * Services extending this class must implement the `setAbilities` and `register` methods.
 */
export default abstract class AService<
    TType extends MdorimBase,
    TQuery extends IQuery<TType>,
> {
    /**
     * ## The auth context for the service.
     */
    protected context?: AuthContext;

    /**
     * # AbstractService constructor
     *
     * @param validator - The Validator instance used for validating data.
     * @param query - The query instance used for database operations.
     * @param auth - The Auth instance used for managing user permissions.
     * @param graph - The Graph instance used for interacting with the graph database.
     * @param hooks - The Hooks instance used for managing application hooks.
     */
    constructor(
        protected validator: Validator,
        protected query: TQuery,
        protected auth: Auth,
        protected graph: Graph,
        protected hooks: Hooks,
    ) { }

    /**
     * ## Sets the authentication context for the service.
     * This method is used to set the context that contains user and role information.
     *
     * @param context - The authentication context containing user and role information.
     */
    setContext(context: AuthContext): void {
        this.context = context;
    }

    /**
     * ## Gets the authentication context for the service.
     * This method returns the current authentication context if set.
     *
     * @returns The authentication context or undefined if not set.
     */
    getContext(): AuthContext | undefined {
        return this.context;
    }

    /**
     * ## Sets the abilities for the user based on their role.
     * This method modifies the abilities array to include management permissions.
     *
     * @param abilities - The current abilities array.
     * @param context - The authentication context containing user and role information.
     * @returns The modified abilities array.
     */
    protected abstract setAbilities(
        abilities: RawRuleOf<MongoAbility>[],
        context: AuthContext,
    ): RawRuleOf<MongoAbility>[];

    /**
     * ## Registers the service hooks for authorization rules.
     * This method adds a filter to the "authorization.rules" hook
     * to set abilities based on the user's role.
     */
    protected abstract register(): void;

    /**
     * ## Retrieves the permissions for the user based on their context.
     *
     * @returns The MongoAbility instance containing the user's permissions.
     * @throws ServiceError if the authorization context is not set.
     */
    getPermissions(): MongoAbility {
        try {
            if (typeof this.context === "undefined") {
                throw this.error("Auth context is not set", 500);
            }
            return this.auth.permissions(this.context);
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * ## Handles errors that occur within the service.
     * This method takes an error object and returns a standardized error response.
     *
     * @param e - The error object to handle.
     * @param statusCode - The HTTP status code to use for the response.
     * @returns A standardized error response.
     */
    error(
        e: unknown,
        statusCode?: number,
    ): ServiceError | MdorimError | GraphError {
        if (typeof e === "string") {
            return new ServiceError(e, statusCode);
        }

        if (isServiceError(e)) {
            return e;
        }

        if (isNeo4jError(e) || isGraphError(e)) {
            return this.graph.error(e, undefined, statusCode);
        }

        if (isMdorimError(e)) {
            return e;
        }

        return new ServiceError(String(e), statusCode);
    }
}
