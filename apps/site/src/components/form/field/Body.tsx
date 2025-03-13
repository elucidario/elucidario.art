import { useFieldContext } from "./Context";
import {
    Input,
    InputNumber,
    Multiple,
    ObjectComponent,
} from "@/components/form";

export function Body() {
    const {
        field: { schema },
        ...props
    } = useFieldContext();

    let type = schema?.type;
    // If type is an array, default to the first element as the type
    if (Array.isArray(schema?.type)) {
        type = schema.type[0];
    }

    switch (type) {
        case "number": {
            return <InputNumber {...props} type="number" />;
        }

        case "string": {
            // if (typeof schema?.enum !== "undefined") {
            //     return (
            //         <Select
            //             {...props}
            //             {...schema?.html}
            //             value={props.value as string}
            //             defaultValue={schema?.default?.toString()} // Convert defaultValue to string
            //             options={schema?.enum as string[]}
            //         />
            //     );
            // }

            return <Input {...props} type="text" />;
        }

        case "array": {
            return <Multiple {...props} />;
        }

        case "object": {
            return <ObjectComponent {...props} />;
        }
    }
}
