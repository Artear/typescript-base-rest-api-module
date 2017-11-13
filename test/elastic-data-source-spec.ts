import * as sinon from "sinon";
import {expect} from "chai";
import {Connection} from "../src/data_source/dynamo/Connection";
import {ElasticSearchDataSource} from "../src/data_source/ElasticSearchDatasource";
import {DynamoDB} from "aws-sdk";
import DocumentClient = DynamoDB.DocumentClient;
import {itemMock} from "./mocks/itemMock";
import {mockLoader} from "./mocks/mockHelper";
import * as chai from "chai";


describe("ElasticSearchDataSource Test", function () {

    const connectionStub = sinon.stub(Connection, "getInstance", function () {
        return documentClient;
    });

    let dataSource: ElasticSearchDataSource;
    let mockedBody;
    let documentClient;

    beforeEach(() => {
        mockedBody = mockLoader(itemMock);
        dataSource = new ElasticSearchDataSource();
    });

    after(() => {
    });

    it("Updated Should return item id updated", (done: Function) => {

    });
});