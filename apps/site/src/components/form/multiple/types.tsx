export type MultipleProps = React.HTMLAttributes<HTMLUListElement> & {
    ref?: React.RefObject<HTMLUListElement | null>;
    name: string;
};
