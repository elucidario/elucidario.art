/// <reference types="react" />
export type HeadingProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLHeadingElement> &
    React.AriaAttributes & {
        level: 1 | 2 | 3 | 4 | 5 | 6;
    }
>;
