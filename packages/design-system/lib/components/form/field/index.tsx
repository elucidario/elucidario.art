import { Root } from "./Root";
import { Body } from "./Body";
import { Label } from "./Label";
import { Description } from "./Description";
import { Error } from "./Error";

import { FieldProviderProps } from "@elucidario/types-design-system";

const Field = { Root, Body, Label, Description, Error };

export { Field };

const Component = (props: FieldProviderProps) => {
    return (
        <Root {...props}>
            <Label />
            <Body />
            <Description />
            <Error />
        </Root>
    );
};

export default Component;
