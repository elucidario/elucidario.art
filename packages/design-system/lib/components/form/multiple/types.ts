import { Schema } from "../field";

export type MultipleProps = React.HTMLAttributes<HTMLDivElement> & {
    schema?: Schema;
    fields?: {
        id: string;
        [key: string]: unknown;
    };
};
