import * as Form from "@/components/form";
import { cn } from "@/utils";

export function Newsletter() {
    return (
        <Form.default
            className={cn("flex", "flex-col", "gap-4", "mt-4")}
            fields={{
                nome: {
                    name: "nome",
                    schema: {
                        type: "string",
                        format: "email",
                        title: "Nome",
                    },
                },
                email: {
                    name: "email",
                    schema: {
                        type: "string",
                        format: "email",
                        title: "Email",
                        html: {
                            placeholder: "ola mundo",
                        },
                    },
                },
            }}
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
