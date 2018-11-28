import * as sinon from "sinon";
import {expect} from "chai";
import {NotAuthorizedError} from "restify-errors";
import {tokenIsValid} from "../src/server/SecurityMiddleware";
const SecurityModule = require("../src/server/SecurityMiddleware");

describe("Function test: withSecurity", () => {
  let sandbox;

  beforeEach(function () {
      sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
      sandbox.restore();
  });

  it("Should call next handler in chain if token is valid", done => {
    sandbox.stub(SecurityModule, "tokenIsValid").callsFake( token => true );

    const req = { headers: {}};
    const res = {};

    const fakeMiddleware = sinon.stub();
    const stub = sinon.stub();
    stub.returns(fakeMiddleware);

    SecurityModule.withSecurity("token")(stub)(req, res);
    expect(stub.calledOnce).to.equal(true);
    done();
  });

  it("Should call send with Error if token is not valid", done => {
    sandbox.stub(SecurityModule, "tokenIsValid").callsFake( token => false );

    const req = { headers: {}};
    const res = { send: sinon.stub()};

    const fakeMiddleware = sinon.stub();
    const stub = sinon.stub();
    stub.returns(fakeMiddleware);

    SecurityModule.withSecurity("token")(stub)(req, res);

    expect(res.send.calledOnce).to.equal(true);

    const error = res.send.firstCall.args[0];

    expect(error).to.be.instanceof(NotAuthorizedError);
    expect(error.message).to.equal("invalid Token");

    done();
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

});
