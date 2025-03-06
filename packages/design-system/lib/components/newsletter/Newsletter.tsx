import * as Form from "@/components/form";
import { cn } from "@/utils";

import type { Field } from "../form";
import type { NewsletterProps } from "./types";

export function Newsletter({
    fields,
    submitLabel,
    onSubmit,
    onError,
}: NewsletterProps) {
    const defaultFields: Field.Fields = {
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
            render={({ fields, methods }) => {
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
                            onClick={methods.handleSubmit((values) => {
                                console.log({ values });
                            })}
                        >
                            enviar
                        </Form.Submit>
                    </>
                );
            }}
        />
    );
}
