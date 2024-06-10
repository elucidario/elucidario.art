import { cn } from "@/utils";
import { Logo } from "../logo";

export function Header() {
    return (
        <header
            className={cn(
                "px-8",
                "row-start-1",
                "row-span-1",
                "col-start-1",
                "col-span-3",
                "grid",
                "grid-cols-subgrid",
                "items-center",
            )}
        >
            <Logo />
        </header>
    );
}
