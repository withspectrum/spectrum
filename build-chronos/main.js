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
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 3));
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
      var fs = __webpack_require__(10);
      var path = __webpack_require__(11);
      var IS_PROD = !process.env.FORCE_DEV && 'development' === 'production';

      var DEFAULT_CONFIG = {
        db: 'spectrum',
      };

      var PRODUCTION_CONFIG = {
        password: process.env.COMPOSE_RETHINKDB_PASSWORD,
        host: process.env.COMPOSE_RETHINKDB_URL,
        port: process.env.COMPOSE_RETHINKDB_PORT,
        ssl: {
          ca: IS_PROD && __webpack_require__(12),
        },
      };

      var config = IS_PROD
        ? _extends({}, DEFAULT_CONFIG, PRODUCTION_CONFIG)
        : _extends({}, DEFAULT_CONFIG);

      var r = __webpack_require__(13)(config);

      module.exports = { db: r };

      /***/
    },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      // counts for processing
      var MIN_MESSAGE_COUNT = (exports.MIN_MESSAGE_COUNT = 4);
      var MAX_THREAD_COUNT_PER_CHANNEL = (exports.MAX_THREAD_COUNT_PER_CHANNEL = 10);
      var MIN_THREADS_REQUIRED_FOR_DIGEST = (exports.MIN_THREADS_REQUIRED_FOR_DIGEST = 5);
      // queues
      var SEND_WEEKLY_DIGEST_EMAIL = (exports.SEND_WEEKLY_DIGEST_EMAIL =
        'send weekly digest email');

      /***/
    },
    /* 2 */
    /***/ function(module, exports) {
      module.exports = require('debug');

      /***/
    },
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(4);

      /***/
    },
    /* 4 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _sendWeeklyDigestEmail = __webpack_require__(5);

      var _sendWeeklyDigestEmail2 = _interopRequireDefault(
        _sendWeeklyDigestEmail
      );

      var _constants = __webpack_require__(1);

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
      var createWorker = __webpack_require__(18);

      var PORT = process.env.PORT || 3004;

      console.log('\n✉️ Chronos, the chron worker, is starting...');
      debug('Logging with debug enabled!');
      console.log('');

      var server = createWorker(
        _defineProperty(
          {},
          _constants.SEND_WEEKLY_DIGEST_EMAIL,
          _sendWeeklyDigestEmail2.default
        )
      );

      console.log(
        '\uD83D\uDDC4 Queues open for business ' +
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
    /* 5 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _regenerator = __webpack_require__(6);

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

      var _lodash = __webpack_require__(8);

      var _lodash2 = _interopRequireDefault(_lodash);

      var _constants = __webpack_require__(1);

      var _thread = __webpack_require__(9);

      var _usersSettings = __webpack_require__(14);

      var _usersChannels = __webpack_require__(15);

      var _message = __webpack_require__(16);

      var _community = __webpack_require__(17);

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
                          _context2.next = 6;
                          break;
                        }

                        return _context2.abrupt('return');

                      case 6:
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
                                          return (0, _message.getMessageCount)(
                                            id
                                          );

                                        case 6:
                                          _context.t4 = _context.sent;
                                          return _context.abrupt('return', {
                                            communityId: _context.t0,
                                            channelId: _context.t1,
                                            id: _context.t2,
                                            title: _context.t3,
                                            messageCount: _context.t4,
                                          });

                                        case 8:
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

                        _context2.next = 9;
                        return Promise.all(messageCountPromises);

                      case 9:
                        messageCounts = _context2.sent;

                        debug('\n ⚙️ Fetched message counts for threads');

                        // remove any threads where the message count is less than 10
                        filteredTopThreads = messageCounts.filter(function(
                          thread
                        ) {
                          return (
                            thread.messageCount >= _constants.MIN_MESSAGE_COUNT
                          );
                        });

                        debug('\n ⚙️ Filtered threads with enough messages');

                        // returns an array of threads that are active in the last week and have the minimum required message count to be considered valuable
                        return _context2.abrupt('return', filteredTopThreads);

                      case 14:
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
                          _context4.next = 5;
                          break;
                        }

                        return _context4.abrupt('return');

                      case 5:
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
                        _context4.next = 10;
                        return Promise.all(topThreadsWithCommunityDataPromises);

                      case 10:
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
                        _context4.next = 14;
                        return Promise.all(finalThreads);

                      case 14:
                        finishedTopThreads = _context4.sent;

                        debug('\n ⚙️ Organized top threads by channel');

                        // return the final object containing keys for channelIds, and arrays of threads for values
                        return _context4.abrupt('return', obj);

                      case 17:
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
        var eligbleUsersForWeeklyDigest = (function() {
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
                          _context6.next = 14;
                          break;
                        }

                        return _context6.abrupt('return');

                      case 14:
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
                          _context6.next = 21;
                          break;
                        }

                        return _context6.abrupt('return');

                      case 21:
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

                            return _extends({}, user, {
                              threads: user.threads.sort(function(a, b) {
                                return b.messageCount - a.messageCount;
                              }),
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

                      case 24:
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

          return function eligbleUsersForWeeklyDigest() {
            return _ref6.apply(this, arguments);
          };
        })();

        var processSendWeeklyDigests = (function() {
          var _ref10 = _asyncToGenerator(
            _regenerator2.default.mark(function _callee8() {
              var eligibleUsers, sendDigestPromises, sendAllWeeklyDigests;
              return _regenerator2.default.wrap(
                function _callee8$(_context8) {
                  while (1) {
                    switch ((_context8.prev = _context8.next)) {
                      case 0:
                        _context8.next = 2;
                        return eligbleUsersForWeeklyDigest();

                      case 2:
                        eligibleUsers = _context8.sent;

                        if (!(!eligibleUsers || eligibleUsers.length === 0)) {
                          _context8.next = 5;
                          break;
                        }

                        return _context8.abrupt('return');

                      case 5:
                        debug('\n👉 Eligible users data');
                        debug(eligibleUsers);
                        debug('\n👉 Example thread data for email');
                        debug(eligibleUsers[0].threads[0]);

                        sendDigestPromises = eligibleUsers.map(
                          (function() {
                            var _ref11 = _asyncToGenerator(
                              _regenerator2.default.mark(function _callee7(
                                user
                              ) {
                                return _regenerator2.default.wrap(
                                  function _callee7$(_context7) {
                                    while (1) {
                                      switch ((_context7.prev =
                                        _context7.next)) {
                                        case 0:
                                          _context7.next = 2;
                                          return sendWeeklyDigestEmail(
                                            _constants.SEND_WEEKLY_DIGEST_EMAIL,
                                            _extends({}, user)
                                          );

                                        case 2:
                                          return _context7.abrupt(
                                            'return',
                                            _context7.sent
                                          );

                                        case 3:
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
                        _context8.next = 12;
                        return Promise.all(sendDigestPromises);

                      case 12:
                        sendAllWeeklyDigests = _context8.sent;
                        return _context8.abrupt('return', sendAllWeeklyDigests);

                      case 14:
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

        return processSendWeeklyDigests().catch(function(err) {
          return console.log('Error sending weekly digests: ', err);
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
    /* 6 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(7);

      /***/
    },
    /* 7 */
    /***/ function(module, exports) {
      module.exports = require('regenerator-runtime');

      /***/
    },
    /* 8 */
    /***/ function(module, exports) {
      module.exports = require('lodash.intersection');

      /***/
    },
    /* 9 */
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
    /* 10 */
    /***/ function(module, exports) {
      module.exports = require('fs');

      /***/
    },
    /* 11 */
    /***/ function(module, exports) {
      module.exports = require('path');

      /***/
    },
    /* 12 */
    /***/ function(module, exports) {
      module.exports =
        '-----BEGIN CERTIFICATE-----\nMIIDbzCCAlegAwIBAgIEWRMkLjANBgkqhkiG9w0BAQ0FADA5MTcwNQYDVQQDDC5T\ncGFjZSBQcm9ncmFtLTc5Njk3YmRkYTQxNTg3YjFmMzk4MzYxNDhlNmJjMTZhMB4X\nDTE3MDUxMDE0MzExMFoXDTM3MDUxMDE0MDAwMFowOTE3MDUGA1UEAwwuU3BhY2Ug\nUHJvZ3JhbS03OTY5N2JkZGE0MTU4N2IxZjM5ODM2MTQ4ZTZiYzE2YTCCASIwDQYJ\nKoZIhvcNAQEBBQADggEPADCCAQoCggEBALwgqk6SZZah3eVlCvZ8sFHDaHPWekVt\n1k3XAUkV+SrxijNGWNPnzkumXEd+qWYS9gYL9ak1otEjbxPR9B7+zBiPOFbwX1fE\n5o97W0gxjwS8iJGL3brSmSuJAfqx3be3l2Da4tpdgmQgKVID3c7E4AVFdgh0snh5\nNAChbx/BZXtCyJNk8gRR0G9tX01EtAumoRe3PkHs6CN0ObUNX7W9l1G6J5N00ECU\nZBEcXIyQ/lNzpJrIzcBrZ75mocyCVkp5HINjs0mG+CrSgVzY5KMtWOPFlr1KuH9P\nDXwYBDAKI3sKxj3Bgmwq1WtFbhTfuZkynxSZ0rgnr+aVFcszL2ZRVDMCAwEAAaN/\nMH0wHQYDVR0OBBYEFIXsudbQwxml7S2NjYaFCcTs0meUMA4GA1UdDwEB/wQEAwIC\nBDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0TBAUwAwEB/zAf\nBgNVHSMEGDAWgBSF7LnW0MMZpe0tjY2GhQnE7NJnlDANBgkqhkiG9w0BAQ0FAAOC\nAQEAfjae2H+mdzABC9Kkh/tLUPKtGu1c3/3QSq4RTPyOAsCgmtWO2NSUcEI928eo\n8EJvljx8Xo2vl3DbD9OmbWzPeUqQMm2Wsq98RB80KRvQAFSwOKMDqyv0+C/UGnnw\nry3UMfTuY5Y2rRwsY4Z6FDPWnLJJKIa6aKutYo1pzkkvphtwq8lPQO2NW4uTrpjG\nuhhH2cmtBUZRvRGIey29Z0TXufUNN6EAcbo0JxEuux6HotXbwI0wRwPmqHLNbSWw\ngCd/pne0Pjryvw6XHzd4CQUsElWafmOf/+N760O1RCC/XCzOnsjUSLiAt9R7C/Ao\niS3oQCP1KMbyfpulMFctZJR0kQ==\n-----END CERTIFICATE-----\n';

      /***/
    },
    /* 13 */
    /***/ function(module, exports) {
      module.exports = require('rethinkdbdash');

      /***/
    },
    /* 14 */
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
    /* 15 */
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
    /* 16 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _require = __webpack_require__(0),
        db = _require.db;

      var getMessageCount = (exports.getMessageCount = function getMessageCount(
        threadId
      ) {
        return db
          .table('messages')
          .getAll(threadId, { index: 'threadId' })
          .count()
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

      var _require = __webpack_require__(0),
        db = _require.db;

      var getCommunityById = (exports.getCommunityById = function getCommunityById(
        id
      ) {
        return db.table('communities').get(id).run();
      });

      /***/
    },
    /* 18 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      // Create a worker with bull and start a small webserver which responds with
      // health information
      var http = __webpack_require__(19);
      var createQueue = __webpack_require__(20);

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
    /* 19 */
    /***/ function(module, exports) {
      module.exports = require('http');

      /***/
    },
    /* 20 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var Queue = __webpack_require__(21);
      var Raven = __webpack_require__(22);

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
    /* 21 */
    /***/ function(module, exports) {
      module.exports = require('bull');

      /***/
    },
    /* 22 */
    /***/ function(module, exports) {
      module.exports = require('raven');

      /***/
    },
    /******/
  ]
);
//# sourceMappingURL=main.map
