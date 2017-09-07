require('source-map-support/register');
module.exports = /******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        /******/ configurable: false,
        /******/ enumerable: true,
        /******/ get: getter,
        /******/
      });
      /******/
    }
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default'];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, 'a', getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = '/'; // Load entry module and return exports
  /******/
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 5));
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };

      /**
 * Database setup is done here
 */
      const fs = __webpack_require__(11);
      const path = __webpack_require__(12);
      const IS_PROD = !process.env.FORCE_DEV && 'development' === 'production';

      const DEFAULT_CONFIG = {
        db: 'spectrum',
      };

      const PRODUCTION_CONFIG = {
        password: process.env.COMPOSE_RETHINKDB_PASSWORD,
        host: process.env.COMPOSE_RETHINKDB_URL,
        port: process.env.COMPOSE_RETHINKDB_PORT,
        ssl: {
          ca: IS_PROD && __webpack_require__(13),
        },
      };

      const config = IS_PROD
        ? _extends({}, DEFAULT_CONFIG, PRODUCTION_CONFIG)
        : _extends({}, DEFAULT_CONFIG);

      var r = __webpack_require__(14)(config);

      module.exports = { db: r };

      // /**
      //  * Database setup is done here
      //  */
      // const fs = require('fs');
      // const path = require('path');
      // const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';
      //
      // const DEFAULT_CONFIG = {
      //   db: 'spectrum',
      // };
      //
      // // COMPOSE_RETHINKDB_URL="aws-us-east-1-portal.6.dblayer.com"
      // // COMPOSE_RETHINKDB_PORT=19241
      // // COMPOSE_RETHINKDB_PASSWORD="12460d0b-b1dc-4505-9cd5-7a96e58ad825"
      //
      // const PRODUCTION_CONFIG = {
      //   password: "12460d0b-b1dc-4505-9cd5-7a96e58ad825",
      //   host: "aws-us-east-1-portal.6.dblayer.com"  ,
      //   port: 19241,
      //   ssl: {
      //     ca: !IS_PROD && require('raw-loader!../../cacert'),
      //   },
      // };
      //
      // const config = !IS_PROD
      //   ? {
      //       ...DEFAULT_CONFIG,
      //       ...PRODUCTION_CONFIG,
      //     }
      //   : {
      //       ...DEFAULT_CONFIG,
      //     };
      //
      // var r = require('rethinkdbdash')(config);
      //
      // module.exports = { db: r };

      /***/
    },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      const Queue = __webpack_require__(9);
      const Raven = __webpack_require__(3);

      if (false) {
        Raven.config(
          'https://3bd8523edd5d43d7998f9b85562d6924:d391ea04b0dc45b28610e7fad735b0d0@sentry.io/154812',
          {
            environment: process.env.NODE_ENV,
          }
        ).install();
      }

      const redis = false
        ? {
            port: process.env.COMPOSE_REDIS_PORT,
            host: process.env.COMPOSE_REDIS_URL,
            password: process.env.COMPOSE_REDIS_PASSWORD,
          }
        : undefined; // Use the local instance of Redis in development by not passing any connection string

      // Leave the options undefined if we're using the default redis connection
      const options = redis && { redis: redis };

      function createQueue(name /*: string */) {
        const queue = new Queue(name, options);
        queue.on('stalled', job => {
          const message = `Job#${job.id} stalled, processing again.`;
          if (true) {
            console.error(message);
            return;
          }
          // In production log stalled job to Sentry
          Raven.captureException(new Error(message));
        });
        return new Queue(name, options);
      }

      module.exports = createQueue;

      /***/
    },
    /* 2 */
    /***/ function(module, exports) {
      module.exports = require('debug');

      /***/
    },
    /* 3 */
    /***/ function(module, exports) {
      module.exports = require('raven');

      /***/
    },
    /* 4 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      // counts for processing
      // the thread must have at least # total messages
      const MIN_TOTAL_MESSAGE_COUNT = (exports.MIN_TOTAL_MESSAGE_COUNT = 1);
      // # of the total messages must have been sent in the past week
      const MIN_NEW_MESSAGE_COUNT = (exports.MIN_NEW_MESSAGE_COUNT = 1);
      // # only show the top # threads per channel
      const MAX_THREAD_COUNT_PER_CHANNEL = (exports.MAX_THREAD_COUNT_PER_CHANNEL = 10);
      // don't send the digest if the email will have less than # total threads to show
      const MIN_THREADS_REQUIRED_FOR_DIGEST = (exports.MIN_THREADS_REQUIRED_FOR_DIGEST = 1);
      // cap the digest at # threads
      const MAX_THREAD_COUNT_PER_DIGEST = (exports.MAX_THREAD_COUNT_PER_DIGEST = 10);
      // upsell communities to join if the user has joined less than # communities
      const COMMUNITY_UPSELL_THRESHOLD = (exports.COMMUNITY_UPSELL_THRESHOLD = 5);

      // generate a score for each thread based on the total number of messages and number of new messages
      // new messages rank higher in order to devalue old threads that have a large amount of old messages (like pinned posts)
      // the end weekly digest will have threads sorted by the weight of (TOTAL * WEIGHT) + (NEW * WEIGHT)
      const TOTAL_MESSAGE_COUNT_WEIGHT = (exports.TOTAL_MESSAGE_COUNT_WEIGHT = 0.1);
      const NEW_MESSAGE_COUNT_WEIGHT = (exports.NEW_MESSAGE_COUNT_WEIGHT = 1.5);

      /*
  Example weighting:
  A thread with 150 messages, where 5 are new this week: 22.5
  A thread with 10 total messages, where all 10 are new this week: 16
  A thread with 25 total messages, where 10 are old and 15 are new this week: 25
*/

      // queues
      const SEND_WEEKLY_DIGEST_EMAIL = (exports.SEND_WEEKLY_DIGEST_EMAIL =
        'send weekly digest email');

      /***/
    },
    /* 5 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(6);

      /***/
    },
    /* 6 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _sendWeeklyDigestEmail = __webpack_require__(7);

      var _sendWeeklyDigestEmail2 = _interopRequireDefault(
        _sendWeeklyDigestEmail
      );

      var _constants = __webpack_require__(4);

      var _jobs = __webpack_require__(20);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      const debug = __webpack_require__(2)('hermes');
      const createWorker = __webpack_require__(24);

      const PORT = process.env.PORT || 3004;

      console.log('\n✉️ Chronos, the cron job worker, is starting...');
      debug('Logging with debug enabled!');
      console.log('');

      const server = createWorker({
        [_constants.SEND_WEEKLY_DIGEST_EMAIL]: _sendWeeklyDigestEmail2.default,
      });

      console.log(
        `🗄 Crons open for business ${('development' === 'production' &&
          `at ${process.env.COMPOSE_REDIS_URL}:${process.env
            .COMPOSE_REDIS_PORT}`) ||
          'locally'}`
      );

      server.listen(PORT, 'localhost', () => {
        console.log(
          `💉 Healthcheck server running at ${server.address()
            .address}:${server.address().port}`
        );
      });

      /***/
    },
    /* 7 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };

      var _lodash = __webpack_require__(8);

      var _lodash2 = _interopRequireDefault(_lodash);

      var _createQueue = __webpack_require__(1);

      var _createQueue2 = _interopRequireDefault(_createQueue);

      var _constants = __webpack_require__(4);

      var _thread = __webpack_require__(10);

      var _usersSettings = __webpack_require__(15);

      var _usersChannels = __webpack_require__(16);

      var _usersCommunities = __webpack_require__(17);

      var _message = __webpack_require__(18);

      var _community = __webpack_require__(19);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _objectWithoutProperties(obj, keys) {
        var target = {};
        for (var i in obj) {
          if (keys.indexOf(i) >= 0) continue;
          if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
          target[i] = obj[i];
        }
        return target;
      }

      const debug = __webpack_require__(2)(
        'chronos:queue:send-weekly-digest-email'
      );
      // $FlowFixMe

      const sendWeeklyDigestEmailQueue = (0, _createQueue2.default)(
        _constants.SEND_WEEKLY_DIGEST_EMAIL
      );

      exports.default = job => {
        debug(`\nnew job: ${job.id}`);
        debug(`\nprocessing weekly digest`);

        /*
      1. Get all threads in the database that were active in the last week. For each thread, construct a new object containing the thread data and the message count from the server
  */
        const allActiveThreadsThisWeek = async () => {
          // returns array of thread ids
          const threadIds = await (0, _thread.getActiveThreadsInPastWeek)();
          debug('\n ⚙️ Fetched all active threads this week');

          // if no threadIds, escape
          if (!threadIds || threadIds.length === 0) {
            debug('\n ❌  No active threads found');
            return;
          }

          // for each thread that was active in the last week, return a new array containing a record for each thread with the thread data and the message count
          const messageCountPromises = threadIds.map(async _ref => {
            let { communityId, channelId, id, content } = _ref,
              thread = _objectWithoutProperties(_ref, [
                'communityId',
                'channelId',
                'id',
                'content',
              ]);

            return {
              communityId,
              channelId,
              id,
              title: content.title,
              newMessageCount: await (0, _message.getNewMessageCount)(id),
              totalMessageCount: await (0, _message.getTotalMessageCount)(id),
            };
          });

          // promise all the active threads and message counts
          const messageCounts = await Promise.all(messageCountPromises);
          debug('\n ⚙️ Fetched message counts for threads');

          // remove any threads where the total message count is less than 10
          const filteredTopThreads = messageCounts
            .filter(
              thread =>
                thread.totalMessageCount >= _constants.MIN_TOTAL_MESSAGE_COUNT
            )
            .filter(
              thread =>
                thread.newMessageCount >= _constants.MIN_NEW_MESSAGE_COUNT
            );
          debug('\n ⚙️ Filtered threads with enough messages');

          // returns an array of threads that are active in the last week and have the minimum required message count to be considered valuable
          return filteredTopThreads;
        };

        /*
      2. Given an array of all the active threads this week that contain the minimum message count required, we now aggregate them by the channel where they were posted.
       The return value from this function is an object with keys representing channelIds and values representing an array of threads
  */
        const activeThreadsByChannel = async () => {
          // get all the active threads from this week
          const topThreads = await allActiveThreadsThisWeek();

          // if no topThreads, escape
          if (!topThreads || topThreads.length === 0) {
            debug('\n ❌  No topThreads found');
            return;
          }

          // create an empty object for the final output
          let obj = {};

          const getCommunity = id => (0, _community.getCommunityById)(id);

          // for each thread, get the community data that we'll need when rendering an email
          const topThreadsWithCommunityDataPromises = topThreads.map(
            async thread => {
              const community = await getCommunity(thread.communityId);

              // this is the final data we'll send to the email for each thread
              const obj = {
                community: {
                  name: community.name,
                  slug: community.slug,
                  profilePhoto: community.profilePhoto,
                },
                channelId: thread.channelId,
                title: thread.title,
                threadId: thread.id,
                newMessageCount: thread.newMessageCount,
                totalMessageCount: thread.totalMessageCount,
              };
              return obj;
            }
          );

          const threadsWithCommunityData = await Promise.all(
            topThreadsWithCommunityDataPromises
          );
          // for each of the active threads this week, determine if that that thread has been categorized yet into the new object. If so, push that thread into the array, otherwise create a new key/value pair in the object for the channel + thread
          const finalThreads = threadsWithCommunityData.map(
            thread =>
              obj[thread.channelId]
                ? (obj[thread.channelId] = [
                    ...obj[thread.channelId],
                    _extends({}, thread),
                  ])
                : (obj[thread.channelId] = [_extends({}, thread)])
          );

          const finishedTopThreads = await Promise.all(finalThreads);
          debug('\n ⚙️ Organized top threads by channel');

          // return the final object containing keys for channelIds, and arrays of threads for values
          return obj;
        };

        /*
      3. In this step we process and aggregate user settings, users channels, and the thread data fetched above
       a. first, get all the userIds of people who have opted to receive a weekly digest
      b. for each person, get an array of channelIds where that user is a member
      c. determine if there is any overlap between the user's channels and the active threads from the past week. Note: this filters out people who are members of inactive communities, even if they are opted in to receive a weekly digest
  */
        const eligibleUsersForWeeklyDigest = async () => {
          // get users who have opted to receive a weekly digest
          const users = await (0, _usersSettings.getUsersForWeeklyDigest)();
          debug('\n ⚙️ Fetched users who want to receive a weekly digest');

          // for each user who wants a weekly digest, fetch an array of channelIds where they are a member
          const channelConnectionPromises = users.map(async _ref2 => {
            let { email, firstName, userId } = _ref2,
              user = _objectWithoutProperties(_ref2, [
                'email',
                'firstName',
                'userId',
              ]);

            return {
              email,
              name: firstName || null,
              userId,
              channels: await (
                0,
                _usersChannels.getUsersChannelsEligibleForWeeklyDigest
              )(userId),
            };
          });

          // fetch all usersChannels
          const usersWithChannels = await Promise.all(
            channelConnectionPromises
          );
          debug('\n ⚙️ Fetched users eligible channels');

          // get all the threads, organized by channel, in scope
          const threadData = await activeThreadsByChannel();

          // if no threads exist
          if (!threadData) {
            debug('\n ❌  No threadData found');
            return;
          }

          // get an array of all channels where there are active threads this week
          const threadChannelKeys = Object.keys(threadData);

          // for each user, determine the overlapping channels where they are a member and where active threads occurred this week
          const getIntersectingChannels = usersWithChannels.map(e => {
            return _extends({}, e, {
              channels: (0, _lodash2.default)(e.channels, threadChannelKeys),
            });
          });
          debug(
            '\n ⚙️ Filtered intersecting channels between the user and the top threads this week'
          );

          // based on the intersecting channels, get the threads that could appear in the user's weekly digest
          const rawThreadsForUsersEmail = getIntersectingChannels.map(e => {
            let arr = [];
            e.channels.map(c => arr.push(...threadData[c]));
            return _extends({}, e, {
              threads: [...arr],
            });
          });
          debug(
            '\n ⚙️ Fetched all the possible threads this user could receive in a weekly digest'
          );

          // if no rawThreadsForUsersEmail, escape
          if (
            !rawThreadsForUsersEmail ||
            rawThreadsForUsersEmail.length === 0
          ) {
            debug('\n ❌  No rawThreads found');
            return;
          }

          // we don't want to send a weekly digest to someone with only one thread for that week - so in this step we filter out any results where the thread count is less than the miminimum acceptable threshhold
          const eligibleUsersForWeeklyDigest = rawThreadsForUsersEmail
            .filter(
              user =>
                user.threads.length > _constants.MIN_THREADS_REQUIRED_FOR_DIGEST
            )
            // and finally, sort the user's threads in descending order by message count
            .map(_ref3 => {
              let { channels } = _ref3,
                user = _objectWithoutProperties(_ref3, ['channels']);

              // for each thread, assign a score based on the total message count and new message count
              const threadsWithScores = user.threads.map(thread =>
                _extends({}, thread, {
                  score:
                    thread.newMessageCount *
                      _constants.NEW_MESSAGE_COUNT_WEIGHT +
                    thread.totalMessageCount *
                      _constants.TOTAL_MESSAGE_COUNT_WEIGHT,
                })
              );

              return _extends({}, user, {
                threads: threadsWithScores
                  .sort((a, b) => b.score - a.score)
                  .slice(0, _constants.MAX_THREAD_COUNT_PER_DIGEST),
              });
            });

          debug(
            '\n ⚙️ Filtered users who have enough threads to qualify for a weekly digest'
          );

          /*
      The result of our operations so far has given us an array with the following shape:
       [
        {
          userId: ID,
          email: String,
          name?: String // returns null if user doesn't have a first name
          threads: [{ thread1 }, { thread2}, ... ]
        }
        ...
      ]
       Where a thread contains the following information:
      {
        communityId: ID,
        channelId: ID,
        id: ID,
        title: String,
        messageCount: Number
      }
    */
          return eligibleUsersForWeeklyDigest;
        };

        const processSendWeeklyDigests = async () => {
          const eligibleUsers = await eligibleUsersForWeeklyDigest();
          debug('\n ⚙️  Got eligible users');
          const topCommunities = await (0, _community.getTopCommunities)(20);
          debug('\n ⚙️  Got top communities');

          // if no elegible users, escape
          if (!eligibleUsers || eligibleUsers.length === 0) {
            debug('\n ❌  No eligible users');
            return;
          }

          debug('\n👉 Eligible users data');
          debug(eligibleUsers);
          debug('\n👉 Example array of threads');
          debug(eligibleUsers[0].threads);
          debug('\n👉 Example thread data for email');
          debug(eligibleUsers[0].threads[0]);

          const sendDigestPromises = topCommunities =>
            eligibleUsers.map(async user => {
              // see what communities the user is in. if they are a member of less than 3 communities, we will upsell communities to join in the weekly digest
              const usersCommunityIds = await (
                0,
                _usersCommunities.getUsersCommunityIds
              )(user.userId);
              debug('\n ⚙️  Got users communities');
              // if the user has joined less than three communities, take the top communities on Spectrum, remove any that the user has already joined, and slice the first 3 to send into the email template
              const communities =
                usersCommunityIds.length < _constants.COMMUNITY_UPSELL_THRESHOLD
                  ? topCommunities
                      .filter(
                        community =>
                          usersCommunityIds.indexOf(community.id) <= -1
                      )
                      .slice(0, 3)
                  : null;

              debug('\n ⚙️  Processed community upsells for email digest');

              return await sendWeeklyDigestEmailQueue.add(
                _extends({}, user, { communities })
              );
            });

          return await Promise.all(sendDigestPromises(topCommunities));
        };

        return processSendWeeklyDigests().catch(err => {
          debug('❌  Error sending weekly digest');
          debug(err);
          console.log('Error sending weekly digests: ', err);
        });
      };

      // migration
      // r.db('spectrum')
      //   .table('usersSettings')
      //   .filter({userId: '01p2A7kDCWUjGj6zQLlMQUOSQL42'})
      //   .update({
      //     notifications: {
      //       types: {
      //         newMessageInThreads: {
      //          email: r.row('notifications')('types')('newMessageInThreads')(
      //            'email'
      //          ),
      //         },
      //         newThreadCreated: {
      //          email: r.row('notifications')('types')('newThreadCreated')(
      //            'email'
      //          ),
      //         },
      //         newDirectMessage: {
      //          email: r.row('notifications')('types')('newDirectMessage')(
      //            'email'
      //          ),
      //         },
      //         weeklyDigest: {
      //          email: true
      //         },
      //       },
      //     },
      //   })

      /***/
    },
    /* 8 */
    /***/ function(module, exports) {
      module.exports = require('lodash.intersection');

      /***/
    },
    /* 9 */
    /***/ function(module, exports) {
      module.exports = require('bull');

      /***/
    },
    /* 10 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      const { db } = __webpack_require__(0);

      const getActiveThreadsInPastWeek = (exports.getActiveThreadsInPastWeek = () => {
        return db
          .table('threads')
          .filter(
            db.row('lastActive').during(
              // Change this to 60*60*24*7 to get weekly active users
              db.now().sub(60 * 60 * 24 * 7),
              db.now()
            )
          )
          .filter(thread => db.not(thread.hasFields('deletedAt')))
          .run();
      });

      /***/
    },
    /* 11 */
    /***/ function(module, exports) {
      module.exports = require('fs');

      /***/
    },
    /* 12 */
    /***/ function(module, exports) {
      module.exports = require('path');

      /***/
    },
    /* 13 */
    /***/ function(module, exports) {
      module.exports =
        '-----BEGIN CERTIFICATE-----\nMIIDbzCCAlegAwIBAgIEWRMkLjANBgkqhkiG9w0BAQ0FADA5MTcwNQYDVQQDDC5T\ncGFjZSBQcm9ncmFtLTc5Njk3YmRkYTQxNTg3YjFmMzk4MzYxNDhlNmJjMTZhMB4X\nDTE3MDUxMDE0MzExMFoXDTM3MDUxMDE0MDAwMFowOTE3MDUGA1UEAwwuU3BhY2Ug\nUHJvZ3JhbS03OTY5N2JkZGE0MTU4N2IxZjM5ODM2MTQ4ZTZiYzE2YTCCASIwDQYJ\nKoZIhvcNAQEBBQADggEPADCCAQoCggEBALwgqk6SZZah3eVlCvZ8sFHDaHPWekVt\n1k3XAUkV+SrxijNGWNPnzkumXEd+qWYS9gYL9ak1otEjbxPR9B7+zBiPOFbwX1fE\n5o97W0gxjwS8iJGL3brSmSuJAfqx3be3l2Da4tpdgmQgKVID3c7E4AVFdgh0snh5\nNAChbx/BZXtCyJNk8gRR0G9tX01EtAumoRe3PkHs6CN0ObUNX7W9l1G6J5N00ECU\nZBEcXIyQ/lNzpJrIzcBrZ75mocyCVkp5HINjs0mG+CrSgVzY5KMtWOPFlr1KuH9P\nDXwYBDAKI3sKxj3Bgmwq1WtFbhTfuZkynxSZ0rgnr+aVFcszL2ZRVDMCAwEAAaN/\nMH0wHQYDVR0OBBYEFIXsudbQwxml7S2NjYaFCcTs0meUMA4GA1UdDwEB/wQEAwIC\nBDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0TBAUwAwEB/zAf\nBgNVHSMEGDAWgBSF7LnW0MMZpe0tjY2GhQnE7NJnlDANBgkqhkiG9w0BAQ0FAAOC\nAQEAfjae2H+mdzABC9Kkh/tLUPKtGu1c3/3QSq4RTPyOAsCgmtWO2NSUcEI928eo\n8EJvljx8Xo2vl3DbD9OmbWzPeUqQMm2Wsq98RB80KRvQAFSwOKMDqyv0+C/UGnnw\nry3UMfTuY5Y2rRwsY4Z6FDPWnLJJKIa6aKutYo1pzkkvphtwq8lPQO2NW4uTrpjG\nuhhH2cmtBUZRvRGIey29Z0TXufUNN6EAcbo0JxEuux6HotXbwI0wRwPmqHLNbSWw\ngCd/pne0Pjryvw6XHzd4CQUsElWafmOf/+N760O1RCC/XCzOnsjUSLiAt9R7C/Ao\niS3oQCP1KMbyfpulMFctZJR0kQ==\n-----END CERTIFICATE-----\n';

      /***/
    },
    /* 14 */
    /***/ function(module, exports) {
      module.exports = require('rethinkdbdash');

      /***/
    },
    /* 15 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      const { db } = __webpack_require__(0);

      const getUsersForWeeklyDigest = (exports.getUsersForWeeklyDigest = () => {
        return db
          .table('usersSettings')
          .filter(row =>
            row('notifications')('types')('weeklyDigest')('email').eq(true)
          )
          .eqJoin('userId', db.table('users'))
          .zip()
          .pluck(['userId', 'email', 'firstName', 'name'])
          .distinct()
          .run();
      });

      /***/
    },
    /* 16 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      const { db } = __webpack_require__(0);

      const getUsersChannelsEligibleForWeeklyDigest = (exports.getUsersChannelsEligibleForWeeklyDigest = userId => {
        return db
          .table('usersChannels')
          .getAll(userId, { index: 'userId' })
          .filter({ isMember: true })
          .map(row => row('channelId'))
          .run();
      });

      /***/
    },
    /* 17 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      const { db } = __webpack_require__(0);
      const debug = __webpack_require__(2)(
        'hermes:queue:send-weekly-digest-email'
      );

      const getUsersCommunityIds = (exports.getUsersCommunityIds = userId => {
        debug(userId);
        return (
          db
            .table('usersCommunities')
            .getAll(userId, { index: 'userId' })
            .filter({ isMember: true })
            .run()
            // return an array of the userIds to be loaded by gql
            .then(
              communities =>
                debug(communities) ||
                communities.map(community => community.communityId)
            )
        );
      });

      /***/
    },
    /* 18 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      const { db } = __webpack_require__(0);

      const getTotalMessageCount = (exports.getTotalMessageCount = threadId => {
        return db
          .table('messages')
          .getAll(threadId, { index: 'threadId' })
          .count()
          .run();
      });

      const getNewMessageCount = (exports.getNewMessageCount = threadId => {
        return db
          .table('messages')
          .getAll(threadId, { index: 'threadId' })
          .filter(
            db.row('timestamp').during(
              // only count messages sent in the past week
              db.now().sub(60 * 60 * 24 * 7),
              db.now()
            )
          )
          .count()
          .run();
      });

      /***/
    },
    /* 19 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      const { db } = __webpack_require__(0);

      const getCommunityById = (exports.getCommunityById = id => {
        return db.table('communities').get(id).run();
      });

      const getTopCommunities = (exports.getTopCommunities = amount => {
        return db
          .table('communities')
          .pluck('id')
          .run()
          .then(communities => communities.map(community => community.id))
          .then(communityIds => {
            return Promise.all(
              communityIds.map(community => {
                return db
                  .table('usersCommunities')
                  .getAll(community, { index: 'communityId' })
                  .filter({ isMember: true })
                  .count()
                  .run()
                  .then(count => {
                    return {
                      id: community,
                      count,
                    };
                  });
              })
            );
          })
          .then(data => {
            let sortedCommunities = data
              .sort((x, y) => {
                return y.count - x.count;
              })
              .map(community => community.id)
              .slice(0, amount);

            return db
              .table('communities')
              .getAll(...sortedCommunities)
              .filter(community => db.not(community.hasFields('deletedAt')))
              .run();
          });
      });

      /***/
    },
    /* 20 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _utils = __webpack_require__(21);

      // weekly digest
      const weeklyDigest = (0, _utils.createJob)(
        'send weekly digest email',
        '01 * * * * *', // run every second
        true
      );

      module.exports = {
        weeklyDigest,
      };

      /***/
    },
    /* 21 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.createJob = exports.addQueue = undefined;

      var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };

      var _raven = __webpack_require__(3);

      var _raven2 = _interopRequireDefault(_raven);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      const CronJob = __webpack_require__(22).CronJob;
      const createQueue = __webpack_require__(1);

      // logging to Sentry for weekly digests
      if (false) {
        _raven2.default
          .config(
            'https://3bd8523edd5d43d7998f9b85562d6924:d391ea04b0dc45b28610e7fad735b0d0@sentry.io/154812',
            {
              environment: process.env.NODE_ENV,
            }
          )
          .install();
      }

      const addQueue = (exports.addQueue = (name, data, opts) => {
        const worker = createQueue(name);
        return worker
          .add(_extends({}, data), _extends({}, opts))
          .catch(err => _raven2.default.captureException(err));
      });

      const createJob = (exports.createJob = (
        name,
        pattern,
        start // start immediately
      ) => {
        try {
          const job = new CronJob({
            cronTime: pattern,
            onTick: () => {
              console.log('🕑 New cron job initiated');
              return addQueue(
                name,
                {},
                { removeOnComplete: true, removeOnFail: true }
              );
            },
            start,
            timeZone: 'America/Los_Angeles',
          });

          return job.start();
        } catch (err) {
          console.log('❌ Error processing cron job:\n' + err);
        }
      });

      /***/
    },
    /* 22 */
    /***/ function(module, exports, __webpack_require__) {
      var __WEBPACK_AMD_DEFINE_FACTORY__,
        __WEBPACK_AMD_DEFINE_ARRAY__,
        __WEBPACK_AMD_DEFINE_RESULT__;
      (function(root, factory) {
        if (true) {
          !(
            (__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(23)]),
            (__WEBPACK_AMD_DEFINE_FACTORY__ = factory),
            (__WEBPACK_AMD_DEFINE_RESULT__ =
              typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function'
                ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(
                    exports,
                    __WEBPACK_AMD_DEFINE_ARRAY__
                  )
                : __WEBPACK_AMD_DEFINE_FACTORY__),
            __WEBPACK_AMD_DEFINE_RESULT__ !== undefined &&
              (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)
          );
        } else if (typeof exports === 'object') {
          module.exports = factory(
            require('moment-timezone'),
            require('child_process')
          );
        } else {
          root.Cron = factory(root.moment);
        }
      })(this, function(moment, child_process) {
        var exports = {},
          timeUnits = [
            'second',
            'minute',
            'hour',
            'dayOfMonth',
            'month',
            'dayOfWeek',
          ],
          spawn = child_process && child_process.spawn;

        function CronTime(source, zone) {
          this.source = source;

          if (zone) {
            if (moment.tz.names().indexOf(zone) === -1) {
              throw new Error('Invalid timezone.');
            }

            this.zone = zone;
          }

          var that = this;
          timeUnits.map(function(timeUnit) {
            that[timeUnit] = {};
          });

          if (this.source instanceof Date) {
            this.source = moment(this.source);
            this.realDate = true;
          } else {
            this._parse();
            this._verifyParse();
          }
        }

        CronTime.constraints = [
          [0, 59],
          [0, 59],
          [0, 23],
          [1, 31],
          [0, 11],
          [0, 6],
        ];
        CronTime.monthConstraints = [
          31,
          29, //support leap year...not perfect
          31,
          30,
          31,
          30,
          31,
          31,
          30,
          31,
          30,
          31,
        ];
        CronTime.parseDefaults = ['0', '*', '*', '*', '*', '*'];
        CronTime.aliases = {
          jan: 0,
          feb: 1,
          mar: 2,
          apr: 3,
          may: 4,
          jun: 5,
          jul: 6,
          aug: 7,
          sep: 8,
          oct: 9,
          nov: 10,
          dec: 11,
          sun: 0,
          mon: 1,
          tue: 2,
          wed: 3,
          thu: 4,
          fri: 5,
          sat: 6,
        };

        CronTime.prototype = {
          _verifyParse: function() {
            var months = Object.keys(this.month);
            for (var i = 0; i < months.length; i++) {
              var m = months[i];
              var con = CronTime.monthConstraints[parseInt(m, 10)];
              var ok = false;
              var dsom = Object.keys(this.dayOfMonth);
              for (var j = 0; j < dsom.length; j++) {
                var dom = dsom[j];
                if (dom <= con) ok = true;
              }

              if (!ok) {
                console.warn(
                  "Month '" + m + "' is limited to '" + con + "' days."
                );
              }
            }
          },

          /**
	 * calculates the next send time
	 */
          sendAt: function(i) {
            var date = this.realDate ? this.source : moment();
            // Set the timezone if given (http://momentjs.com/timezone/docs/#/using-timezones/parsing-in-zone/)
            if (this.zone) date = date.tz(this.zone);

            if (this.realDate) return date;

            //add 1 second so next time isn't now (can cause timeout to be 0 or negative number)
            var now = new Date();
            var targetSecond = date.seconds();
            var diff = Math.abs(targetSecond - now.getSeconds());
            // there was a problem when `date` is 1424777177999 and `now` is 1424777178000
            // 1 ms diff but this is another second...
            if (
              diff == 0 ||
              (diff == 1 && now.getMilliseconds() <= date.milliseconds())
            ) {
              //console.log('add 1 second?');
              date = date.add(1, 's');
            }

            //If the i argument is not given, return the next send time
            if (isNaN(i) || i < 0) {
              date = this._getNextDateFrom(date);
              return date;
            } else {
              //Else return the next i send times
              var dates = [];
              for (; i > 0; i--) {
                date = this._getNextDateFrom(date);
                dates.push(moment(date));
                if (i > 1) date.add(1, 's');
              }
              return dates;
            }
          },

          /**
	 * Get the number of milliseconds in the future at which to fire our callbacks.
	 */
          getTimeout: function() {
            return Math.max(-1, this.sendAt() - moment());
          },

          /**
	 * writes out a cron string
	 */
          toString: function() {
            return this.toJSON().join(' ');
          },

          /**
	 * Json representation of the parsed cron syntax.
	 */
          toJSON: function() {
            var self = this;
            return timeUnits.map(function(timeName) {
              return self._wcOrAll(timeName);
            });
          },

          /**
	 * get next date that matches parsed cron time
	 */
          _getNextDateFrom: function(start) {
            var date = moment(start);
            if (date.toString() == 'Invalid date') {
              console.log('ERROR: You specified an invalid date.');
              return date;
            }
            if (this.realDate && start < new Date())
              console.log('WARNING: Date in past. Will never be fired.');
            if (this.realDate) return date;

            //sanity check
            while (true) {
              var diff = date - start,
                origDate = new Date(date);

              if (!(date.month() in this.month)) {
                date.add(1, 'M');
                date.date(1);
                date.hours(0);
                date.minutes(0);
                date.seconds(0);
                continue;
              }

              if (!(date.date() in this.dayOfMonth)) {
                date.add(1, 'd');
                date.hours(0);
                date.minutes(0);
                date.seconds(0);
                continue;
              }

              if (!(date.day() in this.dayOfWeek)) {
                date.add(1, 'd');
                date.hours(0);
                date.minutes(0);
                date.seconds(0);
                if (date <= origDate) {
                  date = this._findDST(origDate);
                }
                continue;
              }

              if (!(date.hours() in this.hour)) {
                origDate = moment(date);
                date.hours(
                  date.hours() == 23 && diff > 86400000 ? 0 : date.hours() + 1
                );
                date.minutes(0);
                date.seconds(0);
                if (date <= origDate) {
                  date = this._findDST(origDate);
                }
                continue;
              }

              if (!(date.minutes() in this.minute)) {
                origDate = moment(date);
                date.minutes(
                  date.minutes() == 59 && diff > 60 * 60 * 1000
                    ? 0
                    : date.minutes() + 1
                );
                date.seconds(0);
                if (date <= origDate) {
                  date = this._findDST(origDate);
                }
                continue;
              }

              if (!(date.seconds() in this.second)) {
                origDate = moment(date);
                date.seconds(
                  date.seconds() == 59 && diff > 60 * 1000
                    ? 0
                    : date.seconds() + 1
                );
                if (date <= origDate) {
                  date = this._findDST(origDate);
                }
                continue;
              }

              break;
            }

            return date;
          },

          /**
	 * get next date that is a valid DST date
	 */
          _findDST: function(date) {
            var newDate = moment(date);
            while (newDate <= date) newDate.add(1, 's');

            return newDate;
          },

          /**
	 * wildcard, or all params in array (for to string)
	 */
          _wcOrAll: function(type) {
            if (this._hasAll(type)) return '*';

            var all = [];
            for (var time in this[type]) {
              all.push(time);
            }

            return all.join(',');
          },

          _hasAll: function(type) {
            var constrain = CronTime.constraints[timeUnits.indexOf(type)];

            for (var i = constrain[0], n = constrain[1]; i < n; i++) {
              if (!(i in this[type])) return false;
            }

            return true;
          },

          _parse: function() {
            var aliases = CronTime.aliases,
              source = this.source.replace(/[a-z]{1,3}/gi, function(alias) {
                alias = alias.toLowerCase();

                if (alias in aliases) {
                  return aliases[alias];
                }

                throw new Error('Unknown alias: ' + alias);
              }),
              split = source.replace(/^\s\s*|\s\s*$/g, '').split(/\s+/),
              cur,
              i = 0,
              len = timeUnits.length;

            for (; i < timeUnits.length; i++) {
              // If the split source string doesn't contain all digits,
              // assume defaults for first n missing digits.
              // This adds support for 5-digit standard cron syntax
              cur =
                split[i - (len - split.length)] || CronTime.parseDefaults[i];
              this._parseField(cur, timeUnits[i], CronTime.constraints[i]);
            }
          },

          _parseField: function(field, type, constraints) {
            var rangePattern = /^(\d+)(?:-(\d+))?(?:\/(\d+))?$/g,
              typeObj = this[type],
              pointer,
              low = constraints[0],
              high = constraints[1];

            // * is a shortcut to [lower-upper] range
            field = field.replace(/\*/g, low + '-' + high);

            //commas separate information, so split based on those
            var allRanges = field.split(',');

            for (var i = 0; i < allRanges.length; i++) {
              if (allRanges[i].match(rangePattern)) {
                allRanges[i].replace(rangePattern, function(
                  $0,
                  lower,
                  upper,
                  step
                ) {
                  step = parseInt(step) || 1;
                  // Positive integer higher than constraints[0]
                  lower = Math.min(Math.max(low, ~~Math.abs(lower)), high);

                  // Positive integer lower than constraints[1]
                  upper = upper ? Math.min(high, ~~Math.abs(upper)) : lower;

                  // Count from the lower barrier to the upper
                  pointer = lower;

                  do {
                    typeObj[pointer] = true;
                    pointer += step;
                  } while (pointer <= upper);
                });
              } else {
                throw new Error('Field (' + field + ') cannot be parsed');
              }
            }
          },
        };

        function command2function(cmd) {
          var command, args;
          switch (typeof cmd) {
            case 'string':
              args = cmd.split(' ');
              command = args.shift();

              cmd = spawn.bind(undefined, command, args);
              break;
            case 'object':
              command = cmd && cmd.command;
              if (command) {
                args = cmd.args;
                var options = cmd.options;

                cmd = spawn.bind(undefined, command, args, options);
              }
              break;
          }

          return cmd;
        }

        function CronJob(
          cronTime,
          onTick,
          onComplete,
          startNow,
          timeZone,
          context,
          runOnInit
        ) {
          var _cronTime = cronTime;
          if (typeof cronTime != 'string' && arguments.length == 1) {
            //crontime is an object...
            onTick = cronTime.onTick;
            onComplete = cronTime.onComplete;
            context = cronTime.context;
            startNow = cronTime.start || cronTime.startNow || cronTime.startJob;
            timeZone = cronTime.timeZone;
            runOnInit = cronTime.runOnInit;
            _cronTime = cronTime.cronTime;
          }

          this.context = context || this;
          this._callbacks = [];
          this.onComplete = command2function(onComplete);
          this.cronTime = new CronTime(_cronTime, timeZone);

          addCallback.call(this, command2function(onTick));

          if (runOnInit) fireOnTick.call(this);
          if (startNow) start.call(this);

          return this;
        }

        var addCallback = function(callback) {
          if (typeof callback == 'function') this._callbacks.push(callback);
        };
        CronJob.prototype.addCallback = addCallback;

        CronJob.prototype.setTime = function(time) {
          if (!(time instanceof CronTime))
            throw new Error("'time' must be an instance of CronTime.");
          this.stop();
          this.cronTime = time;
        };

        CronJob.prototype.nextDate = function() {
          return this.cronTime.sendAt();
        };

        var fireOnTick = function() {
          for (var i = this._callbacks.length - 1; i >= 0; i--)
            this._callbacks[i].call(this.context, this.onComplete);
        };
        CronJob.prototype.fireOnTick = fireOnTick;

        CronJob.prototype.nextDates = function(i) {
          return this.cronTime.sendAt(i);
        };

        var start = function() {
          if (this.running) return;

          var MAXDELAY = 2147483647; // The maximum number of milliseconds setTimeout will wait.
          var self = this;
          var timeout = this.cronTime.getTimeout();
          var remaining = 0;
          var startTime;

          if (this.cronTime.realDate) this.runOnce = true;

          function _setTimeout(timeout) {
            startTime = Date.now();
            self._timeout = setTimeout(callbackWrapper, timeout);
          }

          // The callback wrapper checks if it needs to sleep another period or not
          // and does the real callback logic when it's time.

          function callbackWrapper() {
            var diff = startTime + timeout - Date.now();

            if (diff > 0) {
              var newTimeout = self.cronTime.getTimeout();

              if (newTimeout > diff) {
                newTimeout = diff;
              }

              remaining += newTimeout;
            }

            // If there is sleep time remaining, calculate how long and go to sleep
            // again. This processing might make us miss the deadline by a few ms
            // times the number of sleep sessions. Given a MAXDELAY of almost a
            // month, this should be no issue.

            self.lastExecution = new Date();
            if (remaining) {
              if (remaining > MAXDELAY) {
                remaining -= MAXDELAY;
                timeout = MAXDELAY;
              } else {
                timeout = remaining;
                remaining = 0;
              }

              _setTimeout(timeout);
            } else {
              // We have arrived at the correct point in time.

              self.running = false;

              //start before calling back so the callbacks have the ability to stop the cron job
              if (!self.runOnce) self.start();

              self.fireOnTick();
              //for (var i = (self._callbacks.length - 1); i >= 0; i--)
              //self._callbacks[i].call(self.context, self.onComplete);
            }
          }

          if (timeout >= 0) {
            this.running = true;

            // Don't try to sleep more than MAXDELAY ms at a time.

            if (timeout > MAXDELAY) {
              remaining = timeout - MAXDELAY;
              timeout = MAXDELAY;
            }

            _setTimeout(timeout);
          } else {
            this.stop();
          }
        };

        CronJob.prototype.start = start;

        CronJob.prototype.lastDate = function() {
          return this.lastExecution;
        };

        /**
 * Stop the cronjob.
 */
        CronJob.prototype.stop = function() {
          if (this._timeout) clearTimeout(this._timeout);
          this.running = false;
          if (typeof this.onComplete == 'function') this.onComplete();
        };

        exports.job = function(cronTime, onTick, onComplete) {
          return new CronJob(cronTime, onTick, onComplete);
        };

        exports.time = function(cronTime, timeZone) {
          return new CronTime(cronTime, timeZone);
        };

        exports.sendAt = function(cronTime) {
          return exports.time(cronTime).sendAt();
        };

        exports.timeout = function(cronTime) {
          return exports.time(cronTime).getTimeout();
        };

        exports.CronJob = CronJob;
        exports.CronTime = CronTime;

        return exports;
      });

      /***/
    },
    /* 23 */
    /***/ function(module, exports) {
      module.exports = require('moment-timezone');

      /***/
    },
    /* 24 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      // Create a worker with bull and start a small webserver which responds with
      // health information
      const http = __webpack_require__(25);
      const createQueue = __webpack_require__(1);

      /*::
type QueueMap = {
  [name: string]: (job: any) => Promise<any>
}
*/

      // Helper function to sum properties of an array of objects
      // e.g. [{ completed: 6 }, { completed: 2 }] => 8
      const sumArr = (
        input /*: Array<Object> */,
        prop /*: number */ /*: string */
      ) => {
        return input.reduce((sum, item) => sum + item[prop], 0);
      };

      const createWorker = (queueMap /*: QueueMap */) => {
        // Start processing the queues
        const queues = Object.keys(queueMap).map(name => {
          const queue = createQueue(name);
          queue.process(queueMap[name]);
          return queue;
        });

        return http.createServer((req, res) => {
          res.setHeader('Content-Type', 'application/json');
          // Summarize the data across all the queues
          Promise.all(
            queues.map(queue => queue.getJobCounts())
          ).then(jobCounts => {
            const data = {
              waiting: sumArr(jobCounts, 'waiting'),
              active: sumArr(jobCounts, 'active'),
              completed: sumArr(jobCounts, 'completed'),
              failed: sumArr(jobCounts, 'failed'),
              delayed: sumArr(jobCounts, 'delayed'),
            };

            res.end(JSON.stringify(data, null, 2));
          });
        });
      };

      module.exports = createWorker;

      /***/
    },
    /* 25 */
    /***/ function(module, exports) {
      module.exports = require('http');

      /***/
    },
    /******/
  ]
);
//# sourceMappingURL=main.map
