import { HTMLAttributes } from "react";
import { useFormContext, UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/utils";
import { HtmlProps, Schema } from "../types";
import {
    Label,
    Input,
    FieldDescription,
    FieldError,
    PasswordInput,
} from "@/components";

export type FieldProps = {
    as?: React.ElementType;
    schema: Schema & HtmlProps;
    inputProps: UseFormRegisterReturn;
    disabled?: boolean;
};

export function Field({
    as,
    className,
    schema,
    disabled,
    hidden,
    inputProps: { name, ...inputProps },
    ...props
}: FieldProps & HTMLAttributes<HTMLElement>) {
    const {
        formState: { errors },
    } = useFormContext();

    const Tag: React.ElementType = as || "fieldset";

    return (
        <Tag
            className={cn(
                "flex",
                "flex-col",
                "gap-1",
                hidden && "hidden",
                className,
            )}
            disabled={disabled}
            {...props}
        >
            <Label htmlFor={name}>{schema.title}</Label>
            <FieldBody
                disabled={disabled}
                schema={schema}
                as={as}
                inputProps={{ name, ...inputProps }}
            />
            {schema.description && (
                <FieldDescription>{schema.description}</FieldDescription>
            )}
            {errors[name] && (
                <FieldError
                    error={
                        (errors[name].message as string) ||
                        errors[name].toString()
                    }
                    className={cn("text-red-500")}
                />
            )}
        </Tag>
    );
}

export function FieldBody({ schema, disabled, inputProps }: FieldProps) {
    switch (schema.type) {
        case "string":
        default: {
            if (schema.html?.type === "password") {
                return (
                    <PasswordInput
                        type={schema.html.type}
                        disabled={disabled}
                        {...schema.html}
                        {...inputProps}
                    />
                );
            }

            return (
                <Input
                    type={"text"}
                    disabled={disabled}
                    {...schema.html}
                    {...inputProps}
                />
            );
        }
    }
}
