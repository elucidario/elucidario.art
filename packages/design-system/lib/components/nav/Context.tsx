import { createContext } from "react";
import type { NavContextType } from "./types";

export const defaultContext: NavContextType = {
    expanded: [],
    setExpanded: () => {},
};

export const Context = createContext<NavContextType>(defaultContext);
