import { LandingPageLayout } from "@/templates";
import { cn } from "@/utils";
import { Hero, Heading, Lead, Newsletter, Visible } from "@/components";

import cms from "../assets/svg/cms.svg";

function Soon() {
    return (
        <LandingPageLayout>
            <Hero className={cn()}>
                <Visible only={["tablet", "desktop"]}>
                    <img
                        src={cms}
                        alt="Collection Management System"
                        className={cn(
                            "md:col-start-2",
                            "md:col-span-1",
                            "md:row-start-4",

                            "lg:col-start-3",
                            "lg:col-span-1",
                            "lg:row-start-3",
                            "lg:row-span-2",
                        )}
                    />
                </Visible>
                <Heading
                    level={2}
                    className={cn(
                        "font-mono",
                        "self-end",
                        "px-4",

                        "col-start-1",
                        "col-span-full",
                        "row-start-2",
                        "row-span-2",

                        "md:px-0",
                        "md:col-start-3",
                        "md:col-span-full",
                        "md:row-start-2",
                        "md:row-span-2",

                        "lg:col-start-4",
                        "lg:col-span-full",
                        "lg:row-start-1",
                        "lg:row-span-2",
                    )}
                >
                    Ecossistema WordPress para gestão de coleções de artes
                    mistas
                </Heading>
                <div
                    className={cn(
                        "flex",
                        "flex-col",
                        "px-4",
                        "h-full",

                        "row-start-4",
                        "col-span-2",
                        "row-span-full",

                        "md:px-0",
                        "md:pr-4",
                        "md:row-start-4",
                        "md:col-start-3",
                        "md:col-span-2",
                        "md:row-span-full",


                        "lg:pr-0",
                        "lg:row-start-3",
                        "lg:col-start-4",
                        "lg:col-span-2",
                        "lg:row-span-full",
                    )}
                >
                    <div
                        className={cn(
                            "flex",
                            "flex-col",
                            "bg-blue-900/50",
                            "p-4",
                            "h-full"
                        )}
                    >
                        <Lead>Em construção...</Lead>
                        <p>Cadastre-se para receber novidades</p>
                        <Newsletter />
                    </div>
                </div>
            </Hero>
        </LandingPageLayout>
    );
}

export default Soon;
