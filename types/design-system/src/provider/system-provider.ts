export type SystemState = {
    lang: string;
    variant: "default" | "landing";
    theme: "light" | "dark";
};

export type SystemContextProps = Partial<SystemState>;

export type SystemContextProvider = SystemState & {};

export type SystemAction = {
    type: string;
    payload: Partial<SystemState>;
};

