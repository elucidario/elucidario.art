import { cn } from "@/utils";
import { Slot } from "@radix-ui/react-slot";

export type CardFooterProps = {
    asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function CardFooter({ asChild, className, ...props }: CardFooterProps) {
    const Comp = asChild ? Slot : "footer";
    return <Comp className={cn(className)} {...props} />;
}
