import { cn } from "@/utils";
import type {
    FormProviderProps,
    Schema,
} from "@elucidario/types-design-system";
import { useCallback } from "react";
import { useForm, FormProvider, FieldValues, Field } from "react-hook-form";
import { ajvResolver } from "@hookform/resolvers/ajv";

import { JSONSchemaType } from "ajv";

export const Root = ({
    render,
    fields,

    //rhf @link https://react-hook-form.com/docs/useform
    mode,
    disabled,
    reValidateMode,
    defaultValues,
    values,
    errors,
    resetOptions,
    resolver,
    context,
    shouldFocusError,
    shouldUnregister,
    shouldUseNativeValidation,
    progressive,
    criteriaMode,
    delayError,

    // form props HTMLAttributes<HTMLFormElement>
    className,
    children,
    ...props
}: FormProviderProps) => {
    const validation = useCallback(
        async (values: FieldValues) => {
            const schemaToValidate = {
                type: "object",
                properties: Object.values(fields).reduce(
                    (acc, cur) => {
                        acc[cur.name] = cur.schema;
                        return acc;
                    },
                    {} as Record<string, Schema>,
                ),
            } as JSONSchemaType<"object">;

            // if (preValidation) {
            //     try {
            //         preValidation(values, schemaToValidate);
            //     } catch (error) {
            //         console.error("preValidation", error);
            //     }
            // }

            const resolver = ajvResolver(schemaToValidate, {
                keywords: ["html"],
                formats: { date: true, time: true },
            });

            const resolved = await resolver(values, undefined, {
                fields: {},
                shouldUseNativeValidation: undefined,
            });

            // if (postValidation) {
            //     try {
            //         postValidation(schemaToValidate, resolved);
            //     } catch (error) {
            //         console.error("postValidation", error);
            //     }
            // }

            return {
                ...resolved,
            };
        },
        [
            // postValidation,
            // preValidation,
            fields,
        ],
    );

    const methods = useForm<FieldValues, any, undefined>({
        mode,
        disabled,
        reValidateMode,
        defaultValues,
        values,
        errors,
        resolver: resolver || validation,
        context,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
        progressive,
        criteriaMode,
        delayError,
    });

    return (
        <FormProvider {...methods}>
            <form className={cn(className)} {...props}>
                {render?.({ formProps: { ...props, fields }, fields, methods })}
                {children}
            </form>
        </FormProvider>
    );
};
