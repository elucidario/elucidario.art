import type { VariantProps } from "class-variance-authority";

export type HeaderProps<T extends (...args: any) => any> =
    React.PropsWithChildren<
        React.HTMLAttributes<HTMLDivElement> &
        React.AriaAttributes &
        VariantProps<T>
    >;
