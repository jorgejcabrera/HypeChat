'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var extend = require('util')._extend;
var TestUtils = require('../test-utils');
console.log('ENV: ' + process.env.NODE_ENV);
var app = require('../../src/app');

chai.use(chaiHttp);

describe('Workspace Routes Test', () => {

  beforeEach(async() => {
    await TestUtils.clearDB();
    await TestUtils.userFactory();
  });

  afterEach(() => {
    sinon.restore();
  });

  var workspaceData = {
    name: 'Test Workspace',
    image: 'http://test.workspace.com',
    location: 'Street 101, City, Country',
  };

  describe('Create', () => {
    it('should return invalid when no name is provided', async() => {
      var testData = extend({}, workspaceData);
      delete testData.name;

      var res = await chai.request(app)
        .post('/workspaces')
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

    it('should return ok when all info is valid', async() => {
      var res = await chai.request(app)
        .post('/workspaces')
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

  // describe('Retrieve', () => {
  //   it('should return invalid when user does not exist', async() => {
  //     User.findByPk.returns(null);

  //     var res = await chai.request(app).get('/users/1');

  //     chai.assert.strictEqual(
  //       res.status,
  //       404,
  //       'Status was not 404'
  //     );
  //   });

  //   it('should return ok when user exists', async() => {
  //     User.findByPk.returns(userData);

  //     var res = await chai.request(app).get('/users/1');

  //     chai.assert.strictEqual(
  //       res.status,
  //       200,
  //       'Status was not 200'
  //     );
  //     chai.assert.deepEqual(
  //       res.body,
  //       userData,
  //       'Response was not what was expected'
  //     );
  //   });
  // });
});
