import { cn } from "@/utils";
import type { FormProps } from "@elucidario/types-design-system";
import { useForm, FormProvider } from "react-hook-form";

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
            <form
                className={cn(className)}
                {...props}
            >
                {render?.({ formProps: props, fields, methods })}
                {children}
            </form>
        </FormProvider>
    );
};
