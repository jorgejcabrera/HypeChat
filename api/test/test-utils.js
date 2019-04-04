'use strict';

var faker = require('faker');
var models = require('../src/models');
var services = require('../src/services');

var TestUtils = {};

TestUtils.clearDB = async() => {
  for (var key in models) {
    if (['Database'].includes(key)) continue;
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

  return await services.UserService.create(await data(props));
};

TestUtils.authenticatedUserFactory = async(props = {}) => {
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

  var userData = await data(props);
  var email = userData.email;
  var password = userData.password;
  var user = await services.UserService.create(userData);
  user.auth = await services.AuthService.login(email, password);

  return user;
};

TestUtils.workspaceFactory = async(props = {}) => {
  const data = async(props = {}) => {
    const defaultProps = {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
      location: faker.address.streetAddress(),
      creatorId: 1,
    };
    return Object.assign({}, defaultProps, props);
  };
  return await services.WorkspaceService.create(await data(props));
};

module.exports = TestUtils;
