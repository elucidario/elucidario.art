import { SystemContextProvider, SystemState } from "./types";
import { createContext } from "react";

export enum SystemActionTypes {
    SET_THEME = "SET_THEME",
}

export const defaultContext: SystemState = {
    theme: "light",
};

export const Context = createContext<SystemContextProvider>(defaultContext);
