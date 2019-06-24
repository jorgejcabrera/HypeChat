'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('Group', 'totalMessages', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ];
  },

  down: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('Group', 'totalMessages', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ];
  },
};
