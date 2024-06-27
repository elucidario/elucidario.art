import { cn } from "@/utils";
import { FieldLabelProps } from "@elucidario/types-design-system";
import { useContext } from "react";
import { Context } from "./Context";
import * as Form from "@/components/form";

export function Label({ children }: React.PropsWithChildren<FieldLabelProps>) {
    const { schema } = useContext(Context);
    return (
        <Form.Label className={cn("flex", "flex-col", "gap-2", "text-md", "font-bold")}>
            <span className={cn("mb-2")}>
                {schema?.title}
                {schema.required ? (
                    <span className={cn("text-red-400")}>*</span>
                ) : null}
            </span>
            {children}
        </Form.Label>
    );
}
