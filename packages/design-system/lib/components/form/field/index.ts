import { FieldProvider } from "./FieldProvider";
import { FieldRoot } from "./FieldRoot";
import { FieldLabel } from "./FieldLabel";
import { FieldDescription } from "./FieldDescription";
import type { FieldType } from "@elucidario/types-design-system";

// hooks
export * from "./useFieldComponent";
import useFieldContext from "./useFieldContext";

const Field: FieldType = {
    Provider: FieldProvider,
    Root: FieldRoot,
    Label: FieldLabel,
    Description: FieldDescription,
};

export { Field, useFieldContext };
