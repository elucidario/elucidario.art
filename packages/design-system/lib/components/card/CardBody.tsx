import { cn } from "@/utils";
import { Slot } from "@radix-ui/react-slot";

export type CardBodyProps = {
    asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function CardBody({ asChild, className, ...props }: CardBodyProps) {
    const Comp = asChild ? Slot : "div";
    return <Comp className={cn("p-4", className)} {...props} />;
}
