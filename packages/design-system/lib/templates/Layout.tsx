import { LayoutProps } from "./types";

export function Layout({ className, children, ...props }: LayoutProps) {
    return (
        <div {...props} className={className}>
            {children}
        </div>
    );
}
