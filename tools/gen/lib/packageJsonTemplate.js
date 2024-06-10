const packageJsonTemplate = (type, name, description, author, license) => {
    return {
        name: `@elucidario/${type}-${name}`,
        version: "0.1.0",
        description,
        author,
        license,
        main: "index.js",
        scripts: {
            test: 'echo "Error: no test specified" && exit 1',
        },
        keywords: [],
        devDependencies: {
            "@elucidario/tool-tsconfig": "workspace:^",
        },
        dependencies: {},
    };
};

export default packageJsonTemplate;
