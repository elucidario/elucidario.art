import { parseLinkedArtSchema } from "@/utils";
import coreJson from "./entities/core.json" with { type: "json" };

const Core = parseLinkedArtSchema(coreJson, "/linked-art/Core");

export default Core;
