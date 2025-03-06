import { cn } from "@/utils";
import type { FormProviderProps } from "./types";
import type { Schema } from "./field";
import { useCallback } from "react";
import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { ajvResolver } from "@hookform/resolvers/ajv";

import { JSONSchemaType } from "ajv";

export const Root = ({
    children,
    render,
    fields,
    className,
    ...props
}: FormProps) => {
    const methods = useForm();

    return (
        <FormProvider {...methods}>
            <form className={cn(className)} {...props}>
                {render?.({ formProps: props, fields, methods })}
                {children}
            </form>
        </FormProvider>
    );
};
