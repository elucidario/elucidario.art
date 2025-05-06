import { cn } from "@/utils";
import { SubmenuProps } from "../types";

export function TopSubmenu({ label, icon, className, ...props }: SubmenuProps) {
    return (
        <li
            key={label}
            className={cn("flex", "flex-row", className)}
            {...props}
        >
            <details className="group">
                <summary className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    {icon && <span className="mr-2">{icon}</span>}
                    {label}
                </summary>
                {/* <ul className="ml-4">
                    {items.map((item) => (
                        <TopMenuItem key={item.label} {...item} />
                    ))}
                </ul> */}
            </details>
        </li>
    );
}
