import { DefaultLocale, I18n, Mdorim } from "@elucidario/mdorim";

import { closeDriver, getDriver } from "./infrastructure/db/driver";

import { Graph } from "@/application/Graph";
import { Cypher } from "@/application/Cypher";
import { Actions, Filters } from "@/domain/hooks";
import { Hooks } from "@/types";
import { Auth } from "@/application/auth/Auth";
import { Config, History, User, Workspace } from "@/domain/models/core";

/**
 * # Core
 * The Core class initializes the main components of the application,
 * including the hooks, cypher, graph, mdorim, and authorization.
 */
export default class Core {
    mdorim: Mdorim;
    graph: Graph;
    cypher: Cypher;
    hooks: Hooks;
    auth: Auth;

    /**
     * # Core constructor
     * Initializes the core components of the application.
     * It sets up the hooks, cypher, graph, mdorim, and authorization.
     */
    constructor() {
        this.hooks = {
            filters: new Filters(),
            actions: new Actions(),
        };

        this.cypher = new Cypher();

        this.graph = new Graph(getDriver(), this.cypher, this.hooks);

        this.mdorim = new Mdorim(new I18n(DefaultLocale));

        this.auth = new Auth(this.cypher, this.graph, this.hooks);
    }

    /**
     * ## Setup method
     * Registers the models and sets up the graph.
     * This method should be called after the Core instance is created.
     */
    async setup() {
        this.register();
        await this.graph.setup();
    }

    /**
     * ## Register
     * Registers the models.
     * see specific register methods in models.
     */
    protected register() {
        new Config(null, this.hooks).register();
        new History(null, this.hooks).register();
        new User(null, this.hooks).register();
        new Workspace(null, this.hooks).register();
        // new History(null, this.hooks).register();
        // new Concept(null, this.hooks).register();
        // new NameOrIdentifier(null, this.hooks).register();
        // new Reference(null, this.hooks).register();
    }

    /**
     * ## Close method
     * Closes the database driver.
     */
    async close() {
        closeDriver();
    }
}
