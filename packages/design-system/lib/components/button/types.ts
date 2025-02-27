import { VariantProps } from "class-variance-authority";
import React, { AriaAttributes } from "react";
export type ButtonProps<T extends (...args: any) => any> = React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement> & AriaAttributes & VariantProps<T> & {
    asChild?: boolean;
}>;
