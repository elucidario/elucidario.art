import { VariantProps } from "class-variance-authority";
import { AriaAttributes } from "react";

export type InputProps<T extends (...args: any) => any> =
    React.InputHTMLAttributes<HTMLInputElement> &
    AriaAttributes &
    VariantProps<T>;

export type NumberInputProps<T extends (...args: any) => any> =
    InputProps<T> & {
        localeOptions?: Intl.NumberFormatOptions;
    };
