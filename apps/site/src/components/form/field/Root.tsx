import { FieldProviderProps } from "./types";
import { Provider } from "./Provider";

export function Root({ children, ...props }: FieldProviderProps) {
    return <Provider {...props}>{children}</Provider>;
}
