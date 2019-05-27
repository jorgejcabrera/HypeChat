'use strict';

var { firebaseAdmin } = require('../config/dependencies');

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
}

FirebaseService.sendMessage = async(payload) => {
    //do something
}
module.exports = FirebaseService;
