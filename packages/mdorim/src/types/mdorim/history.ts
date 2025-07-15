import { EntityStatus, Timestamp } from "../generic";
import { MdorimBase } from "./definitions";
import { User } from "./user";

export type HistoryAction = "CREATE" | "UPDATE" | "DELETE";

export type StatusChange = {
    from: EntityStatus;
    to: EntityStatus;
};

export type Snapshot = string; // JSON string of the entity's state

export type History = MdorimBase<
    {
        action: HistoryAction;
        timestamp: Timestamp;
        user: User;
        snapshot: Snapshot;
        previous?: History;
    },
    "HistoryEvent"
>;
