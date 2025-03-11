import { cn } from "@/utils";
import { FooterProps } from "./types";

export function Footer({ ref, children, className, ...props }: FooterProps) {
    return (
        <footer
            ref={ref}
            className={cn(
                "relative",
                "h-[800px]",

                "bg-light",
                "dark:bg-dark",
                "-z-10",

                className,
            )}
            {...props}
        >
            <div className={cn("fixed", "bottom-0", "w-full", "h-[800px]")}>
                <div
                    className={cn("absolute", "-z-10", "w-full", "h-full")}
                    style={{
                        background:
                            "radial-gradient(transparent 1px, var(--color-primary-dark, #ffffff) 2px) 0 0 / 8px 8px;",
                        backdropFilter: "blur(10px)",
                        mask: "linear-gradient( rgba(0, 0, 0, 0) 20%, rgb(0, 0, 0) 100%)",
                        opacity: 1,
                    }}
                ></div>
                <div className={cn("p-10")}>{children}</div>
            </div>
        </footer>
    );
}
