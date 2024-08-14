import { useMemo } from "react";
import { useViewPortSize } from "@/hooks";
import { Breakpoints, VisibleProps } from "@elucidario/types-design-system";

export function Visible({ only, children }: VisibleProps) {
    const { type } = useViewPortSize();

    if (type === "unknown") {
        return null;
    }

    const hidden = useMemo(() => {
        if (typeof only === "string") {
            return true;
        }
        return typeof only !== "undefined"
            ? !only.includes(type as Breakpoints)
            : true;
    }, [only, type]);

    return !hidden ? <>{children}</> : null;
}
