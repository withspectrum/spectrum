// @flow
require('now-env');
const passport = require('passport');
const { Strategy: TwitterStrategy } = require('passport-twitter');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { Strategy: GoogleStrategy } = require('passport-google-oauth2');
const { Strategy: GitHubStrategy } = require('passport-github2');
const {
  getUser,
  createOrFindUser,
  saveUserProvider,
  getUserByIndex,
} = require('./models/user');

const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

const TWITTER_OAUTH_CLIENT_SECRET = IS_PROD
  ? process.env.TWITTER_OAUTH_CLIENT_SECRET
  : process.env.TWITTER_OAUTH_CLIENT_SECRET_DEVELOPMENT;

const FACEBOOK_OAUTH_CLIENT_ID = IS_PROD
  ? process.env.FACEBOOK_OAUTH_CLIENT_ID
  : process.env.FACEBOOK_OAUTH_CLIENT_SECRET_DEVELOPMENT;

const FACEBOOK_OAUTH_CLIENT_SECRET = IS_PROD
  ? process.env.FACEBOOK_OAUTH_CLIENT_SECRET
  : process.env.FACEBOOK_OAUTH_CLIENT_SECRET_DEVELOPMENT;

const GOOGLE_OAUTH_CLIENT_SECRET = IS_PROD
  ? process.env.GOOGLE_OAUTH_CLIENT_SECRET
  : process.env.GOOGLE_OAUTH_CLIENT_SECRET_DEVELOPMENT;

const GITHUB_OAUTH_CLIENT_SECRET = IS_PROD
  ? process.env.GITHUB_OAUTH_CLIENT_SECRET
  : process.env.GITHUB_OAUTH_CLIENT_SECRET_DEVELOPMENT;

const TWITTER_OAUTH_CLIENT_ID = IS_PROD
  ? 'vxmsICGyIIoT5NEYi1I8baPrf'
  : 'Qk7BWFe44JKswEw2sNaDAA4x7';

const GOOGLE_OAUTH_CLIENT_ID = IS_PROD
  ? '923611718470-chv7p9ep65m3fqqjr154r1p3a5j6oidc.apps.googleusercontent.com'
  : '923611718470-hjribk5128dr3s26cbp5cbdecigrsjsp.apps.googleusercontent.com';

const GITHUB_OAUTH_CLIENT_ID = IS_PROD
  ? '208a2e8684d88883eded'
  : 'ed3e924f4a599313c83b';

const init = () => {
  // Setup use serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    getUser({ id })
      .then(user => {
        done(null, user);
        return null;
      })
      .catch(err => {
        done(err);
        return null;
      });
  });

  // Set up Twitter login
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: TWITTER_OAUTH_CLIENT_ID,
        consumerSecret: TWITTER_OAUTH_CLIENT_SECRET,
        callbackURL: '/auth/twitter/callback',
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

        return createOrFindUser(user, 'providerId')
          .then(user => {
            done(null, user);
            return user;
          })
          .catch(err => {
            done(err);
            return null;
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
        callbackURL: '/auth/facebook/callback',
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
            profile.emails &&
            profile.emails.length > 0 &&
            profile.emails[0].value !== undefined
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

        return createOrFindUser(user, 'fbProviderId')
          .then(user => {
            done(null, user);
            return user;
          })
          .catch(err => {
            done(err);
            return null;
          });
      }
    )
  );

  // Set up Google login
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
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

        return createOrFindUser(user, 'googleProviderId')
          .then(user => {
            done(null, user);
            return user;
          })
          .catch(err => {
            done(err);
            return null;
          });
      }
    )
  );

  // Set up GitHub login
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_OAUTH_CLIENT_ID,
        clientSecret: GITHUB_OAUTH_CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
        scope: ['user'],
        passReqToCallback: true,
      },
      async (req, token, tokenSecret, profile, done) => {
        if (req.user) {
          // if a user exists in the request body, it means the user is already
          // authed and is trying to connect a github account. Before we do so
          // we need to make sure that:
          // 1. The user doesn't have an existing githubProviderId on their user
          // 2. The providerId returned from GitHub isnt' being used by another user

          // 1
          // if the user already has a githubProviderId, don't override it
          if (req.user.githubProviderId) {
            return done(null, req.user);
          }

          const existingUserWithProviderId = await getUserByIndex(
            'githubProviderId',
            profile.id
          );

          // 2
          // if no user exists with this provider id, it's safe to save on the req.user's object
          if (!existingUserWithProviderId) {
            return saveUserProvider(
              req.user.id,
              'githubProviderId',
              profile.id,
              { githubUsername: profile.username }
            )
              .then(user => {
                done(null, user);
                return user;
              })
              .catch(err => {
                done(err);
                return null;
              });
          }

          // if a user exists with this provider id, don't do anything and return
          if (existingUserWithProviderId) {
            return done(null, req.user);
          }
        }

        const user = {
          providerId: null,
          fbProviderId: null,
          googleProviderId: null,
          githubProviderId: profile.id,
          githubUsername: profile.username,
          username: null,
          name: profile.displayName || null,
          description: profile._json.bio,
          website: profile._json.blog,
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

        return createOrFindUser(user, 'githubProviderId')
          .then(user => {
            done(null, user);
            return user;
          })
          .catch(err => {
            done(err);
            return null;
          });
      }
    )
  );
};

module.exports = {
  init,
};
