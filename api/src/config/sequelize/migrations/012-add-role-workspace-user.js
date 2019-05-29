'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('WorkspaceUsers', 'role', {
      type: Sequelize.ENUM('CREATOR', 'MODERATOR', 'MEMBER'),
      defaultValue: 'MEMBER',
      required: true,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'WorkspaceUsers',
      'role'
    );
  },
};
