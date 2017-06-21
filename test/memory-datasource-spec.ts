import * as chai from "chai";
import {MemoryDataSource} from "../src/data_source/MemoryDataSource";
import {Model} from "../examples/basic/itemModel";
import {mockLoader} from "./mocks/mockHelper";
import {itemMock} from "./mocks/itemMock";

let should = chai.should();

describe("MemoryDatasource Test", function () {
    let datasource;
    let mockedBody: Model.Item;

    beforeEach(() => {
        mockedBody = mockLoader(itemMock);
        datasource = new MemoryDataSource();
    });

    it("Should return data after insert new item", function (done: Function) {
        datasource.putData(mockedBody.itemId, mockedBody).then(function(data) {
            chai.expect(data).to.equal(mockedBody);
            done()
        });
    });

    it("Should find data by id", function (done: Function) {
        datasource.putData(mockedBody.itemId, mockedBody).then(function(data) {
            datasource.getData(mockedBody.itemId).then(function(data) {
                chai.expect(data).to.equal(mockedBody);
                done()
            });
        });
    });

    it("Should find a set of data by id", function (done: Function) {
        datasource.putData(mockedBody.itemId, mockedBody).then(function(data) {
            datasource.getItems([mockedBody.itemId]).then(function(data) {
                chai.expect(data[0]).to.equal(mockedBody);
                done()
            });
        });
    });
});