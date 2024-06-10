import React from "react";
import type { FormProps } from "@elucidario/types-design-system";
import { useForm, FormProvider } from "react-hook-form";

export const Form = ({ children }: FormProps) => {
    const methods = useForm();

    return (
        <FormProvider {...methods}>
            <form>
                <>{children}</>
            </form>
        </FormProvider>
    )
}
