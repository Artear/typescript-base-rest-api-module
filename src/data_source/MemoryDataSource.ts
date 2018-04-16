import {DataSource} from "./base/DataSource";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import {InternalServerError} from "restify-errors";

/**
 * Used mostly for debugging;
 */
export class MemoryDataSource implements DataSource {

    private _dictionary: Dictionary<string, any>;

    constructor() {
        this._dictionary = new Dictionary<string, any>();
    }

    getData(key: string): Promise<any> {
        return new Promise((resolve) => {
            resolve(this._dictionary.getValue(key));
        });
    }

    putData(key: string, value: any): Promise<any> {
        return new Promise((resolve) => {
            this._dictionary.setValue(key, value);
            resolve(value);
        });
    }

    getItems(keys: Array<string>, fields?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let promises = keys.map(
                id => this.getData(id).then((data) => {
                        return data;
                    }
                ).catch((err) => {
                    // item not found
                    reject(err);
                })
            );
            Promise.all(promises).then(function (items) {
                resolve(items);
            });
        });
    }

    updateData(key: string, value: Object): Promise<any> {
        throw new InternalServerError("Can not update item to a memory datasource");
    }

    searchData(query: Object): Promise<any> {
        console.log("searcg data");
        return new Promise((resolve, reject) => resolve(null));
    }
}
