'use strict';

var bcrypt = require('bcrypt');

module.exports = {
  up: async(queryInterface, Sequelize) => {
    if (process.env.NODE_ENV === 'test') return;
    return queryInterface.bulkInsert('User', [{
      firstName: 'Tito',
      lastName: 'Bot',
      email: 'titobot@hypechat.com',
      password: await bcrypt.hash('titosPassword123!', 10),
      status: 'ACTIVE',
      isAdmin: false,
      createdAt: '2019-04-30T20:26:11.519Z',
      updatedAt: '2019-04-30T20:26:11.519Z',
      firebaseToken: null,
      isBot: true,
      isGlobalBot: true,
      callbackOnMention:
        process.env.NODE_ENV === 'production' ?
          'https://hypechat-tito-bot.herokuapp.com/tito' :
          'http://botservice.hypechat:5000/tito',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {
      where: {
        email: 'titobot@hypechat.com',
      },
    });
  },
};
