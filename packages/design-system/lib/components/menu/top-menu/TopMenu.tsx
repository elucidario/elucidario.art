import { cn } from "@/utils";

import { MenuProps } from "../types";
import { MenuContext } from "../Context";
import { Image } from "@/components/image";

export function TopMenu({
    className,
    active,
    children,
    theme,
    home,
    social,
    ...props
}: MenuProps) {
    const isActive = (path: string) => {
        return active ? active === path : false;
    };

    return (
        <MenuContext value={{ isActive }}>
            <header
                className={cn(
                    "p-4",
                    "flex",
                    "flex-row",
                    "gap-4",
                    "items-center",
                    "justify-between",
                    "h-18",
                )}
            >
                <a href={home || "/"}>
                    <Image
                        alt="logo elucidario.art"
                        width={164}
                        src={`https://elucidario.art/svg/type=horizontal-color=secondary-theme=${theme}.svg`}
                    />
                </a>
                <nav
                    className={cn(
                        "w-fit",
                        "flex",
                        "flex-row",
                        "gap-4",
                        "items-center",
                        "justify-center",
                        className,
                    )}
                    {...props}
                >
                    {children}
                </nav>
                <aside className={cn("flex", "flex-row", "gap-2")}>
                    {social}
                </aside>
            </header>
        </MenuContext>
    );
}
