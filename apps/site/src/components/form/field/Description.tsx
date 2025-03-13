import { useFieldContext } from "./Context";

import { Description as PrimitiveDescription } from "@/components/form/description";

export function Description() {
    const {
        field: { schema },
    } = useFieldContext();

    return schema?.description ? (
        <PrimitiveDescription>
            {schema?.description as string}
        </PrimitiveDescription>
    ) : null;
}
