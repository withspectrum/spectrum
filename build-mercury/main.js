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
    /* 0 */
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

      /***/
    },
    /* 1 */
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

      var _constants = __webpack_require__(0);

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

      var _constants = __webpack_require__(0);

      const debug = __webpack_require__(1)(
        'mercury:queue:process-reputation-event'
      );

      exports.default = job => {
        const { type, userId, entityId } = job.data;
        debug(`\nnew job: ${job.id}`);
        debug(`\nprocessing reputation type: ${type}`);
        debug(`\nprocessing reputation entityId: ${entityId}`);

        return Promise.resolve();
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
    /******/
  ]
);
//# sourceMappingURL=main.map
