'use strict';

var {
  express,
  logger,
  swaggerUi,
  swaggerDocument,
  firebaseAdmin,
} = require('./config/dependencies');

var { CorsHandler, ErrorHandler, AuthHandler } = require('./middleware');

var serviceAccount = require('./config/serviceAccountKey.json');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Initialize firebase
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://hypechat-fda96.firebaseio.com',
});

// Enable CORS.
app.use(CorsHandler.cors);

// Fetch user and add it to request.
app.use(AuthHandler.authenticate);

require('./routes')(app);

// Handle any errors.
app.use(ErrorHandler.default);

module.exports = app;
