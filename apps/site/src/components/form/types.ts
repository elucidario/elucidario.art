import {
    SubmitErrorHandler,
    SubmitHandler,
    UseFormProps,
} from "react-hook-form";

export type FormProps<T extends Record<string, unknown>> = {
    schema: T;
    hookProps?: UseFormProps;
    submitLabel?: string;
    onValid: SubmitHandler<T>;
    onInvalid?: SubmitErrorHandler<T>;
} & React.FormHTMLAttributes<HTMLFormElement>;

export type FormProviderProps<T extends Record<string, unknown>> =
    React.PropsWithChildren<
        React.HTMLAttributes<HTMLFormElement> & FormProps<T>
    >;
