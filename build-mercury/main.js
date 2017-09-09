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
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 2));
  /******/
})(
  /************************************************************************/
  /******/ [
    ,
    /* 0 */ /* 1 */
    /***/ function(module, exports) {
      module.exports = require('debug');

      /***/
    },
    /* 2 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(3);

      /***/
    },
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _processReputationEvent = __webpack_require__(4);

      var _processReputationEvent2 = _interopRequireDefault(
        _processReputationEvent
      );

      var _constants = __webpack_require__(10);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      // $FlowFixMe
      const debug = __webpack_require__(1)('mercury');
      const createWorker = __webpack_require__(5);

      const PORT = process.env.PORT || 3004;

      console.log('\n✉️ Mercury, the reputation worker, is starting...');
      debug('Logging with debug enabled!');
      console.log('');

      const server = createWorker({
        [_constants.PROCESS_REPUTATION_EVENT]: _processReputationEvent2.default,
      });

      console.log(
        `🗄 Mercury open for business ${('development' === 'production' &&
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
    /* 4 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _processThreadCreated = __webpack_require__(12);

      var _processThreadCreated2 = _interopRequireDefault(
        _processThreadCreated
      );

      var _constants = __webpack_require__(10);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      const debug = __webpack_require__(1)(
        'mercury:queue:process-reputation-event'
      );

      exports.default = async job => {
        const { type, userId, entityId } = job.data;
        debug(`\nnew job: ${job.id}`);
        debug(`\nprocessing reputation type: ${type}`);
        debug(`\nprocessing reputation entityId: ${entityId}`);

        // if the event came in with bad data, escape
        if (!type || !userId || !entityId) return Promise.resolve();

        // parse event types
        switch (type) {
          case _constants.THREAD_CREATED: {
            return await (0, _processThreadCreated2.default)(job.data);
          }
          default: {
            debug('❌ No reputation event type matched');
            return Promise.resolve();
          }
        }
      };

      /***/
    },
    /* 5 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      // Create a worker with bull and start a small webserver which responds with
      // health information
      const http = __webpack_require__(6);
      const createQueue = __webpack_require__(7);

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
    /* 6 */
    /***/ function(module, exports) {
      module.exports = require('http');

      /***/
    },
    /* 7 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      const Queue = __webpack_require__(8);
      const Raven = __webpack_require__(9);

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
    /* 8 */
    /***/ function(module, exports) {
      module.exports = require('bull');

      /***/
    },
    /* 9 */
    /***/ function(module, exports) {
      module.exports = require('raven');

      /***/
    },
    /* 10 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      // queues
      const PROCESS_REPUTATION_EVENT = (exports.PROCESS_REPUTATION_EVENT =
        'process reputation event');

      // reputation event types
      const THREAD_CREATED = (exports.THREAD_CREATED = 'thread created');

      // scores
      const THREAD_CREATED_SCORE = (exports.THREAD_CREATED_SCORE = 10);
      const THREAD_DELETED_SCORE = (exports.THREAD_DELETED_SCORE = -10);

      /***/
    },
    /* 11 */
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
      const fs = __webpack_require__(14);
      const path = __webpack_require__(15);
      const IS_PROD = !process.env.FORCE_DEV && 'development' === 'production';

      const DEFAULT_CONFIG = {
        db: 'spectrum',
      };

      const PRODUCTION_CONFIG = {
        password: process.env.COMPOSE_RETHINKDB_PASSWORD,
        host: process.env.COMPOSE_RETHINKDB_URL,
        port: process.env.COMPOSE_RETHINKDB_PORT,
        ssl: {
          ca: IS_PROD && __webpack_require__(16),
        },
      };

      const config = IS_PROD
        ? _extends({}, DEFAULT_CONFIG, PRODUCTION_CONFIG)
        : _extends({}, DEFAULT_CONFIG);

      var r = __webpack_require__(17)(config);

      module.exports = { db: r };

      /***/
    },
    /* 12 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _usersCommunities = __webpack_require__(13);

      var _thread = __webpack_require__(18);

      var _constants = __webpack_require__(10);

      const debug = __webpack_require__(1)(
        'mercury:queue:process-thread-created'
      );

      exports.default = async data => {
        // entityId represents the threadId
        const { userId, entityId } = data;
        const { communityId } = await (0, _thread.getThread)(entityId);
        debug(`Processing thread created reputation event`);
        debug(`Got communityId: ${communityId}`);
        return (0, _usersCommunities.updateReputation)(
          userId,
          communityId,
          _constants.THREAD_CREATED_SCORE
        );
      };

      /***/
    },
    /* 13 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      const { db } = __webpack_require__(11);

      const updateReputation = (exports.updateReputation = (
        userId,
        communityId,
        score
      ) => {
        return db
          .table('usersCommunities')
          .getAll(userId, { index: 'userId' })
          .filter({ communityId })
          .update({
            reputation: db.row('reputation').add(score),
          })
          .run();
      });

      /***/
    },
    /* 14 */
    /***/ function(module, exports) {
      module.exports = require('fs');

      /***/
    },
    /* 15 */
    /***/ function(module, exports) {
      module.exports = require('path');

      /***/
    },
    /* 16 */
    /***/ function(module, exports) {
      module.exports =
        '-----BEGIN CERTIFICATE-----\nMIIDbzCCAlegAwIBAgIEWRMkLjANBgkqhkiG9w0BAQ0FADA5MTcwNQYDVQQDDC5T\ncGFjZSBQcm9ncmFtLTc5Njk3YmRkYTQxNTg3YjFmMzk4MzYxNDhlNmJjMTZhMB4X\nDTE3MDUxMDE0MzExMFoXDTM3MDUxMDE0MDAwMFowOTE3MDUGA1UEAwwuU3BhY2Ug\nUHJvZ3JhbS03OTY5N2JkZGE0MTU4N2IxZjM5ODM2MTQ4ZTZiYzE2YTCCASIwDQYJ\nKoZIhvcNAQEBBQADggEPADCCAQoCggEBALwgqk6SZZah3eVlCvZ8sFHDaHPWekVt\n1k3XAUkV+SrxijNGWNPnzkumXEd+qWYS9gYL9ak1otEjbxPR9B7+zBiPOFbwX1fE\n5o97W0gxjwS8iJGL3brSmSuJAfqx3be3l2Da4tpdgmQgKVID3c7E4AVFdgh0snh5\nNAChbx/BZXtCyJNk8gRR0G9tX01EtAumoRe3PkHs6CN0ObUNX7W9l1G6J5N00ECU\nZBEcXIyQ/lNzpJrIzcBrZ75mocyCVkp5HINjs0mG+CrSgVzY5KMtWOPFlr1KuH9P\nDXwYBDAKI3sKxj3Bgmwq1WtFbhTfuZkynxSZ0rgnr+aVFcszL2ZRVDMCAwEAAaN/\nMH0wHQYDVR0OBBYEFIXsudbQwxml7S2NjYaFCcTs0meUMA4GA1UdDwEB/wQEAwIC\nBDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0TBAUwAwEB/zAf\nBgNVHSMEGDAWgBSF7LnW0MMZpe0tjY2GhQnE7NJnlDANBgkqhkiG9w0BAQ0FAAOC\nAQEAfjae2H+mdzABC9Kkh/tLUPKtGu1c3/3QSq4RTPyOAsCgmtWO2NSUcEI928eo\n8EJvljx8Xo2vl3DbD9OmbWzPeUqQMm2Wsq98RB80KRvQAFSwOKMDqyv0+C/UGnnw\nry3UMfTuY5Y2rRwsY4Z6FDPWnLJJKIa6aKutYo1pzkkvphtwq8lPQO2NW4uTrpjG\nuhhH2cmtBUZRvRGIey29Z0TXufUNN6EAcbo0JxEuux6HotXbwI0wRwPmqHLNbSWw\ngCd/pne0Pjryvw6XHzd4CQUsElWafmOf/+N760O1RCC/XCzOnsjUSLiAt9R7C/Ao\niS3oQCP1KMbyfpulMFctZJR0kQ==\n-----END CERTIFICATE-----\n';

      /***/
    },
    /* 17 */
    /***/ function(module, exports) {
      module.exports = require('rethinkdbdash');

      /***/
    },
    /* 18 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      const { db } = __webpack_require__(11);

      const getThread = (exports.getThread = id => {
        return db
          .table('threads')
          .get(id)
          .run();
      });

      /***/
    },
    /******/
  ]
);
//# sourceMappingURL=main.map
