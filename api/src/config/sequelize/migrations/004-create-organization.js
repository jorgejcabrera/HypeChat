'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Organization', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      // TODO: define how to store images.
      // For now let's just use an external URL.
      image: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          isUrl: true,
        },
      },
      // TODO: check how to store the location.
      location: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      creatorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' },
      },
      description: {
        type: Sequelize.STRING,
      },
      welcomeMessage: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      // TODO: Active users
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
    return queryInterface.dropTable('Organizations');
  },
};
