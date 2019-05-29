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

        delete res.body.id;
        delete res.body.createdAt;
        delete res.body.updatedAt;
        groupData.workspaceId = workspace.id;
        chai.assert.deepEqual(
          res.body,
          groupData,
          'Response was not what was expected'
        );
      }
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
            name: 'A test group',
            isActive: true,
          },
          [],
          user.auth.accessToken,
          'OK'
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
    var expected;

    beforeEach(async() => {
      groups = [
        {
          creatorId: user.id,
          name: 'A test group',
          isActive: true,
        },
        {
          creatorId: otherUser.id,
          name: 'Another test group',
          isActive: true,
        },
      ];

      expected = groups;
    });

    var addGroup = async(members, groups, token, expect, expectResponse) => {
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
          });

          expectResponse = expectResponse.map((group) => {
            group.workspaceId = workspace.id;
          });

          chai.assert.deepEqual(
            res.body,
            expectResponse,
            'Response was not what was expected'
          );
        }
      }
    };

    it('should return unauthorized when calling user doesn\'t belong',
      async() => {
        await addGroup(
          [],
          groups,
          otherUser.auth.accessToken,
          'UNAUTHORIZED'
        );
      });

    it('should return ok when calling user is creator',
      async() => {
        await addGroup(
          [ { id: otherUser.id, role: 'MEMBER' } ],
          groups,
          user.auth.accessToken,
          'OK',
          expected
        );
      });

    it('should return ok when calling user is moderator',
      async() => {
        await addGroup(
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
        await addGroup(
          [ { id: otherUser.id, role: 'MEMBER' } ],
          groups,
          otherUser.auth.accessToken,
          'OK',
          expected
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
          .send({ userId: thirdUser.id });

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
