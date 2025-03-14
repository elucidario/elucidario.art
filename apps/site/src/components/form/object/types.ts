export type ObjectProps = React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.RefObject<HTMLDivElement | null>;
    name: string;
};
