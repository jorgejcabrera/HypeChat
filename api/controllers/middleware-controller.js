'use strict';

var MiddlewareController = {};
MiddlewareController.name = 'MiddlewareController';

MiddlewareController.isUserAuthenticated = (req, res, next) => {
  console.log('paso por el middleware');
  next();
};

/*
const isUserAuthenticated = (req, res, next) => {
  var accessToken = req.headers['X-Auth'];

  console.log('paso por el middleware');
  if (typeof accessToken !== 'undefined') {
    Auth.findOne({ where: {accessToken} })
      .then(auth => {
        if (auth) {
          res.locals.auth = {
            auth,
          };
        } else {
          res.status(403).send('Invalid token.');
        }
      });
    next();
  } else {
    res.status(401).send('Unauthorized.');
  }
};*/

module.exports = MiddlewareController;
