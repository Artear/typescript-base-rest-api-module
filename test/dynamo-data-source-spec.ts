import * as sinon from "sinon";
import * as chai from "chai";
import {expect} from "chai";
import {Connection} from "../src/data_source/dynamo/Connection";
import {DynamoDataSource} from "../src/data_source/DynamoDataSource";
import {DynamoDB} from "aws-sdk";
import {itemMock} from "./mocks/itemMock";
import {mockLoader} from "./mocks/mockHelper";
import DocumentClient = DynamoDB.DocumentClient;


describe("DynamoDataSource Test", function () {

    let documentClientStub;
    let documentPutClientStub;
    let dataSource: DynamoDataSource;
    let mockedBody;
    let documentClient;
    const connectionStub = sinon.stub(Connection, "getInstance", function () {
        return documentClient;
    });

    beforeEach(() => {
        mockedBody = mockLoader(itemMock);
        dataSource = new DynamoDataSource();
        documentClient = new DocumentClient();
        documentClientStub = sinon.stub(documentClient, "get", function (params, callback) {
            callback(null, {Item: mockedBody});
        });

        documentPutClientStub = sinon.stub(documentClient, "put", function (params, callback) {
            callback(null, mockedBody);
        });

    });

    after(() => {
        documentClientStub.restore();
        documentPutClientStub.restore();
    });

    it("Should receive fields to filter on DynamoDataSource", (done: Function) => {
        const key = "some_key";
        const fields = "itemId";
        documentClientStub.restore();
        documentClientStub = sinon.stub(documentClient, "get",
            function (params: any, next: (err: any, data: any) => void) {
                expect(params["ProjectionExpression"]).to.be.equal(fields);
                done();
            });

        dataSource.getData(key, fields).then();
    });

    it("Should get items by id", (done: Function) => {
        dataSource.getItems([mockedBody.itemId]).then(function (data) {
            chai.expect(data[0]).to.equal(mockedBody);
            done();
        });
    });

    it("PutData Should return item id inserted", (done: Function) => {
        dataSource = new DynamoDataSource();
        dataSource.putData(mockedBody.itemId, mockedBody).then(function (data) {
            chai.expect(data.itemId).to.equal(mockedBody.itemId);
            done();
        });
    });

    it("Updated Should return item id updated", (done: Function) => {
        dataSource = new DynamoDataSource();
        mockedBody.content.title.main = "dummy title";
        dataSource.updateData(mockedBody.itemId, mockedBody).then(function (data) {
            chai.expect(data.itemId).to.equal(mockedBody.itemId);
            done();
        });
    });
});