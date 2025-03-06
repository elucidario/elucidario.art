export type Breakpoints = "desktop" | "tablet" | "mobile" | "unknown";

export type VisibleProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> & {
        only?: Breakpoints | Breakpoints[];
    }
>;
