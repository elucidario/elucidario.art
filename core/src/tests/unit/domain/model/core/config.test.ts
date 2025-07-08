import { describe, expect, it } from "vitest";

import { Config as ConfigType, ConfigTypes } from "@elucidario/mdorim";
import { Config } from "@/domain/models/core";

describe("Config Model", { skip: false }, () => {
    it("should create a Config instance", () => {
        const user = new Config();
        expect(user).toBeInstanceOf(Config);
        expect(user.schema).toBe("/core/Config");
    });

    it("should create a Config instance with provided data", () => {
        const config: ConfigType<ConfigTypes> = {
            type: "MainConfig",
            _label: "Test Config",
            sysadmins: [
                {
                    type: "User",
                    username: "admin",
                    email: "admin@example.com",
                },
            ],
        };
        const user = new Config(config);
        expect(user).toBeInstanceOf(Config);
        expect(user.get()).toEqual(config);
        expect(user.schema).toBe("/core/Config");
    });
});
