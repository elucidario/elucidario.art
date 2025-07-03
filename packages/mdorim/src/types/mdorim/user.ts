import { MdorimBase } from "./definitions";

export type User = MdorimBase<
    {
        username?: string;
        email?: string;
    },
    "User"
>;
