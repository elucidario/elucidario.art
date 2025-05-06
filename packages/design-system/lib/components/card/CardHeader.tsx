import { cn } from "@/utils";
import { Slot } from "@radix-ui/react-slot";

export type CardHeaderProps = {
    asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ asChild, className, ...props }: CardHeaderProps) {
    const Comp = asChild ? Slot : "header";
    return (
        <Comp
            className={cn(
                "px-4",
                "py-2",
                "border-b-2",
                "border-gray-45",
                "dark:border-gray-65",
                className,
            )}
            {...props}
        />
    );
}
