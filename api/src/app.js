'use strict';

var {
  express,
  logger,
  passport,
  FacebookStrategy,
  swaggerUi,
  swaggerDocument,
} = require('./config/dependencies');

var { CorsHandler, ErrorHandler, AuthHandler } = require('./middleware');

var { UserService } = require('./services');

var app = express();

// Initialize passport.
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

// Enable CORS.
app.use(CorsHandler.cors);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Fetch user and add it to request.
app.use(AuthHandler.authenticate);

require('./routes')(app);

// Handle any errors.
app.use(ErrorHandler.default);

module.exports = app;
