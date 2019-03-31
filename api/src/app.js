'use strict';

var {
  express,
  logger,
  swaggerUi,
  swaggerDocument,
} = require('./config/dependencies');

var { Auth, User } = require('./models');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Enable CORS.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Auth, X-Client'
  );
  next();
});

// Fetch user and add it to request.
app.use(async(req, res, next) => {
  var accessToken = req.headers['x-auth'];
  if (accessToken) {
    var auth = await Auth.findOne({
      where: { accessToken },
      include: [
        { model: User, as: 'user' },
      ],
    });
    if (auth) {
      req.user = auth.user.toJSON();
    }
  }
  console.log(req.user);
  next();
});

require('./routes')(app);

module.exports = app;
