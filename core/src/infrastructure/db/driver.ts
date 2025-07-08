import { NEO4J_PASSWORD, NEO4J_URI, NEO4J_USERNAME } from "@/constants";
import neo4j, { Driver } from "neo4j-driver";

let driver: Driver | undefined;

export function getDriver(): Driver {
    if (!driver) {
        driver = neo4j.driver(
            NEO4J_URI,
            neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
        );
    }
    return driver;
}

export function closeDriver(): void {
    if (driver) {
        driver.close();
        driver = undefined;
    }
}
