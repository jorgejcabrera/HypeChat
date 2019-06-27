'use strict';

var {
  express,
  log,
  morgan,
  passport,
  FacebookStrategy,
  swaggerUi,
  swaggerDocument,
  firebaseAdmin,
} = require('./config/dependencies');

var { CorsHandler, ErrorHandler, AuthHandler } = require('./middleware');
var { UserService } = require('./services');

var app = express();

// Initialize passport.
if (process.env.NODE_ENV !== 'test') {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  }, async(accessToken, refreshToken, profile, done) => {
    try {
      var user = await UserService.getByFacebookId(profile.id);
      if (!user) {
        log.info('Creating new user with facebookId ' + profile.id);
        user = {
          facebookId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
        };
        user = await UserService.create(user);
      } else {
        log.info('New Facebook login for user with facebookId ' + profile.id);
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));
}

// Enable CORS.
app.use(CorsHandler.cors);

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(morgan(
  'Request: :method :url ',
  { immediate: true, stream: log.stream }
));
app.use((req, res, next) => {
  if (req.body) {
    log.debug('Request body: ', JSON.stringify(req.body, null, 2));
    log.debug('Headers: ', JSON.stringify(req.headers, null, 2));
  }
  next();
});
app.use(morgan(
  'Response: :status - :response-time ms',
  { stream: log.stream }
));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Initialize firebase
var cert = JSON.parse(process.env.FIREBASE_CONFIG);
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(cert),
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
