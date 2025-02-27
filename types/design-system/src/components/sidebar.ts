export type SidebarProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: "left" | "right";
    }
>;
