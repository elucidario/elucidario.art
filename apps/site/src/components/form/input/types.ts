export type InputProps<T> = React.InputHTMLAttributes<HTMLInputElement> &
    T & {
        ref?: React.Ref<HTMLInputElement | null>;
    };

export type NumberInputProps<T> = InputProps<T> & {
    localeOptions?: Intl.NumberFormatOptions;
};
