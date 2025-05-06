import { Button, ButtonProps } from "@/components";

export function Submit({ ...props }: ButtonProps) {
    return <Button type="submit" {...props} />;
}
