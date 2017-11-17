import {DataSource} from "./base/DataSource";
import {BadRequestError, InternalServerError, NotAcceptableError, ServiceUnavailableError} from "restify";
import * as restler from "restler";
import * as config from "config";
import {ExternalUrlBuilder} from "./ExternalUrlBuilder";
import {LoggerHelper} from "../helper/logger/LoggerHelper";

/**
 * Class that represents an external data source (fallback to fetch external data)
 */
export class ExternalDataSource implements DataSource {
    private urlBuilder: any;

    constructor(urlBuilder: ExternalUrlBuilder) {
        this.urlBuilder = urlBuilder;
    }

    getData(key: string, fields?: string): Promise<any> {

        return new Promise((resolve, reject) => {
            try {
                let path = this.urlBuilder.getResourceUrlOrThrow(key);

                if (!!path) {

                    LoggerHelper.getDefaultHandler().info(`Request item from ${path}`);

                    restler.get(path, {timeout: config.get<number>("server.options.timeout")})
                        .on("timeout", () => {
                            LoggerHelper.getDefaultHandler().error(`ExternalDataSource timeout`);
                            reject(new ServiceUnavailableError("External data source not respond"));
                        })
                        .on("fail", (err, response) => {
                            LoggerHelper.getDefaultHandler().error(`ExternalDataSource fail: ${err}`);
                            reject(new BadRequestError(err));
                        })
                        .on("error", (err, response) => {
                            LoggerHelper.getDefaultHandler().error(`ExternalDataSource error: ${err}`);
                            reject(new ServiceUnavailableError(err));
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

    getItems(keys: Array<string>, fields?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                let path = this.urlBuilder.getMultiGetResourceUrl(keys);
                if (!!path) {

                    LoggerHelper.getDefaultHandler().info(`Request items from ${path}`);

                    restler.get(path, {timeout: config.get<number>("server.options.timeout")})
                        .on("timeout", () => {
                            LoggerHelper.getDefaultHandler().error(`ExternalDataSource timeout`);
                            reject(new ServiceUnavailableError("External data source not respond"));
                        })
                        .on("fail", (err, response) => {
                            LoggerHelper.getDefaultHandler().error(`ExternalDataSource fail: ${err}`);
                            reject(new BadRequestError(err));
                        })
                        .on("error", (err, response) => {
                            LoggerHelper.getDefaultHandler().error(`ExternalDataSource: ${err}`);
                            reject(new ServiceUnavailableError(err));
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

    searchData(query: Object): Promise<any> {
        return new Promise((resolve, reject) => resolve(null));
    }
}