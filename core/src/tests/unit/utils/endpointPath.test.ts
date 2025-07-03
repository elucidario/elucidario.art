import { describe, expect, it } from "vitest";
import { endpointPath } from "@/utils";
import { API_PREFIX } from "@/constants";

describe("endpointPath", () => {
    it("should return the correct endpoint for given parameters", () => {
        expect(
            endpointPath(
                {
                    prefix: API_PREFIX,
                    path: "config",
                    version: "v1",
                    endpoints: {
                        create: "create",
                        read: "read",
                        update: "read",
                    },
                },
                "create",
            ),
        ).toBe("/api/v1/config/create");
    });
});
