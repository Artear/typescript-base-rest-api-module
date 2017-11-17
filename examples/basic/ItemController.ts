import {DataSourceManager} from "../../src/data_source/base/DataSourceManager";
import {NotAcceptableError, UnprocessableEntityError} from "restify";
import * as UUID from "uuid";
import {LoggerHelper} from "../../src/helper/logger/LoggerHelper";
import {MemoryDataSource} from "../../src/data_source/MemoryDataSource";
import {ElasticSearchDataSource} from "../../src/data_source/elastic/ElasticSearchDatasource";

/**
 * Class that abstract access of database for article services.
 */
export class ItemController {

    static dataManager: DataSourceManager = new DataSourceManager(new MemoryDataSource(), new ElasticSearchDataSource());

    public createItem(item: any) {
        return new Promise(function (resolve, reject) {
            // If itemId is undefined or hasn't UUID format, generate UUID for resource.
            if (!item.itemId) {
                item.itemId = UUID.v4();
            } else if (!item.itemId.match(/^[a-z]+-[0-9]+$/i)) {
                reject(new UnprocessableEntityError("Property itemId doesn't match expected pattern: the only" +
                    " allowed format for creation is XYZ-1234"));
            }

            LoggerHelper.getDefaultHandler().info("CREATE: " + item.itemId);
            ItemController.dataManager.putData(item.itemId, item).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public updateItem(item: any) {
        return new Promise(function (resolve, reject) {
            ItemController.dataManager.updateData(item.itemId, item).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public getItem(key: string, fields?: string) {
        return new Promise(function (resolve, reject) {
            ItemController.dataManager.getData(key, fields).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public search(query: string) {
        return new Promise(function (resolve, reject) {
            ItemController.dataManager.searchData(query).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public getItemCollection(items: Array<string>, fields?: string) {
        return new Promise(function (resolve, reject) {
            ItemController.dataManager.getItems(items, fields).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(new NotAcceptableError("Some of the articles don't exists!", err));
            });
        });
    }
}
