'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn('User', 'base64Image', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ];
  },

  down: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn('User', 'base64Image', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ];
  },
};
