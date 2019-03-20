// express configuration
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  User = require('./api/models/User'),
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// db connection
 const pg = require('pg');
 const config = {
  host: 'postgres',
  user: 'hypechat',
  database: 'hypechat',
  password: 'hypechat',
  port: 5432
};
const pool = new pg.Pool(config);
pool.connect(function (err, client, done) {
  if (err) {
      console.log("Can not connect to the DB" + err);
      throw err;
  }
  console.log("DB connection was succesfull.");
})

// routes
var userRoutes = require('./api/routes/UserRoutes');
userRoutes(app);

app.listen(port);

console.log('HypeChat RESTful API server started on: ' + port);