import { cn } from "@/utils";
import { SectionProps } from "./types";
import { Thing } from "schema-dts";
import { JsonLD } from "@/components/json-ld";

export function Section<T extends Thing>({
    className,
    children,
    metadata,
    ...props
}: SectionProps<T>) {
    return (
        <section className={cn(className)} {...props}>
            {metadata && <JsonLD<T> head={true} data={metadata} />}
            {children}
        </section>
    );
}
