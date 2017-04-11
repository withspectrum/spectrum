const passport = require('passport');
const { Strategy: TwitterStrategy } = require('passport-twitter');
const { getUser, createOrFindUser } = require('./models/user');

const init = ({ twitterCallbackURLBase }) => {
  // Setup use serialization
  passport.serializeUser((user, done) => {
    done(null, user.uid);
  });

  passport.deserializeUser((uid, done) => {
    getUser(uid)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  });

  // Set up Twitter login
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: 'vxmsICGyIIoT5NEYi1I8baPrf',
        consumerSecret: 'uH7CqsEWPTgMHu7rp8UhiaoS7bzgN53h3od95BEJBFEgUQzMOq',
        callbackURL: `${twitterCallbackURLBase}/auth/twitter/callback`,
      },
      (token, tokenSecret, profile, done) => {
        const user = {
          providerId: profile.id,
          username: profile.username,
          displayName: profile.displayName ||
            (profile.name &&
              `${profile.name.givenName} ${profile.name.familyName}`) ||
            null,
          email: (profile.emails &&
            profile.emails.length > 0 &&
            profile.emails[0].value) ||
            null,
          photoURL: (profile.photos &&
            profile.photos.length > 0 &&
            profile.photos[0].value) ||
            null,
          createdAt: new Date(),
          lastSeen: new Date(),
        };

        createOrFindUser(user)
          .then(user => {
            console.log(user);
            done(null, user);
          })
          .catch(err => {
            done(err);
          });
      }
    )
  );
};

module.exports = {
  init,
};
