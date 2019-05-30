'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('Group', 'visibility', {
        type: Sequelize.ENUM('PUBLIC', 'PRIVATE'),
        defaultValue: 'PUBLIC',
        allowNull: false,
      },),
      await queryInterface.addColumn('Group', 'description', {
        type: Sequelize.STRING,
        defaultValue: 'Descripción del grupo',
        allowNull: false,
      }),
    ];
  },

  down: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('Group', 'visibility'),
      await queryInterface.removeColumn('Group', 'description'),
    ];
  },
};
