import {DataSource} from "./base/DataSource";
import {NotAcceptableError, BadRequestError, ServiceUnavailableError, InternalServerError} from "restify";
import * as restler from "restler";
import * as config from "config";


export class ExternalDataSource implements DataSource {
    private externalSources: any;

    constructor(externalSources) {
        this.externalSources = externalSources;
    }

    getData(key: string, fields?: string): Promise<any> {

        return new Promise((resolve, reject) => {
            try {
                let path = this.getResourceUrlOrThrow(key);

                if (!!path) {
                    restler.get(path, {timeout: config.get<number>("server.options.timeout")})
                    .on("timeout", () => {
                        reject(new ServiceUnavailableError("External data source not respond"));
                    })
                    .on("fail", (data, response) => {
                        reject(new BadRequestError(response.statusMessage));
                    })
                    .on("error", (err, response) => {
                        reject(new ServiceUnavailableError(response.statusMessage));
                    })
                    .on("success", (result) => {
                        resolve(result);
                    });
                } else {
                    reject(new NotAcceptableError("The source " + key + " can't be parsed."));
                }
            } catch (e) {
                reject(new Error(e.message));
            }
        });
    }

    putData(key: string, value: any): Promise<any> {
        return new Promise((resolve) => {
            resolve(true);
        });
    }

    /**
     * Return the source url
     * @param pattern
     *      Ex: TN-5434341
     * @returns {string}
     */
    public getResourceUrlOrThrow(pattern: string): string {

        let url: string = "";

        if (pattern.match(/^[a-z]+-[0-9]+$/i)) {
            let keySource = pattern.split("-");

            if (!!this.externalSources) {
                if (this.externalSources[keySource[0]]) {
                    url = this.externalSources[keySource[0]].url + keySource[1] + ".json";
                }
            } else {
                throw new Error("External sources config is not defined");
            }
        }

        return url;
    }

    getItems(keys: Array<string>, fields?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                let path = this.getMultiGetResourceUrl(keys);
                if (!!path) {
                    restler.get(path, {timeout: config.get<number>("server.options.timeout")})
                        .on("timeout", () => {
                            reject(new ServiceUnavailableError("External data source not respond"));
                        })
                        .on("fail", (data, response) => {
                            reject(new BadRequestError(response.statusMessage));
                        })
                        .on("error", (err, response) => {
                            reject(new ServiceUnavailableError(response.statusMessage));
                        })
                        .on("success", (result) => {
                            resolve(result);
                        });
                } else {
                    reject(new NotAcceptableError("The sources " + keys + " can't be parsed."));
                }
            } catch (e) {
                reject(new Error(e.message));
            }
        });
    }

    updateData(key: string, value: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            reject(new InternalServerError("Can not update item to an external datasource"));
        });
    }

    public getMultiGetResourceUrl(keys: Array<string>) {
        let url: string = "";
        let pattern = keys[0];
        if (pattern.match(/^[a-z]+-[0-9]+$/i)) {
            let keySource = pattern.split("-");
            if (!!this.externalSources &&
                (this.externalSources[keySource[0]])) {
                url = this.externalSources[keySource[0]].url;
                url = url.endsWith("/") ? url.slice(0, -1) : url;
                // @todo: no acoplar llamada a api concreta. Esto se debe modificar
                url += ".json?+" + this.externalSources[keySource[0]].queryParameter;
                url += keys.map((v) => (
                    v.split("-")[1] + ","
                ));
            } else {
                throw new Error("External sources config is not defined");
            }
        }
        return url.slice(0, -1);
    }
}