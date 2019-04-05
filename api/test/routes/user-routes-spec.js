'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var TestUtils = require('../test-utils');
var app = require('../../src/app');

chai.use(chaiHttp);

describe('User Routes Test', () => {
  beforeEach(async() => {
    await TestUtils.clearDB();
  });

  after(() => {
    sinon.restore();
  });

  describe('Create', () => {
    it('should return invalid when email is already used', async() => {
      await TestUtils.userFactory(
        {email: 'some@email.com', password: 'myValidPwd.123'});

      var res = await chai.request(app)
        .post('/users')
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
        .post('/users')
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

  describe('Retrieve', () => {
    it('should return invalid when user does not exist', async() => {
      var res = await chai.request(app).get('/users/1');

      chai.assert.strictEqual(
        res.status,
        404,
        'Status was not 404'
      );
    });

    it('should return ok when user exists', async() => {
      var user = await TestUtils.userFactory(
        {email: 'valid@email.com', password: 'myPassword12.3'});

      var res = await chai.request(app).get('/users/' + user.id);

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );

      chai.assert.strictEqual(
        res.body.id,
        user.id,
        'Response was not what was expected'
      );
    });
  });
});
