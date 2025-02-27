import { useViewPortSize } from "@/hooks";
import { Breakpoints, VisibleProps } from "@elucidario/types-design-system";

export function Visible<T>({ only, children }: VisibleProps<T>) {
    const { type } = useViewPortSize();
    if (typeof only === "string") {
        return type === only ? children : null;
    } else if (Array.isArray(only)) {
        return only.includes(type as Breakpoints) ? children : null;
    } else {
        return children;
    }
}
