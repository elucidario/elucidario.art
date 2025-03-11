import { HTMLAttributes } from "react";
import { Footer, Link, Main } from "@/components";
import { SystemProvider } from "@/provider";
import { cn } from "@/utils";
import { Layout } from "./Layout";

export function LandingPageLayout({
    children,
}: React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
    return (
        <SystemProvider>
            <Layout>
                <Main>{children}</Main>
                <Footer>
                    <Link
                        href="https://www.instagram.com/elucidario.art"
                        target="_blank"
                    >
                        <img
                            src={
                                "https://cdn.simpleicons.org/instagram/000/fff"
                            }
                            alt="Instagram"
                            className={cn("h-4", "fill-zinc-500")}
                        />
                    </Link>
                    <Link
                        href="https://github.com/hgodinho/elucidario/"
                        target="_blank"
                    >
                        <img
                            src={"https://cdn.simpleicons.org/github/000/fff"}
                            alt="GitHub"
                            className={cn("h-4", "fill-lcdr-blue")}
                        />
                    </Link>
                </Footer>
            </Layout>
        </SystemProvider>
    );
}
