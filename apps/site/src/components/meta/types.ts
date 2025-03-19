import { MetaHTMLAttributes } from "react";

export type MetaProps = MetaHTMLAttributes<HTMLMetaElement> & {
    head?: boolean;
};
