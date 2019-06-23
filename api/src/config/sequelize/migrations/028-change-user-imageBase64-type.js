'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn('Workspace', 'base64Image', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ];
  },

  down: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn('Workspace', 'base64Image', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ];
  },
};
