import * as Form from "@/components/form";
import { FieldProviderProps } from "@elucidario/types-design-system";
import { Provider } from "./Provider";
import { cn } from "@/utils";
import { useState } from "react";
import { ClassValue } from "clsx";

export function Root({
    name,
    schema,
    className,
    children,
    ...rest
}: FieldProviderProps) {
    const [hidden, setHidden] = useState<boolean>(false);
    return (
        <Provider {...{ name, schema, hidden, setHidden, ...rest }}>
            <Form.Fieldset
                id={name}
                className={cn(
                    className,
                    schema?.html?.className as ClassValue,
                    hidden ? "hidden" : "",
                )}
            >
                {children}
            </Form.Fieldset>
        </Provider>
    );
}
