import * as chai from "chai";
import * as sinon from "sinon";
import {UnprocessableEntityError} from "restify";
import {itemMock} from "./mocks/itemMock";
import {mockLoader} from "./mocks/mockHelper";
import {server as server} from "../examples/basic/index";
import * as config from "config";
import {Model} from "../examples/basic/itemModel";
import ItemService from "../examples/basic/current/ItemService";
import {server as dummy_server} from "./mocks/DummyServer";
import chaiHttp = require("chai-http");

let should = chai.should();

chai.use(chaiHttp);

describe("Services validation test", () => {

    let mockedBody: Model.Item;
    let ItemServiceGetDataStub;
    let ItemServicePutDataStub;

    beforeEach(() => {
        mockedBody = mockLoader(itemMock);
        ItemServiceGetDataStub = sinon.stub(ItemService.controller, "getItem").callsFake(function (key: string) {
            return new Promise((resolve, reject) => {
                resolve(mockedBody);
            });
        });
        ItemServicePutDataStub = sinon.stub(ItemService.controller, "createItem").callsFake(function (key: string) {
            return new Promise((resolve, reject) => {
                resolve(mockedBody);
            });
        });
    });

    afterEach(() => {
        mockedBody = null;
        ItemServiceGetDataStub.restore();
        ItemServicePutDataStub.restore();
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

    it("GET /ping Should return pong (200)", (done) => {
        chai.request(server)
            .get("/ping")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("string");
                chai.expect(res.body).to.equal("pong");
                done();
            });
    });

    it("Should validate numerics ids", (done) => {
        chai.request(dummy_server)
            .get("/dummy/1234")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it("Should validate invalid numeric ids", (done) => {
        chai.request(dummy_server)
            .get("/dummy/ab-1234")
            .end((err, res) => {
                res.should.have.status(406);
                res.body.should.be.a("object");
                res.body.should.have.property("code").eql("NotAcceptableError");
                done();
            });
    });
});
