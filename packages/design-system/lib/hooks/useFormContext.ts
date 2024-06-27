import { useFormContext as usePrimitiveFormContext } from "react-hook-form";

export function useFormContext() {
    const context = usePrimitiveFormContext();

    return {
        ...context,
    };
}
