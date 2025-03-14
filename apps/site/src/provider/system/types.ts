export type Theme = "light" | "dark";

export type SystemState = {
    theme: Theme;
};

export type SystemContextProps = {
    theme?: Theme;
};

export type SystemContextProvider = SystemState & {};

export type SystemAction = {
    type: string;
    payload: Partial<SystemState>;
};
