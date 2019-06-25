'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'callbackOnNewMember', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'User',
      'callbackOnNewMember'
    );
  },
};
