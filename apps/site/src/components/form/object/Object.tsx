import { cn } from "@/utils";
import { ObjectProps } from "./types";
import { Field, useFieldContext } from "../field";

export function ObjectComponent({
    ref,
    name,
    // children,
    className,
    ...props
}: ObjectProps) {
    const {
        field: { schema },
    } = useFieldContext();

    console.log("object", { name, className, schema, props });

    return (
        <div ref={ref} {...props} className={cn("pl-4", className)}>
            {Object.entries(schema.properties as Record<string, unknown>).map(
                ([key, value]) => {
                    return (
                        <Field
                            key={key}
                            name={`${name}.${key}`}
                            field={{ schema: value as Record<string, unknown> }}
                        />
                    );
                },
            )}
        </div>
    );
}
