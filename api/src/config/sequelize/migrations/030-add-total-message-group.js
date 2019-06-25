'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('Group', 'totalMessages', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }),
    ];
  },

  down: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('Group', 'totalMessages'),
    ];
  },
};
