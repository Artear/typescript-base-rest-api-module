import * as sinon from "sinon";
import * as chai from "chai";
import * as config from "config";
const SecurityModule = require('../src/server/SecurityMiddleware');

const mockRequest = {
  method: 'POST',
  route: {
    path: '/new_path'
  },
  headers:
  {
    authorization: 'ABCD'
  }
};

describe('Function test: securityMiddleware', () => {

  it('Should call next handler in chain if token is valid', done => {
    const shouldValidateMethodStub = sinon.stub(SecurityModule, 'shouldValidateMethod').callsFake( method => true );
    const tokenIsValidStub = sinon.stub(SecurityModule, 'tokenIsValid').callsFake( token => true );
    SecurityModule.securityMiddleware( mockRequest, { send : () => {} }, () => done() );
    shouldValidateMethodStub.restore();
    tokenIsValidStub.restore();
  })

  it('Should call next handler in chain if there is no need to validate method', done => {
    const shouldValidateMethodStub = sinon.stub(SecurityModule, 'shouldValidateMethod').callsFake( method => false );
    SecurityModule.securityMiddleware( mockRequest, { send : () => {} }, () => done() );
    shouldValidateMethodStub.restore();
  })

  it('Should call next handler in chain if there is no need to validate path', done => {
    const shouldValidateMethodStub = sinon.stub(SecurityModule, 'shouldValidatePath').callsFake( path => false );
    SecurityModule.securityMiddleware( mockRequest, { send : () => {} }, () => done() );
    shouldValidateMethodStub.restore();
  })

  it('Should call send with Error is token is not valid', done => {
    const shouldValidateMethodStub = sinon.stub(SecurityModule, 'shouldValidateMethod').callsFake( method => true );
    const tokenIsValidStub = sinon.stub(SecurityModule, 'tokenIsValid').callsFake( token => false );
    SecurityModule.securityMiddleware( mockRequest, { send: () => done() }, () => {} );
    shouldValidateMethodStub.restore();
    tokenIsValidStub.restore();
  })

})

describe('Function test: shouldValidateMethod', () => {
  it('Should require validation for some methods.', () => {
    chai.expect(SecurityModule.shouldValidateMethod('GET')).to.equal(true);
    chai.expect(SecurityModule.shouldValidateMethod('POST')).to.equal(true);
    chai.expect(SecurityModule.shouldValidateMethod('PUT')).to.equal(true);
    chai.expect(SecurityModule.shouldValidateMethod('DELETE')).to.equal(true);
    chai.expect(SecurityModule.shouldValidateMethod('PATCH')).to.equal(true);
  });

  it('Should not require validation for some methods.', () => {
    chai.expect(SecurityModule.shouldValidateMethod('OPTIONS')).to.equal(false);
    chai.expect(SecurityModule.shouldValidateMethod('HEAD')).to.equal(false);
    chai.expect(SecurityModule.shouldValidateMethod('CONNECT')).to.equal(false);
  });

})


describe('Function test: shouldValidatePath', () => {
  it('Should require validation for some paths.', () => {
    chai.expect(SecurityModule.shouldValidatePath('/article')).to.equal(true);
    chai.expect(SecurityModule.shouldValidatePath('/media')).to.equal(true);
    chai.expect(SecurityModule.shouldValidatePath('/cover')).to.equal(true);
    chai.expect(SecurityModule.shouldValidatePath('/block')).to.equal(true);
  });

  it('Should not require validation for /ping path.', () => {
    chai.expect(SecurityModule.shouldValidatePath('/ping')).to.equal(false);
  });

})

describe('Function test: tokenIsValid', () => {
  console.log(config.get<string>("security.token"));
  it('Should validate correct token', () => {
    const someKey = 'AHSDBCHDSMSADKLQWOIEQWMNDSADLKJASDP';
    const configGetStub = sinon.stub(config, 'get').callsFake( key => key === 'security.token' ? someKey:'');
    chai.expect(SecurityModule.tokenIsValid(someKey)).to.equal(true);
    configGetStub.restore();
  })

  it('Should not validate incorrect token', () => {
    chai.expect(SecurityModule.tokenIsValid('ABCD')).to.equal(false);
    chai.expect(SecurityModule.tokenIsValid(' '+config.get<string>("security.token"))).to.equal(false);
  })

  it('Should not validate empty token', () => {
    chai.expect(SecurityModule.tokenIsValid('')).to.equal(false);
    chai.expect(SecurityModule.tokenIsValid([])).to.equal(false);
  })

})