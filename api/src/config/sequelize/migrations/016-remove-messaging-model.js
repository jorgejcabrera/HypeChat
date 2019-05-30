'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.dropTable('MessageRecipient'),
      await queryInterface.dropTable('Message'),
    ];
  },
};
