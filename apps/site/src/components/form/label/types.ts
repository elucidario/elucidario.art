export type LabelProps<T> = React.HTMLAttributes<HTMLLabelElement> &
    T & {
        ref?: React.Ref<HTMLLabelElement | null>;
    };
