'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('User', 'facebookId', {
        type: Sequelize.STRING,
        allowNull: true,
      },),
      await queryInterface.changeColumn('User', 'password', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ];
  },

  down: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('User', 'facebookId'),
      await queryInterface.changeColumn('User', 'password', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'invalid',
      }),
    ];
  },
};
