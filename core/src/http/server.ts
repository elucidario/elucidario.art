import { APP_PORT, NODE_ENV } from "@/constants";

import { lcdr } from "./app";

const app = await lcdr(false);

app.listen({ port: APP_PORT, host: "0.0.0.0" })
    .then((serverUrl) => {
        if (["development"].includes(NODE_ENV)) {
            console.info(`elucidario.art up and running at ${serverUrl}`);
        }
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
