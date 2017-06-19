import {DataSource} from "./base/DataSource";
import {Connection} from "./dynamo/Connection";
import {InternalServerError, NotFoundError} from "restify";
import * as config from "config";

export class DynamoDataSource implements DataSource {

    private table: string = config.get<string>("aws.dynamodb.tableName");

    getData(key: string, fields?: string): Promise<any> {
        const params = {
            TableName: this.table,
            Key: {
                "articleId": key
            }
        };

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
                    resolve({"articleId": key});
                }
            });
        });
    }

    getItems(keys: Array<string>, fields?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let items = keys.map(
                id => this.getData(id, fields).then((data) => {
                        return data;
                    }
                ).catch((err) => {
                    reject(new InternalServerError("Unable to get items, error", err));
                })
            );
            Promise.all(items).then(function (articles) {
                resolve(articles.filter(Boolean));
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
}