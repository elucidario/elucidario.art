import { createContext } from "react";
import type { FieldProviderProps } from "@elucidario/types-design-system";

export const defaultContext: FieldProviderProps = {
    name: "",
    schema: {},
};

export const Context = createContext<FieldProviderProps>(defaultContext);
