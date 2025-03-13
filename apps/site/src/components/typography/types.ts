import type { HTMLMotionProps } from "motion/react";

export type LinkType = {
    href: string;
    active?: boolean;
    target?: React.HTMLAttributeAnchorTarget;
};

export type LinkProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLAnchorElement> &
        LinkType & {
            active?: boolean;
            external?: boolean;
        }
>;

export type HeadingProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLHeadingElement> & {
        level?: 1 | 2 | 3 | 4 | 5 | 6;
    } & HTMLMotionProps<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">
>;

export type LeadProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLParagraphElement> & React.AriaAttributes
>;
