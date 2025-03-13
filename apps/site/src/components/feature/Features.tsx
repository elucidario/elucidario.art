import { cn } from "@/utils";
import { FeaturesProps } from "./types";
import { Feature } from "./Feature";

export function Features({ features, ctaRef }: FeaturesProps) {
    return (
        <section
            className={cn(
                "features",
                "relative",
                "gap-4",
                "flex",
                "flex-col",
                "items-center",
                "md:max-w-1/2",
                "justify-between",
                "mx-auto",
                "px-4",
            )}
        >
            <div
                className={cn(
                    "absolute",
                    "h-full",
                    "w-fit",
                    "mx-auto",
                    "flex",
                    "flex-col",
                    "items-center",
                    "py-72",
                )}
            >
                <div
                    className={cn(
                        "h-full",
                        "w-0.5",
                        "lg:w-1",
                        "bg-dark",
                        "dark:bg-light",
                    )}
                ></div>
            </div>
            {features.map((feature, i) => {
                return <Feature key={i} {...feature} ctaRef={ctaRef} />;
            })}
        </section>
    );
}
