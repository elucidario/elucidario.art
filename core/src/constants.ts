import { config } from "dotenv";

config({
    path: [
        `.env.${process.env.NODE_ENV}`,
        `.env.${process.env.NODE_ENV}.local`,
        `.env.local`,
        `.env`,
    ],
});

export const NODE_ENV = process.env.NODE_ENV || "development";
export const IS_DEVELOPMENT = NODE_ENV === "development";

export const NEO4J_URI = process.env.NEO4J_URI;
export const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
export const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

export const APP_PORT = process.env.APP_PORT
    ? parseInt(process.env.APP_PORT)
    : 8000;

export const API_PREFIX = "api";
export const API_VERSION = "v1";
