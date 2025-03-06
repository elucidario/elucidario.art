export type MainProps<T> = React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> & React.AriaAttributes & T
>;
