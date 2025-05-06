import { cn } from "@/utils";

export type FieldDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;

export function FieldDescription({
    className,
    children,
}: FieldDescriptionProps) {
    return (
        <span className={cn("text-sm", "text-gray-500", className)}>
            {children}
        </span>
    );
}
