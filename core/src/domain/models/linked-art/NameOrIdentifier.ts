import { IdentifierOrName } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";

export class NameOrIdentifier
    extends AModel<IdentifierOrName>
    implements IModel<IdentifierOrName>
{
    constructor(data?: IdentifierOrName | null) {
        super(
            [
                "/linked-art/Core#/$defs/Identifier",
                "/linked-art/Core#/$defs/Name",
            ],
            data,
        );
    }
}
