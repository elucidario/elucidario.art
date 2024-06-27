import {
    SystemContextProvider,
    SystemState,
} from "@elucidario/types-design-system";
import { createContext } from "react";

export enum SystemActionTypes {
    SET_LANG = "SET_LANG",
    SET_VARIANT = "SET_VARIANT",
    SET_THEME = "SET_THEME",
}

export const defaultContext: SystemState = {
    lang: "pt-BR",
    variant: "default",
    theme: "dark",
};

export const SystemContext =
    createContext<SystemContextProvider>(defaultContext);
