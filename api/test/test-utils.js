'use strict';

var faker = require('faker');
var models = require('../src/models');
var services = require('../src/services');

var TestUtils = {};

TestUtils.clearDB = async() => {
  for (var key in models) {
    if (['Database'].includes(key)) return null;
    await models[key].destroy({ where: {}, force: true });
  };
};

TestUtils.userFactory = async(props = {}) => {
  const data = async(props = {}) => {
    const defaultProps = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isAdmin: false,
    };
    return Object.assign({}, defaultProps, props);
  };

  return services.UserService.create(await data(props));
};

module.exports = TestUtils;
