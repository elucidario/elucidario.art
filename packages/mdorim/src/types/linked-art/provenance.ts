import { Concept } from "./concept";
import { MdorimBase } from "../mdorim";
import { LinkedArtProperties, LinkedArtProperty, PersonOrGroup } from "./core";
import { PhysicalObject } from "./object";
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

type RawProvenanceActivity = LinkedArtProperty<
    Pick<
        LinkedArtProperties,
        | "timespan"
        | "during"
        | "took_place_at"
        | "influenced_by"
        | "carried_out_by"
        | "participant"
        | "used_specific_object"
    >
>;

export type AcquisitionActivity = RawProvenanceActivity &
    MdorimBase<
        Pick<
            LinkedArtProperties,
            "transferred_title_from" | "transferred_title_to"
        > & {
            transferred_title_of: PhysicalObject[];
        },
        "Acquisition"
    >;

export type PaymentActivity = RawProvenanceActivity &
    MdorimBase<
        {
            paid_amount?: MonetaryAmount;
            paid_from?: PersonOrGroup[];
            paid_to?: PersonOrGroup[];
        },
        "Payment"
    >;

export type TransferOfCustodyActivity = RawProvenanceActivity &
    MdorimBase<
        {
            transferred_custody_of: PhysicalObject[];
            transferred_custody_from?: PersonOrGroup[];
            transferred_custody_to?: PersonOrGroup[];
        },
        "TransferOfCustody"
    >;

export type EncounterActivity = RawProvenanceActivity &
    MdorimBase<
        {
            encountered: PhysicalObject[];
        },
        "Encounter"
    >;

export type RightAcquisitionActivity = RawProvenanceActivity &
    MdorimBase<
        {
            establishes: Right;
            invalidates?: Right[];
        },
        "RightAcquisition"
    >;

export type MoveActivity = RawProvenanceActivity &
    MdorimBase<
        {
            moved: PhysicalObject[];
            moved_from?: Place;
            moved_to?: Place;
        },
        "Move"
    >;

export type PromiseActivity = RawProvenanceActivity &
    MdorimBase<
        {
            classified_as: [
                Concept & {
                    id: "http://vocab.getty.edu/aat/300435599";
                },
                ...Concept[],
            ];
        },
        "Promise"
    >;

export type TransferActivity = RawProvenanceActivity &
    MdorimBase<
        {
            transferred: PhysicalObject[];
            transferred_from?: PersonOrGroup[];
            transferred_to?: PersonOrGroup[];
        },
        "Transfer"
    >;
