import { _Label, GenericType, UUID } from "../generic";

export type MdorimBase<
    T extends Record<string, unknown> = Record<string, unknown>,
    TType extends GenericType = GenericType,
> = {
    uuid?: UUID;
    type: TType;
    _label: _Label;
} & T;
