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
    // TODO: define how to store images first.
    // image: {
    //   type: type.STRING,
    // },
    location: {
      allowNull: false,
      type: type.STRING,
    },
    // TODO: add relation to users.
    creator: {
      allowNull: false,
      type: type.STRING,
    },
    description: {
      type: type.STRING,
    },
    welcomeMessage: {
      type: type.STRING,
    },
    // TODO: Active users
  });

  Organization.associate = (models) => {
    // Add any relations (foreign keys) here.
  };

  return Organization;
};