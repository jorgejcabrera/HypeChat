'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var extend = require('util')._extend;
var TestUtils = require('../test-utils');
var app = require('../../src/app');

chai.use(chaiHttp);

describe('Workspace Routes Test', () => {

  var user;
  var workspaceData;

  beforeEach(async() => {
    await TestUtils.clearDB();
    // We need to have a user so we can create workspaces.
    user = await TestUtils.authenticatedUserFactory(
      {password: 'validPassword.123'});
    workspaceData = {
      name: 'Test Workspace',
      image: 'http://test.workspace.com',
      location: 'Street 101, City, Country',
      // TODO: remove this after route is secured.
      creatorId: user.id,
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Create', () => {
    it('should return invalid when no name is provided', async() => {
      var testData = extend({}, workspaceData);
      delete testData.name;

      var res = await chai.request(app)
        .post('/workspaces')
        .set('X-Auth', user.auth.accessToken)
        .send(testData);

      chai.assert.strictEqual(
        res.status,
        400,
        'Status was not 400'
      );
      chai.assert.deepEqual(
        res.body,
        {
          status: 'error',
          type: 'validationError',
          validationErrors: [
            {error: 'isBlank', path: 'name'},
          ],
        },
        'Response was not what was expected'
      );
    });

    it('should return invalid when missing multiple fields', async() => {
      var testData = extend({}, workspaceData);
      delete testData.image;
      delete testData.location;

      var res = await chai.request(app)
        .post('/workspaces')
        .set('X-Auth', user.auth.accessToken)
        .send(testData);

      chai.assert.strictEqual(
        res.status,
        400,
        'Status was not 400'
      );
      chai.assert.deepEqual(
        res.body,
        {
          status: 'error',
          type: 'validationError',
          validationErrors: [
            {error: 'isBlank', path: 'image'},
            {error: 'isBlank', path: 'location'},
          ],
        },
        'Response was not what was expected'
      );
    });

    it('should return ok when all info is valid', async() => {
      var res = await chai.request(app)
        .post('/workspaces')
        .set('X-Auth', user.auth.accessToken)
        .send(workspaceData);

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
    it('should return invalid when workspace does not exist', async() => {
      var res = await chai.request(app).get('/workspaces/1');

      chai.assert.strictEqual(
        res.status,
        404,
        'Status was not 404'
      );
    });

    it('should return ok when workspace exists', async() => {
      var workspace = await TestUtils.workspaceFactory({ creatorId: user.id });
      var res = await chai.request(app).get('/workspaces/' + workspace.id);

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );
      chai.assert.strictEqual(
        res.body.id,
        workspace.id,
        'Response was not what was expected'
      );
    });
  });
});
