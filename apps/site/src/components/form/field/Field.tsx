import { FieldProviderProps } from "./types";

import { Provider } from "./Provider";
import { Body } from "./Body";
import { Label } from "./Label";
import { Description } from "./Description";
import { Error } from "./Error";

export function Field(props: FieldProviderProps) {
    return (
        <Provider {...props}>
            <Label />
            <Body />
            <Description />
            <Error />
        </Provider>
    );
}
