import { SystemProvider } from "@/provider";
import { Layout } from "./Layout";
import { Header, Footer, Main, Link } from "@/components";
import { HTMLAttributes } from "react";
import { cn } from "..";

export function LandingPageLayout({
    children,
}: React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
    return (
        <SystemProvider variant={"landing"}>
            <Layout variant={"landing"}>
                <Header variant={"landing"} />
                <Main variant={"landing"}>{children}</Main>
                <Footer variant={"landing"}>
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
