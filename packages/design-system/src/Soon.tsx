import { LandingPageLayout } from "@/templates";
import { cn } from "@/utils";
import { Hero, Heading, Lead, Newsletter } from "@/components";

import cms from "../assets/svg/cms.svg";

function Soon() {
    return (
        <LandingPageLayout>
            <Hero className={cn("grid-cols-8", "grid-rows-1", "gap-8")}>
                <img
                    src={cms}
                    alt="Collection Management System"
                    className={cn("h-64", "col-start-2", "col-span-2")}
                />

                <div className={cn("col-start-5", "col-span-3")}>
                    <Heading>Em construção...</Heading>
                    <Lead>Cadastre-se para receber novidades</Lead>
                    <Newsletter />
                </div>
            </Hero>
        </LandingPageLayout>
    );
}

export default Soon;
