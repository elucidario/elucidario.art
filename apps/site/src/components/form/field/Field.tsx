import { FieldProviderProps } from "./types";

import { Root } from "./Root";
import { Body } from "./Body";
import { Label } from "./Label";
import { Description } from "./Description";
import { Error } from "./Error";

export function Field(props: FieldProviderProps) {
    return (
        <Root {...props}>
            <Label />
            <Body />
            <Description />
            <Error />
        </Root>
    );
}
