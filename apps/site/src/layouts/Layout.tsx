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
                {children}
                <Footer />
            </div>
        </SystemProvider>
    );
}
