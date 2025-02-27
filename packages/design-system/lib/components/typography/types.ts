export type LinkType = {
    href: string;
    active?: boolean;
    target?: React.HTMLAttributeAnchorTarget;
};
export type LinkProps = React.PropsWithChildren<React.HTMLAttributes<HTMLAnchorElement> & LinkType & {
    active?: boolean;
    external?: boolean;
}>;
export type HeadingProps = React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement> & React.AriaAttributes & {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}>;
export type LeadProps = React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement> & React.AriaAttributes>;
