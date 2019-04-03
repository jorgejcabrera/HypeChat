'use strict';

module.exports = (sequelize, type) => {
  var Organization = sequelize.define('Organization', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    name: {
      allowNull: false,
      type: type.STRING,
    },
    // TODO: define how to store images.
    // For now let's just use an external URL.
    image: {
      allowNull: false,
      type: type.STRING,
      validate: {
        isUrl: true,
      },
    },
    // TODO: check how to store the location.
    location: {
      allowNull: false,
      type: type.STRING,
    },
    creatorId: {
      allowNull: false,
      type: type.INTEGER,
    },
    description: {
      type: type.STRING,
    },
    welcomeMessage: {
      allowNull: false,
      type: type.STRING,
    },
    // TODO: Active users
  }, {
    hooks: {
      beforeCreate: (organization, options) => {
        organization.welcomeMessage = 'Welcome to ' + organization.name + '!';
      },
    },
  });

  Organization.associate = (models) => {
    // Add any relations (foreign keys) here.
    Organization.belongsTo(models.User, { as: 'creator', foreignKey: 'creatorId' })
  };

  return Organization;
};
