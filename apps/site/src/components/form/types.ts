import { FieldValues, UseFormReturn } from "react-hook-form";
// import { FieldProps } from "./field";

export type FormProps = {
    // fields?: Record<string, FieldProps>;
    render?: (render: {
        formProps: FormProps;
        methods: UseFormReturn;
        fields?: FieldValues;
    }) => React.ReactNode;
} & React.FormHTMLAttributes<HTMLFormElement>;

export type LegendProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLLegendElement>
>;

export type FormProviderProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLFormElement> & FormProps
>;
