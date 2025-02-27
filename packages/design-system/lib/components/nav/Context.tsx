import { createContext } from "react";
import type { NavContextType } from "@elucidario/types-design-system";

export const defaultContext: NavContextType = {
    expanded: [],
    setExpanded: () => { },
};

export const Context = createContext<NavContextType>(defaultContext);
