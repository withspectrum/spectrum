const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// exports.emailNotifications = functions.database
//   .ref('/notifications/{userId}')
//   .onWrite(event => {
//     console.log(event.data.val());
//     return event.data.val();
//   });
exports.shortener = require('./sp.chat.js');
exports.payments = require('./payments.js');
exports.topFreqs = require('./top-freqs.js');
