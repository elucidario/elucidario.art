const packageJsonTemplate = (type, name, description, author, license) => {
    return {
        name: `@elucidario/${type}-${name}`,
        version: "0.1.0",
        keywords: [],
        license,
        author,
        description,
        main: "index.js",
        scripts: {
            build: "tsc",
            clean: "rm -rf dist",
            dev: "tsc -w",
        },
        devDependencies: {
            "@elucidario/tool-tsconfig": "workspace:^",
        },
        dependencies: {},
    };
};

export default packageJsonTemplate;
