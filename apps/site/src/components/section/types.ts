import { HTMLAttributes } from "react";
import { Thing, WithContext } from "schema-dts";

export type SectionProps<T extends Thing> = HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
    metadata?: WithContext<T>;
};
