import { GenericType, Reference as ReferenceType } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";

/**
 * # ReferenceModel
 *
 * @link https://linked.art/api/1.0/shared/reference/
 */
export class Reference
    extends AModel<ReferenceType<GenericType>>
    implements IModel<ReferenceType<GenericType>>
{
    constructor(data?: ReferenceType<GenericType> | null) {
        super("/linked-art/Core#/$defs/AnyRef", data);
    }
}
