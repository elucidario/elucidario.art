export type ButtonProps<T = unknown> = React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement> &
        T & {
            ref?: React.Ref<HTMLButtonElement>;
            asChild?: boolean;
        }
>;
