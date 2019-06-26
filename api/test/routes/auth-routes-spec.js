'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var TestUtils = require('../test-utils');
var app = require('../../src/app');

chai.use(chaiHttp);

describe('Auth Routes Test', () => {

  before(async() => {
    TestUtils.mockFirebase();
  });

  beforeEach(async() => {
    await TestUtils.clearDB();
  });

  after(() => {
    TestUtils.restore();
  });

  describe('Register', () => {
    it('should return invalid when email is already used', async() => {
      await TestUtils.userFactory(
        {email: 'some@email.com', password: 'myValidPwd.123'}
      );

      var res = await chai.request(app)
        .post('/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'some@email.com',
          password: 'somePas1.ssword',
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
      var res = await chai.request(app)
        .post('/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'valid@email.com',
          password: 'invalidP1.assword',
          isAdmin: false,
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

  describe('Login', () => {
    it('should return invalid when user is invalid', async() => {
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

    /*
    it('should return invalid when password is invalid', async() => {
      await TestUtils.userFactory(
        {
          email: 'valid@email.com',
          password: 'myPassword.123',
          status: 'ACTIVE',
        });

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
    });*/

    it('should return ok when credentials are valid', async() => {
      await TestUtils.userFactory({
        email: 'valid@email.com',
        password: 'validPassword1.',
      });

      var res = await chai.request(app)
        .post('/login')
        .send({
          email: 'valid@email.com',
          password: 'validPassword1.',
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
