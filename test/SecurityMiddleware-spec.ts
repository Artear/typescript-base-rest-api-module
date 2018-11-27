import * as sinon from "sinon";
import {expect} from "chai";
import {NotAuthorizedError} from "restify-errors";
import {shouldValidateMethod, tokenIsValid} from "../src/server/SecurityMiddleware";
const SecurityModule = require("../src/server/SecurityMiddleware");

describe("Function test: withSecurity", () => {
  let sandbox;

  beforeEach(function () {
      sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
      sandbox.restore();
  });

  it("Should call next handler in chain if token is valid", async(done) => {
    sandbox.stub(SecurityModule, "shouldValidateMethod").callsFake( method => true );
    sandbox.stub(SecurityModule, "tokenIsValid").callsFake( token => true );

    const fakeMiddleware = sinon.stub();
    const req = {method: "GET"};
    const res = {headers: {authorization: "token"}};
    //const fakeMiddleware = sinon.stub(obj, "req");

    const stub = sinon.stub();
    stub.returns(fakeMiddleware);

    await SecurityModule.withSecurity("token")(stub)();
    await expect(fakeMiddleware.calledOnce).to.equal(true);
    await done();
  });

  /*it("Should call next handler in chain if there is no need to validate method", done => {
    sandbox.stub(SecurityModule, "shouldValidateMethod").callsFake( method => false );
    SecurityModule.withSecurity("token")(done());
  });

  it("Should call send with Error is token is not valid", done => {
    sandbox.stub(SecurityModule, "shouldValidateMethod").callsFake( method => true );
    sandbox.stub(SecurityModule, "tokenIsValid").callsFake( token => false );
    expect(SecurityModule.withSecurity("token")(done())).to.equal(NotAuthorizedError);
  });*/
});

/*describe("Function test: shouldValidateMethod", () => {
  it("Should require validation for some methods.", () => {
    expect(shouldValidateMethod("GET")).to.equal(true);
    expect(shouldValidateMethod("POST")).to.equal(true);
    expect(shouldValidateMethod("PUT")).to.equal(true);
    expect(shouldValidateMethod("PATCH")).to.equal(true);
    expect(shouldValidateMethod("DELETE")).to.equal(true);
  });

  it("Should not require validation for some methods.", () => {
    expect(shouldValidateMethod("OPTIONS")).to.equal(false);
    expect(shouldValidateMethod("HEAD")).to.equal(false);
    expect(shouldValidateMethod("CONNECT")).to.equal(false);
  });

});

describe("Function test: tokenIsValid", () => {
  const token = "AHSDBCHDSMSADKLQWOIEQWMNDSADLKJASDP";

  it("Should validate correct token", () => {
    expect(tokenIsValid(token, token)).to.equal(true);
  });

  it("Should not validate incorrect token", () => {
    const invalidAuth = "invalidAuthToken12321";
    expect(tokenIsValid(token, invalidAuth)).to.equal(false);
  });

  it("Should not validate empty token", () => {
    expect(tokenIsValid(token, "")).to.equal(false);
  });

});*/
