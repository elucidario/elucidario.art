export type LayoutProps<T> = React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> & React.AriaAttributes & T
>;
