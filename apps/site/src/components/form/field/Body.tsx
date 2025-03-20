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
        hidden,
        ...props
    } = useFieldContext();

    // If type is an array, default to the first element as the type
    let type = schema?.type;
    if (Array.isArray(schema?.type)) {
        type = schema.type[0];
    }

    switch (type) {
        case "number": {
            return <InputNumber {...props} hidden={hidden} type="number" />;
        }

        case "string": {
            return <Input {...props} hidden={hidden} type="text" />;
        }

        case "array": {
            return <Multiple hidden={hidden} {...props} />;
        }

        case "object": {
            return <ObjectComponent hidden={hidden} {...props} />;
        }
    }
}
