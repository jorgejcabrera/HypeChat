'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var TestUtils = require('../test-utils');
var app = require('../../src/app');

chai.use(chaiHttp);

describe('Auth Routes Test', () => {
  beforeEach(async() => {
    await TestUtils.clearDB();
  });

  after(() => {
    sinon.restore();
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

    it('should return invalid when password is invalid', async() => {
      await TestUtils.userFactory({email: 'valid@email.com'});

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
      await TestUtils.userFactory({
        email: 'valid@email.com',
        password: 'validPassword',
      });

      var res = await chai.request(app)
        .post('/login')
        .send({
          email: 'valid@email.com',
          password: 'validPassword',
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
