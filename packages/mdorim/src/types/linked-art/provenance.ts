import { Concept } from "./concept";
import {
    LinkedArtProperties,
    LinkedArtSharedStructure,
    PersonOrGroup,
} from "./core";
import { HumanMadeObject } from "./object";
import { Place } from "./place";
import { Activity, MonetaryAmount, Right } from "./shared";

export type ProvenanceActivity<T extends TypesOfProvenanceActivity> = Omit<
    Omit<Activity<T>, "part">,
    "technique"
> & { part: ProvenanceActivityPart[] };

export type ProvenanceActivityPart =
    | AcquisitionActivity
    | PaymentActivity
    | TransferOfCustodyActivity
    | EncounterActivity
    | RightAcquisitionActivity
    | MoveActivity
    | PromiseActivity
    | TransferActivity;

export type TypesOfProvenanceActivity = "Activity" | "Event";

export type TypesOfProvenanceActivityPart =
    | "Acquisition"
    | "Payment"
    | "TransferOfCustody"
    | "Encounter"
    | "RightAcquisition"
    | "Move"
    | "Promise"
    | "Transfer";

type RawProvenanceActivity<T extends TypesOfProvenanceActivityPart> =
    LinkedArtSharedStructure<
        Pick<
            LinkedArtProperties,
            | "timespan"
            | "during"
            | "took_place_at"
            | "influenced_by"
            | "carried_out_by"
            | "participant"
            | "used_specific_object"
        >,
        T
    >;

export type AcquisitionActivity = RawProvenanceActivity<"Acquisition"> &
    Pick<
        LinkedArtProperties,
        "transferred_title_from" | "transferred_title_to"
    > & {
        transferred_title_of: HumanMadeObject[];
    };

export type PaymentActivity = RawProvenanceActivity<"Payment"> & {
    paid_amount?: MonetaryAmount;
    paid_from?: PersonOrGroup[];
    paid_to?: PersonOrGroup[];
};

export type TransferOfCustodyActivity =
    RawProvenanceActivity<"TransferOfCustody"> & {
        transferred_custody_of: HumanMadeObject[];
        transferred_custody_from?: PersonOrGroup[];
        transferred_custody_to?: PersonOrGroup[];
    };

export type EncounterActivity = RawProvenanceActivity<"Encounter"> & {
    encountered: HumanMadeObject[];
};

export type RightAcquisitionActivity =
    RawProvenanceActivity<"RightAcquisition"> & {
        establishes: Right;
        invalidates?: Right[];
    };

export type MoveActivity = RawProvenanceActivity<"Move"> & {
    moved: HumanMadeObject[];
    moved_from?: Place;
    moved_to?: Place;
};

export type PromiseActivity = RawProvenanceActivity<"Promise"> & {
    classified_as: [
        Concept & {
            id: "http://vocab.getty.edu/aat/300435599";
        },
        ...Concept[],
    ];
};

export type TransferActivity = RawProvenanceActivity<"Transfer"> & {
    transferred: HumanMadeObject[];
    transferred_from?: PersonOrGroup[];
    transferred_to?: PersonOrGroup[];
};
