export type Breakpoints = "desktop" | "tablet" | "mobile";

export type VisibleProps<T> = React.PropsWithChildren<
    React.HTMLAttributes<T> & {
        only?: Breakpoints | Breakpoints[];
    }
>;
