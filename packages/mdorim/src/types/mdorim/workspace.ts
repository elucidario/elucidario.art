import { MdorimBase } from "./definitions";

export type Workspace = MdorimBase<{
    name: string;
    description?: string;
}, "Workspace">;
