import { cn } from "@/utils";
import { SystemProvider } from "@/provider";
import { Layout } from "./Layout";
import { Header, Sidebar, Footer, Main, Article, Nav } from "@/components";
import { HTMLAttributes } from "react";

export function PageLayout({
    children,
}: React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
    return (
        <SystemProvider>
            <Layout>
                <Header />
                <Sidebar>
                    <Nav.Root>
                        <Nav.List>
                            <Nav.Item>
                                <Nav.Toggle
                                    name="item-1"
                                    className={cn("flex", "gap-2")}
                                    icon={true}
                                >
                                    Item 1
                                </Nav.Toggle>
                                <Nav.List name="item-1">
                                    <Nav.Item href="sub-item-1">
                                        sub-Item 1
                                    </Nav.Item>
                                    <Nav.Item href="sub-item-2">
                                        sub-Item 2
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Toggle
                                            name="sub-item-3"
                                            className={cn("flex", "gap-2")}
                                            icon={true}
                                        >
                                            sub-item-3
                                        </Nav.Toggle>
                                        <Nav.List name="sub-item-3">
                                            <Nav.Item href="sub-item-1">
                                                sub-Item 1
                                            </Nav.Item>
                                            <Nav.Item href="sub-item-2">
                                                sub-Item 2
                                            </Nav.Item>
                                            <Nav.Item href="sub-item-3">
                                                sub-Item 3
                                            </Nav.Item>
                                        </Nav.List>
                                    </Nav.Item>
                                </Nav.List>
                            </Nav.Item>

                            <Nav.Item active={true}>
                                <Nav.Toggle
                                    name="item-2"
                                    className={cn("flex", "gap-2")}
                                    icon={true}
                                >
                                    Item 2
                                </Nav.Toggle>
                                <Nav.List name="item-2">
                                    <Nav.Item href="sub-item-4">
                                        sub-Item 4
                                    </Nav.Item>
                                    <Nav.Item href="sub-item-5">
                                        sub-Item 5
                                    </Nav.Item>
                                    <Nav.Item href="sub-item-6">
                                        sub-Item 6
                                    </Nav.Item>
                                </Nav.List>
                            </Nav.Item>

                            <Nav.Item>Item 3</Nav.Item>
                        </Nav.List>
                    </Nav.Root>
                </Sidebar>

                <Main>
                    <Article>
                        <div
                            className={cn(
                                "wrapper",
                                "col-start-1",
                                "col-span-1",
                            )}
                        >
                            {children}
                        </div>
                        <Sidebar variant="right">sidebar right</Sidebar>
                        <footer className={cn("footer")}>references</footer>
                    </Article>
                </Main>

                <Footer>Footer</Footer>
            </Layout>
        </SystemProvider>
    );
}
