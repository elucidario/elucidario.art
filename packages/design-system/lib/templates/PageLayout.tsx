import { cn } from "@/utils";
import { SystemProvider } from "@/provider";
import { Header } from "@/components";
import { HTMLAttributes } from "react";

export function PageLayout({
    children,
}: React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
    return (
        <SystemProvider>
            <div
                className={cn(
                    "grid",
                    "grid-cols-page",
                    "grid-rows-page",
                    "bg-zinc-50",
                    "text-zinc-900",
                    "dark:bg-zinc-950",
                    "dark:text-zinc-50",
                )}
            >
                <Header />

                <aside
                    className={cn(
                        "sidebar-left",
                        "row-start-2",
                        "col-start-1",
                        "col-span-1",
                        "px-8",
                        "py-4",
                    )}
                >
                    sidebar left
                </aside>

                <main
                    className={cn(
                        "row-start-2",
                        "col-start-2",
                        "col-span-2",
                        "grid",
                        "grid-cols-subgrid",
                        "py-4",
                    )}
                >
                    <article
                        className={cn(
                            "col-start-1",
                            "col-span-2",
                            "grid",
                            "grid-cols-subgrid",
                        )}
                    >
                        <div
                            className={cn(
                                "wrapper",
                                "col-start-1",
                                "col-span-1",
                            )}
                        >
                            {children}
                        </div>
                        <aside className={cn("col-start-2", "col-span-1")}>
                            sidebar right
                        </aside>
                        <footer className={cn("footer")}>references</footer>
                    </article>
                </main>

                <footer
                    className={cn(
                        "footer",
                        "px-8",
                        "col-start-1",
                        "col-span-3",
                        "row-start-3",
                        "row-span-3",
                        "grid",
                        "grid-cols-subgrid",
                        "items-center",
                        "bg-lcdr-blue",
                    )}
                >
                    footer
                </footer>
            </div>
        </SystemProvider>
    );
}
