// @flow
// $FlowFixMe
const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, './.env'), { raise: false });
}
// $FlowFixMe
const passport = require('passport');
// $FlowFixMe
const { Strategy: TwitterStrategy } = require('passport-twitter');
// $FlowFixMe
const { Strategy: FacebookStrategy } = require('passport-facebook');
// $FlowFixMe
const { Strategy: GoogleStrategy } = require('passport-google-oauth2');
// $FlowFixMe
const { Strategy: GitHubStrategy } = require('passport-github2');
const { getUser, createOrFindUser } = require('./models/user');

let TWITTER_OAUTH_CLIENT_SECRET = process.env.TWITTER_OAUTH_CLIENT_SECRET;
let FACEBOOK_OAUTH_CLIENT_ID = process.env.FACEBOOK_OAUTH_CLIENT_ID;
let FACEBOOK_OAUTH_CLIENT_SECRET = process.env.FACEBOOK_OAUTH_CLIENT_SECRET;
let GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
let GITHUB_OAUTH_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET;

const init = () => {
  // Setup use serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    getUser({ id })
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
        consumerSecret: TWITTER_OAUTH_CLIENT_SECRET,
        callbackURL: `/auth/twitter/callback`,
        includeEmail: true,
      },
      (token, tokenSecret, profile, done) => {
        const user = {
          providerId: profile.id,
          fbProviderId: null,
          googleProviderId: null,
          githubProviderId: null,
          username: null,
          name:
            profile.displayName ||
            (profile.name &&
              `${profile.name.givenName} ${profile.name.familyName}`) ||
            null,
          email:
            (profile.emails &&
              profile.emails.length > 0 &&
              profile.emails[0].value) ||
            null,
          profilePhoto:
            (profile.photos &&
              profile.photos.length > 0 &&
              profile.photos[0].value) ||
            null,
          coverPhoto: profile._json.profile_background_image_url_https
            ? profile._json.profile_background_image_url_https
            : null,
          description:
            profile._json.description && profile._json.description.length > 0
              ? profile._json.description
              : '',
          website:
            profile._json.entities.url &&
            profile._json.entities.url.urls &&
            profile._json.entities.url.urls.length > 0
              ? profile._json.entities.url.urls[0].expanded_url
              : '',
          createdAt: new Date(),
          lastSeen: new Date(),
        };

        createOrFindUser(user, 'providerId')
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            done(err);
          });
      }
    )
  );

  // Set up Facebook login
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_OAUTH_CLIENT_ID,
        clientSecret: FACEBOOK_OAUTH_CLIENT_SECRET,
        callbackURL: `/auth/facebook/callback`,
        profileFields: [
          'id',
          'displayName',
          'email',
          'photos',
          'about',
          'cover',
          'first_name',
          'last_name',
          'website',
        ],
      },
      (token, tokenSecret, profile, done) => {
        const user = {
          providerId: null,
          fbProviderId: profile.id,
          googleProviderId: null,
          githubProviderId: null,
          username: null,
          name: profile.displayName,
          firstName:
            profile.name && profile.name.givenName
              ? profile.name.givenName
              : '',
          lastName:
            profile.name && profile.name.familyName
              ? profile.name.familyName
              : '',
          description: profile.about ? profile.about : '',
          website: profile.website ? profile.website : '',
          email:
            profile.emails.length > 0 && profile.emails[0].value !== undefined
              ? profile.emails[0].value
              : null,
          profilePhoto:
            profile.photos &&
            profile.photos.length > 0 &&
            profile.photos[0].value !== undefined
              ? profile.photos[0].value
              : null,
          coverPhoto: profile._json.cover ? profile._json.cover.source : '',
          createdAt: new Date(),
          lastSeen: new Date(),
        };

        createOrFindUser(user, 'fbProviderId')
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            done(err);
          });
      }
    )
  );

  // Set up Google login
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          '923611718470-chv7p9ep65m3fqqjr154r1p3a5j6oidc.apps.googleusercontent.com',
        clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: `/auth/google/callback`,
      },
      (token, tokenSecret, profile, done) => {
        const user = {
          providerId: null,
          fbProviderId: null,
          googleProviderId: profile.id,
          githubProviderId: null,
          username: null,
          name:
            profile.displayName ||
            (profile.name &&
              `${profile.name.givenName} ${profile.name.familyName}`) ||
            null,
          firstName:
            profile.name && profile.name.givenName
              ? profile.name.givenName
              : '',
          lastName:
            profile.name && profile.name.familyName
              ? profile.name.familyName
              : '',
          description: profile.tagline ? profile.tagline : '',
          email:
            (profile.emails &&
              profile.emails.length > 0 &&
              profile.emails[0].value) ||
            null,
          profilePhoto:
            (profile.photos &&
              profile.photos.length > 0 &&
              profile.photos[0].value) ||
            null,
          coverPhoto:
            profile._json.cover &&
            profile._json.cover.coverPhoto &&
            profile._json.cover.coverPhoto.url
              ? profile._json.cover.coverPhoto.url
              : '',
          website:
            profile._json.urls && profile._json.urls.length > 0
              ? profile._json.urls[0].value
              : '',
          createdAt: new Date(),
          lastSeen: new Date(),
        };

        createOrFindUser(user, 'googleProviderId')
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            done(err);
          });
      }
    )
  );

  // Set up GitHub login
  passport.use(
    new GitHubStrategy(
      {
        clientID: '208a2e8684d88883eded',
        clientSecret: GITHUB_OAUTH_CLIENT_SECRET,
        callbackURL: `/auth/github/callback`,
        scope: ['user'],
      },
      (token, tokenSecret, profile, done) => {
        const user = {
          providerId: null,
          fbProviderId: null,
          googleProviderId: null,
          githubProviderId: profile.id,
          username: null,
          name: profile.displayName || null,
          email:
            (profile.emails &&
              profile.emails.length > 0 &&
              profile.emails[0].value) ||
            null,
          profilePhoto:
            (profile._json.avatar_url && profile._json.avatar_url) || null,
          createdAt: new Date(),
          lastSeen: new Date(),
        };

        createOrFindUser(user, 'githubProviderId')
          .then(user => {
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
