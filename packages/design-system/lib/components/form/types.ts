import { FormHTMLAttributes, HTMLAttributes } from "react";
import { FieldValues, SubmitErrorHandler, UseFormProps } from "react-hook-form";
import { FieldProps } from "./field";

export type SchemaType =
    | "object"
    | "string"
    | "number"
    | "boolean"
    | "array"
    | "null";

export type Schema = {
    type: SchemaType | SchemaType[];
    properties?: {
        [key: string]: Schema;
    };
    items?: Schema;
    enum?: string[];
    title?: string;
    description?: string;
    default?: unknown;
    format?: string | RegExp;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    additionalProperties?: boolean;
    required?: string[];
};

export type HtmlProps = {
    html?: {
        type?: string;
        placeholder?: string;
        disabled?: boolean;
        min?: number;
        max?: number;
        step?: number;
        pattern?: string;
        multiple?: boolean;
        accept?: string;
        rows?: number;
        maxLength?: number;
        minLength?: number;
        autoComplete?: string;
        autoFocus?: boolean;
    };
};

export type FormSchema = Omit<Schema, "type" | "properties"> & {
    type: "object";
    properties: {
        [key: string]: Schema & HtmlProps;
    };
};

export type FormError = {
    [key: string]: string;
};

export type FormProps<T extends FieldValues> =
    FormHTMLAttributes<HTMLFormElement> & {
        schema: FormSchema;
        submitLabel?: string;
        config?: UseFormProps<T>;
        hiddenFields?: string[];
        hideFields?: string[];
        onValid: (data: T) => Promise<unknown>;
        onInvalid?: SubmitErrorHandler<T>;
        parseResponse: (response: unknown) => true | FormError;
        render?: (
            fields: [string, FieldProps & HTMLAttributes<HTMLElement>][],
        ) => React.ReactNode;
    };
