'use strict';

module.exports = (sequelize, type) => {
  var Organization = sequelize.define('Organization', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING
    },
    // TODO: define how to store images. 
    // For now let's just use an external URL.
    image: {
      allowNull: false,
      type: type.STRING,
      validate: {
          isUrl: true,
      }
    },
    // TODO: check how to store the location.
    location: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    // TODO: add relation to users.
    creator: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    welcomeMessage: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    // TODO: Active users
  }, {
    hooks: {
        beforeCreate: (organization, options) => {
            organization.welcomeMessage = "Welcome to " + organization.name + "!";
        },
    }
  });

  Organization.associate = (models) => {
    // Add any relations (foreign keys) here.
  };

  return Organization;
};