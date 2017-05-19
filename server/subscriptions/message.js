/**
 * Define the message subscription resolvers
 */
module.exports = {
  Subscription: {
    messageAdded: message => console.log('sub', message) || message,
  },
};
