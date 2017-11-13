import { DataSource } from "../base/DataSource";
import { ElasticSearchConnection, QueryParams } from "./ElasticSearchConnection";
import { InternalServerError, NotFoundError } from "restify";
import * as config from "config";

export class ElasticSearchDataSource implements DataSource {

    getData(key: string, fields?: string): Promise<any> {
        // TODO: multi-index and multi-type support
        return new Promise((resolve, reject) => {
            ElasticSearchConnection.getInstance().get({
                index: config.get<string>("elastic.index"),
                type: config.get<string>("elastic.type"),
                id: key
            }, (error, response) => {
                if (error)
                    reject(error);
                resolve(response);
            });
        });
    }
    putData(key: string, value: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getItems(keys: string[], fields?: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateData(key: string, value: Object): Promise<any> {
        throw new Error("Method not implemented.");
    }
    searchData(query: QueryParams): Promise<any> {
        const q = {
            index: config.get<string>("elastic.index"),
            query
        };
        return new Promise((resolve, reject) => {
            ElasticSearchConnection.getInstance().search(q, (error, response) => {
                if (error)
                    reject(error);
                resolve(response);
            });
        });
    }
}