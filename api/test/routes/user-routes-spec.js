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
        {email: 'valid@email.com', password: 'myPassword12.3'}
      );

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

  describe('Update', () => {
    it('should return invalid when user is not authorized', async() => {
      var res = await chai.request(app)
      .put('/users/1')
      .send();

      chai.assert.strictEqual(
        res.status,
        403,
        'Status was not 403'
      );
    });

    it('should return ok when user exists and data is valid', async() => {
      var user = await TestUtils.authenticatedUserFactory(
        {email: 'valid@email.com', password: 'myPassword12.3'}
      );

      var res = await chai.request(app)
        .put('/users/' + user.id)
        .set('X-Auth', user.auth.accessToken)
        .send({ firstName: 'Newname' });

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

  describe('Delete', () => {
    it('should return invalid when user is not authorized', async() => {
      var res = await chai.request(app)
      .delete('/users/1')
      .send();

      chai.assert.strictEqual(
        res.status,
        403,
        'Status was not 403'
      );
    });

    it('should return ok when user is authorized', async() => {
      var user = await TestUtils.authenticatedUserFactory(
        {email: 'valid@email.com', password: 'myPassword12.3'}
      );

      var res = await chai.request(app)
        .delete('/users/' + user.id)
        .set('X-Auth', user.auth.accessToken);
        
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

  describe('Get Workspaces for User', () => {
    it('should return invalid when user does not exist', async() => {
      var res = await chai.request(app).get('/users/1/workspaces');

      chai.assert.strictEqual(
        res.status,
        404,
        'Status was not 404'
      );
    });

    it('should return ok when user exists', async() => {
      var user = await TestUtils.userFactory(
        {email: 'valid@email.com', password: 'myPassword12.3'}
      );

      // Create some workspaces that the user belongs to.
      for (var i = 0; i < 5; i++) {
        await TestUtils.workspaceFactory(
          { creatorId: user.id }
        );
      }

      var res = await chai.request(app)
        .get('/users/' + user.id + '/workspaces');

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );

      chai.assert.strictEqual(
        res.body.length,
        5,
        'Response was not what was expected'
      );
    });
  });
});
