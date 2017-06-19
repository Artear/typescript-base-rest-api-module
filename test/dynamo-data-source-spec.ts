import {DataSourceManager} from "../src/data_source/base/DataSourceManager";
import * as sinon from "sinon";
import {expect} from "chai";
import {Connection} from "../src/data_source/dynamo/Connection";
import {DynamoDataSource} from "../src/data_source/DynamoDataSource";
import {DynamoDB} from "aws-sdk";
import DocumentClient = DynamoDB.DocumentClient;

describe("DynamoDataSource Test", function () {

    let connectionStub;
    let documentClientStub;

    after(() => {
        connectionStub.restore();
        documentClientStub.restore();
    });

    it("Should receive fields to filter on DynamoDataSource", (done: Function) => {
        const key = "some_key";
        const fields = "itemId";
        const documentClient = new DocumentClient();

        connectionStub = sinon.stub(Connection, "getInstance", function () {
            return documentClient;
        });

        documentClientStub = sinon.stub(documentClient, "get", function (params: any, next: (err: any, data: any) => void) {
            expect(params["ProjectionExpression"]).to.be.equal(fields);
            done();
        });

        let manager: DataSourceManager = new DataSourceManager(new DynamoDataSource());
        manager.getData(key, fields).then();
    });
});