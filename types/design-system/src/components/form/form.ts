import type { FieldValues, UseFormReturn, UseFormProps } from "react-hook-form";
import type { Fields } from "./field";
import { HTMLAttributes } from "react";

export type FormProps = {
    fields: Fields;
    render?: (render: {
        formProps: FormProps;
        methods: UseFormReturn<FieldValues, any, undefined>;
        fields: Fields;
        values?: FieldValues;
    }) => React.ReactNode;
} & UseFormProps;

export type FormProviderProps = React.PropsWithChildren<
    HTMLAttributes<HTMLFormElement> & FormProps
>;

export type LegendProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLLegendElement>
>;
