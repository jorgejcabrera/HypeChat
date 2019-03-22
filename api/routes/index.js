'use strict';

var { fs, path } = require('../config/dependencies');

module.exports = (app) => {
    // Health check
    app.route('/ping')
    .get((req, res) => {
        res.send('pong');
    });

    fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) 
            && (file !== path.basename(__filename)) 
            && (file.slice(-3) === '.js');
    }).forEach(file => {
        var filePath = path.join(__dirname, file);
        require(filePath)(app);
    });
}