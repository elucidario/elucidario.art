export type SystemState = {
    variant: "default" | "landing";
    theme: "light" | "dark";
};

export type SystemContextProps = {};

export type SystemContextProvider = SystemState & {};

export type SystemAction = {
    type: string;
    payload: Partial<SystemState>;
};

