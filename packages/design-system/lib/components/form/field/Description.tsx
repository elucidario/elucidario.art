import { useContext } from "react";
import { Context } from "./Context";

import { Description as PrimitiveDescription } from "@/components/form/description";

export function Description() {
    const { schema } = useContext(Context);

    return schema?.description ? (
        <PrimitiveDescription name="field">
            {schema?.description as string}
        </PrimitiveDescription>
    ) : null;
}
