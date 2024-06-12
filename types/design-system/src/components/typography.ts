export type LinkType = {
    href: string;
    active?: boolean;
    target?: React.HTMLAttributeAnchorTarget
};

export type LinkProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLAnchorElement> &
    React.AriaAttributes &
    LinkType
>;
