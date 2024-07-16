export type Variants = 'default' | 'landing' | 'app';

export type Theme = "light" | "dark";

export type SystemState = {
    variant: Variants;
    theme: Theme;
};

export type SystemContextProps = {
    variant?: Variants;
    theme?: Theme;
};

export type SystemContextProvider = SystemState & {};

export type SystemAction = {
    type: string;
    payload: Partial<SystemState>;
};

