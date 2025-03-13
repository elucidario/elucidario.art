import { cn } from "@/utils";
import {
    useForm,
    FormProvider,
    FieldValues,
    FieldErrors,
} from "react-hook-form";
import { ajvResolver } from "@hookform/resolvers/ajv";
import { fullFormats } from "ajv-formats/dist/formats";

import type { FormProviderProps } from "./types";
import { JSONSchemaType } from "ajv";
import { Submit } from "./submit";
import { Field } from "./field";

export function Form<T extends Record<string, unknown>>({
    schema,

    //rhf @link https://react-hook-form.com/docs/useform
    hookProps,

    // form props HTMLAttributes<HTMLFormElement>
    className,
    submitLabel,
    children,
    onValid,
    onInvalid,
    ...props
}: FormProviderProps<T>) {
    const validation = async (values: FieldValues) => {
        if (!schema) {
            return {
                values,
                errors: {},
            };
        }

        const resolver = ajvResolver(schema as JSONSchemaType<T>, {
            formats: fullFormats,
        });

        const resolved = await resolver(values, undefined, {
            fields: {},
            shouldUseNativeValidation: undefined,
        });

        return resolved;
    };

    const methods = useForm({
        ...hookProps,
        resolver: validation,
    });

    return (
        <FormProvider {...methods}>
            <form
                className={cn("flex", "flex-col", "gap-2", className)}
                {...props}
                onSubmit={methods.handleSubmit(
                    (data, event) => onValid(data as T, event),
                    (errors) => onInvalid?.(errors as FieldErrors<T>),
                )}
            >
                {Object.entries(schema.properties!).map(([name, field]) => {
                    return (
                        <Field
                            key={name}
                            name={name}
                            field={{ schema: field }}
                            required={(schema.required as Array<string>)!.includes(
                                name,
                            )}
                        />
                    );
                })}
                {children}
                <Submit>{submitLabel}</Submit>
            </form>
        </FormProvider>
    );
}
