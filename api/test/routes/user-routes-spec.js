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
