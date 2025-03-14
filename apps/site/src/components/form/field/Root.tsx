import { FieldProviderProps } from "./types";
import { Provider } from "./Provider";
import { useState } from "react";

export function Root({ children, ...props }: FieldProviderProps) {
    const [hidden, setHidden] = useState<boolean>(false);
    return <Provider {...{ hidden, setHidden, ...props }}>{children}</Provider>;
}
