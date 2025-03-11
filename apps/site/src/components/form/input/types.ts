export type InputProps<T> = React.InputHTMLAttributes<HTMLInputElement> & T;

export type NumberInputProps<T> = InputProps<T> & {
    localeOptions?: Intl.NumberFormatOptions;
};
