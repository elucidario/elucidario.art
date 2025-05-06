import { cn } from "@/utils";
import { Slot } from "@radix-ui/react-slot";

export type CardProps = {
    asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function Card({ asChild, className, ...props }: CardProps) {
    const Comp = asChild ? Slot : "div";
    return (
        <Comp
            className={cn(
                "bg-light",
                "dark:bg-gray-5",
                "card",
                "border-2",
                "border-gray-45",
                "dark:border-gray-65",
                "rounded-md",
                className,
            )}
            {...props}
        />
    );
}
