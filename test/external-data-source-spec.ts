import {DataSourceManager} from "../src/data_source/base/DataSourceManager";
import * as sinon from "sinon";
import {expect} from "chai";
import {DynamoDB} from "aws-sdk";
import {itemMock} from "./mocks/itemMock";
import * as restler from "restler";
import {NotAcceptableError, ServiceUnavailableError} from "restify";
import {ExternalDataSource} from "../src/data_source/ExternalDataSource";
import * as nock from "nock";
import DocumentClient = DynamoDB.DocumentClient;

const external_sources = {
    "DM": {
        "url": "http://dummy.url.com.ar/media-api/"
    },
};


describe("ExternalDataSource Test", function () {

    let externalSource : ExternalDataSource = null;

    beforeEach(() => {
        externalSource = new ExternalDataSource(external_sources);
    })
    it("Should get an external source", (done: Function) => {
        let key = "DM-1234";

        nock(external_sources["DM"].url)
            .get(/$/)
            .reply(200, () => {
                return itemMock;
            });

        let manager: DataSourceManager = new DataSourceManager(externalSource);
        manager.getData(key).then((data) => {
            expect(data).to.deep.equal(itemMock);
            done();
        });
    });

    it("Should return NotAcceptableError when trying to get an invalid External Source", (done: Function) => {
        let key = "INVALIDEXTERNAL-1234";

        // stub http request
        let requestStub = sinon.stub(restler, "get").returns({
            on: sinon.stub().yields(itemMock)
        });

        let manager: DataSourceManager = new DataSourceManager(externalSource);
        manager.getData(key).catch((err) => {
            expect(err).to.be.an.instanceof(NotAcceptableError);
            requestStub.restore();
            done();
        });
    });

    it("Should return ServiceUnavailableError", (done: Function) => {
        let key = "DM-876543";

        // stub http request
        let requestStub = sinon.stub(restler, "get").returns({
            on: sinon.stub().yields(new Error("Service Unavailable"))
        });

        let manager: DataSourceManager = new DataSourceManager(externalSource);
        manager.getData(key).catch((err) => {
            expect(err).to.be.an.instanceof(ServiceUnavailableError);
            requestStub.restore();
            done();
        });
    });

    it("Should return Resource URL", () => {
        let resource_url = externalSource.getResourceUrlOrThrow("DM-765432345");
        expect(resource_url).to.be.equal(external_sources["DM"].url + "765432345.json");
    });
});