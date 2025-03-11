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

                    "h-full",
                    "w-screen",
                )}
            >
                <main className={cn("bg-light", "dark:bg-dark")}>
                    {children}
                </main>
                <Footer>Footer</Footer>
            </div>
        </SystemProvider>
    );
}
