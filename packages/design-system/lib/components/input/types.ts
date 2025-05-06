import { VariantProps } from "class-variance-authority";
import { inputVariants } from "./variants";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
    name: string;
    type: string;
} & VariantProps<typeof inputVariants>;
