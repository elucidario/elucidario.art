import { SystemContextProvider, SystemState } from "./types";
import { createContext } from "react";

export enum SystemActionTypes {
    SET_VARIANT = "SET_VARIANT",
    SET_THEME = "SET_THEME",
}

export const defaultContext: SystemState = {
    variant: "default",
    theme: "dark",
};

export const Context = createContext<SystemContextProvider>(defaultContext);
