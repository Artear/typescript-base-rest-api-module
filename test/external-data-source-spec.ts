import {DataSourceManager} from "../src/data_source/base/DataSourceManager";
import * as sinon from "sinon";
import {expect} from "chai";
import {DynamoDB} from "aws-sdk";
import {itemMock} from "./mocks/itemMock";
import * as restler from "restler";
import {BadRequestError, InternalServerError, NotAcceptableError, ServiceUnavailableError} from "restify";
import {ExternalDataSource} from "../src/data_source/ExternalDataSource";
import * as nock from "nock";
import DocumentClient = DynamoDB.DocumentClient;
import {ItemExternalUrlBuilder} from "../examples/basic/latest/ItemExternalUrlBuilder";
import * as config from "config";

describe("ExternalDataSource Test", function () {

    let externalSource: ExternalDataSource = null;
    let urlBuilder: ItemExternalUrlBuilder = null;
    beforeEach(() => {
        urlBuilder = new ItemExternalUrlBuilder();
        externalSource = new ExternalDataSource(urlBuilder);
    });

    it("Should get an external source", (done: Function) => {
        let key = "DM-1234";

        nock(urlBuilder.getResourceUrlOrThrow(key))
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

    it("Should get an array of external source", (done: Function) => {
        itemMock.itemId = "DM-1234";
        let keys = [itemMock.itemId, itemMock.itemId];

        nock(urlBuilder.getMultiGetResourceUrl(keys))
            .get(/$/)
            .reply(200, () => {
                return [itemMock, itemMock];
            });

        let manager: DataSourceManager = new DataSourceManager(externalSource);
        manager.getItems(keys).then((data) => {
            expect(data).to.deep.equal([itemMock, itemMock]);
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
        let resource_url = urlBuilder.getResourceUrlOrThrow("DM-765432345");
        expect(resource_url).to.be.equal("http://dummy.url.com.ar/media-api/765432345.json");
    });

    it("Shouldn't update data to a resource URL", (done) => {
        externalSource.updateData("dummy_key", {}).catch((err) => {
            expect(err).to.be.an.instanceof(InternalServerError);
            done();
        });
    });

    it("Should return ServiceUnavailableError on fail", (done: Function) => {
        let key = "DM-1234";
        nock(urlBuilder.getResourceUrlOrThrow(key))
            .get(/$/)
            .replyWithError({'statusMessage': 'something awful happened', 'code': 500});
        externalSource.getData(key).catch((err) => {
            expect(err).to.be.an.instanceof(ServiceUnavailableError);
            done();
        });
    });

    it("Should return BadRequestError on error", (done: Function) => {
        let key = "DM-1234";
        nock(urlBuilder.getResourceUrlOrThrow(key))
            .get(/$/)
            .reply(500, () => ({'statusMessage': 'something awful happened', 'code': 500})
            );
        externalSource.getData(key).catch((err) => {
            expect(err).to.be.an.instanceof(BadRequestError);
            done();
        });
    });

    it("Should return ServiceUnavailableError on timeout", (done: Function) => {
        let key = "DM-1234";
        nock(urlBuilder.getResourceUrlOrThrow(key))
            .get(/$/)
            .delayConnection(config.get<number>("server.options.timeout") + 1000);
        externalSource.getData(key).catch((err) => {
            expect(err).to.be.an.instanceof(ServiceUnavailableError);
            done();
        });
    });
});