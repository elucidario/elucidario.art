import { FormProvider, FieldValues, Path, useForm } from "react-hook-form";

import { cn } from "@/utils";
import { FormProps } from "./types";
import { Field } from "./field";
import { Submit } from "./Submit";

export function Form<T extends FieldValues>({
    className,
    config,
    schema,
    submitLabel,
    hiddenFields,
    hideFields = [],
    parseResponse,
    onValid,
    onInvalid,
    render,
    ...props
}: FormProps<T>) {
    const methods = useForm<T>(config);

    const {
        handleSubmit,
        register,
        setError,
        formState: { isSubmitting },
    } = methods;

    const onValidSubmit = async (data: T) => {
        const response = await onValid(data);
        const parsedResponse = parseResponse(response);

        if (parsedResponse !== true) {
            Object.entries(parsedResponse).forEach(([key, value]) => {
                setError(key as Path<T>, {
                    type: "manual",
                    message: value,
                });
            });
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                className={cn("flex", "flex-col", "gap-4", className)}
                onSubmit={handleSubmit(onValidSubmit, onInvalid)}
                {...props}
            >
                {(() => {
                    if (render) {
                        return render(
                            Object.entries(schema.properties).map(
                                ([key, schema]) => {
                                    console.log({ key, schema });
                                    return [
                                        key,
                                        {
                                            key,
                                            schema,
                                            disabled: isSubmitting,
                                            hidden: hiddenFields?.includes(key),
                                            inputProps: register(
                                                key as Path<T>,
                                                {},
                                            ),
                                        },
                                    ];
                                },
                            ),
                        );
                    } else {
                        return Object.entries(schema.properties).map(
                            ([key, schema]) => {
                                return (
                                    !hideFields.includes(key) && (
                                        <Field
                                            key={key}
                                            schema={schema}
                                            disabled={isSubmitting}
                                            hidden={hiddenFields?.includes(key)}
                                            inputProps={register(
                                                key as Path<T>,
                                                {},
                                            )}
                                        />
                                    )
                                );
                            },
                        );
                    }
                })()}
                <Submit disabled={isSubmitting}>
                    {submitLabel || "Enviar"}
                </Submit>
            </form>
        </FormProvider>
    );
}
