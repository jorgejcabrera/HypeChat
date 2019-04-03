'use strict';

var { FileUtils } = require('../utils');

module.exports = (app) => {
  // Health check
  app.route('/ping')
    .get((req, res) => {
      res.send('pong');
    });

  FileUtils.processFilesInDir(__dirname, __filename, (filepath) => {
    require(filepath)(app);
  });
};
