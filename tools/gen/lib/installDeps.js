import { exec } from "child_process";

export const installDeps = async ({ cd, deps, flags, console }) => {
    return new Promise((resolve, reject) => {
        let command = cd ? `cd ${cd}` : "";

        const dependencies = deps.join(" ");

        console.log(`Installing dependencies: ${dependencies}`);
        command += ` && pnpm add ${dependencies}`;

        if (flags) {
            command += ` ${flags.join(" ")}`;
        }

        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
};

export const installDepsDev = async ({ cd, deps, flags, console }) => {
    return await installDeps({
        cd,
        deps,
        flags: ["-D", ...(flags ? flags : [])],
        console,
    });
};
