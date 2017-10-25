import * as fs from "fs-extra";
import config from "../config";

export default () => {

    return new Promise((resolve, reject) => {

        let versions = [];

        const paths = fs.readdirSync(config.srcPath);

        if (!paths) throw new Error(`Path "${config.srcPath}" not found`);


        for (let currentPath in paths) {

            if (paths.hasOwnProperty(currentPath)) {

                if (fs.lstatSync(`${config.srcPath}${paths[currentPath]}`).isDirectory()) {

                    const files = fs.readdirSync(`${config.srcPath}${paths[currentPath]}`);

                    if (!files) throw new Error(`Files "${config.srcPath}${paths[currentPath]}" not found`);

                    for (let currentFile in files) {

                        if (files.hasOwnProperty(currentFile)) {

                            if (files[currentFile] === config.versionFile) {
                                const version = fs.readJsonSync(`${config.srcPath}${paths[currentPath]}/${files[currentFile]}`);
                                if (!!version) {
                                    versions.push(version);
                                }
                            }
                        }
                    }
                }
            }
        }

        if (versions.length > 0) {
            resolve(versions);
        } else {
            reject(new Error("Zero versions, try crating a new version from scratch"));
        }
    });
};