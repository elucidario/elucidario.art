import { cn } from "@/utils";
import { FieldLabelProps } from "./types";
import { useFieldContext } from "./Context";
import * as Form from "@/components/form";

export function Label({ children }: React.PropsWithChildren<FieldLabelProps>) {
    const {
        required,
        field: { schema },
    } = useFieldContext();

    return (
        <Form.Label
            className={cn("flex", "flex-col", "gap-2", "text-md", "font-bold")}
        >
            <span>
                {schema.title ? (schema.title as string) : null}
                {required ? (
                    <span className={cn("text-red-400")}>*</span>
                ) : null}
            </span>
            {children}
        </Form.Label>
    );
}
