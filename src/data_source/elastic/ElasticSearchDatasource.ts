import {DataSource} from "../base/DataSource";
import {ElasticSearchConnection} from "./ElasticSearchConnection";
import * as config from "config";

export class ElasticSearchDataSource implements DataSource {

    getData(key: string, fields?: string): Promise<any> {
        // TODO: add multi-index and multi-type support
        return new Promise((resolve, reject) => {
            ElasticSearchConnection.getInstance().get({
                index: config.get<string>("elastic.index"),
                type: config.get<string>("elastic.type") ? config.get<string>("elastic.type") : "_all",
                id: key
            }, (error, response) => {
                if (error)
                    reject(error);
                resolve(response);
            });
        });
    }

    putData(key: string, value: any): Promise<any> {
        return new Promise(resolve => resolve(null));
    }

    getItems(keys: string[], fields?: string): Promise<any> {
        return new Promise(resolve => resolve(null));
    }

    updateData(key: string, value: Object): Promise<any> {
        return new Promise(resolve => resolve(null));
    }

    searchData(query: any): Promise<any> {
        const q = this.buildQueryObject(query);
        return new Promise((resolve, reject) => {
            ElasticSearchConnection.getInstance().search(q, (error, response) => {
                if (error)
                    reject(error);
                resolve(response);
            });
        });
    }

    private buildQueryObject(query: any) {
        try {
            const queryBody = JSON.parse(query);
            return {
                index: config.get<string>("elastic.index"),
                body: queryBody
            };
        } catch (error) {}
        return {
            index: config.get<string>("elastic.index"),
            q: query
        };
    }

    deleteItem(key: string): Promise<any> {
        return Promise.reject(new Error('Method not implemented'));
    }
}