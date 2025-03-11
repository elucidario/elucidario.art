import { motion } from "motion/react";

import { cn } from "@/utils";

import { Heading, Button } from "@/components";
import { useSystemProvider } from "@/provider";
import { featureVariants } from "./variants";
import { FeatureProps } from "./types";

export function Feature({
    inverted,
    title,
    description,
    className,
    cta,
    ctaRef,
    ...props
}: FeatureProps) {
    const { theme } = useSystemProvider();

    const onClick = () => {
        if (ctaRef?.current) {
            ctaRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <div className={featureVariants({ inverted, className })} {...props}>
            <div
                className={cn(
                    "w-1/2",
                    "z-10",
                    "p-2",
                    "flex",
                    "flex-col",
                    inverted ? "items-start" : "items-end",
                )}
            >
                <Heading
                    level={2}
                    className={cn(
                        "font-mono",
                        "pb-4",
                        inverted ? "text-left" : "text-right",
                    )}
                >
                    {title}
                </Heading>
                {cta && (
                    <Button variant={"pb"} size={"lg"} onClick={onClick}>
                        {cta}
                    </Button>
                )}
            </div>

            <div
                className={cn(
                    "absolute",
                    "flex",
                    "w-full",
                    "h-full",
                    "items-center",
                    "justify-center",
                )}
            >
                <motion.div
                    className={cn(
                        "rounded-full",
                        "bg-transparent",
                        "size-32",
                        "lg:size-56",
                    )}
                    initial={{ scale: 1 }}
                    whileInView={{ scale: 2.5 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.2,
                        easings: "easeInOut",
                    }}
                    style={{
                        background: inverted
                            ? `radial-gradient(circle at 25% 25%, var(--color-secondary-${theme}), var(--color-primary-${theme}))`
                            : `radial-gradient(circle at 75% 75%, var(--color-primary-${theme}), var(--color-secondary-${theme}))`,
                        filter: "blur(10px)",
                    }}
                ></motion.div>
            </div>

            <div
                className={cn(
                    "w-1/2",
                    "z-10",
                    "flex",
                    "flex-col",
                    "gap-2",
                    "p-4",
                    "bg-light/70",
                    "dark:bg-dark/70",
                    "rounded-2xl",
                    "border",
                    inverted
                        ? [
                              "border-secondary-light",
                              "dark:border-secondary-dark",
                              "border-l-4",
                              "border-b-4",
                          ]
                        : [
                              "border-primary-light",
                              "dark:border-primary-dark",
                              "border-r-4",
                              "border-b-4",
                          ],
                )}
            >
                <p className={cn("font-sans", "text-lg")}>{description}</p>
            </div>
        </div>
    );
}
