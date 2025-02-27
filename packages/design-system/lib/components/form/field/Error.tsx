import { useContext } from "react";
import { FieldErrors, FieldValues, useFormContext } from "react-hook-form";

import { Context } from "./Context";
import * as Form from "@/components/form";
import { cn } from "@/utils";

export function Error() {
    const { name } = useContext(Context);
    const {
        formState: { errors },
    } = useFormContext();

    const names = name.split(".");

    if (names.length === 1) {
        return errors[name]?.message ? (
            <Form.Description name="field-error" className={cn("text-red-400")}>
                {errors[name]?.message as React.ReactNode}
            </Form.Description>
        ) : null;
    } else {
        const reduced = names.reduce((acc, cur) => {
            if (typeof acc[cur] !== "undefined") {
                return acc[cur] as FieldErrors<FieldValues>;
            } else {
                return acc;
            }
        }, errors);
        if (reduced.message) {
            return (
                <Form.Description
                    name="field-error"
                    className={cn("text-red-400")}
                >
                    {reduced?.message as React.ReactNode}
                </Form.Description>
            );
        }
    }

    return null;
}
