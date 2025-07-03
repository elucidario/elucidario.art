import {
    _Label,
    Content,
    Format,
    ID,
    LanguageTag,
    GenericType,
    WKT,
} from "../generic";
import { MdorimBase } from "../mdorim";
import { Concept } from "./concept";
import { DigitalService } from "./digital";
import {
    Activities,
    Activity,
    Assignment,
    Birth,
    Creation,
    Death,
    Destruction,
    Dimension,
    Dissolution,
    Encounter,
    Formation,
    Identifier,
    IdentifierOrName,
    Language,
    Material,
    Modification,
    PartRemoval,
    Period,
    PeriodEventOrActivity,
    Production,
    Right,
    Statement,
    Timespan,
} from "./shared";
import { Textual } from "./textual";
import { Visual } from "./visual";
import { Set } from "./set";
import { PhysicalObject } from "./object";
import { Place } from "./place";
import { Person } from "./person";
import { Group } from "./group";
import { ProvenanceActivity, TypesOfProvenanceActivity } from "./provenance";
import { Abstract } from "./abstract";

export type Reference<ResourceType extends GenericType> = MdorimBase<
    {
        id: ID;
        equivalent?: Reference<string>[];
        notation?: LanguageTag[];
    },
    ResourceType
>;

export type PersonOrGroup = Person | Group;

export type LinkedArtProperties = {
    identified_by?: IdentifierOrName[];
    classified_as?: Concept[];
    referred_to_by?: Statement[];
    equivalent?: Reference<string>[];
    representation?: Visual[];
    member_of?: Set[];
    subject_of?: Textual[];
    attributed_by?: Assignment[];
    assigned_by?: Assignment[];
    part_of?: PhysicalObject[];
    dimension?: Dimension[];
    made_of?: Material[];
    current_owner?: PersonOrGroup[];
    current_custodian?: PersonOrGroup[];
    current_permanent_custodian?: PersonOrGroup[];
    current_location?: Place[];
    current_permanent_location?: Place[];
    held_or_supported_by?: PhysicalObject;
    carries?: Textual[];
    shows?: Visual[];
    used_for?: Activity[];
    produced_by?: Production[];
    destroyed_by?: Destruction[];
    removed_by?: PartRemoval[];
    modified_by?: Modification[];
    encountered_by?: Encounter[];
    changed_ownership_through?: ProvenanceActivity<TypesOfProvenanceActivity>[];
    transferred_title_from?: PersonOrGroup[];
    transferred_title_to?: PersonOrGroup[];
    conceptually_part_of?: Abstract[];
    about?: LinkedArtEntity[];
    subject_to?: Right[];
    broader?: Concept[];
    created_by?: Creation;
    format?: Format;
    conforms_to?: Reference<"InformationObject">[];
    digitally_carries?: Textual[];
    digitally_shows?: Visual[];
    digitally_available_via?: DigitalService[];
    access_point?: Reference<string>[];
    timespan?: Timespan;
    during?: Period[];
    before?: PeriodEventOrActivity[];
    after?: PeriodEventOrActivity[];
    took_place_at?: Place[];
    caused_by?: Event[];
    influenced_by?: LinkedArtEntity[];
    carried_out_by?: PersonOrGroup[];
    participant?: PersonOrGroup[];
    used_specific_object?: PhysicalObject[];
    technique?: Concept[];
    contact_point?: Identifier[];
    residence?: Place[];
    carried_out?: Activities[]; // @todo: review this type
    participated_in?: Activities[]; // @todo: review this type
    formed_by?: Formation[];
    dissolved_by?: Dissolution[];
    born?: Birth;
    died?: Death;
    defined_by?: WKT;
    part?: Activity[];
    members_exemplified_by?: LinkedArtEntity[];
    members_contained_by?: PhysicalObject[];
    language?: Language[];
    content?: Content;
    represents?: LinkedArtEntity[];
    represents_instance_of_type?: Concept[];
    notation?: LanguageTag[];
};

export type LinkedArtBase<T = unknown> = {
    id: ID;
    _label: _Label;
} & T;

export type LinkedArtEntity<T = unknown> = LinkedArtBase<T> &
    Pick<
        LinkedArtProperties,
        | "classified_as"
        | "identified_by"
        | "referred_to_by"
        | "equivalent"
        | "representation"
        | "member_of"
        | "subject_of"
        | "attributed_by"
    >;

export type LinkedArtProperty<T = unknown> = LinkedArtBase<T> &
    Pick<
        LinkedArtProperties,
        "classified_as" | "identified_by" | "referred_to_by"
    >;
