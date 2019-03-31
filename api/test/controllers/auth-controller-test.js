'use strict';

var chai = require('chai');
var sinon = require('sinon');
var authController = require('../../src/controllers/auth-controller');
var { Auth, User } = require('../../src/models');
var { bcrypt } = require('../../src/config/dependencies');

describe('Auth Controller Test', () => {
  var res = {
    status: () => res,
    send: () => {},
    json: () => {},
  };

  before(() => {
    sinon.spy(res, 'status');
    sinon.spy(res, 'send');
    sinon.spy(res, 'json');

    sinon.stub(User, 'findOne');
    sinon.stub(Auth, 'create');
    sinon.stub(Auth, 'destroy');
    sinon.stub(bcrypt, 'compare');
  });

  beforeEach(() => {
    res.status.resetHistory();
    res.send.resetHistory();
    res.json.resetHistory();

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

      var req = {
        body: {
          email: 'invalid@email.com',
          password: 'somePassword',
        },
      };

      await authController.login(req, res);

      chai.assert(res.status.calledWith(400), 'Status was not 400');
      chai.assert(res.send.calledOnce, 'Error response was not sent');
      chai.assert(res.json.notCalled, 'Success response was sent');
    });

    it('should return invalid when password is invalid', async() => {
      User.findOne.returns({id: 1, password: 'hashedPassword'});
      bcrypt.compare.returns(false);

      var req = {
        body: {
          email: 'valid@email.com',
          password: 'invalidPassword',
        },
      };

      await authController.login(req, res);

      chai.assert(res.status.calledWith(400), 'Status was not 400');
      chai.assert(res.send.calledOnce, 'Error response was not sent');
      chai.assert(res.json.notCalled, 'Success response was sent');
    });

    it('should return ok when credentials are valid', async() => {
      User.findOne.returns({id: 1, password: 'hashedPassword'});
      Auth.create.returnsArg(0);
      Auth.destroy.returns(null);
      bcrypt.compare.returns(true);

      var req = {
        body: {
          email: 'valid@email.com',
          password: 'invalidPassword',
        },
      };

      await authController.login(req, res);

      chai.assert(res.status.notCalled, 'Status was not 200');
      chai.assert(res.send.notCalled, 'Error response was sent');
      chai.assert(res.json.calledOnce, 'Success response was not sent');
    });
  });
});
