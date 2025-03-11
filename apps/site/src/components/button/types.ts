import React, { AriaAttributes } from "react";

export type ButtonProps<T = unknown> = React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement> &
        AriaAttributes &
        T & {
            ref?: React.Ref<HTMLButtonElement>;
            asChild?: boolean;
        }
>;
