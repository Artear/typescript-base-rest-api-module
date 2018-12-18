import {DataSource} from "./DataSource";
import {InternalServerError, ResourceNotFoundError, ServiceUnavailableError} from "restify-errors";
import {LoggerHelper} from "../../helper/logger/LoggerHelper";

export class DataSourceManager {
    private dataSources: Array<DataSource>;

    constructor(dataSource: DataSource, ...dataSources: DataSource[]) {
        this.dataSources = [];
        this.dataSources.push(dataSource);

        if (!!dataSources) {
            dataSources.forEach((value: DataSource, index: number, array: DataSource[]) => {
                this.dataSources.push(value);
            });
        }
    }

    public getData(key: string, fields?: string): Promise<any> {
        return this.internal_get_data(0, key, fields);
    }

    public putData(key: string, value: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            let dataSource = this.dataSources[0];
            if (!!dataSource) {
                dataSource.putData(key, value).then((data) => {
                    if (!!data) {
                        resolve(data);
                    }
                }).catch((err) => {
                    LoggerHelper.getDefaultHandler().error(err.message);
                    reject(new InternalServerError(err.message));
                });
            } else {
                LoggerHelper.getDefaultHandler().error("DataSource not found");
                reject(new ServiceUnavailableError("DataSource not found"));
            }
        });
    }

    public getItems(keys: Array<string>, fields?: string): Promise<any> {
        return this.internal_get_list(0, keys, fields);
    }

    public updateData(key: string, value: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            let dataSource = this.dataSources[0];
            dataSource.updateData(key, value).then((data) => {
                if (!!data) {
                    resolve(data);
                }
            }).catch((err) => {
                LoggerHelper.getDefaultHandler().error(err.message);
                reject(err);
            });
        });
    }

    private internal_get_data(index: number, key: string, fields?: string): Promise<any> {
        let dataSource = this.dataSources[index];
        return new Promise((resolve, reject) => {
            if (!!dataSource) {
                dataSource.getData(key, fields).then((data) => {
                    if (!!data) {
                        if (index > 0) {
                            // update the main source
                            this.dataSources[0].putData(key, data);
                        }
                        resolve(data);
                    } else {
                        // if the main source doesn't have data, update it with the next source
                        index++;
                        this.internal_get_data(index, key, fields).then((data) => {
                            resolve(data);
                        }).catch((err) => {
                            LoggerHelper.getDefaultHandler().error(err.message);
                            reject(err);
                        });
                    }
                }).catch((err) => {
                    LoggerHelper.getDefaultHandler().error(err.message);
                    reject(err);
                });
            } else {
                reject(new ResourceNotFoundError("Resource not found"));
            }
        });
    }

    private internal_get_list(index: number, keys: Array<string>, fields: string, items?: Array<any>): Promise<any> {
        let dataSource = this.dataSources[index];
        return new Promise((resolve, reject) => {
            if (!!dataSource) {
                dataSource.getItems(keys, fields).then((data) => {
                    // if we dont find all the keys we fetch the next datasource
                    if (!!data && data.length === keys.length) {
                        if (index > 0) {
                            // update the main source: we have to verify all the items and update which ones that dont exist
                            this.updateMainDatasource(keys, data, reject);
                        }
                        resolve(data);
                    } else {
                        index++;
                        this.internal_get_list(index, keys, fields, data).then((data) => {
                            resolve(data);
                        }).catch((err) => {
                            LoggerHelper.getDefaultHandler().error(err.message);
                            reject(err);
                        });
                    }
                }).catch((err) => {
                    if (!!items) {
                        LoggerHelper.getDefaultHandler().warn(`Some items fail from: ${keys}`);
                        resolve(items);
                    }
                    else {
                        LoggerHelper.getDefaultHandler().error(err.message);
                        reject(err);
                    }
                });
            } else {
                reject(new ResourceNotFoundError("Resource not found"));
            }
        });
    }

    private updateMainDatasource(keys: Array<string>, data, reject) {
        let dataIndex = 0;
        keys.map((key) => {
            if (!!data[dataIndex]) {
                this.dataSources[0].putData(key, data[dataIndex])
                    .catch((err) => {
                        // item not found
                        reject(err);
                    });
            }
            dataIndex++;
        });
    }

    public searchData(query: Object): Promise<any> {
        return this.internal_search_data(0, query);
    }

    private internal_search_data(index: number, query: Object): Promise<any> {
        let dataSource = this.dataSources[index];
        return new Promise((resolve, reject) => {
            if (!!dataSource) {
                dataSource.searchData(query).then((data) => {
                    if (!!data) {
                        resolve(data);
                    } else {
                        index++;
                        // try to search in the next datasource
                        this.internal_search_data(index, query).then((data) => {
                            resolve(data);
                        }).catch((err) => {
                            LoggerHelper.getDefaultHandler().error(err.message);
                            reject(err);
                        });
                    }
                }).catch((err) => {
                    LoggerHelper.getDefaultHandler().error(err.message);
                    reject(err);
                });
            } else {
                reject(new ResourceNotFoundError("Resource not found"));
            }
        });
    }

    public deleteItem(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let dataSource = this.dataSources[0];
            dataSource.deleteItem(key).then((data) => {
                if (!!data) {
                    resolve(data);
                }
            }).catch((err) => {
                LoggerHelper.getDefaultHandler().error(err.message);
                reject(err);
            });
        });


    }
}
