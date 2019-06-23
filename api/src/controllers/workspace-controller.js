'use strict';

var {
  FirebaseService,
  WorkspaceService,
  UserService,
  MentionService,
} = require('../services');

var { MessageValidator } = require('../validators');

var { jwt } = require('../config/dependencies');

var WorkspaceController = {};
WorkspaceController.name = 'WorkspaceController';

WorkspaceController.create = async(req, res, next) => {
  try {
    req.body.creatorId = req.user.id;
    var workspace = await WorkspaceService.create(req.body);
    res.json(workspace);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.inviteUser = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService.getById(req.params.workspaceId);
    var user = await UserService.getByEmail(req.body.email);
    if (!user || !workspace)
      return res.status(404).send();
    var token = jwt.sign(
      {
        workspaceId: workspace.id,
        userId: user.id,
        role: 'MEMBER',
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ inviteToken: token });
  } catch (err) {
    next(err);
  }
};

WorkspaceController.addUserWithInvite = async(req, res, next) => {
  try {
    var decoded = jwt.verify(req.body.inviteToken, process.env.JWT_SECRET);
    if (decoded.userId !== req.user.id) {
      return res.status(401).send('Unauthorized');
    }
    var userWorkspace = await WorkspaceService.addUser(
      decoded.workspaceId,
      decoded.userId,
      decoded.role
    );
    res.json(userWorkspace);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.addUser = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService.getById(req.params.workspaceId);
    var user = await UserService.getByEmail(req.body.userEmail);
    if (!user || !workspace) {
      return res.status(404).send();
    }
    var userWorkspace = await WorkspaceService.addUser(workspace.id, user.id);
    res.json(userWorkspace);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.updateUserRole = async(req, res, next) => {
  try {
    var userWorkspace = await WorkspaceService.updateUserRole(
      req.params.workspaceId,
      req.params.userId,
      req.body.role,
    );
    res.json(userWorkspace);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.removeUser = async(req, res, next) => {
  try {
    await WorkspaceService.removeUser(
      req.params.workspaceId,
      req.params.userId,
    );
    res.send();
  } catch (err) {
    next(err);
  }
};

WorkspaceController.retrieve = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService
      .getById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).send();
    res.json(workspace);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.listAll = async(req, res, next) => {
  try {
    var page = await WorkspaceService.list(req.query.page);
    res.json(page);
  } catch (err) {
    if (err.name === 'OutOfBounds') {
      return res.status(404).send();
    }
    next(err);
  }
};

WorkspaceController.retrieveUsers = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService
      .getById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).send();
    var users = await WorkspaceService
      .retrieveUsers(workspace.id);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.retrieveWorkspacesByUser = async(req, res, next) => {
  try {
    var user = await UserService.getById(req.params.userId);
    if (!user)
      return res.status(404).send();
    var workspaces = await WorkspaceService
      .retrieveWorkspacesByUser(user.id);
    res.json(workspaces);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.update = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService
      .update(req.params.workspaceId, req.body);
    if (!workspace)
      return res.status(404).send();
    res.json(workspace);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.delete = async(req, res, next) => {
  try {
    await WorkspaceService.delete(req.params.workspaceId);
    res.send();
  } catch (err) {
    next(err);
  }
};

WorkspaceController.sendMessage = async(req, res, next) => {
  try {
    var isValid = await MessageValidator.isValid(
      req.params.workspaceId,
      req.user.id,
      req.body
    );

    if (!isValid) return res.status(404).send();

    req.body.workspaceId = req.params.workspaceId;
    await MentionService.analyzeMessage(
      req.user,
      req.body
    );

    await FirebaseService.send(
      req.params.workspaceId,
      req.user,
      req.body
    );
    res.json();
  } catch (err) {
    // TODO LOGS with warn level
    next(err);
  }
};

module.exports = WorkspaceController;
