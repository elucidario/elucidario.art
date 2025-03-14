import { type ButtonProps, Button, buttonVariants } from "@/components/button";
import { VariantProps } from "class-variance-authority";

export function Submit({
    children,
    ...props
}: ButtonProps<VariantProps<typeof buttonVariants>>) {
    return (
        <Button type="submit" variant={"pb"} {...props}>
            {children}
        </Button>
    );
}
