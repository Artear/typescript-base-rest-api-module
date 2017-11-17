import * as sinon from "sinon";
import * as chai from "chai";
import {ElasticSearchDataSource} from "../src/data_source/elastic/ElasticSearchDatasource";
import {ElasticSearchConnection} from "../src/data_source/elastic/ElasticSearchConnection";
import {elasticResponseMock} from "./mocks/elasticSearchResponseMock";
import {elasticSearchGetMock} from "./mocks/elasticSearchGetMock";
import {mockLoader} from "./mocks/mockHelper";


describe("ElasticSearchDataSource Test", function () {

    let dataSource: ElasticSearchDataSource;
    let mockedBody;
    let connectStub;

    beforeEach(() => {
        mockedBody = mockLoader(elasticResponseMock);
        dataSource = new ElasticSearchDataSource();
        connectStub = sinon.stub(ElasticSearchConnection, "getInstance").callsFake(function () {
            return {
                search: (params, callback) => callback(null, mockedBody)
            }
        });
    });

    afterEach(() => {
        connectStub.restore();
    });

    it("Should return search resultset from elastic text search", (done: Function) => {
        dataSource.searchData("some text").then(function (data) {
            chai.expect(data).to.equal(mockedBody);
            done();
        });
    });

    it("Should return error ECONNREFUSED from elastic if elasticsearch engine is not available", (done: Function) => {
        connectStub.restore();
        connectStub = sinon.stub(ElasticSearchConnection, "getInstance").callsFake(function () {
            return {
                search: (params, callback) => {
                    throw(new Error("ECONNREFUSED"));
                }
            }
        });
        dataSource.searchData({q: "some text"}).catch(err => {
            chai.expect(err).to.be.an.instanceof(Error);
            done();
        });
    });


    it("Should return one item from elastic get ", (done: Function) => {
        connectStub.restore();
        connectStub = sinon.stub(ElasticSearchConnection, "getInstance").callsFake(function () {
            return {
                get: (params, callback) => {
                    callback(null, elasticSearchGetMock);
                }
            }
        });
        dataSource.getData("TN-1234").then(err => {
            chai.expect(err).to.be.equal(elasticSearchGetMock);
            done();
        });
    });
});