var fs = require("fs");

module.exports = function(app) {
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file != "index.js") {
            require("./" + file)(app);
        }
    });
}