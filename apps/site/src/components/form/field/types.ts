import { HTMLAttributes, LabelHTMLAttributes } from "react";

export type FieldValue = string | number | undefined | readonly string[];

export type FieldDescriptionProps = React.HTMLAttributes<HTMLDivElement> & {
    name?: string;
};

export type FieldVariants = "default" | "outline" | "ghost";

export type FieldProps = {
    value?: FieldValue;
    schema: Record<string, unknown>;
    hidden?: boolean;
    setHidden?: (hidden: boolean) => void;
};

export type FieldProviderType = {
    id: string;
    name: string;
    field: FieldProps;

    variant?: FieldVariants;
    required?: boolean;
    disabled?: boolean;
    hidden?: boolean;
};

export type FieldProviderProps = Omit<
    React.HTMLAttributes<HTMLElement>,
    "dir"
> &
    Omit<FieldProviderType, "id">;

export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export type FieldBodyProps = HTMLAttributes<HTMLDivElement>;

export type Fields = Record<string, FieldProps>;
