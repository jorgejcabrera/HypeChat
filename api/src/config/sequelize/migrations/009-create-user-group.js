'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserGroup', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' },
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Group', key: 'id' },
      },
      isActive: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }).then(function() {
      return queryInterface.addConstraint('UserGroup',['userId','groupId'], {
        type: 'unique',
        name: 'user_group_unique_constraint',
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserGroup');
  },
};
