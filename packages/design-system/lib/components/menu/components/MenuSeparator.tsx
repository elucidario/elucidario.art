import { menuSeparatorVariants } from "../variants";
import { cn } from "@/utils";
import { MenuSeparatorProps } from "../types";

export function MenuSeparator({ dir, className }: MenuSeparatorProps) {
    return (
        <div className={cn(menuSeparatorVariants({ dir, className }))}></div>
    );
}
