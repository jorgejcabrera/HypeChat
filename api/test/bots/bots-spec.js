'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var extend = require('util')._extend;
var sinon = require('sinon');
var TestUtils = require('../test-utils');
var app = require('../../src/app');
var { HttpService } = require('../../src/services');

chai.use(chaiHttp);

describe('Bots Test', () => {
  var user;
  var workspace;
  var otherWorkspace;
  var httpPostSpy;
  var botData = {
    firstName: 'Robo',
    lastName: 'Bot',
    email: 'robo.bot@gmail.com',
    password: 'robosPassword123!',
    callbackOnMention: 'http://botservice.hypechat:5000/robo/mention',
    workspaceId: 1,
  };

  before(() => {
    TestUtils.mockFirebase();
    httpPostSpy = sinon.stub(HttpService, 'post');
  });

  beforeEach(async() => {
    await TestUtils.clearDB();

    sinon.resetHistory();

    // We need to have a user so we can create workspaces.
    user = await TestUtils.authenticatedUserFactory(
      { password: 'validPassword.123' }
    );

    workspace = await TestUtils.workspaceFactory(
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
      ]
    );

    botData.workspaceId = workspace.id;

    otherWorkspace = await TestUtils.workspaceFactory(
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
      ]
    );
  });

  after(() => {
    TestUtils.restore();
  });

  describe('Register Bot', () => {
    it('should return invalid when workspace doesn\'t exist', async() => {
      var customBotData = extend({}, botData);
      customBotData.workspaceId = 3;
      var res = await chai.request(app)
        .post('/bot/register')
        .send(customBotData);

      chai.assert.strictEqual(
        res.status,
        404,
        'Status was not 404'
      );
    });

    it('should return ok when all info is valid', async() => {
      var res = await chai.request(app)
        .post('/bot/register')
        .send(botData);

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

  describe('Bot behaviour', () => {
    var bot;

    beforeEach(async() => {
      var res = await chai.request(app)
        .post('/bot/register')
        .send(botData);
      bot = res.body;
    });

    it('should be member of workspace it was assigned to', async() => {
      var res = await chai.request(app)
        .get(`/users/${bot.id}/profile`);

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );

      chai.assert.strictEqual(
        res.body.workspaces.length,
        1,
        'Bot didn\'t belong to the right amount of workspaces'
      );

      chai.assert.strictEqual(
        res.body.workspaces[0].id,
        botData.workspaceId,
        'Bot didn\'t belong to the right workspace'
      );
    });

    it('should be called if mentioned in workspace it belongs to', async() => {
      var res = await chai.request(app)
        .post(`/workspaces/${workspace.id}/messages`)
        .set('X-Auth', user.auth.accessToken)
        .send({
          recipientId: null,
          groupId: workspace.groups[0].id,
          message: '@Robo hola',
        });

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );

      chai.assert.strictEqual(
        httpPostSpy.callCount,
        1,
        'There was more/less than 1 invocation to a bot'
      );
    });

    it('should NOT be called if it doesn\'t belong to workspace', async() => {
      var res = await chai.request(app)
        .post(`/workspaces/${otherWorkspace.id}/messages`)
        .set('X-Auth', user.auth.accessToken)
        .send({
          recipientId: null,
          groupId: otherWorkspace.groups[0].id,
          message: '@Robo hola',
        });

      chai.assert.strictEqual(
        res.status,
        200,
        'Status was not 200'
      );

      chai.assert.strictEqual(
        httpPostSpy.callCount,
        0,
        'Bot was called when it shouldn\'t have'
      );
    });
  });
});
