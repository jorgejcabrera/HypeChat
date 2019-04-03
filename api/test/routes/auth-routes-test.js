'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var app = require('../../src/app');

var { Auth, User } = require('../../src/models');
var { bcrypt } = require('../../src/config/dependencies');

chai.use(chaiHttp);

describe('Auth Routes Test', () => {
  before(() => {
    sinon.stub(User, 'findOne');
    sinon.stub(Auth, 'create');
    sinon.stub(Auth, 'destroy');
    sinon.stub(bcrypt, 'compare');
  });

  beforeEach(() => {
    User.findOne.resetHistory();
    Auth.create.resetHistory();
    Auth.destroy.resetHistory();
    bcrypt.compare.resetHistory();
  });

  after(() => {
    User.findOne.restore();
    Auth.create.restore();
    Auth.destroy.restore();
    bcrypt.compare.restore();
  });

  describe('Login', () => {
    it('should return invalid when user is invalid', async() => {
      User.findOne.returns(null);

      var res = await chai.request(app)
        .post('/login')
        .send({
          email: 'invalid@email.com',
          password: 'somePassword',
        });

      chai.assert.strictEqual(
        res.status,
        400,
        'Status was not 400'
      );
      chai.assert.deepEqual(
        res.body,
        { status: 'error', type: 'invalidCredentials' },
        'Response was not what was expected'
      );
    });

    it('should return invalid when password is invalid', async() => {
      User.findOne.returns({id: 1, password: 'hashedPassword'});
      bcrypt.compare.returns(false);

      var res = await chai.request(app)
        .post('/login')
        .send({
          email: 'valid@email.com',
          password: 'invalidPassword',
        });

      chai.assert.strictEqual(
        res.status,
        400,
        'Status was not 400'
      );
      chai.assert.deepEqual(
        res.body,
        { status: 'error', type: 'invalidCredentials' },
        'Response was not what was expected'
      );
    });

    it('should return ok when credentials are valid', async() => {
      User.findOne.returns({id: 1, password: 'hashedPassword'});
      Auth.create.returnsArg(0);
      Auth.destroy.returns(null);
      bcrypt.compare.returns(true);


      var res = await chai.request(app)
        .post('/login')
        .send({
          email: 'valid@email.com',
          password: 'somePassword',
        });

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );
      chai.assert.isObject(
        res.body,
        'Response was not what was expected'
      );
    });
  });
});
