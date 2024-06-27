import { Button, buttonVariants } from "@/components";
import { cn } from "@/utils";
import type { ButtonProps } from "@elucidario/types-design-system";

export function Submit({
    children,
    variant = "outline",
    className,
    ...props
}: ButtonProps<typeof buttonVariants>) {
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
