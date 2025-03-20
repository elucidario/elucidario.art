import { createContext, useContext } from "react";
import type { FieldProviderType } from "./types";

export const defaultContext: FieldProviderType = {
    name: "",
    id: "",
    field: { schema: {} },
};

export const Context = createContext<FieldProviderType>(defaultContext);

export function useFieldContext() {
    return useContext(Context);
}
