import { NavProviderProps } from "@elucidario/types-design-system";
import { Context, defaultContext } from "./Context";
import { useCallback, useEffect, useState } from "react";

export function Provider({
    children,
    className,
    expanded: expandedProp,
    setExpanded: setExpandedProp,
    ...props
}: NavProviderProps) {
    const [expanded, setExpanded] = useState(expandedProp || []);

    const handleSetExpanded = useCallback(
        (name: string) => {
            if (!expanded.includes(name)) {
                setExpanded([...expanded, name]);
            } else {
                setExpanded(expanded.filter((item) => item !== name));
            }
            setExpandedProp?.(name);
        },
        [setExpandedProp, expanded],
    );

    useEffect(() => {
        console.log("NavProvider", { expanded });
    }, [expanded]);

    return (
        <Context.Provider
            value={{
                ...defaultContext,
                ...props,
                expanded,
                setExpanded: handleSetExpanded,
            }}
        >
            {children}
        </Context.Provider>
    );
}
