import * as inquirer from "inquirer";
import * as fs from "fs-extra";
import config  from "../config";
import getVersionList from "../lib/versionList";
import {overrideDir} from  "./cloneOperation";


export default () => {
    inquirer.prompt([
        {
            type: "list",
            name: "operation",
            message: "Create a version from scratch or from a previous version",
            choices: ["scratch", "previous"]
        }])
        .then((option: any) => {
            switch (option.operation) {
                case "scratch":
                    fromScratch();
                    break;

                case "previous":
                    fromPrevious();
                    break;
            }
        });
};


const fromScratch = () => {

    let version = {
        name: "",
        value: "",
        number: ""
    };

    inquirer.prompt([
        {
            type: "input",
            name: "versionName",
            message: "Please insert the version name Ex: current",
            validate: (input) => {
                if (!!input)
                    return true;
                return "You need to provide a version name";
            }
        }
    ])
        .then((value: any) => {
            version.name = value.versionName;
            version.value = value.versionName;

            inquirer.prompt([
                {
                    type: "input",
                    name: "versionNumber",
                    message: "Please insert the version number Ex: 0.0.1",
                    validate: (input) => {
                        if (!!input)
                            return true;
                        return "You need to provide a version number";
                    }
                }
            ])
                .then((value: any) => {
                    version.number = value.versionNumber;
                    fs.copy(`${config.scratchPath}`, `${config.srcPath}${version.name}`).then(() => {
                        fs.writeJsonSync(`${config.srcPath}${version.name}/${config.versionFile}`, version);

                        console.info("Done!");
                    });
                });
        });
};


const fromPrevious = () => {

    getVersionList().then((versions: Array<string>) => {

        let from = "";
        let to = "";
        let versionNumber = "";

        if (versions.length < 1) {
            throw new Error(`Can't create a new version from a previous version because is zero!, try creating a new version from scratch`);
        }

        inquirer.prompt([
            {
                type: "list",
                name: "from",
                message: "Create new version from:",
                choices: () => {
                    return versions;
                }
            }
        ])
            .then(function (answer: any) {
                from = answer.from;
                return inquirer.prompt([
                    {
                        type: "input",
                        name: "versionName",
                        message: "Please insert the version name Ex: current", validate: (input: string) => {
                        if (!!input)
                            return true;
                        return "You need to provide a version name";
                    }

                    }
                ]);
            })
            .then(function (answer: any) {
                to = answer.versionName;
                return inquirer.prompt([
                    {
                        type: "input",
                        name: "versionNumber",
                        message: "Please insert the version number Ex: 0.0.1",
                        validate: (input) => {
                            if (!!input)
                                return true;
                            return "You need to provide a version number";
                        }
                    }
                ]);
            })
            .then((value: any) => {
                const exists = fs.pathExistsSync(`${config.srcPath}${from}`);
                versionNumber = value.versionNumber;

                if (exists) {
                    return inquirer.prompt([
                        {
                            type: "confirm",
                            name: "confirm",
                            message: `You will create a new version from "${from}" with the name "${to}" and version "${versionNumber}". Continue? `,
                        }]);
                } else {
                    throw new Error(`"${from}" directory does not exists.`);
                }
            })
            .then(({confirm}) => {
                if (confirm) {
                    return overrideDir(from, to, versionNumber);
                } else {
                    console.log("Cancelled.");
                }
            })
            .catch((err) => {
                console.log("Error: ", err.message);
            });

    }).catch((err) => {
        throw new Error(`Error gathering versions: ${err.message}`);
    });
};