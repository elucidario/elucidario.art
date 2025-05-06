import { cn } from "@/utils";
import { MenuListProps } from "@/components/menu";
import { menuListVariants } from "@/components/menu";

export function MenuList({
    children,
    className,
    dir,
    ...props
}: MenuListProps) {
    return (
        <ul className={cn(menuListVariants({ className, dir }))} {...props}>
            {children}
        </ul>
    );
}
