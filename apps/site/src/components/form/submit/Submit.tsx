import { cn } from "@/utils";
import { type ButtonProps, Button, buttonVariants } from "@/components/button";
import { VariantProps } from "class-variance-authority";

export function Submit({
    children,
    variant = "outline",
    className,
    ...props
}: ButtonProps<VariantProps<typeof buttonVariants>>) {
    return (
        <Button
            type="submit"
            className={cn(buttonVariants({ variant, className }))}
            {...props}
        >
            {children}
        </Button>
    );
}
