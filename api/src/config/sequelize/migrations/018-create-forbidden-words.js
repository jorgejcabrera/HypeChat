'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ForbiddenWord', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      workspaceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      word: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      replaceBy: {
        allowNull: false,
        type: Sequelize.STRING,
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
      return queryInterface.addConstraint(
        'ForbiddenWord', ['workspaceId', 'word'], {
          type: 'unique',
          name: 'forbidden_word_unique_constraint',
        });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ForbiddenWord');
  },
};
