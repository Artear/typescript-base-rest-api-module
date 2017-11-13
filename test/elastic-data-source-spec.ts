import * as sinon from "sinon";
import {expect} from "chai";
import * as Elasticsearch from "elasticsearch";
import {ElasticSearchDataSource} from "../src/data_source/elastic/ElasticSearchDatasource";
import {ElasticSearchConnection} from "../src/data_source/elastic/ElasticSearchConnection";
import {elasticResponseMock} from "./mocks/elasticSearchResponseMock";
import {mockLoader} from "./mocks/mockHelper";
import * as chai from "chai";


describe("ElasticSearchDataSource Test", function () {

    const connectionStub = sinon.stub(ElasticSearchConnection, "getInstance", function () {
        return Elasticsearch.Client;
    });

    let dataSource: ElasticSearchDataSource;
    let mockedBody;
    let documentClientStub;
    let clientStub: Elasticsearch.Client = new Elasticsearch.Client({});

    beforeEach(() => {
        mockedBody = mockLoader(elasticResponseMock);
        dataSource = new ElasticSearchDataSource();
        documentClientStub = sinon.stub(clientStub, "search", function(params, callback) {
            callback(null, mockedBody);
        });
    });

    after(() => {
        documentClientStub.restore();
    });

    it("Should return search resulset from elastic", (done: Function) => {
        dataSource.searchData({ q: "some text"}).then(function (data) {
            chai.expect(data).to.equal(mockedBody);
            done();
        });
    });
});