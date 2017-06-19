import * as chai from "chai";
import * as sinon from "sinon";
import {UnprocessableEntityError} from "restify";
import {itemMock} from "./mocks/itemMock";
import {mockLoader} from "./mocks/mockHelper";
import {server as server} from "../examples/basic/index";
import * as config from "config";
import chaiHttp = require("chai-http");
import {Model} from "../examples/basic/itemModel";
import ItemService from "../examples/basic/ItemService";

let should = chai.should();

chai.use(chaiHttp);

describe("RestifyValidation Test", () => {

    let mockedBody: Model.Item;
    let ArticleServiceGetDataStub;
    let ArticleServicePutDataStub;

    beforeEach(() => {
        mockedBody = mockLoader(itemMock);
        ArticleServiceGetDataStub = sinon.stub(ItemService.controller, "getItem", function (key: string) {
            return new Promise((resolve, reject) => {
                resolve(mockedBody);
            });
        });
        ArticleServicePutDataStub = sinon.stub(ItemService.controller, "createItem", function (key: string) {
            return new Promise((resolve, reject) => {
                resolve(mockedBody);
            });
        });
    });

    afterEach(() => {
        mockedBody = null;
        ArticleServiceGetDataStub.restore();
        ArticleServicePutDataStub.restore();
    });

    it("Should return http status UnprocessableEntityError (code 422) because 'itemId' has an invalid format", (done) => {
        mockedBody.itemId = "TN-d11bc1fc-de56-11e6-bf01-fe55135034f3!";
        chai.request(server)
            .post("/items")
            .set("Authorization", config.get<string>("security.token"))
            .send(mockedBody)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a("object");
                res.body.should.have.property("code").eql("UnprocessableEntityError");
                res.body.should.have.property("message").eql("\"itemId\" with value \"TN-d11bc1fc-de56-11e6-bf01-fe55135034f3&#x21;\" fails to match the required pattern: /^[a-z0-9\\-]+$/i");
                done();
            });
    });


    it("Should return http status UnprocessableEntityError (code 422) because 'createdISO' has an invalid format", (done) => {
        // JSON with invalid "createdISO" property.
        mockedBody.content.createdISO = "2017-11-03 13:18:05";

        chai.request(server)
            .post("/items")
            .set("Authorization", config.get<string>("security.token"))
            .send(mockedBody)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a("object");
                res.body.should.have.property("code").eql("UnprocessableEntityError");
                done();
            });
    });

    it("Should return http status UnprocessableEntityError (code 422) because 'changedISO' has an invalid format", (done) => {
        // JSON with invalid "changedISO" property.
        mockedBody.content.changedISO = "2017-11-03 13:18:05";
        chai.request(server)
            .post("/items")
            .set("Authorization", config.get<string>("security.token"))
            .send(mockedBody)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a("object");
                res.body.should.have.property("code").eql("UnprocessableEntityError");
                done();
            });
    });

    it("Should return http status UnprocessableEntityError (code 422) because 'title' is not an Object", (done) => {
        // JSON with invalid "title" property.
        mockedBody.content.title = null;
        chai.request(server)
            .post("/items")
            .set("Authorization", config.get<string>("security.token"))
            .send(mockedBody)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a("object");
                res.body.should.have.property("code").eql("UnprocessableEntityError");
                res.body.should.have.property("message").eql("\"title\" must be an object");
                done();
            });
    });

    it("Should return http status UnprocessableEntityError (code 422) because 'body' is not Array", (done) => {
        // JSON with invalid "body" property.
        mockedBody.content.body = null;

        chai.request(server)
            .post("/items")
            .set("Authorization", config.get<string>("security.token"))
            .send(mockedBody)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a("object");
                res.body.should.have.property("code").eql("UnprocessableEntityError");
                res.body.should.have.property("message").eql("\"body\" must be an array");
                done();
            });
    });


    it("Should return http status UnprocessableEntityError (code 422) because 'tagList' is not Array of Strings", (done) => {
        // JSON with invalid "tagList" property.
        mockedBody.content.tagList = null;

        chai.request(server)
            .post("/items")
            .set("Authorization", config.get<string>("security.token"))
            .send(mockedBody)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a("object");
                res.body.should.have.property("code").eql("UnprocessableEntityError");
                res.body.should.have.property("message").eql("\"tagList\" must be an array");
                done();
            });
    });


    it("Should return http status UnprocessableEntityError (code 422) because 'content' property is not defined", (done) => {
        // invalid JSON without "content" property.
        delete mockedBody.content;

        chai.request(server)
            .post("/items")
            .set("Authorization", config.get<string>("security.token"))
            .send(mockedBody)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a("object");
                res.body.should.have.property("code").eql("UnprocessableEntityError");
                res.body.should.have.property("message").eql("\"content\" is required");
                done();
            });
    });

});
