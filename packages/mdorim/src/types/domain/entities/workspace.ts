import { EntityProps, Name } from "@/types";
import { TeamProps } from "@/types";

export type WorkspaceProps = EntityProps<{
    name: Name;
    team?: TeamProps;
    description?: string;
    organization?: string;
}>;
