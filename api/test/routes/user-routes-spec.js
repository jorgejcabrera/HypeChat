'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var app = require('../../src/app');
var { Auth, User } = require('../../src/models');

chai.use(chaiHttp);

describe('User Routes Test', () => {
  before(() => {
    sinon.stub(User, 'findOne');
    sinon.stub(User, 'findByPk');
    sinon.stub(User, 'create');
    sinon.stub(Auth, 'create');
  });

  beforeEach(() => {
    sinon.resetHistory();
  });

  after(() => {
    sinon.restore();
  });

  var userData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'valid@email.com',
    password: 'invalidPassword',
  };

  describe('Create', () => {
    it('should return invalid when email is already used', async() => {
      User.findOne.returns({
        id: 1,
        email: 'some@email.com',
        password: 'hashedPassword',
      });

      var res = await chai.request(app)
        .post('/users')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'some@email.com',
          password: 'somePassword',
        });

      chai.assert.strictEqual(
        res.status,
        400,
        'Status was not 400'
      );
      chai.assert.deepEqual(
        res.body,
        { status: 'error', type: 'userAlreadyExists' },
        'Response was not what was expected'
      );
    });

    it('should return ok when all info is valid', async() => {
      User.findOne.returns(null);
      User.create.returnsArg(0);
      Auth.create.returnsArg(0);


      var res = await chai.request(app)
        .post('/users')
        .send(userData);

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

  describe('Retrieve', () => {
    it('should return invalid when user does not exist', async() => {
      User.findByPk.returns(null);

      var res = await chai.request(app).get('/users/1');

      chai.assert.strictEqual(
        res.status,
        404,
        'Status was not 404'
      );
    });

    it('should return ok when user exists', async() => {
      User.findByPk.returns(userData);

      var res = await chai.request(app).get('/users/1');

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );
      chai.assert.deepEqual(
        res.body,
        userData,
        'Response was not what was expected'
      );
    });
  });
});
