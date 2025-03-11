export type Breakpoints = "desktop" | "tablet" | "mobile";

export type VisibleProps<T = unknown> = React.PropsWithChildren<
    React.HTMLAttributes<T> & {
        only?: Breakpoints | Breakpoints[];
    }
>;
