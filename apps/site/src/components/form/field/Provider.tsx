import { useFormContext } from "react-hook-form";

import { Context } from "./Context";
import { FieldProviderProps } from "./types";
import { Fieldset } from "../fieldset";
import { useState } from "react";

export function Provider({
    children,
    className,
    name,
    required,
    field,
    ...props
}: FieldProviderProps) {
    const { register } = useFormContext();
    const [hidden] = useState<boolean>(false);
    const registered = register(name as string, {
        shouldUnregister: true,
    });

    return (
        <Context
            value={{
                field,
                required,
                hidden,
                id: `field-${name}`,
                ...registered,
            }}
        >
            <Fieldset className={className} {...props}>
                {children}
            </Fieldset>
        </Context>
    );
}
