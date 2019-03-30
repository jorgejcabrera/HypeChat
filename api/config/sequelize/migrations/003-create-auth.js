'use strict';

/* TODO 
  1- create access token index
  2- create fk
  3- maybe we can use (userId,accessToken) like pk
  */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Auth', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      accessToken: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Auth');
  },
};
