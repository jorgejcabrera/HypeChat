'use strict';

var bcrypt = require('bcrypt');

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', [{
      firstName: 'Rodrigo',
      lastName: 'Zapico',
      email: 'rodri.zapico@gmail.com',
      password: await bcrypt.hash('somePassword123!', 10),
      status: 'ACTIVE',
      isAdmin: false,
      createdAt: '2019-04-30T20:26:11.519Z',
      updatedAt: '2019-04-30T20:26:11.519Z',
      firebaseToken: null,
    }, {
      firstName: 'Jorge',
      lastName: 'Cabrera',
      email: 'cabrerajjorge@gmail.com',
      password: await bcrypt.hash('somePassword123!', 10),
      status: 'ACTIVE',
      isAdmin: false,
      createdAt: '2019-04-30T21:26:11.519Z',
      updatedAt: '2019-04-30T21:26:11.519Z',
      firebaseToken: null,
    }, {
      firstName: 'Gabriel',
      lastName: 'Robles',
      email: 'GabyRobles93@gmail.com',
      password: await bcrypt.hash('somePassword123!', 10),
      status: 'ACTIVE',
      isAdmin: false,
      createdAt: '2019-04-30T22:26:11.519Z',
      updatedAt: '2019-04-30T22:26:11.519Z',
      firebaseToken: null,
    }, {
      firstName: 'Ariel',
      lastName: 'Alvarez Windey',
      email: 'arieljaw12@gmail.com',
      password: await bcrypt.hash('somePassword123!', 10),
      status: 'ACTIVE',
      isAdmin: false,
      createdAt: '2019-05-01T20:26:11.519Z',
      updatedAt: '2019-05-01T20:26:11.519Z',
      firebaseToken: null,
    }, {
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@test.com',
      password: await bcrypt.hash('adminPassword123!', 10),
      status: 'ACTIVE',
      isAdmin: true,
      createdAt: '2019-05-01T16:26:11.519Z',
      updatedAt: '2019-05-01T16:26:11.519Z',
      firebaseToken: null,
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  },
};
