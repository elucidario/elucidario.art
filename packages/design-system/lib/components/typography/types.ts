import { VariantProps } from "class-variance-authority";
import { headingVariants } from "./variants";

export type LinkType = {
    href: string;
    target?: React.HTMLAttributeAnchorTarget;
    external?: boolean;
};

export type LinkProps = LinkType &
    React.PropsWithChildren<React.HTMLAttributes<HTMLAnchorElement>>;

export type HeadingProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLHeadingElement>
> &
    VariantProps<typeof headingVariants>;

export type LeadProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLParagraphElement>
>;

export type TextProps = React.HTMLAttributes<HTMLParagraphElement> & {
    ref?: React.Ref<HTMLParagraphElement>;
};
