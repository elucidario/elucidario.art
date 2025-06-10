import { MdorimBase } from "@/types/mdorim";
import {
    LinkedArtBase,
    LinkedArtEntity,
    LinkedArtProperties,
    LinkedArtProperty,
    PersonOrGroup,
} from "./core";
import { Value } from "../generic";
import { PhysicalObject } from "./object";

export interface Identifier
    extends MdorimBase<
        LinkedArtProperty<Pick<LinkedArtProperties, "content" | "assigned_by">>,
        "Identifier"
    > { }

export interface Name
    extends MdorimBase<
        LinkedArtProperty<
            Pick<
                LinkedArtProperties,
                "content" | "language" | "part" | "assigned_by"
            >
        >,
        "Name"
    > { }

export type IdentifierOrName = Identifier | Name;

export interface Statement
    extends MdorimBase<
        LinkedArtProperty<
            Pick<
                LinkedArtProperties,
                | "content"
                | "language"
                | "format"
                | "assigned_by"
                | "subject_to"
                | "created_by"
            >
        >,
        "Statement"
    > { }

export interface Assignment
    extends MdorimBase<
        LinkedArtProperty<
            Pick<
                LinkedArtProperties,
                | "carried_out_by"
                | "timespan"
                | "during"
                | "before"
                | "after"
                | "influenced_by"
                | "caused_by"
                | "used_specific_object"
                | "technique"
            >
        >,
        "AttributeAssignment"
    > {
    assigned: LinkedArtEntity;
    assigned_property?: string;
}

export type TypesOfType =
    | "Type"
    | "Currency"
    | "Language"
    | "Material"
    | "MeasurementUnit";

export interface Type<T extends TypesOfType = "Type">
    extends MdorimBase<
        LinkedArtBase<
            Pick<
                LinkedArtProperties,
                "equivalent" | "notation" | "classified_as"
            >
        >,
        T
    > { }

export type Currency = Type<"Currency">;

export type Language = Type<"Language">;

export type Material = Type<"Material">;

export type MeasurementUnit = Type<"MeasurementUnit">;

export type TypesOfActivity =
    | "Activity"
    | "Event"
    | "Period"
    | "Creation"
    | "Birth"
    | "Formation"
    | "Dissolution"
    | "Death"
    | "Destruction"
    | "Production"
    | "PartRemoval"
    | "Encounter"
    | "Modification";

export interface Activity<T extends TypesOfActivity = "Activity">
    extends MdorimBase<
        LinkedArtEntity<
            Pick<
                LinkedArtProperties,
                | "took_place_at"
                | "timespan"
                | "during"
                | "before"
                | "after"
                | "caused_by"
                | "carried_out_by"
                | "influenced_by"
                | "used_specific_object"
                | "technique"
                | "part"
                | "part_of"
                | "participant"
            >
        >,
        T
    > { }

export type Event = Activity<"Event">

export type Period = Activity<"Period">

export type PeriodEventOrActivity = Activity | Event | Period;

export type Creation = Activity<"Creation">;

export type Birth = Omit<
    Activity<"Birth">,
    | "carried_out_by"
    | "influenced_by"
    | "used_specific_object"
    | "technique"
    | "part"
>;

export type Formation = Activity<"Formation">;

export type Dissolution = Activity<"Dissolution">;

export type Death = Omit<
    Activity<"Death">,
    | "carried_out_by"
    | "influenced_by"
    | "used_specific_object"
    | "technique"
    | "part"
>;

export type Destruction = Activity<"Destruction">;

export type Production = Activity<"Production">;

export type PartRemoval = Activity<"PartRemoval"> & {
    diminished?: PhysicalObject;
};

export type Encounter = Activity<"Encounter">;

export type Modification = Activity<"Modification">;

export type Activities =
    | Activity
    | Creation
    | Birth
    | Formation
    | Dissolution
    | Death
    | Destruction
    | Production
    | PartRemoval
    | Encounter
    | Modification;

export interface Dimension
    extends MdorimBase<
        LinkedArtProperty<
            {
                value: Value;
                unit: MeasurementUnit;
                upper_value_limit?: Value;
                lower_value_limit?: Value;
            } & Pick<LinkedArtProperties, "assigned_by">
        >,
        "Dimension"
    > { }

export interface Right
    extends MdorimBase<
        LinkedArtProperty<{ possessed_by?: PersonOrGroup }>,
        "Right"
    > { }

export interface Timespan
    extends MdorimBase<
        LinkedArtProperty<{
            begin_of_the_begin?: Date;
            end_of_the_end?: Date;
            end_of_the_begin?: Date;
            begin_of_the_end?: Date;
            duration?: Dimension;
        }>,
        "Timespan"
    > { }

export interface MonetaryAmount
    extends MdorimBase<
        LinkedArtProperty<{
            value: Value;
            currency: Currency;
            upper_value_limit?: Value;
            lower_value_limit?: Value;
        }>,
        "MonetaryAmount"
    > { }
