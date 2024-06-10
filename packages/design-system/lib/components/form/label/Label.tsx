import React from "react";

import type { LabelProps } from "@elucidario/types-design-system";

export const Label = ({ children, ...labelProps }: LabelProps) => {
    const className = [
        "label",
        "font-bold",
        "mb-3",

        "text-black",
        "dark:text-white",
    ];

    return (
        <label {...labelProps} className={className.join(" ")}>
            <>{children}</>
        </label>
    );
};
