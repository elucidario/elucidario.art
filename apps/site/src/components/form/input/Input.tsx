import type { InputProps } from "./types";
import { VariantProps } from "class-variance-authority";
import { inputVariants } from "./variants";

export function Input({
    ref,
    className,
    type,
    variant,
    ...props
}: InputProps<VariantProps<typeof inputVariants>>) {
    return (
        <input
            ref={ref}
            type={type}
            className={inputVariants({ className, variant })}
            {...props}
        />
    );
}
