import type { CodegenConfig } from "@graphql-codegen/cli";

const codegen: CodegenConfig = {
    schema: ["http://dev_core:8000/api/graphql"],
    generates: {
        "./src/graphql/gen/": {
            preset: "client",
            config: {
                documentMode: "string",
            },
        },
        "./src/graphql/gen/schema.graphql": {
            plugins: ["schema-ast"],
            overwrite: true,
            config: {
                includeDirectives: true,
            },
        },
    },
};

export default codegen;
