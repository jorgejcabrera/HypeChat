'use strict';

var { WorkspaceController } = require('../controllers');

module.exports = (app) => {
  app.route('/workspaces')
    .post(WorkspaceController.create);

  app.route('/workspaces/:workspaceId')
    .get(WorkspaceController.retrieve)
    .put(WorkspaceController.update)
    .delete(WorkspaceController.delete);
};
