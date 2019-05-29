'use strict';

var {
  express,
  logger,
  passport,
  FacebookStrategy,
  swaggerUi,
  swaggerDocument,
  firebaseAdmin,
} = require('./config/dependencies');

var { CorsHandler, ErrorHandler, AuthHandler } = require('./middleware');

var serviceAccount = require('./config/serviceAccountKey.json');
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
        user = {
          facebookId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
        };
      }
      console.log(user);
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));
}

// Enable CORS.
app.use(CorsHandler.cors);

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
