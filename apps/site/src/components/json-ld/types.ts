import { Thing, WithContext } from "schema-dts";

export type JsonLDProps<T extends Thing> = {
    head?: boolean;
    data: WithContext<T>;
};
