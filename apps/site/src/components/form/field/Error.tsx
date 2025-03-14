import { FieldErrors, FieldValues, useFormContext } from "react-hook-form";

import { useFieldContext } from "./Context";

import { Description } from "@/components/form";
import { cn } from "@/utils";

export function Error() {
    const { name } = useFieldContext();

    const {
        formState: { errors },
    } = useFormContext();

    const names = name.split(".");

    if (names.length === 1) {
        return errors[name]?.message ? (
            <Description className={cn("text-red-400")}>
                {errors[name]?.message as React.ReactNode}
            </Description>
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
                <Description className={cn("text-red-400")}>
                    {reduced?.message as React.ReactNode}
                </Description>
            );
        }
    }

    return null;
}
