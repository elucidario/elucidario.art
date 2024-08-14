import { useContext } from "react";
import { Context } from "./Context";
import * as Form from "@/components/form";

export function Body() {
    const { schema, hidden, setHidden, render, ...rest } = useContext(Context);

    if (render) {
        return render({ schema, hidden, setHidden, ...rest });
    }

    let type = schema?.type;
    // If type is an array, default to the first element as the type
    if (Array.isArray(schema?.type)) {
        type = schema.type[0];
    }

    switch (type) {
        case "number":
            return <Form.InputNumber {...rest} type="number" {...schema?.html} />;

        case "string":
            if (typeof schema?.enum !== "undefined") {
                return (
                    <Form.Select.Controlled
                        {...rest}
                        {...schema?.html}
                        value={rest.value as string}
                        defaultValue={schema?.default?.toString()} // Convert defaultValue to string
                        options={schema?.enum as string[]}
                    />
                );
            }

            if (
                typeof schema?.html?.type !== "undefined" &&
                ["date", "datetime-local", "month", "time", "week"].includes(
                    schema?.html.type as string,
                )
            ) {
                return (
                    <Form.DatePicker
                        {...rest}
                        type={schema?.html.type as string}
                        {...schema?.html}
                    />
                );
            }

            return <Form.Input {...rest} type="text" {...schema?.html} />;

        case "object":
        // if (schema?.properties) {
        //     return (
        //         <ObjectComponent
        //             {...rest}
        //             properties={schema?.properties}
        //             schema={schema}
        //         />
        //     );
        // }
        // break;

        default:
            return `Unsupported type '${schema.type}' for field '${schema.title}'`;
    }
}
