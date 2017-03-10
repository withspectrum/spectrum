const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.emailNotifications = functions
	.database
  .ref('/notifications/{userId}')
  .onWrite(event => {
    console.log(event.data.val());
    return event.data.val();
  });
