import { JSONSchema7 } from "json-schema";
import { HTMLAttributes, RefAttributes } from "react";
import { ChangeHandler } from "react-hook-form";

export type FieldValue = string | number | undefined | readonly string[];

export type HTML = Record<string, unknown>;

export type Schema = JSONSchema7 & {
    ref?: RefAttributes<HTMLAttributes<HTMLElement>>;
    html?: HTML;
};

export type FieldDescriptionProps = React.HTMLAttributes<HTMLDivElement> & {
    name?: string;
};

export type RenderField = (props: FieldProps) => React.JSX.Element;

export type FieldProps = {
    name: string;
    schema: Schema;
    value?: FieldValue;
    hidden?: boolean;
    onChange?: ChangeHandler;
    render?: RenderField;
    setHidden?: (hidden: boolean) => void;
};

export type FieldProviderProps = Omit<
    React.HTMLAttributes<HTMLElement>,
    "dir"
> &
    FieldProps & {
        variant?: FieldVariants;
    };

export type FieldLabelProps = HTMLAttributes<
    HTMLLabelElement | HTMLLegendElement
>;

export type FieldBodyProps = HTMLAttributes<HTMLDivElement>;

export type Fields = Record<string, FieldProps>;
