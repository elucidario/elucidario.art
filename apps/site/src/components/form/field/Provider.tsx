import { useFormContext } from "react-hook-form";

import { Context } from "./Context";
import { FieldProviderProps } from "./types";
import { Fieldset } from "../fieldset";

export function Provider({
    children,
    className,
    name,
    required,
    field,
    ...props
}: FieldProviderProps) {
    const { register } = useFormContext();

    const registered = register(name as string, {
        shouldUnregister: true,
    });

    return (
        <Context
            value={{
                field,
                required,
                ...registered,
            }}
        >
            <Fieldset className={className} {...props}>
                {children}
            </Fieldset>
        </Context>
    );
}
