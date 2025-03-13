import { Heading, Logo } from "@/components";
import { useSystemProvider } from "@/provider";
import { cn } from "@/utils";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { HeaderProps } from "./types";

export function Header({ className, ...props }: HeaderProps) {
    const { theme } = useSystemProvider();

    const headingRef = useRef<HTMLDivElement>(null);

    const [y, setY] = useState(0);

    const { scrollY } = useScroll({
        target: headingRef,
        offset: ["end end", "start start"],
    });

    useMotionValueEvent(scrollY, "change", (latest) => {
        setY(Math.max(Math.min(latest, Math.max(0, 100)), Math.min(0, 100)));
    });

    return (
        <>
            <motion.header
                className={cn(
                    "mb-14",
                    "px-4",
                    "sticky",
                    "top-0",
                    "flex",
                    "flex-col",
                    "gap-8",
                    "items-center",
                    "justify-between",
                    "z-20",
                    "bg-lcdr-light/70",
                    "dark:bg-lcdr-dark/90",
                    className,
                )}
                {...props}
            >
                <div
                    className={cn("absolute", "-z-10", "w-full", "h-full")}
                    style={{
                        background: `radial-gradient(transparent 1px, var(--color-primary-${theme}, #ffffff) 2px) 0 0 / 8px 8px`,
                        // filter: "blur(1px)",
                        mask: "linear-gradient( rgba(0, 0, 0) 10%, rgb(0, 0, 0, 0) 90%)",
                        opacity: 1,
                    }}
                ></div>
                <Logo
                    type="horizontal"
                    theme={theme}
                    color="secondary"
                    className={cn(
                        "max-w-[250px]",
                        "lg:max-w-[500px]",
                        "relative",
                        "mt-6",
                        "mb-10",
                    )}
                    animate={{
                        scale: (1 - y / 100) * 0.5 + 0.8,
                    }}
                />
            </motion.header>
            <Heading
                ref={headingRef}
                level={1}
                className={cn("font-mono", "text-center", "mx-4", "relative")}
                initial={{ scale: 1 }}
                animate={{
                    scale: 1 - y / 100,
                    opacity: 1 - y / 100,
                }}
            >
                Revolucione a Gestão de sua Coleção
            </Heading>
        </>
    );
}
