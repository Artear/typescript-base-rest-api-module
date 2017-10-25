import * as inquirer from "inquirer";
import * as fs from "fs-extra";
import config from "../config";

export const overrideDir = (from, to, versionNumber) => {
    return fs.remove(`${config.srcPath}${to}`)
        .then(() => fs.copy(`${config.srcPath}${from}`, `${config.srcPath}${to}`))
        .then(() => {

            const version = fs.readJsonSync(`${config.srcPath}${to}/${config.versionFile}`);
            version.name = to;
            version.value = to;

            if (!!versionNumber)
                version.number = versionNumber;

            fs.writeJsonSync(`${config.srcPath}${to}/${config.versionFile}`, version);

            console.log("Done!");
        })
        .catch((err) => {
            throw err;
        });
};

export default (versions, from, to) => {
    inquirer.prompt([
        {
            type: "list",
            name: "from",
            message: "Which version do you want to promote?",
            choices: versions
        }])
        .then(function (answer: any) {
            from = answer.from;

            versions.splice(versions.findIndex(i => i.value === from), 1);

            if (versions.length < 1) {
                throw new Error(`Can't promote a version because you just have "${from}" version, try creating a new version`);
            }

            return inquirer.prompt([
                {
                    type: "list",
                    name: "to",
                    message: "Promote to ...",
                    choices: () => {
                        return versions;
                    }
                }
            ]);
        })
        .then(function (answer: any) {
            to = answer.to;
            const exists = fs.pathExistsSync(`${config.srcPath}${from}`);
            if (exists) {
                return inquirer.prompt([
                    {
                        type: "confirm",
                        name: "confirm",
                        message: `"${to}" directory will be overriden by the contents of "${from}". Continue? `,
                    }]);
            } else {
                throw new Error(`"${from}" directory does not exists.`);
            }
        })
        .then(({confirm}) => {
            if (confirm) {
                return overrideDir(from, to, false);
            } else {
                console.log("Cancelled.");
            }
        })
        .catch((err) => {
            console.log("Error: ", err.message);
        });
};