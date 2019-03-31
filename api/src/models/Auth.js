'use strict';

module.exports = (sequelize, type) => {
  var Auth = sequelize.define('Auth', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    userId: {
      type: type.INTEGER,
      allowNull: false,
    },
    accessToken: {
      type: type.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    createdAt: {
      allowNull: false,
      type: type.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: type.DATE,
    },
  });

  Auth.associate = (models) => {
    // Add any relations (foreign keys) here.
    Auth.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Auth;
};
