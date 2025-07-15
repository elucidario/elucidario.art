import { assertType, describe, it } from "vitest";

import { Identifier, Name, Statement } from "./shared";
import { AcquisitionActivity, ProvenanceActivity } from "./provenance";

describe("Shared", () => {
    it("Should be a valid Identifier", () => {
        const identifier: Identifier = {
            uuid: "0000000-0000-0000-0000-000000000000",
            type: "Identifier",
            id: "http://example.com/identifier/1",
            _label: "Example Identifier",
            content: "Example Content",
            // assigned_by: [{}]
        };
        assertType<Identifier>(identifier);
    });

    it("Should be a valid Name", () => {
        const name: Name = {
            uuid: "0000000-0000-0000-0000-000000000001",
            type: "Name",
            id: "http://example.com/name/1",
            _label: "Example Name",
            content: "Example Content",
        }
        assertType<Name>(name);
    })

    it("Should be a valid Statement", () => {
        const statement: Statement = {
            uuid: "0000000-0000-0000-0000-000000000002",
            type: "LinguisticObject",
            id: "http://example.com/statement/1",
            _label: "Example Statement",
            content: "Example Content",
            // subject: {},
            // predicate: {},
            // object: {},
            // qualifiers: [],
        }
        assertType<Statement>(statement);
    })

    it("should be a valid ProvenanceActivity", () => {
        const acquisition: AcquisitionActivity = {
            id: "http://example.com/activity/1",
            _label: "Example Acquisition Activity",
            uuid: "0000000-0000-0000-0000-000000000003",
            type: "Acquisition",
            transferred_title_of: [],
            transferred_title_from: [],
            transferred_title_to: [],
        }
        const acquisitionProvenance: ProvenanceActivity<"Activity"> = {
            uuid: "0000000-0000-0000-0000-000000000003",
            type: "Activity",
            id: "http://example.com/activity/1",
            _label: "Example Acquisition Activity",
            part: [acquisition],
        }

        assertType<ProvenanceActivity<"Activity">>(acquisitionProvenance);
    })
});
