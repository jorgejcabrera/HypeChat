'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'image', {
      type: Sequelize.STRING,
      validate: {
        isUrl: true,
      },
    },);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'User',
      'image'
    );
  },
};
