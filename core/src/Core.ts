import { DefaultLocale, I18n, Mdorim } from "@elucidario/mdorim";

import { closeDriver, getDriver } from "./infrastructure/db/driver";

import { Graph } from "@/application/Graph";
import { Cypher } from "@/application/Cypher";
import { Actions, Filters } from "@/domain/hooks";
import { Hooks, PropertyConstraint } from "@/types";
import { Authorization } from "@/application/Authorization";
import { History, User, Workspace } from "@/domain/models/core";
import {
    Concept,
    NameOrIdentifier,
    Reference,
} from "@/domain/models/linked-art";

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
    authorization: Authorization;

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

        this.authorization = new Authorization(this.hooks);
    }

    /**
     * ## Setup method
     * Registers the models and sets up the graph.
     * This method should be called after the Core instance is created.
     */
    async setup() {
        this.registerModels();
        await this.graph.setup();
    }

    /**
     * ## Register Models
     * Registers the models and their constraints.
     */
    protected registerModels() {
        const models = new Map<string, PropertyConstraint[]>([
            ["Core/History", new History().constraints],
            ["Core/User", new User().constraints],
            ["Core/Workspace", new Workspace().constraints],
            ["LinkedArt/Concept", new Concept().constraints],
            ["LinkedArt/NameOrIdentifier", new NameOrIdentifier().constraints],
            ["LinkedArt/Reference", new Reference().constraints],
        ]);

        models.forEach((constraints) => {
            this.hooks.filters.add<PropertyConstraint[], unknown[]>(
                "graph.setConstraints",
                (c) => {
                    c.push(...constraints);
                    return c;
                },
            );
        });
    }

    /**
     * ## Close method
     * Closes the database driver.
     */
    async close() {
        closeDriver();
    }
}
