'use strict';

var chai = require('chai');
var sinon = require('sinon');
var userController = require('../../src/controllers/user-controller');
var { Auth, User } = require('../../src/models');

describe('User Controller Test', () => {
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
    sinon.stub(User, 'findByPk');
    sinon.stub(User, 'create');
    sinon.stub(Auth, 'create');
  });

  beforeEach(() => {
    res.status.resetHistory();
    res.send.resetHistory();
    res.json.resetHistory();

    User.findOne.resetHistory();
    User.findByPk.resetHistory();
    User.create.resetHistory();
    Auth.create.resetHistory();
  });

  after(() => {
    User.findOne.restore();
    User.findByPk.restore();
    User.create.restore();
    Auth.create.restore();
  });

  describe('Create', () => {
    it('should return invalid when email is already used', async() => {
      User.findOne.returns({
        id: 1,
        email: 'some@email.com',
        password: 'hashedPassword',
      });

      var req = {
        body: {
          firstName: 'Test',
          lastName: 'User',
          email: 'some@email.com',
          password: 'somePassword',
        },
      };

      await userController.create(req, res);

      chai.assert(res.status.calledWith(400), 'Status was not 400');
      chai.assert(res.send.calledOnce, 'Error response was not sent');
      chai.assert(res.json.notCalled, 'Success response was sent');
    });

    it('should return ok when all info is valid', async() => {
      User.findOne.returns(null);
      User.create.returnsArg(0);
      Auth.create.returnsArg(0);

      var req = {
        body: {
          firstName: 'Test',
          lastName: 'User',
          email: 'valid@email.com',
          password: 'invalidPassword',
          toJSON: () => this,
        },
      };

      await userController.create(req, res);

      chai.assert(res.status.notCalled, 'Status was not 200');
      chai.assert(res.send.notCalled, 'Error response was sent');
      chai.assert(res.json.calledOnce, 'Success response was not sent');
    });
  });

  describe('Retrieve', () => {
    it('should return invalid user does not exist', async() => {
      User.findByPk.returns(null);

      var req = {
        params: { id: 1 },
      };

      await userController.retrieve(req, res);

      chai.assert(res.status.calledWith(404), 'Status was not 404');
      chai.assert(res.send.calledOnce, 'Error response was not sent');
      chai.assert(res.json.notCalled, 'Success response was sent');
    });

    it('should return ok when user exists', async() => {
      User.findByPk.returns({
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'valid@email.com',
        password: 'invalidPassword',
        toJSON: () => this,
      });

      var req = {
        params: { id: 1 },
      };

      await userController.retrieve(req, res);

      chai.assert(res.status.notCalled, 'Status was not 200');
      chai.assert(res.send.notCalled, 'Error response was sent');
      chai.assert(res.json.calledOnce, 'Success response was not sent');
    });
  });
});
