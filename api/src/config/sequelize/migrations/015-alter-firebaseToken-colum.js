'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'firebaseToken', {
      type: Sequelize.STRING,
    },);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'User',
      'firebaseToken'
    );
  },
};
