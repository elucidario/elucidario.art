import { cn } from "@/utils";
import { FieldLabelProps } from "./types";
import { useFieldContext } from "./Context";
import * as Form from "@/components/form";

export function Label({ children, ...props }: FieldLabelProps) {
    const {
        id,
        required,
        field: { schema },
    } = useFieldContext();

    return (
        <Form.Label
            className={cn("flex", "flex-col", "gap-2", "text-md", "font-bold")}
            htmlFor={id}
            {...props}
        >
            <span className={cn("inline-flex", "gap-1")}>
                {schema.title ? (schema.title as string) : null}
                {required ? (
                    <span className={cn("text-red-400")}>*</span>
                ) : null}
            </span>
            {children}
        </Form.Label>
    );
}
