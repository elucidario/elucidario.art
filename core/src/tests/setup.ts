const mainConfig: MainConfig = {
    skipDelete: false,
};

type MainConfig = Record<string, boolean>;

export const testSetup = {
    DELETE: {
        skip: mainConfig.skipDelete,
        only: mainConfig.onlyDelete,
    },
    CREATE: {
        skip: mainConfig.skipCreate,
        only: mainConfig.onlyCreate,
    },
    UPDATE: {
        skip: mainConfig.skipUpdate,
        only: mainConfig.onlyUpdate,
    },
    READ: {
        skip: mainConfig.skipRead,
        only: mainConfig.onlyRead,
    },
};
