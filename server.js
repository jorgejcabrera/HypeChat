// express configuration
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  User = require('./api/models/User'),
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// db connection
// const pg = require('pg');
// pg.connect('postgres://postgres:hypechat@hypechat:5432/hypechat');

// routes
var userRoutes = require('./api/routes/UserRoutes');
userRoutes(app);

app.listen(port);

console.log('HypeChat RESTful API server started on: ' + port);