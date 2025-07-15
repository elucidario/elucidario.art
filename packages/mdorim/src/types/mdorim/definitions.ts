import { GenericType, UUID } from "../generic";

export type MdorimBase<
    T extends Record<string, unknown> = Record<string, unknown>,
    TType extends GenericType = GenericType,
> = {
    type: TType;
    uuid?: UUID;
} & T;
