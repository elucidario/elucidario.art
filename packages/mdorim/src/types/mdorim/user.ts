import { MdorimBase } from "./definitions";

export type User = MdorimBase<{
    username: string;
    email: string;
    password: string;
}, "User">;
