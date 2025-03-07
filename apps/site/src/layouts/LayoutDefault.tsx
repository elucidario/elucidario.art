import "./tailwind.css";
import { cn } from "@elucidario/pkg-design-system";

export default function LayoutDefault({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={cn("flex", "max-w-5xl", "m-auto", "bg-black")}>
            {children}
        </div>
    );
}
