import { FieldProps } from "@elucidario/types-design-system";
import { useFormContext } from "react-hook-form";
import { cn } from "@/utils";
import { Context } from "./Context";

export function Provider({
    name,
    schema,
    children,
    ...rest
}: FieldProps<HTMLFieldSetElement>) {
    const { register } = useFormContext();

    const field = register(name, {
        ...rest,
        shouldUnregister: true,
        valueAsNumber: schema.type === "number",
    });

    return (
        <Context.Provider
            value={{
                ...field,
                schema,
                ...rest,
                className: cn(rest.className),
            }}
        >
            {children}
        </Context.Provider>
    );
}
