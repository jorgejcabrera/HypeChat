'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
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

  describe('Update', () => {
    it('should return unauthorized when user doesn\' belong', async() => {
      var res = await chai.request(app)
        .put('/workspaces/1')
        .set('X-Auth', user.auth.accessToken)
        .send({name: 'changed name'});

      chai.assert.strictEqual(
        res.status,
        401,
        'Status was not 401'
      );
    });

    it('should return ok when all info is valid', async() => {
      var workspace = await TestUtils.workspaceFactory({ creatorId: user.id });

      var res = await chai.request(app)
        .put('/workspaces/' + workspace.id)
        .set('X-Auth', user.auth.accessToken)
        .send({name: 'changed name'});

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

  describe('List', () => {
    var adminUser;

    beforeEach(async function() {
      this.timeout(5000);
      // Create some workspaces to be able to list something.
      for (var i = 0; i < 25; i++) {
        await TestUtils.workspaceFactory({ creatorId: user.id });
      };

      // Create an admin user.
      adminUser = await TestUtils.authenticatedUserFactory(
        { password: 'validPassword.123', isAdmin: true }
      );
    });

    it('should return unauthorized when user is not admin',
      async() => {
        var res = await chai.request(app)
          .get('/workspaces')
          .set('X-Auth', user.auth.accessToken);

        chai.assert.strictEqual(
          res.status,
          401,
          'Status was not 401'
        );
      });

    it('should return ok when user is admin',
      async() => {
        var res = await chai.request(app)
          .get('/workspaces')
          .set('X-Auth', adminUser.auth.accessToken);

        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );

        chai.assert.strictEqual(
          res.body.pageContents.length,
          10,
          'Contents were not what was expected'
        );

        chai.assert.strictEqual(
          res.body.pageNumber,
          1,
          'Page number not what was expected'
        );

        chai.assert.strictEqual(
          res.body.total,
          25,
          'Total was not what was expected'
        );
      });

    it('should return ok when asking for last page',
      async() => {
        var res = await chai.request(app)
          .get('/workspaces?page=3')
          .set('X-Auth', adminUser.auth.accessToken);

        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );

        chai.assert.strictEqual(
          res.body.pageContents.length,
          5,
          'Contents were not what was expected'
        );

        chai.assert.strictEqual(
          res.body.pageNumber,
          3,
          'Page number not what was expected'
        );

        chai.assert.strictEqual(
          res.body.total,
          25,
          'Total was not what was expected'
        );
      });

    /* TODO check this test
    it('should return invalid when asking for page out of range',
      async() => {
        var res = await chai.request(app)
          .get('/workspaces?page=4')
          .set('X-Auth', adminUser.auth.accessToken);

        chai.assert.strictEqual(
          res.status,
          404,
          'Status was not 404'
        );
      });*/
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

  describe('Invite User', () => {
    before(async() => {
      TestUtils.mockEmail();
    });

    after(() => {
      TestUtils.restore();
    });

    it('should return unauthorized when calling user doesn\'t belong',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id }
        );

        var res = await chai.request(app)
          .post('/workspaces/' + workspace.id + '/invite')
          .set('X-Auth', otherUser.auth.accessToken)
          .send({ email: thirdUser.email });

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
          .post('/workspaces/' + workspace.id + '/invite')
          .set('X-Auth', otherUser.auth.accessToken)
          .send({ email: thirdUser.email });

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
          .post('/workspaces/' + workspace.id + '/invite')
          .set('X-Auth', otherUser.auth.accessToken)
          .send({ email: thirdUser.email });

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
          .post('/workspaces/' + workspace.id + '/invite')
          .set('X-Auth', user.auth.accessToken)
          .send({ email: thirdUser.email });

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
          .post('/workspaces/' + workspace.id + '/invite')
          .set('X-Auth', user.auth.accessToken)
          .send({ email: 'someInvalid@email.com' });

        chai.assert.strictEqual(
          res.status,
          404,
          'Status was not 404'
        );
      });
  });

  describe('Accept Invite', () => {
    it('should return ok when user and token are valid',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id }
        );

        var res = await chai.request(app)
          .post('/workspaces/' + workspace.id + '/invite')
          .set('X-Auth', user.auth.accessToken)
          .send({ email: otherUser.email });

        res = await chai.request(app)
          .post('/workspaces/accept-invite')
          .set('X-Auth', otherUser.auth.accessToken)
          .send({ inviteToken: res.body.inviteToken });

        res = await chai.request(app)
          .get('/workspaces/' + workspace.id + '/users')
          .set('X-Auth', user.auth.accessToken);

        chai.assert.equal(
          res.body.length,
          2,
          'Response was not what was expected'
        );
      });

    it('should return invalid when calling user doesn\'t match token',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id }
        );

        var res = await chai.request(app)
          .post('/workspaces/' + workspace.id + '/invite')
          .set('X-Auth', user.auth.accessToken)
          .send({ email: otherUser.email });

        res = await chai.request(app)
          .post('/workspaces/accept-invite')
          .set('X-Auth', thirdUser.auth.accessToken)
          .send({ inviteToken: res.body.inviteToken });

        res = await chai.request(app)
          .get('/workspaces/' + workspace.id + '/users')
          .set('X-Auth', user.auth.accessToken);

        chai.assert.equal(
          res.body.length,
          1,
          'Response was not what was expected'
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
          .send({ userEmail: thirdUser.email });

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
          .send({ userEmail: thirdUser.email });

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
          .send({ userEmail: thirdUser.email });

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
          .send({ userEmail: thirdUser.email });

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
          .send({ userEmail: 'invalid@email.com' });

        chai.assert.strictEqual(
          res.status,
          404,
          'Status was not 404'
        );
      });

    it('should add user to public groups',
      async() => {

        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id },
          [],
          [
            {
              creatorId: user.id,
              name: 'A test public group',
              description: 'A public description',
              visibility: 'PUBLIC',
              isActive: true,
            },
            {
              creatorId: user.id,
              name: 'Another test public group',
              description: 'A public description',
              visibility: 'PUBLIC',
              isActive: true,
            },
          ]
        );

        var res = await chai.request(app)
          .post('/workspaces/' + workspace.id + '/users')
          .set('X-Auth', user.auth.accessToken)
          .send({ userEmail: thirdUser.email });

        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );

        chai.assert.isObject(
          res.body,
          'Response was not what was expected'
        );

        res = await chai.request(app)
          .get('/workspaces/' + workspace.id + '/groups')
          .set('X-Auth', thirdUser.auth.accessToken);

        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );

        chai.assert.strictEqual(
          res.body.length,
          3,
          'User doesn\'t belong to the right amount of groups'
        );
      });

    it('should NOT add user to private groups',
      async() => {

        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id },
          [],
          [
            {
              creatorId: user.id,
              name: 'A test private group',
              description: 'A private description',
              visibility: 'PRIVATE',
              isActive: true,
            },
            {
              creatorId: user.id,
              name: 'Another test private group',
              description: 'A private description',
              visibility: 'PRIVATE',
              isActive: true,
            },
          ]
        );

        var res = await chai.request(app)
          .post('/workspaces/' + workspace.id + '/users')
          .set('X-Auth', user.auth.accessToken)
          .send({ userEmail: thirdUser.email });

        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );

        chai.assert.isObject(
          res.body,
          'Response was not what was expected'
        );

        res = await chai.request(app)
          .get('/workspaces/' + workspace.id + '/groups')
          .set('X-Auth', thirdUser.auth.accessToken);

        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );

        chai.assert.strictEqual(
          res.body.length,
          1,
          'User doesn\'t belong to the right amount of groups'
        );
      });


  });

  describe('Add Group', () => {

    var addGroup = async(groupData, members, token, expect, expectError) => {
      var workspace = await TestUtils.workspaceFactory(
        { creatorId: user.id },
        members
      );

      var res = await chai.request(app)
        .post('/workspaces/' + workspace.id + '/groups')
        .set('X-Auth', token)
        .send(groupData);

      if (expect === 'UNAUTHORIZED') {
        chai.assert.strictEqual(
          res.status,
          401,
          'Status was not 401'
        );
      } else if (expect === 'INVALID') {
        chai.assert.strictEqual(
          res.status,
          400,
          'Status was not 400'
        );

        if (expectError) {
          chai.assert.deepEqual(
            res.body,
            expectError,
            'Response was not what was expected'
          );
        }
      } else if (expect === 'OK') {
        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );

        var group = extend({}, res.body);
        delete group.id;
        delete group.totalMessages;
        delete group.createdAt;
        delete group.updatedAt;
        groupData.workspaceId = workspace.id;
        chai.assert.deepEqual(
          group,
          groupData,
          'Response was not what was expected'
        );
      }

      return res.body;
    };

    it('should return unauthorized when calling user doesn\'t belong',
      async() => {
        await addGroup(
          {
            creatorId: otherUser.id,
            name: 'A test group',
            isActive: true,
          },
          [],
          otherUser.auth.accessToken,
          'UNAUTHORIZED'
        );
      });

    it('should return ok when calling user is member',
      async() => {
        await addGroup(
          {
            creatorId: otherUser.id,
            visibility: 'PUBLIC',
            description: 'Una descripcion',
            name: 'A test group',
            isActive: true,
          },
          [ { id: otherUser.id, role: 'MEMBER' } ],
          otherUser.auth.accessToken,
          'OK'
        );
      });

    it('should return ok when calling user is moderator',
      async() => {
        await addGroup(
          {
            creatorId: otherUser.id,
            visibility: 'PUBLIC',
            description: 'Una descripcion',
            name: 'A test group',
            isActive: true,
          },
          [ { id: otherUser.id, role: 'MODERATOR' } ],
          otherUser.auth.accessToken,
          'OK'
        );
      });

    it('should return ok when calling user is creator',
      async() => {
        await addGroup(
          {
            creatorId: user.id,
            visibility: 'PUBLIC',
            description: 'Una descripcion',
            name: 'A test group',
            isActive: true,
          },
          [],
          user.auth.accessToken,
          'OK'
        );
      });

    it('all workspace members should be members when group is public',
      async() => {
        var group = await addGroup(
          {
            creatorId: user.id,
            visibility: 'PUBLIC',
            description: 'Una descripcion',
            name: 'A test group',
            isActive: true,
          },
          [
            { id: otherUser.id, role: 'MEMBER' },
            { id: thirdUser.id, role: 'MEMBER' },
          ],
          user.auth.accessToken,
          'OK'
        );

        var res = await chai.request(app)
          .get('/workspaces/' + group.workspaceId + '/groups/' + group.id)
          .set('X-Auth', user.auth.accessToken);

        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );

        chai.assert.strictEqual(
          res.body.users.length,
          3,
          'Status was not 200'
        );

      });

    it('only creator should be member when group is private',
      async() => {
        var group = await addGroup(
          {
            creatorId: user.id,
            visibility: 'PRIVATE',
            description: 'Una descripcion',
            name: 'A test group',
            isActive: true,
          },
          [
            { id: otherUser.id, role: 'MEMBER' },
            { id: thirdUser.id, role: 'MEMBER' },
          ],
          user.auth.accessToken,
          'OK'
        );

        var res = await chai.request(app)
          .get('/workspaces/' + group.workspaceId + '/groups/' + group.id)
          .set('X-Auth', user.auth.accessToken);

        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );

        chai.assert.strictEqual(
          res.body.users.length,
          1,
          'Status was not 200'
        );

      });

    it('should return invalid when group name is missing',
      async() => {
        await addGroup(
          { isActive: true },
          [],
          user.auth.accessToken,
          'INVALID',
          {
            status: 'error',
            type: 'validationError',
            validationErrors: [
              {error: 'isBlank', path: 'name'},
            ],
          },
        );
      });
  });

  describe('List Groups', () => {

    var groups;
    var publicGroups;
    var expected;

    beforeEach(async() => {
      groups = [
        {
          creatorId: user.id,
          name: 'A test group',
          description: 'A description',
          visibility: 'PRIVATE',
          isActive: true,
        },
        {
          creatorId: otherUser.id,
          name: 'Another test group',
          description: 'A description',
          visibility: 'PRIVATE',
          isActive: true,
        },
      ];

      publicGroups = [
        {
          creatorId: user.id,
          name: 'A test public group',
          description: 'A public description',
          visibility: 'PUBLIC',
          isActive: true,
        },
        {
          creatorId: user.id,
          name: 'Another test public group',
          description: 'A public description',
          visibility: 'PUBLIC',
          isActive: true,
        },
      ];

      expected = groups;
    });

    var listGroups = async(members, groups, token, expect, expectResponse) => {
      var workspace = await TestUtils.workspaceFactory(
        { creatorId: user.id },
        members,
        groups
      );

      var res = await chai.request(app)
        .get('/workspaces/' + workspace.id + '/groups')
        .set('X-Auth', token);

      if (expect === 'UNAUTHORIZED') {
        chai.assert.strictEqual(
          res.status,
          401,
          'Status was not 401'
        );
      } else if (expect === 'OK') {
        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );

        if (expectResponse) {
          res.body = res.body.map((group) => {
            delete group.id;
            delete group.createdAt;
            delete group.updatedAt;
            return group;
          });

          expectResponse = expectResponse.map((group) => {
            group.workspaceId = workspace.id;
            return group;
          });

          chai.assert.deepEqual(
            res.body.length,
            expectResponse.length + 1, // to account for default group.
            'Response was not what was expected'
          );

          // expectResponse.forEach((expected) => {
          //   chai.assert.include(
          //     res.body,
          //     expected,
          //     'Response was not what was expected'
          //   );
          // });
        }
      }
    };

    it('should return unauthorized when calling user doesn\'t belong',
      async() => {
        await listGroups(
          [],
          groups,
          otherUser.auth.accessToken,
          'UNAUTHORIZED'
        );
      });

    it('should return ok when calling user is creator',
      async() => {
        await listGroups(
          [ { id: otherUser.id, role: 'MEMBER' } ],
          groups,
          user.auth.accessToken,
          'OK',
          expected
        );
      });

    it('should return ok when calling user is moderator',
      async() => {
        await listGroups(
          [ { id: otherUser.id, role: 'MODERATOR' } ],
          groups,
          otherUser.auth.accessToken,
          'OK',
          expected
        );
      });

    it('should return ok when calling user is member',
      async() => {
        expected = [ groups[1] ];
        await listGroups(
          [ { id: otherUser.id, role: 'MEMBER' } ],
          groups,
          otherUser.auth.accessToken,
          'OK',
          expected
        );
      });

    it('should return public groups',
      async() => {
        expected = publicGroups.concat(groups[1]);
        await listGroups(
          [ { id: otherUser.id, role: 'MEMBER' } ],
          publicGroups.concat(groups),
          otherUser.auth.accessToken,
          'OK',
          expected
        );
      });
  });

  describe('Add User To Group', () => {

    var groups;

    beforeEach(async() => {
      groups = [
        {
          creatorId: user.id,
          name: 'A test group',
          description: 'A description',
          visibility: 'PRIVATE',
          isActive: true,
        },
        {
          creatorId: otherUser.id,
          name: 'Another test group',
          description: 'A description',
          visibility: 'PRIVATE',
          isActive: true,
        },
      ];
    });

    it('should return ok when user to add exists and belongs to workspace',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id },
          [
            { id: otherUser.id, role: 'MEMBER' },
            { id: thirdUser.id, role: 'MEMBER' },
          ],
          groups
        );

        var res = await chai.request(app)
          .post(
            `/workspaces/${workspace.id}/groups/${workspace.groups[0].id}/users`
          )
          .set('X-Auth', user.auth.accessToken)
          .send({ userEmail: thirdUser.email });

        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );

        res = await chai.request(app)
          .get(
            `/workspaces/${workspace.id}/groups/${workspace.groups[0].id}/users`
          )
          .set('X-Auth', user.auth.accessToken);

        chai.assert.strictEqual(
          res.body.length,
          2,
          'User was not added'
        );
      });

    it('should return invalid when user to add exists and doesn\'t ' +
    'belong to workspace',
    async() => {
      var workspace = await TestUtils.workspaceFactory(
        { creatorId: user.id },
        [
          { id: otherUser.id, role: 'MEMBER' },
        ],
        groups
      );

      var res = await chai.request(app)
        .post(
          `/workspaces/${workspace.id}/groups/${workspace.groups[0].id}/users`
        )
        .set('X-Auth', user.auth.accessToken)
        .send({ userEmail: thirdUser.email });

      chai.assert.strictEqual(
        res.status,
        404,
        'Status was not 404'
      );

      res = await chai.request(app)
        .get(
          `/workspaces/${workspace.id}/groups/${workspace.groups[0].id}/users`
        )
        .set('X-Auth', user.auth.accessToken);

      chai.assert.strictEqual(
        res.body.length,
        1,
        'User was added incorrectly'
      );
    });

    it('should return invalid when user to add doesn\'t exist',
      async() => {
        var workspace = await TestUtils.workspaceFactory(
          { creatorId: user.id },
          [
            { id: otherUser.id, role: 'MEMBER' },
          ],
          groups
        );

        var res = await chai.request(app)
          .post(
            `/workspaces/${workspace.id}/groups/${workspace.groups[0].id}/users`
          )
          .set('X-Auth', user.auth.accessToken)
          .send({ userEmail: 'invalid@email.com' });

        chai.assert.strictEqual(
          res.status,
          404,
          'Status was not 404'
        );

        res = await chai.request(app)
          .get(
            `/workspaces/${workspace.id}/groups/${workspace.groups[0].id}/users`
          )
          .set('X-Auth', user.auth.accessToken);

        chai.assert.strictEqual(
          res.body.length,
          1,
          'User was added incorrectly'
        );
      });
  });

  describe('Update User Roles', () => {
    var updateUserRole = async(newData, members, token, expect) => {
      var workspace = await TestUtils.workspaceFactory(
        { creatorId: user.id },
        members
      );

      var res = await chai.request(app)
        .put('/workspaces/' + workspace.id + '/users/' + newData.id)
        .set('X-Auth', token)
        .send(newData);

      if (expect === 'UNAUTHORIZED') {
        chai.assert.strictEqual(
          res.status,
          401,
          'Status was not 401'
        );
      } else if (expect === 'OK') {
        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );
      }
      return workspace;
    };

    it('should return unauthorized when calling user doesn\'t belong',
      async() => {
        await updateUserRole(
          { id: otherUser.id, role: 'MODERATOR'},
          [],
          otherUser.auth.accessToken,
          'INVALID'
        );
      });

    it('should return invalid when calling user is member',
      async() => {
        await updateUserRole(
          { id: otherUser.id, role: 'MODERATOR'},
          [ { id: otherUser.id, role: 'MEMBER' } ],
          otherUser.auth.accessToken,
          'INVALID'
        );
      });

    it('should return invalid when calling user is moderator',
      async() => {
        await updateUserRole(
          { id: otherUser.id, role: 'MEMBER'},
          [ { id: otherUser.id, role: 'MODERATOR' } ],
          otherUser.auth.accessToken,
          'INVALID'
        );
      });

    it('should return ok when calling user is creator',
      async() => {
        var workspace = await updateUserRole(
          { id: otherUser.id, role: 'MODERATOR'},
          [ { id: otherUser.id, role: 'MEMBER' } ],
          user.auth.accessToken,
          'OK'
        );

        var res = await chai.request(app)
          .post('/workspaces/' + workspace.id + '/users')
          .set('X-Auth', otherUser.auth.accessToken)
          .send({ userEmail: thirdUser.email });

        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );
      });
  });

  describe('Remove User', () => {
    var removeUser = async(deleteId, members, token, expect) => {
      var workspace = await TestUtils.workspaceFactory(
        { creatorId: user.id },
        members
      );

      var res = await chai.request(app)
        .delete('/workspaces/' + workspace.id + '/users/' + deleteId)
        .set('X-Auth', token);

      if (expect === 'UNAUTHORIZED') {
        chai.assert.strictEqual(
          res.status,
          401,
          'Status was not 401'
        );
      } else if (expect === 'OK') {
        chai.assert.strictEqual(
          res.status,
          200,
          'Status was not 200'
        );
      }

      res = await chai.request(app)
        .get('/workspaces/' + workspace.id + '/users')
        .set('X-Auth', user.auth.accessToken);

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );

      chai.assert.strictEqual(
        res.body.length,
        expect === 'OK' ? members.length : members.length + 1,
        'Response length was not as expected'
      );

      return workspace;
    };

    it('should return unauthorized when calling user doesn\'t belong',
      async() => {
        await removeUser(
          thirdUser.id,
          [ { id: thirdUser.id, role: 'MEMBER' } ],
          otherUser.auth.accessToken,
          'INVALID'
        );
      });

    it('should return invalid when calling user is member',
      async() => {
        await removeUser(
          thirdUser.id,
          [
            { id: otherUser.id, role: 'MEMBER' },
            { id: thirdUser.id, role: 'MEMBER' },
          ],
          otherUser.auth.accessToken,
          'INVALID'
        );
      });

    it('should return ok when calling user is moderator',
      async() => {
        await removeUser(
          thirdUser.id,
          [
            { id: otherUser.id, role: 'MODERATOR' },
            { id: thirdUser.id, role: 'MEMBER' },
          ],
          otherUser.auth.accessToken,
          'OK'
        );
      });

    it('should return ok when calling user is creator',
      async() => {
        await removeUser(
          otherUser.id,
          [ { id: otherUser.id, role: 'MEMBER' } ],
          user.auth.accessToken,
          'OK'
        );
      });
  });
});
