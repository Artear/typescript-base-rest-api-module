import {DataSource} from "./base/DataSource";
import {Connection} from "./dynamo/Connection";
import {InternalServerError, NotFoundError} from "restify-errors";
import * as config from "config";
import * as chunk from "lodash.chunk";
import * as flatten from "lodash.flatten";

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
        return new Promise((resolveItems, rejectItems) => {
            const chunks = chunk(keys, 100);
            const chunksLength = chunks.length;
            const promises = [];

            for (let i = 0; i < chunksLength; i++) {
                const params = {
                    RequestItems: {
                        [this.table]: {
                            Keys: chunks[i].map(key => ({ [this.keyName]: key }))
                        }
                    }
                };

                if (!!fields) {
                    params["RequestItems"][this.table]["ProjectionExpression"] = fields;
                }

                promises.push(
                    new Promise((resolve, reject) => {
                        Connection.getInstance().batchGet(params, (err, data) => {
                            if (err) {
                                rejectItems(new InternalServerError("Unable to get items, error: " + err.message));
                            }
                            else {
                                const ordered = keys.map(key => data.Responses[this.table].find(row => row[this.keyName] === key)).filter( key => key);
                                resolve(ordered);
                            }
                        });
                    })
                );
            }

            Promise.all(promises).then(values => {
                resolveItems(flatten(values));
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

    updateDataWithExpression(key: string, Item: Object, ConditionExpression: string, ExpressionAttributeValues: Object): Promise<any> {
        const params = {
            TableName: this.table,
            Key:{
                [this.keyName] : key
            },
            Item,
            ExpressionAttributeValues,
            ConditionExpression,
            ReturnValues: "UPDATED_NEW"
        };
        return new Promise( (resolve, reject) => {
            Connection.getInstance().update(
                params,
                (err, data) => err ? reject(err) : resolve(data)
            );
        });
    }

    searchData(query: Object): Promise<any> {
        return new Promise((resolve, reject) => resolve(null));
    }

    deleteItem(key: string): Promise<any> {
        const params = {
            TableName: this.table,
            Key: {}
        };
        params.Key[this.keyName] = key;

        return new Promise((resolve, reject) => {
            Connection.getInstance().delete(params, (err, data) => {
                if (err) reject(new NotFoundError(err));
                else resolve(data);
            });
        })
    }
}
