import { useViewPortSize } from "@/hooks";
import { Breakpoints, VisibleProps } from "./types";

export function Visible<T>({ only, children }: VisibleProps<T>) {
    const { type } = useViewPortSize();

    const hidden = useMemo(() => {
        if (typeof only === "string") {
            return true;
        }
        return typeof only !== "undefined"
            ? !only.includes(type as Breakpoints)
            : true;
    }, [only, type]);

    if (type === "unknown") {
        return null;
    }

    return !hidden ? <>{children}</> : null;
}
