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
      var fs = __webpack_require__(13);
      var path = __webpack_require__(14);
      var IS_PROD = !process.env.FORCE_DEV && 'development' === 'production';

      var DEFAULT_CONFIG = {
        db: 'spectrum',
      };

      var PRODUCTION_CONFIG = {
        password: process.env.COMPOSE_RETHINKDB_PASSWORD,
        host: process.env.COMPOSE_RETHINKDB_URL,
        port: process.env.COMPOSE_RETHINKDB_PORT,
        ssl: {
          ca: IS_PROD && __webpack_require__(15),
        },
      };

      var config = IS_PROD
        ? _extends({}, DEFAULT_CONFIG, PRODUCTION_CONFIG)
        : _extends({}, DEFAULT_CONFIG);

      var r = __webpack_require__(16)(config);

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

      var Queue = __webpack_require__(11);
      var Raven = __webpack_require__(3);

      if (false) {
        Raven.config(
          'https://3bd8523edd5d43d7998f9b85562d6924:d391ea04b0dc45b28610e7fad735b0d0@sentry.io/154812',
          {
            environment: process.env.NODE_ENV,
          }
        ).install();
      }

      var redis = false
        ? {
            port: process.env.COMPOSE_REDIS_PORT,
            host: process.env.COMPOSE_REDIS_URL,
            password: process.env.COMPOSE_REDIS_PASSWORD,
          }
        : undefined; // Use the local instance of Redis in development by not passing any connection string

      // Leave the options undefined if we're using the default redis connection
      var options = redis && { redis: redis };

      function createQueue(name /*: string */) {
        var queue = new Queue(name, options);
        queue.on('stalled', function(job) {
          var message = 'Job#' + job.id + ' stalled, processing again.';
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
      var MIN_TOTAL_MESSAGE_COUNT = (exports.MIN_TOTAL_MESSAGE_COUNT = 1);
      // # of the total messages must have been sent in the past week
      var MIN_NEW_MESSAGE_COUNT = (exports.MIN_NEW_MESSAGE_COUNT = 1);
      // # only show the top # threads per channel
      var MAX_THREAD_COUNT_PER_CHANNEL = (exports.MAX_THREAD_COUNT_PER_CHANNEL = 10);
      // don't send the digest if the email will have less than # total threads to show
      var MIN_THREADS_REQUIRED_FOR_DIGEST = (exports.MIN_THREADS_REQUIRED_FOR_DIGEST = 1);
      // cap the digest at # threads
      var MAX_THREAD_COUNT_PER_DIGEST = (exports.MAX_THREAD_COUNT_PER_DIGEST = 10);
      // upsell communities to join if the user has joined less than # communities
      var COMMUNITY_UPSELL_THRESHOLD = (exports.COMMUNITY_UPSELL_THRESHOLD = 5);

      // generate a score for each thread based on the total number of messages and number of new messages
      // new messages rank higher in order to devalue old threads that have a large amount of old messages (like pinned posts)
      // the end weekly digest will have threads sorted by the weight of (TOTAL * WEIGHT) + (NEW * WEIGHT)
      var TOTAL_MESSAGE_COUNT_WEIGHT = (exports.TOTAL_MESSAGE_COUNT_WEIGHT = 0.1);
      var NEW_MESSAGE_COUNT_WEIGHT = (exports.NEW_MESSAGE_COUNT_WEIGHT = 1.5);

      /*
  Example weighting:
  A thread with 150 messages, where 5 are new this week: 22.5
  A thread with 10 total messages, where all 10 are new this week: 16
  A thread with 25 total messages, where 10 are old and 15 are new this week: 25
*/

      // queues
      var SEND_WEEKLY_DIGEST_EMAIL = (exports.SEND_WEEKLY_DIGEST_EMAIL =
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

      var _jobs = __webpack_require__(22);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }

      var debug = __webpack_require__(2)('hermes');
      var createWorker = __webpack_require__(26);

      var PORT = process.env.PORT || 3004;

      console.log('\n✉️ Chronos, the cron job worker, is starting...');
      debug('Logging with debug enabled!');
      console.log('');

      var server = createWorker(
        _defineProperty(
          {},
          _constants.SEND_WEEKLY_DIGEST_EMAIL,
          _sendWeeklyDigestEmail2.default
        )
      );

      console.log(_jobs.weeklyDigest);

      console.log(
        '\uD83D\uDDC4 Crons open for business ' +
          (('development' === 'production' &&
            'at ' +
              process.env.COMPOSE_REDIS_URL +
              ':' +
              process.env.COMPOSE_REDIS_PORT) ||
            'locally')
      );

      server.listen(PORT, 'localhost', function() {
        console.log(
          '\uD83D\uDC89 Healthcheck server running at ' +
            server.address().address +
            ':' +
            server.address().port
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

      var _regenerator = __webpack_require__(8);

      var _regenerator2 = _interopRequireDefault(_regenerator);

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

      var _lodash = __webpack_require__(10);

      var _lodash2 = _interopRequireDefault(_lodash);

      var _createQueue = __webpack_require__(1);

      var _createQueue2 = _interopRequireDefault(_createQueue);

      var _constants = __webpack_require__(4);

      var _thread = __webpack_require__(12);

      var _usersSettings = __webpack_require__(17);

      var _usersChannels = __webpack_require__(18);

      var _usersCommunities = __webpack_require__(19);

      var _message = __webpack_require__(20);

      var _community = __webpack_require__(21);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
          }
          return arr2;
        } else {
          return Array.from(arr);
        }
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

      function _asyncToGenerator(fn) {
        return function() {
          var gen = fn.apply(this, arguments);
          return new Promise(function(resolve, reject) {
            function step(key, arg) {
              try {
                var info = gen[key](arg);
                var value = info.value;
              } catch (error) {
                reject(error);
                return;
              }
              if (info.done) {
                resolve(value);
              } else {
                return Promise.resolve(value).then(
                  function(value) {
                    step('next', value);
                  },
                  function(err) {
                    step('throw', err);
                  }
                );
              }
            }
            return step('next');
          });
        };
      }

      var debug = __webpack_require__(2)(
        'chronos:queue:send-weekly-digest-email'
      );
      // $FlowFixMe

      var sendWeeklyDigestEmailQueue = (0, _createQueue2.default)(
        _constants.SEND_WEEKLY_DIGEST_EMAIL
      );

      exports.default = function(job) {
        debug('\nnew job: ' + job.id);
        debug('\nprocessing weekly digest');

        /*
      1. Get all threads in the database that were active in the last week. For each thread, construct a new object containing the thread data and the message count from the server
  */
        var allActiveThreadsThisWeek = (function() {
          var _ref = _asyncToGenerator(
            _regenerator2.default.mark(function _callee2() {
              var threadIds,
                messageCountPromises,
                messageCounts,
                filteredTopThreads;
              return _regenerator2.default.wrap(
                function _callee2$(_context2) {
                  while (1) {
                    switch ((_context2.prev = _context2.next)) {
                      case 0:
                        _context2.next = 2;
                        return (0, _thread.getActiveThreadsInPastWeek)();

                      case 2:
                        threadIds = _context2.sent;

                        debug('\n ⚙️ Fetched all active threads this week');

                        // if no threadIds, escape

                        if (!(!threadIds || threadIds.length === 0)) {
                          _context2.next = 7;
                          break;
                        }

                        debug('\n ❌  No active threads found');
                        return _context2.abrupt('return');

                      case 7:
                        // for each thread that was active in the last week, return a new array containing a record for each thread with the thread data and the message count
                        messageCountPromises = threadIds.map(
                          (function() {
                            var _ref3 = _asyncToGenerator(
                              _regenerator2.default.mark(function _callee(
                                _ref2
                              ) {
                                var communityId = _ref2.communityId,
                                  channelId = _ref2.channelId,
                                  id = _ref2.id,
                                  content = _ref2.content,
                                  thread = _objectWithoutProperties(_ref2, [
                                    'communityId',
                                    'channelId',
                                    'id',
                                    'content',
                                  ]);

                                return _regenerator2.default.wrap(
                                  function _callee$(_context) {
                                    while (1) {
                                      switch ((_context.prev = _context.next)) {
                                        case 0:
                                          _context.t0 = communityId;
                                          _context.t1 = channelId;
                                          _context.t2 = id;
                                          _context.t3 = content.title;
                                          _context.next = 6;
                                          return (
                                            0,
                                            _message.getNewMessageCount
                                          )(id);

                                        case 6:
                                          _context.t4 = _context.sent;
                                          _context.next = 9;
                                          return (
                                            0,
                                            _message.getTotalMessageCount
                                          )(id);

                                        case 9:
                                          _context.t5 = _context.sent;
                                          return _context.abrupt('return', {
                                            communityId: _context.t0,
                                            channelId: _context.t1,
                                            id: _context.t2,
                                            title: _context.t3,
                                            newMessageCount: _context.t4,
                                            totalMessageCount: _context.t5,
                                          });

                                        case 11:
                                        case 'end':
                                          return _context.stop();
                                      }
                                    }
                                  },
                                  _callee,
                                  undefined
                                );
                              })
                            );

                            return function(_x) {
                              return _ref3.apply(this, arguments);
                            };
                          })()
                        );

                        // promise all the active threads and message counts

                        _context2.next = 10;
                        return Promise.all(messageCountPromises);

                      case 10:
                        messageCounts = _context2.sent;

                        debug('\n ⚙️ Fetched message counts for threads');

                        // remove any threads where the total message count is less than 10
                        filteredTopThreads = messageCounts
                          .filter(function(thread) {
                            return (
                              thread.totalMessageCount >=
                              _constants.MIN_TOTAL_MESSAGE_COUNT
                            );
                          })
                          .filter(function(thread) {
                            return (
                              thread.newMessageCount >=
                              _constants.MIN_NEW_MESSAGE_COUNT
                            );
                          });

                        debug('\n ⚙️ Filtered threads with enough messages');

                        // returns an array of threads that are active in the last week and have the minimum required message count to be considered valuable
                        return _context2.abrupt('return', filteredTopThreads);

                      case 15:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                },
                _callee2,
                undefined
              );
            })
          );

          return function allActiveThreadsThisWeek() {
            return _ref.apply(this, arguments);
          };
        })();

        /*
      2. Given an array of all the active threads this week that contain the minimum message count required, we now aggregate them by the channel where they were posted.
       The return value from this function is an object with keys representing channelIds and values representing an array of threads
  */
        var activeThreadsByChannel = (function() {
          var _ref4 = _asyncToGenerator(
            _regenerator2.default.mark(function _callee4() {
              var topThreads,
                obj,
                getCommunity,
                topThreadsWithCommunityDataPromises,
                threadsWithCommunityData,
                finalThreads,
                finishedTopThreads;
              return _regenerator2.default.wrap(
                function _callee4$(_context4) {
                  while (1) {
                    switch ((_context4.prev = _context4.next)) {
                      case 0:
                        _context4.next = 2;
                        return allActiveThreadsThisWeek();

                      case 2:
                        topThreads = _context4.sent;

                        if (!(!topThreads || topThreads.length === 0)) {
                          _context4.next = 6;
                          break;
                        }

                        debug('\n ❌  No topThreads found');
                        return _context4.abrupt('return');

                      case 6:
                        // create an empty object for the final output
                        obj = {};

                        getCommunity = function getCommunity(id) {
                          return (0, _community.getCommunityById)(id);
                        };

                        // for each thread, get the community data that we'll need when rendering an email

                        topThreadsWithCommunityDataPromises = topThreads.map(
                          (function() {
                            var _ref5 = _asyncToGenerator(
                              _regenerator2.default.mark(function _callee3(
                                thread
                              ) {
                                var community, obj;
                                return _regenerator2.default.wrap(
                                  function _callee3$(_context3) {
                                    while (1) {
                                      switch ((_context3.prev =
                                        _context3.next)) {
                                        case 0:
                                          _context3.next = 2;
                                          return getCommunity(
                                            thread.communityId
                                          );

                                        case 2:
                                          community = _context3.sent;

                                          // this is the final data we'll send to the email for each thread
                                          obj = {
                                            community: {
                                              name: community.name,
                                              slug: community.slug,
                                              profilePhoto:
                                                community.profilePhoto,
                                            },
                                            channelId: thread.channelId,
                                            title: thread.title,
                                            threadId: thread.id,
                                            newMessageCount:
                                              thread.newMessageCount,
                                            totalMessageCount:
                                              thread.totalMessageCount,
                                          };
                                          return _context3.abrupt(
                                            'return',
                                            obj
                                          );

                                        case 5:
                                        case 'end':
                                          return _context3.stop();
                                      }
                                    }
                                  },
                                  _callee3,
                                  undefined
                                );
                              })
                            );

                            return function(_x2) {
                              return _ref5.apply(this, arguments);
                            };
                          })()
                        );
                        _context4.next = 11;
                        return Promise.all(topThreadsWithCommunityDataPromises);

                      case 11:
                        threadsWithCommunityData = _context4.sent;

                        // for each of the active threads this week, determine if that that thread has been categorized yet into the new object. If so, push that thread into the array, otherwise create a new key/value pair in the object for the channel + thread
                        finalThreads = threadsWithCommunityData.map(function(
                          thread
                        ) {
                          return obj[thread.channelId]
                            ? (obj[
                                thread.channelId
                              ] = [].concat(
                                _toConsumableArray(obj[thread.channelId]),
                                [_extends({}, thread)]
                              ))
                            : (obj[thread.channelId] = [_extends({}, thread)]);
                        });
                        _context4.next = 15;
                        return Promise.all(finalThreads);

                      case 15:
                        finishedTopThreads = _context4.sent;

                        debug('\n ⚙️ Organized top threads by channel');

                        // return the final object containing keys for channelIds, and arrays of threads for values
                        return _context4.abrupt('return', obj);

                      case 18:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                },
                _callee4,
                undefined
              );
            })
          );

          return function activeThreadsByChannel() {
            return _ref4.apply(this, arguments);
          };
        })();

        /*
      3. In this step we process and aggregate user settings, users channels, and the thread data fetched above
       a. first, get all the userIds of people who have opted to receive a weekly digest
      b. for each person, get an array of channelIds where that user is a member
      c. determine if there is any overlap between the user's channels and the active threads from the past week. Note: this filters out people who are members of inactive communities, even if they are opted in to receive a weekly digest
  */
        var eligibleUsersForWeeklyDigest = (function() {
          var _ref6 = _asyncToGenerator(
            _regenerator2.default.mark(function _callee6() {
              var users,
                channelConnectionPromises,
                usersWithChannels,
                threadData,
                threadChannelKeys,
                getIntersectingChannels,
                rawThreadsForUsersEmail,
                eligibleUsersForWeeklyDigest;
              return _regenerator2.default.wrap(
                function _callee6$(_context6) {
                  while (1) {
                    switch ((_context6.prev = _context6.next)) {
                      case 0:
                        _context6.next = 2;
                        return (0, _usersSettings.getUsersForWeeklyDigest)();

                      case 2:
                        users = _context6.sent;

                        debug(
                          '\n ⚙️ Fetched users who want to receive a weekly digest'
                        );

                        // for each user who wants a weekly digest, fetch an array of channelIds where they are a member
                        channelConnectionPromises = users.map(
                          (function() {
                            var _ref8 = _asyncToGenerator(
                              _regenerator2.default.mark(function _callee5(
                                _ref7
                              ) {
                                var email = _ref7.email,
                                  firstName = _ref7.firstName,
                                  userId = _ref7.userId,
                                  user = _objectWithoutProperties(_ref7, [
                                    'email',
                                    'firstName',
                                    'userId',
                                  ]);

                                return _regenerator2.default.wrap(
                                  function _callee5$(_context5) {
                                    while (1) {
                                      switch ((_context5.prev =
                                        _context5.next)) {
                                        case 0:
                                          _context5.t0 = email;
                                          _context5.t1 = firstName || null;
                                          _context5.t2 = userId;
                                          _context5.next = 5;
                                          return (
                                            0,
                                            _usersChannels.getUsersChannelsEligibleForWeeklyDigest
                                          )(userId);

                                        case 5:
                                          _context5.t3 = _context5.sent;
                                          return _context5.abrupt('return', {
                                            email: _context5.t0,
                                            name: _context5.t1,
                                            userId: _context5.t2,
                                            channels: _context5.t3,
                                          });

                                        case 7:
                                        case 'end':
                                          return _context5.stop();
                                      }
                                    }
                                  },
                                  _callee5,
                                  undefined
                                );
                              })
                            );

                            return function(_x3) {
                              return _ref8.apply(this, arguments);
                            };
                          })()
                        );

                        // fetch all usersChannels

                        _context6.next = 7;
                        return Promise.all(channelConnectionPromises);

                      case 7:
                        usersWithChannels = _context6.sent;

                        debug('\n ⚙️ Fetched users eligible channels');

                        // get all the threads, organized by channel, in scope
                        _context6.next = 11;
                        return activeThreadsByChannel();

                      case 11:
                        threadData = _context6.sent;

                        if (threadData) {
                          _context6.next = 15;
                          break;
                        }

                        debug('\n ❌  No threadData found');
                        return _context6.abrupt('return');

                      case 15:
                        // get an array of all channels where there are active threads this week
                        threadChannelKeys = Object.keys(threadData);

                        // for each user, determine the overlapping channels where they are a member and where active threads occurred this week

                        getIntersectingChannels = usersWithChannels.map(
                          function(e) {
                            return _extends({}, e, {
                              channels: (0, _lodash2.default)(
                                e.channels,
                                threadChannelKeys
                              ),
                            });
                          }
                        );

                        debug(
                          '\n ⚙️ Filtered intersecting channels between the user and the top threads this week'
                        );

                        // based on the intersecting channels, get the threads that could appear in the user's weekly digest
                        rawThreadsForUsersEmail = getIntersectingChannels.map(
                          function(e) {
                            var arr = [];
                            e.channels.map(function(c) {
                              return arr.push.apply(
                                arr,
                                _toConsumableArray(threadData[c])
                              );
                            });
                            return _extends({}, e, {
                              threads: [].concat(arr),
                            });
                          }
                        );

                        debug(
                          '\n ⚙️ Fetched all the possible threads this user could receive in a weekly digest'
                        );

                        // if no rawThreadsForUsersEmail, escape

                        if (
                          !(
                            !rawThreadsForUsersEmail ||
                            rawThreadsForUsersEmail.length === 0
                          )
                        ) {
                          _context6.next = 23;
                          break;
                        }

                        debug('\n ❌  No rawThreads found');
                        return _context6.abrupt('return');

                      case 23:
                        // we don't want to send a weekly digest to someone with only one thread for that week - so in this step we filter out any results where the thread count is less than the miminimum acceptable threshhold
                        eligibleUsersForWeeklyDigest = rawThreadsForUsersEmail
                          .filter(function(user) {
                            return (
                              user.threads.length >
                              _constants.MIN_THREADS_REQUIRED_FOR_DIGEST
                            );
                          })
                          // and finally, sort the user's threads in descending order by message count
                          .map(function(_ref9) {
                            var channels = _ref9.channels,
                              user = _objectWithoutProperties(_ref9, [
                                'channels',
                              ]);

                            // for each thread, assign a score based on the total message count and new message count
                            var threadsWithScores = user.threads.map(function(
                              thread
                            ) {
                              return _extends({}, thread, {
                                score:
                                  thread.newMessageCount *
                                    _constants.NEW_MESSAGE_COUNT_WEIGHT +
                                  thread.totalMessageCount *
                                    _constants.TOTAL_MESSAGE_COUNT_WEIGHT,
                              });
                            });

                            return _extends({}, user, {
                              threads: threadsWithScores
                                .sort(function(a, b) {
                                  return b.score - a.score;
                                })
                                .slice(
                                  0,
                                  _constants.MAX_THREAD_COUNT_PER_DIGEST
                                ),
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
                        return _context6.abrupt(
                          'return',
                          eligibleUsersForWeeklyDigest
                        );

                      case 26:
                      case 'end':
                        return _context6.stop();
                    }
                  }
                },
                _callee6,
                undefined
              );
            })
          );

          return function eligibleUsersForWeeklyDigest() {
            return _ref6.apply(this, arguments);
          };
        })();

        var processSendWeeklyDigests = (function() {
          var _ref10 = _asyncToGenerator(
            _regenerator2.default.mark(function _callee8() {
              var eligibleUsers, topCommunities, sendDigestPromises;
              return _regenerator2.default.wrap(
                function _callee8$(_context8) {
                  while (1) {
                    switch ((_context8.prev = _context8.next)) {
                      case 0:
                        _context8.next = 2;
                        return eligibleUsersForWeeklyDigest();

                      case 2:
                        eligibleUsers = _context8.sent;

                        debug('\n ⚙️  Got eligible users');
                        _context8.next = 6;
                        return (0, _community.getTopCommunities)(20);

                      case 6:
                        topCommunities = _context8.sent;

                        debug('\n ⚙️  Got top communities');

                        // if no elegible users, escape

                        if (!(!eligibleUsers || eligibleUsers.length === 0)) {
                          _context8.next = 11;
                          break;
                        }

                        debug('\n ❌  No eligible users');
                        return _context8.abrupt('return');

                      case 11:
                        debug('\n👉 Eligible users data');
                        debug(eligibleUsers);
                        debug('\n👉 Example array of threads');
                        debug(eligibleUsers[0].threads);
                        debug('\n👉 Example thread data for email');
                        debug(eligibleUsers[0].threads[0]);

                        sendDigestPromises = function sendDigestPromises(
                          topCommunities
                        ) {
                          return eligibleUsers.map(
                            (function() {
                              var _ref11 = _asyncToGenerator(
                                _regenerator2.default.mark(function _callee7(
                                  user
                                ) {
                                  var usersCommunityIds, communities;
                                  return _regenerator2.default.wrap(
                                    function _callee7$(_context7) {
                                      while (1) {
                                        switch ((_context7.prev =
                                          _context7.next)) {
                                          case 0:
                                            _context7.next = 2;
                                            return (
                                              0,
                                              _usersCommunities.getUsersCommunityIds
                                            )(user.userId);

                                          case 2:
                                            usersCommunityIds = _context7.sent;

                                            debug(
                                              '\n ⚙️  Got users communities'
                                            );
                                            // if the user has joined less than three communities, take the top communities on Spectrum, remove any that the user has already joined, and slice the first 3 to send into the email template
                                            communities =
                                              usersCommunityIds.length <
                                              _constants.COMMUNITY_UPSELL_THRESHOLD
                                                ? topCommunities
                                                    .filter(function(
                                                      community
                                                    ) {
                                                      return (
                                                        usersCommunityIds.indexOf(
                                                          community.id
                                                        ) <= -1
                                                      );
                                                    })
                                                    .slice(0, 3)
                                                : null;

                                            debug(
                                              '\n ⚙️  Processed community upsells for email digest'
                                            );

                                            _context7.next = 8;
                                            return sendWeeklyDigestEmailQueue.add(
                                              _extends({}, user, {
                                                communities: communities,
                                              })
                                            );

                                          case 8:
                                            return _context7.abrupt(
                                              'return',
                                              _context7.sent
                                            );

                                          case 9:
                                          case 'end':
                                            return _context7.stop();
                                        }
                                      }
                                    },
                                    _callee7,
                                    undefined
                                  );
                                })
                              );

                              return function(_x4) {
                                return _ref11.apply(this, arguments);
                              };
                            })()
                          );
                        };

                        _context8.next = 20;
                        return Promise.all(sendDigestPromises(topCommunities));

                      case 20:
                        return _context8.abrupt('return', _context8.sent);

                      case 21:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                },
                _callee8,
                undefined
              );
            })
          );

          return function processSendWeeklyDigests() {
            return _ref10.apply(this, arguments);
          };
        })();

        return processSendWeeklyDigests()
          .then(function() {
            return job.remove();
          })
          .catch(function(err) {
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
    /***/ function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(9);

      /***/
    },
    /* 9 */
    /***/ function(module, exports) {
      module.exports = require('regenerator-runtime');

      /***/
    },
    /* 10 */
    /***/ function(module, exports) {
      module.exports = require('lodash.intersection');

      /***/
    },
    /* 11 */
    /***/ function(module, exports) {
      module.exports = require('bull');

      /***/
    },
    /* 12 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _require = __webpack_require__(0),
        db = _require.db;

      var getActiveThreadsInPastWeek = (exports.getActiveThreadsInPastWeek = function getActiveThreadsInPastWeek() {
        return db
          .table('threads')
          .filter(
            db.row('lastActive').during(
              // Change this to 60*60*24*7 to get weekly active users
              db.now().sub(60 * 60 * 24 * 7),
              db.now()
            )
          )
          .filter(function(thread) {
            return db.not(thread.hasFields('deletedAt'));
          })
          .run();
      });

      /***/
    },
    /* 13 */
    /***/ function(module, exports) {
      module.exports = require('fs');

      /***/
    },
    /* 14 */
    /***/ function(module, exports) {
      module.exports = require('path');

      /***/
    },
    /* 15 */
    /***/ function(module, exports) {
      module.exports =
        '-----BEGIN CERTIFICATE-----\nMIIDbzCCAlegAwIBAgIEWRMkLjANBgkqhkiG9w0BAQ0FADA5MTcwNQYDVQQDDC5T\ncGFjZSBQcm9ncmFtLTc5Njk3YmRkYTQxNTg3YjFmMzk4MzYxNDhlNmJjMTZhMB4X\nDTE3MDUxMDE0MzExMFoXDTM3MDUxMDE0MDAwMFowOTE3MDUGA1UEAwwuU3BhY2Ug\nUHJvZ3JhbS03OTY5N2JkZGE0MTU4N2IxZjM5ODM2MTQ4ZTZiYzE2YTCCASIwDQYJ\nKoZIhvcNAQEBBQADggEPADCCAQoCggEBALwgqk6SZZah3eVlCvZ8sFHDaHPWekVt\n1k3XAUkV+SrxijNGWNPnzkumXEd+qWYS9gYL9ak1otEjbxPR9B7+zBiPOFbwX1fE\n5o97W0gxjwS8iJGL3brSmSuJAfqx3be3l2Da4tpdgmQgKVID3c7E4AVFdgh0snh5\nNAChbx/BZXtCyJNk8gRR0G9tX01EtAumoRe3PkHs6CN0ObUNX7W9l1G6J5N00ECU\nZBEcXIyQ/lNzpJrIzcBrZ75mocyCVkp5HINjs0mG+CrSgVzY5KMtWOPFlr1KuH9P\nDXwYBDAKI3sKxj3Bgmwq1WtFbhTfuZkynxSZ0rgnr+aVFcszL2ZRVDMCAwEAAaN/\nMH0wHQYDVR0OBBYEFIXsudbQwxml7S2NjYaFCcTs0meUMA4GA1UdDwEB/wQEAwIC\nBDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0TBAUwAwEB/zAf\nBgNVHSMEGDAWgBSF7LnW0MMZpe0tjY2GhQnE7NJnlDANBgkqhkiG9w0BAQ0FAAOC\nAQEAfjae2H+mdzABC9Kkh/tLUPKtGu1c3/3QSq4RTPyOAsCgmtWO2NSUcEI928eo\n8EJvljx8Xo2vl3DbD9OmbWzPeUqQMm2Wsq98RB80KRvQAFSwOKMDqyv0+C/UGnnw\nry3UMfTuY5Y2rRwsY4Z6FDPWnLJJKIa6aKutYo1pzkkvphtwq8lPQO2NW4uTrpjG\nuhhH2cmtBUZRvRGIey29Z0TXufUNN6EAcbo0JxEuux6HotXbwI0wRwPmqHLNbSWw\ngCd/pne0Pjryvw6XHzd4CQUsElWafmOf/+N760O1RCC/XCzOnsjUSLiAt9R7C/Ao\niS3oQCP1KMbyfpulMFctZJR0kQ==\n-----END CERTIFICATE-----\n';

      /***/
    },
    /* 16 */
    /***/ function(module, exports) {
      module.exports = require('rethinkdbdash');

      /***/
    },
    /* 17 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _require = __webpack_require__(0),
        db = _require.db;

      var getUsersForWeeklyDigest = (exports.getUsersForWeeklyDigest = function getUsersForWeeklyDigest() {
        return db
          .table('usersSettings')
          .filter(function(row) {
            return row('notifications')('types')('weeklyDigest')('email').eq(
              true
            );
          })
          .eqJoin('userId', db.table('users'))
          .zip()
          .pluck(['userId', 'email', 'firstName', 'name'])
          .distinct()
          .run();
      });

      /***/
    },
    /* 18 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _require = __webpack_require__(0),
        db = _require.db;

      var getUsersChannelsEligibleForWeeklyDigest = (exports.getUsersChannelsEligibleForWeeklyDigest = function getUsersChannelsEligibleForWeeklyDigest(
        userId
      ) {
        return db
          .table('usersChannels')
          .getAll(userId, { index: 'userId' })
          .filter({ isMember: true })
          .map(function(row) {
            return row('channelId');
          })
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

      var _require = __webpack_require__(0),
        db = _require.db;

      var debug = __webpack_require__(2)(
        'hermes:queue:send-weekly-digest-email'
      );

      var getUsersCommunityIds = (exports.getUsersCommunityIds = function getUsersCommunityIds(
        userId
      ) {
        debug(userId);
        return (
          db
            .table('usersCommunities')
            .getAll(userId, { index: 'userId' })
            .filter({ isMember: true })
            .run()
            // return an array of the userIds to be loaded by gql
            .then(function(communities) {
              return (
                debug(communities) ||
                communities.map(function(community) {
                  return community.communityId;
                })
              );
            })
        );
      });

      /***/
    },
    /* 20 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _require = __webpack_require__(0),
        db = _require.db;

      var getTotalMessageCount = (exports.getTotalMessageCount = function getTotalMessageCount(
        threadId
      ) {
        return db
          .table('messages')
          .getAll(threadId, { index: 'threadId' })
          .count()
          .run();
      });

      var getNewMessageCount = (exports.getNewMessageCount = function getNewMessageCount(
        threadId
      ) {
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
    /* 21 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
          }
          return arr2;
        } else {
          return Array.from(arr);
        }
      }

      var _require = __webpack_require__(0),
        db = _require.db;

      var getCommunityById = (exports.getCommunityById = function getCommunityById(
        id
      ) {
        return db.table('communities').get(id).run();
      });

      var getTopCommunities = (exports.getTopCommunities = function getTopCommunities(
        amount
      ) {
        return db
          .table('communities')
          .pluck('id')
          .run()
          .then(function(communities) {
            return communities.map(function(community) {
              return community.id;
            });
          })
          .then(function(communityIds) {
            return Promise.all(
              communityIds.map(function(community) {
                return db
                  .table('usersCommunities')
                  .getAll(community, { index: 'communityId' })
                  .filter({ isMember: true })
                  .count()
                  .run()
                  .then(function(count) {
                    return {
                      id: community,
                      count: count,
                    };
                  });
              })
            );
          })
          .then(function(data) {
            var _db$table;

            var sortedCommunities = data
              .sort(function(x, y) {
                return y.count - x.count;
              })
              .map(function(community) {
                return community.id;
              })
              .slice(0, amount);

            return (_db$table = db.table('communities')).getAll
              .apply(_db$table, _toConsumableArray(sortedCommunities))
              .filter(function(community) {
                return db.not(community.hasFields('deletedAt'));
              })
              .run();
          });
      });

      /***/
    },
    /* 22 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _utils = __webpack_require__(23);

      // weekly digest
      var weeklyDigest = (0, _utils.createJob)(
        'send weekly digest email',
        '01 * * * * *', // run every second
        true
      );

      module.exports = {
        weeklyDigest: weeklyDigest,
      };

      /***/
    },
    /* 23 */
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

      var CronJob = __webpack_require__(24).CronJob;
      var createQueue = __webpack_require__(1);

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

      var addQueue = (exports.addQueue = function addQueue(name, data) {
        var worker = createQueue(name);
        return worker.add(_extends({}, data)).catch(function(err) {
          return _raven2.default.captureException(err);
        });
      });

      var createJob = (exports.createJob = function createJob(
        name,
        pattern,
        start // start immediately
      ) {
        try {
          var job = new CronJob({
            cronTime: pattern,
            onTick: function onTick() {
              console.log('🕑 New cron job initiated');
              return addQueue(
                name,
                {},
                { removeOnComplete: true, removeOnFail: true }
              );
            },
            start: start,
            timeZone: 'America/Los_Angeles',
          });

          return job.start();
        } catch (err) {
          console.log('❌ Error processing cron job:\n' + err);
        }
      });

      /***/
    },
    /* 24 */
    /***/ function(module, exports, __webpack_require__) {
      var __WEBPACK_AMD_DEFINE_FACTORY__,
        __WEBPACK_AMD_DEFINE_ARRAY__,
        __WEBPACK_AMD_DEFINE_RESULT__;
      (function(root, factory) {
        if (true) {
          !(
            (__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25)]),
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
    /* 25 */
    /***/ function(module, exports) {
      module.exports = require('moment-timezone');

      /***/
    },
    /* 26 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      // Create a worker with bull and start a small webserver which responds with
      // health information
      var http = __webpack_require__(27);
      var createQueue = __webpack_require__(1);

      /*::
type QueueMap = {
  [name: string]: (job: any) => Promise<any>
}
*/

      // Helper function to sum properties of an array of objects
      // e.g. [{ completed: 6 }, { completed: 2 }] => 8
      var sumArr = function sumArr(
        input /*: Array<Object> */,
        prop /*: number */ /*: string */
      ) {
        return input.reduce(function(sum, item) {
          return sum + item[prop];
        }, 0);
      };

      var createWorker = function createWorker(queueMap /*: QueueMap */) {
        // Start processing the queues
        var queues = Object.keys(queueMap).map(function(name) {
          var queue = createQueue(name);
          queue.process(queueMap[name]);
          return queue;
        });

        return http.createServer(function(req, res) {
          res.setHeader('Content-Type', 'application/json');
          // Summarize the data across all the queues
          Promise.all(
            queues.map(function(queue) {
              return queue.getJobCounts();
            })
          ).then(function(jobCounts) {
            var data = {
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
    /* 27 */
    /***/ function(module, exports) {
      module.exports = require('http');

      /***/
    },
    /******/
  ]
);
//# sourceMappingURL=main.map
