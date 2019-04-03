'use strict';

var {
  express,
  logger,
  swaggerUi,
  swaggerDocument,
} = require('./config/dependencies');

var { CorsHandler, ErrorHandler, AuthHandler } = require('./middleware');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Enable CORS.
app.use(CorsHandler.cors);

// Fetch user and add it to request.
app.use(AuthHandler.authenticate);

require('./routes')(app);

// Handle any errors.
app.use(ErrorHandler.default);

module.exports = app;
