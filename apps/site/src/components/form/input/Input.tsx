import * as React from "react";

import type { InputProps } from "./types";
import { VariantProps } from "class-variance-authority";
import { inputVariants } from "./variants";

export const Input = React.forwardRef<
    HTMLInputElement,
    InputProps<VariantProps<typeof inputVariants>>
>(({ className, type, variant, ...props }, ref) => {
    return (
        <input
            type={type}
            className={inputVariants({ className, variant })}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";
