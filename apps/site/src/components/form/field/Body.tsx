import { useContext } from "react";
import { Context } from "./Context";
import { Input, InputNumber } from "@/components/form";

export function Body() {
    const {
        field: { schema },
        ...rest
    } = useContext(Context);

    let type = schema?.type;
    // If type is an array, default to the first element as the type
    if (Array.isArray(schema?.type)) {
        type = schema.type[0];
    }

    switch (type) {
        case "number":
            return <InputNumber {...rest} type="number" />;

        case "string":
            // if (typeof schema?.enum !== "undefined") {
            //     return (
            //         <Select
            //             {...rest}
            //             {...schema?.html}
            //             value={rest.value as string}
            //             defaultValue={schema?.default?.toString()} // Convert defaultValue to string
            //             options={schema?.enum as string[]}
            //         />
            //     );
            // }

            return <Input {...rest} type="text" />;

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
    }
}
