'use strict';

var { firebaseAdmin, moment } = require('../config/dependencies');

var FirebaseService = {};
FirebaseService.name = 'FirebaseService';

FirebaseService.sendNofication = async(firebaseToken, payload, options) => {
  firebaseAdmin.messaging().sendToDevice(firebaseToken, payload, options)
    .then((response) => {
      console.log('Firebase: Successfully sent message:', response);
      console.log(response.results[0].error);
    })
    .catch((error) => {
      console.log('Firebase: Error sending message:', error);
    });
};

FirebaseService.sendMessage = async(messageData) => {
  var refRoute;
  if (messageData.groupId) {
    // TODO validar que sea un group valido.
    // (deberia validarse antes de llegar acá)
    refRoute = 'messages/groups/group' + messageData.groupId;
  } else {
    // TODO ver que hacer acá.
    refRoute = 'messages/users';
  }

  var ref = firebaseAdmin.database().ref(refRoute);
  ref.push({
    from: messageData.username,
    message: messageData.message,
    timestamp: moment().format(),
  });
};
module.exports = FirebaseService;
