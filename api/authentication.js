// @flow
require('now-env');
const passport = require('passport');
const { Strategy: TwitterStrategy } = require('passport-twitter');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { Strategy: GoogleStrategy } = require('passport-google-oauth2');
const { Strategy: GitHubStrategy } = require('passport-github2');
const {
  getUserById,
  createOrFindUser,
  saveUserProvider,
  getUserByIndex,
} = require('shared/db/queries/user');

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

const CALLBACK_BASE = IS_PROD
  ? 'https://spectrum.chat'
  : 'http://localhost:3001';

const isSerializedJSON = (str: string) =>
  str[0] === '{' && str[str.length - 1] === '}';

const init = () => {
  // Setup use serialization
  passport.serializeUser((user, done) => {
    done(null, typeof user === 'string' ? user : JSON.stringify(user));
  });

  // NOTE(@mxstbr): `data` used to be just the userID, but is now the full user data
  // to avoid having to go to the db on every single request. We have to handle both
  // cases here, as more and more users use Spectrum again we go to the db less and less
  passport.deserializeUser((data, done) => {
    // Fast path: we got the full user data in the cookie
    if (isSerializedJSON(data)) {
      let user;
      // Ignore errors if our isSerializedJSON heuristic is wrong and `data` isn't serialized JSON
      try {
        user = JSON.parse(data);
      } catch (err) {}

      if (user && user.id && user.createdAt) {
        return done(null, user);
      }
    }

    // Slow path: data is just the userID (legacy), so we have to go to the db to get the full data
    return getUserById(data)
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
        consumerKey: TWITTER_OAUTH_CLIENT_ID,
        consumerSecret: TWITTER_OAUTH_CLIENT_SECRET,
        callbackURL: `${CALLBACK_BASE}/auth/twitter/callback`,
        includeEmail: true,
      },
      (token, tokenSecret, profile, done) => {
        const name =
          profile.displayName ||
          profile._json.name ||
          profile._json.screen_name ||
          profile.username ||
          '';

        const user = {
          providerId: profile.id,
          fbProviderId: null,
          googleProviderId: null,
          githubProviderId: null,
          username: null,
          name: name,
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
        };

        return createOrFindUser(user, 'providerId')
          .then(user => {
            done(null, user);
            return user;
          })
          .catch(err => {
            return done(null, err, {
              message: 'Please sign in with GitHub to create a new account.',
            });
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
        callbackURL: `${CALLBACK_BASE}/auth/facebook/callback`,
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
        };

        return createOrFindUser(user, 'fbProviderId')
          .then(user => {
            done(null, user);
            return user;
          })
          .catch(err => {
            return done(null, err, {
              message: 'Please sign in with GitHub to create a new account.',
            });
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
        callbackURL: `${CALLBACK_BASE}/auth/google/callback`,
      },
      (token, tokenSecret, profile, done) => {
        const name =
          profile.displayName || profile.name
            ? `${profile.name.givenName} ${profile.name.familyName}`
            : '';
        const user = {
          providerId: null,
          fbProviderId: null,
          googleProviderId: profile.id,
          githubProviderId: null,
          username: null,
          name: name,
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
        };

        return createOrFindUser(user, 'googleProviderId')
          .then(user => {
            done(null, user);
            return user;
          })
          .catch(err => {
            return done(null, err, {
              message: 'Please sign in with GitHub to create a new account.',
            });
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
        callbackURL: `${CALLBACK_BASE}/auth/github/callback`,
        scope: ['user'],
        passReqToCallback: true,
      },
      async (req, token, tokenSecret, profile, done) => {
        const name =
          profile.displayName || profile.username || profile._json.name || '';

        const splitProfileUrl = profile.profileUrl.split('/');
        const fallbackUsername = splitProfileUrl[splitProfileUrl.length - 1];
        const githubUsername =
          profile.username || profile._json.login || fallbackUsername;

        const existingUserWithProviderId = await getUserByIndex(
          'githubProviderId',
          profile.id
        );

        if (req.user) {
          // if a user exists in the request body, it means the user is already
          // authed and is trying to connect a github account. Before we do so
          // we need to make sure that:
          // 1. The user doesn't have an existing githubProviderId on their user
          // 2. The providerId returned from GitHub isnt' being used by another user

          // 1
          if (req.user.githubProviderId) {
            /*
              Update the cached content of the github profile that we store
              in redis for the graphql resolver. This allows us to put a button
              on the client for a user to re-connect a github profile from
              the web app which will update the cache with any changed usernames
            */
            if (
              !req.user.githubUsername ||
              req.user.githubUsername !== githubUsername
            ) {
              return saveUserProvider(
                req.user.id,
                'githubProviderId',
                profile.id,
                { githubUsername: githubUsername }
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

            return done(null, req.user);
          }

          // 2
          // if no user exists with this provider id, it's safe to save on the req.user's object
          if (!existingUserWithProviderId) {
            return saveUserProvider(
              req.user.id,
              'githubProviderId',
              profile.id,
              { githubUsername: githubUsername }
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
            return done(null, req.user, {
              message:
                'Your GitHub account is already linked to another Spectrum profile.',
            });
          }
        }

        const user = {
          providerId: null,
          fbProviderId: null,
          googleProviderId: null,
          githubProviderId: profile.id,
          githubUsername: githubUsername,
          username: null,
          name: name,
          description: profile._json.bio,
          website: profile._json.blog,
          email:
            (profile.emails &&
              profile.emails.length > 0 &&
              profile.emails[0].value) ||
            null,
          profilePhoto:
            (profile._json.avatar_url && profile._json.avatar_url) || null,
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
