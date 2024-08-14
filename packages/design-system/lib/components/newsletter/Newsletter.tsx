import * as Form from "@/components/form";
import { cn } from "@/utils";

import type { Fields, NewsletterProps } from "@elucidario/types-design-system";

export function Newsletter({
    fields,
    submitLabel,
    onSubmit,
    onError,
}: NewsletterProps) {
    const defaultFields: Fields = {
        nome: {
            name: "nome",
            schema: {
                type: "string",
                title: "Nome",
            },
        },
        email: {
            name: "email",
            schema: {
                type: "string",
                title: "Email",
                html: {
                    placeholder: "nome@dominio.com",
                },
            },
        },
    };

    return (
        <Form.default
            className={cn("flex", "flex-col", "gap-4", "mt-4")}
            fields={fields || defaultFields}
            render={({ formProps, fields, methods }) => {
                return (
                    <>
                        {Object.values(fields || {}).map((field) => {
                            return (
                                <Form.Field.default
                                    key={field.name}
                                    className={cn("w-full")}
                                    {...field}
                                    variant="ghost"
                                />
                            );
                        })}
                        <Form.Submit
                            variant={"ghost"}
                            onClick={methods.handleSubmit(onSubmit, onError)}
                        >
                            {submitLabel || "enviar"}
                        </Form.Submit>
                    </>
                );
            }}
        />
    );
}
