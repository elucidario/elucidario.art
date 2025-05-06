import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./variants";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: React.Ref<HTMLButtonElement>;
    asChild?: boolean;
} & VariantProps<typeof buttonVariants>;
