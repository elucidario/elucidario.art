export type FooterProps<T = unknown> = React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> &
        T & {
            ref?: React.Ref<HTMLDivElement>;
        }
>;
