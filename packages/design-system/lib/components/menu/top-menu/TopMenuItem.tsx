import { cn } from "@/utils";
import { Link } from "@/components";

import { MenuItemProps } from "../types";

import { useMenuContext } from "../Context";

export function TopMenuItem({
    label,
    path,
    className,
    onClick,
    ...props
}: MenuItemProps) {
    const { isActive } = useMenuContext();

    return (
        <li className={cn(className)} {...props}>
            <Link
                href={path}
                color="gray"
                active={isActive(path)}
                onClick={onClick}
                className={cn("font-mono")}
            >
                {label}
            </Link>
        </li>
    );
}
