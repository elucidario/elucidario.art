import { WebPage, WithContext } from "schema-dts";

export type MainProps = React.HTMLAttributes<HTMLDivElement> & {
    metadata?: WithContext<WebPage>;
};
