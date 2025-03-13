import { HTMLAttributes } from "react";

export type FieldValue = string | number | undefined | readonly string[];

export type FieldDescriptionProps = React.HTMLAttributes<HTMLDivElement> & {
    name?: string;
};

export type FieldVariants = "default" | "outline" | "ghost";

export type FieldProps = {
    value?: FieldValue;
    hidden?: boolean;
    setHidden?: (hidden: boolean) => void;
    schema: Record<string, unknown>;
};

export type FieldProviderType = {
    name: string;
    field: FieldProps;
    variant?: FieldVariants;
    required?: boolean;
};

export type FieldProviderProps = Omit<
    React.HTMLAttributes<HTMLElement>,
    "dir"
> &
    FieldProviderType & {
        name: string;
    };

export type FieldLabelProps = HTMLAttributes<
    HTMLLabelElement | HTMLLegendElement
>;

export type FieldBodyProps = HTMLAttributes<HTMLDivElement>;

export type Fields = Record<string, FieldProps>;
