import { useMousePosition } from "@/hooks";
import { LandingPageLayout } from "@/templates";
import { cn } from "@/utils";

import cms from "../assets/svg/cms.svg";

function Soon() {
    const { mouseX, mouseY } = useMousePosition();

    return (
        <LandingPageLayout>
            <div
                className={cn(
                    "h-[--middle-height]",
                    "max-w-7xl",
                    "mx-auto",
                    "bg-white/50",
                    "flex",
                    "items-center",
                    "justify-between",
                    "px-8"
                )}
                style={{
                    background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, var(--lcdr-blue), var(--lcdr-pink)) `,
                }}
            >
                <img
                    src={cms}
                    alt="Collection Management System"
                    className={cn("h-64")}
                />
                <div className={cn("w-3/6")}>
                    <h1 className={cn("text-3xl", "font-bold")}>Em construção...</h1>
                    <p className={cn("text-lg")}>
                        Cadastre-se para receber novidades
                    </p>
                    <form
                        action="https://tinyletter.com/elucidario"
                        method="post"
                        target="popupwindow"
                        onSubmit={() => {
                            window.open(
                                "https://tinyletter.com/elucidario",
                                "popupwindow",
                                "scrollbars=yes,width=800,height=600"
                            );
                            return true;
                        }}
                    />
                </div>
            </div>
        </LandingPageLayout>
    );
}

export default Soon;
