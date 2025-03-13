import { Footer } from "@/components";
import { SystemProvider } from "@/provider";
import { cn } from "@/utils";

export default function Layout({ children }: React.PropsWithChildren) {
    return (
        <SystemProvider>
            <div
                className={cn(
                    "layout",
                    "text-dark",
                    "dark:text-light",

                    "w-full",
                    "relative",
                )}
            >
                <main
                    className={cn(
                        "relative",
                        "z-10",
                        "bg-light",
                        "dark:bg-dark",
                    )}
                >
                    {children}
                </main>
                <Footer />
            </div>
        </SystemProvider>
    );
}
