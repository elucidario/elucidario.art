import { createContext } from "react";
import type { FieldProps } from "@elucidario/types-design-system";

export const defaultContext: FieldProps<HTMLElement> = {
    name: "",
    schema: {},
};

export const Context = createContext<FieldProps<HTMLElement>>(defaultContext);
