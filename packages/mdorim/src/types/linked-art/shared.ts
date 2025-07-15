import { MdorimBase } from "@/types/mdorim";
import {
    LinkedArtEntities,
    LinkedArtEntity,
    LinkedArtProperties,
    LinkedArtSharedStructure,
    PersonOrGroup,
} from "./core";
import { Value } from "../generic";
import { HumanMadeObject } from "./object";

export type NameOrIdentifierType = "Name" | "Identifier";

export type Identifier = MdorimBase<
    LinkedArtSharedStructure<
        Pick<LinkedArtProperties, "content" | "assigned_by">
    >,
    "Identifier"
>;

export type Name = LinkedArtSharedStructure<
    Pick<LinkedArtProperties, "content" | "language" | "part" | "assigned_by">,
    "Name"
>;

export type IdentifierOrName = Identifier | Name;

export type Statement = LinkedArtSharedStructure<
    Pick<
        LinkedArtProperties,
        | "content"
        | "language"
        | "format"
        | "assigned_by"
        | "subject_to"
        | "created_by"
    >,
    "LinguisticObject"
>;

export type Assignment = LinkedArtSharedStructure<
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
    >,
    "AttributeAssignment"
> & {
    assigned: LinkedArtEntity;
    assigned_property?: string;
};

export type TypesOfType =
    | "Type"
    | "Currency"
    | "Language"
    | "Material"
    | "MeasurementUnit";

export type Type<T extends LinkedArtEntities | TypesOfType> = LinkedArtEntity<
    Pick<LinkedArtProperties, "equivalent" | "notation" | "classified_as">,
    T
>;

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

export type Activity<T extends TypesOfActivity = "Activity"> =
    LinkedArtSharedStructure<
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
        >,
        T
    >;

export type Event = Activity<"Event">;

export type Period = Activity<"Period">;

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
    diminished?: HumanMadeObject;
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

export type Dimension = LinkedArtSharedStructure<
    {
        value: Value;
        unit: MeasurementUnit;
        upper_value_limit?: Value;
        lower_value_limit?: Value;
    } & Pick<LinkedArtProperties, "assigned_by">,
    "Dimension"
>;

export type Right = LinkedArtSharedStructure<
    { possessed_by?: PersonOrGroup },
    "Right"
>;

export type Timespan = LinkedArtSharedStructure<
    {
        begin_of_the_begin?: Date;
        end_of_the_end?: Date;
        end_of_the_begin?: Date;
        begin_of_the_end?: Date;
        duration?: Dimension;
    },
    "Timespan"
>;

export type MonetaryAmount = LinkedArtSharedStructure<
    {
        value: Value;
        currency: Currency;
        upper_value_limit?: Value;
        lower_value_limit?: Value;
    },
    "MonetaryAmount"
>;
