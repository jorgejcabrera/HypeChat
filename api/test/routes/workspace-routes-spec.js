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
  var otherUser;
  var thirdUser;
  var workspaceData;

  beforeEach(async() => {
    await TestUtils.clearDB();
    // We need to have a user so we can create workspaces.
    user = await TestUtils.authenticatedUserFactory(
      {password: 'validPassword.123'}
    );
    otherUser = await TestUtils.authenticatedUserFactory(
      {password: 'validPassword.123'}
    );
    thirdUser = await TestUtils.authenticatedUserFactory(
      {password: 'validPassword.123'}
    );
    workspaceData = {
      name: 'Test Workspace',
      image: 'http://test.workspace.com',
      location: 'Street 101, City, Country',
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
    it('should return unauthorized when workspace does not exist',
      async() => {
        var res = await chai.request(app)
          .get('/workspaces/1')
          .set('X-Auth', user.auth.accessToken);

        chai.assert.strictEqual(
          res.status,
          401,
          'Status was not 401'
        );
      });

    it('should return ok when workspace exists and user is creator',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id }
        );
        var res = await chai.request(app)
          .get('/workspaces/' + workspace.id)
          .set('X-Auth', user.auth.accessToken);

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

    it('should return ok when workspace exists and user is moderator',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id },
          [ { id: otherUser.id, role: 'MODERATOR' } ]
        );
        var res = await chai.request(app)
          .get('/workspaces/' + workspace.id)
          .set('X-Auth', otherUser.auth.accessToken);

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

    it('should return ok when workspace exists and user is member',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id },
          [ { id: otherUser.id, role: 'MEMBER' } ]
        );
        var res = await chai.request(app)
          .get('/workspaces/' + workspace.id)
          .set('X-Auth', otherUser.auth.accessToken);

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

    it('should return unauthorized when workspace exists and user'
      + ' doesn\'t belong', async() => {
      var workspace = await TestUtils.workspaceFactory(
        { creatorId: user.id }
      );
      var res = await chai.request(app)
        .get('/workspaces/' + workspace.id)
        .set('X-Auth', otherUser.auth.accessToken);

      chai.assert.strictEqual(
        res.status,
        401,
        'Status was not 401'
      );
    });

    it('should return unauthorized when user is creator of another workspace '
     + 'but doesn\'t belong to this one', async() => {
      var workspace1 = await TestUtils.workspaceFactory(
        { creatorId: user.id }
      );
      await TestUtils.workspaceFactory(
        { creatorId: otherUser.id }
      );
      var res = await chai.request(app)
        .get('/workspaces/' + workspace1.id)
        .set('X-Auth', otherUser.auth.accessToken);

      chai.assert.strictEqual(
        res.status,
        401,
        'Status was not 401'
      );
    });
  });

  describe('Delete', () => {
    it('should return unauthorized when user doesn\'t belong', async() => {
      var workspace = await TestUtils.workspaceFactory(
        { creatorId: user.id }
      );

      var res = await chai.request(app)
        .delete('/workspaces/' + workspace.id)
        .set('X-Auth', otherUser.auth.accessToken);

      chai.assert.strictEqual(
        res.status,
        401,
        'Status was not 401'
      );

      // Check that workspace still exists.
      res = await chai.request(app)
        .get('/workspaces/' + workspace.id)
        .set('X-Auth', user.auth.accessToken);

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );
    });

    it('should return unauthorized when user is member', async() => {
      var workspace = await TestUtils.workspaceFactory(
        { creatorId: user.id },
        [ { id: otherUser.id, role: 'MEMBER' } ]
      );

      var res = await chai.request(app)
        .delete('/workspaces/' + workspace.id)
        .set('X-Auth', otherUser.auth.accessToken);

      chai.assert.strictEqual(
        res.status,
        401,
        'Status was not 401'
      );

      // Check that workspace still exists.
      res = await chai.request(app)
        .get('/workspaces/' + workspace.id)
        .set('X-Auth', user.auth.accessToken);

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );
    });

    it('should return unauthorized when user is moderator', async() => {
      var workspace = await TestUtils.workspaceFactory(
        { creatorId: user.id },
        [ { id: otherUser.id, role: 'MODERATOR' } ]
      );

      var res = await chai.request(app)
        .delete('/workspaces/' + workspace.id)
        .set('X-Auth', otherUser.auth.accessToken);

      chai.assert.strictEqual(
        res.status,
        401,
        'Status was not 401'
      );

      // Check that workspace still exists.
      res = await chai.request(app)
        .get('/workspaces/' + workspace.id)
        .set('X-Auth', user.auth.accessToken);

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );
    });

    it('should return ok when user is creator', async() => {
      var workspace = await TestUtils.workspaceFactory(
        { creatorId: user.id }
      );

      var res = await chai.request(app)
        .delete('/workspaces/' + workspace.id)
        .set('X-Auth', user.auth.accessToken);

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );

      // Check that workspace no longer exists.
      res = await chai.request(app)
        .get('/workspaces/' + workspace.id)
        .set('X-Auth', user.auth.accessToken);

      chai.assert.strictEqual(
        res.status,
        401,
        'Status was not 401'
      );
    });
  });

  describe('Add User', () => {
    it('should return unauthorized when calling user doesn\'t belong',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id }
        );

        var res = await chai.request(app)
          .post('/workspaces/' + workspace.id + '/users')
          .set('X-Auth', otherUser.auth.accessToken)
          .send({ userId: thirdUser.id });

        chai.assert.strictEqual(
          res.status,
          401,
          'Status was not 401'
        );
      });

    it('should return unauthorized when calling user is member',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id },
          [ { id: otherUser.id, role: 'MEMBER' } ]
        );

        var res = await chai.request(app)
          .post('/workspaces/' + workspace.id + '/users')
          .set('X-Auth', otherUser.auth.accessToken)
          .send({ userId: thirdUser.id });

        chai.assert.strictEqual(
          res.status,
          401,
          'Status was not 401'
        );
      });

    it('should return ok when calling user is moderator',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id },
          [ { id: otherUser.id, role: 'MODERATOR' } ]
        );

        var res = await chai.request(app)
          .post('/workspaces/' + workspace.id + '/users')
          .set('X-Auth', otherUser.auth.accessToken)
          .send({ userId: thirdUser.id });

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

    it('should return ok when calling user is creator',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id },
        );

        var res = await chai.request(app)
          .post('/workspaces/' + workspace.id + '/users')
          .set('X-Auth', user.auth.accessToken)
          .send({ userId: thirdUser.id });

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

    it('should return invalid when user to add doesn\'t exist',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id },
        );

        var res = await chai.request(app)
          .post('/workspaces/' + workspace.id + '/users')
          .set('X-Auth', user.auth.accessToken)
          .send({ userId: thirdUser.id + 1 });

        chai.assert.strictEqual(
          res.status,
          404,
          'Status was not 404'
        );
      });
  });
});
