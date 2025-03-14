import { useFormContext } from "@/hooks";
import { useFieldArray } from "react-hook-form";
import { Field, FieldProps, useFieldContext } from "../field";
import { MultipleProps } from "./types";
import { cn } from "@/utils";
import { Button } from "@/components/button";

export function Multiple({ ref, name, className, ...props }: MultipleProps) {
    const { control } = useFormContext();
    const { fields, append } = useFieldArray({
        control,
        name,
    });

    const fillSchema = (schema: Record<string, unknown>): unknown => {
        if (typeof schema.type === "undefined") {
            return 0;
        }
        switch (schema.type) {
            case "string":
            default: {
                return "";
            }

            case "number": {
                return 0;
            }

            case "array": {
                console.log({ schema });
                return [fillSchema(schema.items as Record<string, unknown>)];
            }

            case "object": {
                return Object.entries(
                    schema.properties as FieldProps["schema"],
                ).reduce((acc, [key, value]) => {
                    return {
                        ...acc,
                        [key]: fillSchema(value as Record<string, unknown>),
                    };
                }, {});
            }
        }
    };

    const {
        field: { schema },
    } = useFieldContext();

    return (
        <ul ref={ref} className={cn(className)}>
            {fields.map((field, index) => {
                return (
                    <li key={field.id}>
                        <Field
                            name={`${name}.${index}`}
                            {...props}
                            field={{
                                schema: schema.items as Record<string, unknown>,
                            }}
                        />
                    </li>
                );
            })}
            <Button onClick={() => append(fillSchema(schema))}>+</Button>
        </ul>
    );
}
