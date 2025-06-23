import { MapNeo4jError } from "@/types";

export interface InterfaceModel<
    T extends Record<string, unknown> = Record<string, unknown>,
> {
    parseResponse(data: Record<string, unknown>, filter?: string[]): T;

    error(error: unknown, details?: MapNeo4jError): Error;
}
