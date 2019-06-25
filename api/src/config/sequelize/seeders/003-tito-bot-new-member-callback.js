'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    if (process.env.NODE_ENV === 'test') return;
    return queryInterface.bulkUpdate('User', {
      callbackOnNewMember:
        process.env.NODE_ENV === 'production' ?
          'https://hypechat-tito-bot.herokuapp.com/tito/newmember' :
          'http://botservice.hypechat:5000/tito/newmember',
    }, { id: 6 });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkUpdate('User', {
      callbackOnNewMember: null,
    }, { id: 6 });
  },
};
