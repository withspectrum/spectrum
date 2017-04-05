const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const cache = require('memory-cache');

const ONE_HOUR = 3600000;

module.exports = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const cached = cache.get('result');
    if (cached) return res.json(cached);

    admin
      .database()
      .ref('/frequencies')
      .orderByChild('settings/private')
      .equalTo(false)
      .once('value')
      .then(snapshot => {
        const val = snapshot.val();
        const frequencies = Object.keys(val);

        const top30 = frequencies
          .sort((a, b) => {
            let numUsersA = Object.keys(val[a].users).length;
            let numUsersB = Object.keys(val[b].users).length;
            return numUsersA < numUsersB ? 1 : -1;
          })
          .slice(3, 33)
          .map(id => val[id]);

        // Cache results for an hour to avoid stressing the db
        cache.put('result', top30, ONE_HOUR);

        return res.json(top30);
      });
  });
});
