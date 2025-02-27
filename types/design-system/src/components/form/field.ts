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


export type RenderField<T extends HTMLElement> = (
    props: FieldProps<T>,
) => JSX.Element;

export type FieldProps<T extends HTMLElement = HTMLElement> = Omit<
    HTMLAttributes<T>,
    "onChange" | "dir"
> & {
    name: string;
    schema: Schema;
    value?: FieldValue;
    hidden?: boolean;
    onChange?: ChangeHandler;
    render?: RenderField<T>;
    setHidden?: (hidden: boolean) => void;
};

export type FieldLabelProps = HTMLAttributes<
    HTMLLabelElement | HTMLLegendElement
>;

export type FieldBodyProps = HTMLAttributes<HTMLDivElement>;
