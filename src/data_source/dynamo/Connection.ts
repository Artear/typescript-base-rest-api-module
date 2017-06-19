import * as AWS from "aws-sdk";
import {DynamoDB} from "aws-sdk";
import * as config from "config";
import DocumentClient = DynamoDB.DocumentClient;

AWS.config.dynamodb = {
    region: config.get<string>("aws.region"),
    endpoint: config.get<string>("aws.dynamodb.endpoint"),
    accessKeyId: config.get<string>("aws.accessKeyId"),
    secretAccessKey: config.get<string>("aws.secretAccessKey"),
    maxRetries: config.get<number>("aws.dynamodb.maxRetries")
};

AWS.config.httpOptions.timeout = parseInt(config.get<string>("aws.dynamodb.timeout"));
AWS.config.maxRetries = parseInt(config.get<string>("aws.dynamodb.maxRetries"));

export class Connection {

    private static instance: DocumentClient = new AWS.DynamoDB.DocumentClient();

    private Connection(): void {
    }

    public static getInstance(): DocumentClient {
        return Connection.instance;
    }
}