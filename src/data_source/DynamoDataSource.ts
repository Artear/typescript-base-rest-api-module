import {DataSource} from "./base/DataSource";
import {Connection} from "./dynamo/Connection";
import {InternalServerError, NotFoundError} from "restify-errors";
import * as config from "config";

export class DynamoDataSource implements DataSource {

    private table: string = config.get<string>("aws.dynamodb.tableName");
    private keyName: string = config.get<string>("aws.dynamodb.keyName");

    getData(key: string, fields?: string): Promise<any> {
        const params = {
            TableName: this.table,
            Key: {}
        };
        params.Key[this.keyName] = key;

        if (!!fields) {
            params["ProjectionExpression"] = fields;
        }

        return new Promise((resolve, reject) => {
            Connection.getInstance().get(params, (err, data) => {
                if (err) {
                    reject(new InternalServerError("Unable to get item, error: " + err.message));
                } else {
                    resolve(data.Item);
                }
            });
        });
    }

    putData(key: string, value: Object): Promise<any> {
        let params = {
            TableName: this.table,
            Item: value
        };

        return new Promise((resolve, reject) => {
            Connection.getInstance().put(params, (err, data) => {
                if (err) {
                    reject(new InternalServerError("Unable to create item, error: " + err.message));
                } else {
                    let response = {};
                    response[this.keyName] = key;
                    resolve(response);
                }
            });
        });
    }

    getItems(keys: Array<string>, fields?: string): Promise<any> {
        const params = {
            RequestItems: {
                [this.table]: {
                    Keys: keys.map(key => ({ [this.keyName]: key }))
                }
            }
        };

        if (!!fields) {
            params["RequestItems"][this.table]["ProjectionExpression"] = fields;
        }

        return new Promise((resolve, reject) => {
            Connection.getInstance().batchGet(params, (err, data) => {
                if (err) {
                    reject(new InternalServerError("Unable to get items, error: " + err.message));
                } else {
                    const ordered = keys.map(key => data.Responses[this.table].find(row => row[this.keyName] === key))
                                        .filter( key => key);
                    resolve(ordered);
                }
            });
        });
    }

    updateData(key: string, value: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getData(key).then((item) => {
                if (!!item) {
                    this.putData(key, value).then(function (data) {
                        resolve(data);
                    });
                } else {
                    reject(new NotFoundError("Item not found"));
                }
            }).catch((err) => {
                reject(new InternalServerError("Item not found, error", err));
            });
        });
    }

    searchData(query: Object): Promise<any> {
        return new Promise((resolve, reject) => resolve(null));
    }
}
