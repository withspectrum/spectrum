webpackJsonp([14], {
  /***/ './src/api/web-push-subscriptions.js':
    /*!*******************************************!*\
  !*** ./src/api/web-push-subscriptions.js ***!
  \*******************************************/
    /*! exports provided: subscribeToWebPush */
    /*! exports used: subscribeToWebPush */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return subscribeToWebPush;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo__ = __webpack_require__(
        /*! react-apollo */ './node_modules/react-apollo/react-apollo.browser.umd.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__
      );
      var _templateObject = _taggedTemplateLiteral(
        [
          '\n  mutation subscribeToWebPush($subscription: WebPushSubscription!) {\n    subscribeWebPush(subscription: $subscription)\n  }\n',
        ],
        [
          '\n  mutation subscribeToWebPush($subscription: WebPushSubscription!) {\n    subscribeWebPush(subscription: $subscription)\n  }\n',
        ]
      );

      function _taggedTemplateLiteral(strings, raw) {
        return Object.freeze(
          Object.defineProperties(strings, {
            raw: { value: Object.freeze(raw) },
          })
        );
      }

      var SUBSCRIBE_TO_WEB_PUSH_MUTATION = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql']
      )(_templateObject);

      var SUBSCRIBE_TO_WEB_PUSH_OPTIONS = {
        props: function props(_ref) {
          var mutate = _ref.mutate;
          return {
            subscribeToWebPush: function subscribeToWebPush(subscription) {
              if (!subscription) return;
              var json = subscription.toJSON();
              return mutate({
                variables: {
                  subscription: {
                    endpoint: json.endpoint,
                    keys: {
                      p256dh: json.keys.p256dh,
                      auth: json.keys.auth,
                    },
                  },
                },
              });
            },
          };
        },
      };

      var subscribeToWebPush = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(SUBSCRIBE_TO_WEB_PUSH_MUTATION, SUBSCRIBE_TO_WEB_PUSH_OPTIONS);

      /***/
    },

  /***/ './src/components/infiniteScroll/index.js':
    /*!************************************************!*\
  !*** ./src/components/infiniteScroll/index.js ***!
  \************************************************/
    /*! exports provided: withInfiniteScroll */
    /*! exports used: withInfiniteScroll */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return withInfiniteScroll;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(
        /*! react */ './node_modules/react/react.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react__
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/components/infiniteScroll/index.js';

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        }
        return call && (typeof call === 'object' || typeof call === 'function')
          ? call
          : self;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof superClass
          );
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true,
          },
        });
        if (superClass)
          Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
      }

      var withInfiniteScroll = function withInfiniteScroll(Comp) {
        return (function(_Component) {
          _inherits(InfiniteScroll, _Component);

          function InfiniteScroll() {
            var _ref;

            var _temp, _this, _ret;

            _classCallCheck(this, InfiniteScroll);

            for (
              var _len = arguments.length, args = Array(_len), _key = 0;
              _key < _len;
              _key++
            ) {
              args[_key] = arguments[_key];
            }

            return (
              (_ret = ((_temp = ((_this = _possibleConstructorReturn(
                this,
                (_ref =
                  InfiniteScroll.__proto__ ||
                  Object.getPrototypeOf(InfiniteScroll)).call.apply(
                  _ref,
                  [this].concat(args)
                )
              )),
              _this)),
              (_this.handleScroll = function() {}),
              (_this.fetchMore = function() {
                _this.props.data.fetchMore();
              }),
              _temp)),
              _possibleConstructorReturn(_this, _ret)
            );
          }

          _createClass(InfiniteScroll, [
            {
              key: 'componentDidMount',
              value: function componentDidMount() {
                // if (!this.scrollBody) return;
                // let node = this.scrollBody;
                // node.addEventListener('scroll', this.handleScroll)
              },
            },
            {
              key: 'componentWillUnmount',
              value: function componentWillUnmount() {
                // if (!this.scrollBody) return;
                // let node = this.scrollBody;
                // if (node) {
                // 	node.removeEventListener('scroll', this.handleScroll)
                // }
              },
            },
            {
              key: 'render',
              value: function render() {
                var _this2 = this;

                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Comp,
                  Object.assign(
                    {
                      ref: function ref(scrollBody) {
                        return (_this2.scrollBody = scrollBody);
                      },
                    },
                    this.props,
                    {
                      fetchMore: this.fetchMore,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 27,
                      },
                      __self: this,
                    }
                  )
                );
              },
            },
          ]);

          return InfiniteScroll;
        })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);
      };

      /***/
    },

  /***/ './src/views/notifications/components/browserNotificationRequest.js':
    /*!**************************************************************************!*\
  !*** ./src/views/notifications/components/browserNotificationRequest.js ***!
  \**************************************************************************/
    /*! exports provided: default */
    /*! exports used: default */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(
        /*! react */ './node_modules/react/react.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style__ = __webpack_require__(
        /*! ../style */ './src/views/notifications/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_globals__ = __webpack_require__(
        /*! ../../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/notifications/components/browserNotificationRequest.js',
        _this = this;

      var FirstRequest = function FirstRequest(_ref) {
        var onSubscribe = _ref.onSubscribe,
          onDismiss = _ref.onDismiss,
          loading = _ref.loading;
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_1__style__['n' /* RequestCard */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 7,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'p',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 8,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'span',
              {
                role: 'img',
                'aria-label': 'mailbox emoji',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 9,
                },
                __self: _this,
              },
              '\uD83D\uDCEC'
            ),
            ' ',
            'We need your permission to enable push notifications:'
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__components_globals__[
              'b' /* FlexRow */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 14,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__components_buttons__[
                'a' /* Button */
              ],
              {
                icon: 'notification-fill',
                gradientTheme: 'success',
                onClick: onSubscribe,
                loading: loading,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 15,
                },
                __self: _this,
              },
              'Enable'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1__style__['d' /* CloseRequest */],
              {
                glyph: 'view-close',
                color: 'text.placeholder',
                hoverColor: 'warn.alt',
                tipText: 'Dismiss',
                tipLocation: 'top-left',
                onClick: onDismiss,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 23,
                },
                __self: _this,
              }
            )
          )
        );
      };

      var BrowserNotificationRequest = function BrowserNotificationRequest(
        _ref2
      ) {
        var onSubscribe = _ref2.onSubscribe,
          onDismiss = _ref2.onDismiss,
          loading = _ref2.loading;
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          FirstRequest,
          {
            onSubscribe: onSubscribe,
            onDismiss: onDismiss,
            loading: loading,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 36,
            },
            __self: _this,
          }
        );
      };

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = BrowserNotificationRequest;

      /***/
    },

  /***/ './src/views/notifications/index.js':
    /*!******************************************!*\
  !*** ./src/views/notifications/index.js ***!
  \******************************************/
    /*! exports provided: default */
    /*! all exports used */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      Object.defineProperty(__webpack_exports__, '__esModule', { value: true });
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(
        /*! react */ './node_modules/react/react.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_1_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_infinite_scroller_with_scroll_element__ = __webpack_require__(
        /*! react-infinite-scroller-with-scroll-element */ './node_modules/react-infinite-scroller-with-scroll-element/dist/InfiniteScroll.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_infinite_scroller_with_scroll_element___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_3_react_infinite_scroller_with_scroll_element__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_infiniteScroll__ = __webpack_require__(
        /*! ../../components/infiniteScroll */ './src/components/infiniteScroll/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils__ = __webpack_require__(
        /*! ./utils */ './src/views/notifications/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_newMessageNotification__ = __webpack_require__(
        /*! ./components/newMessageNotification */ './src/views/notifications/components/newMessageNotification.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_newReactionNotification__ = __webpack_require__(
        /*! ./components/newReactionNotification */ './src/views/notifications/components/newReactionNotification.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_newChannelNotification__ = __webpack_require__(
        /*! ./components/newChannelNotification */ './src/views/notifications/components/newChannelNotification.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_newThreadNotification__ = __webpack_require__(
        /*! ./components/newThreadNotification */ './src/views/notifications/components/newThreadNotification.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_communityInviteNotification__ = __webpack_require__(
        /*! ./components/communityInviteNotification */ './src/views/notifications/components/communityInviteNotification.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_mentionMessageNotification__ = __webpack_require__(
        /*! ./components/mentionMessageNotification */ './src/views/notifications/components/mentionMessageNotification.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_mentionThreadNotification__ = __webpack_require__(
        /*! ./components/mentionThreadNotification */ './src/views/notifications/components/mentionThreadNotification.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_newUserInCommunityNotification__ = __webpack_require__(
        /*! ./components/newUserInCommunityNotification */ './src/views/notifications/components/newUserInCommunityNotification.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_privateChannelRequestApprovedNotification__ = __webpack_require__(
        /*! ./components/privateChannelRequestApprovedNotification */ './src/views/notifications/components/privateChannelRequestApprovedNotification.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_privateChannelRequestSentNotification__ = __webpack_require__(
        /*! ./components/privateChannelRequestSentNotification */ './src/views/notifications/components/privateChannelRequestSentNotification.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_column__ = __webpack_require__(
        /*! ../../components/column */ './src/components/column/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_appViewWrapper__ = __webpack_require__(
        /*! ../../components/appViewWrapper */ './src/components/appViewWrapper/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_head__ = __webpack_require__(
        /*! ../../components/head */ './src/components/head/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__views_titlebar__ = __webpack_require__(
        /*! ../../views/titlebar */ './src/views/titlebar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_loading__ = __webpack_require__(
        /*! ../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_globals__ = __webpack_require__(
        /*! ../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__helpers_utils__ = __webpack_require__(
        /*! ../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__helpers_localStorage__ = __webpack_require__(
        /*! ../../helpers/localStorage */ './src/helpers/localStorage.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__helpers_web_push_manager__ = __webpack_require__(
        /*! ../../helpers/web-push-manager */ './src/helpers/web-push-manager.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__helpers_events__ = __webpack_require__(
        /*! ../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__actions_toasts__ = __webpack_require__(
        /*! ../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__api_notification__ = __webpack_require__(
        /*! ../../api/notification */ './src/api/notification.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__api_web_push_subscriptions__ = __webpack_require__(
        /*! ../../api/web-push-subscriptions */ './src/api/web-push-subscriptions.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__components_upsell__ = __webpack_require__(
        /*! ../../components/upsell */ './src/components/upsell/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__components_viewError__ = __webpack_require__(
        /*! ../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__components_browserNotificationRequest__ = __webpack_require__(
        /*! ./components/browserNotificationRequest */ './src/views/notifications/components/browserNotificationRequest.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_32_shared_generate_meta_info__ = __webpack_require__(
        /*! shared/generate-meta-info */ './shared/generate-meta-info.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_32_shared_generate_meta_info___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_32_shared_generate_meta_info__
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/notifications/index.js';

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        }
        return call && (typeof call === 'object' || typeof call === 'function')
          ? call
          : self;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof superClass
          );
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true,
          },
        });
        if (superClass)
          Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
      }

      // NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
      // I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside

      var NotificationsPure = (function(_React$Component) {
        _inherits(NotificationsPure, _React$Component);

        function NotificationsPure() {
          _classCallCheck(this, NotificationsPure);

          var _this = _possibleConstructorReturn(
            this,
            (
              NotificationsPure.__proto__ ||
              Object.getPrototypeOf(NotificationsPure)
            ).call(this)
          );

          _this.markAllNotificationsSeen = function() {
            _this.props
              .markAllNotificationsSeen()
              .then(function(_ref) {
                // notifs were marked as seen

                var markAllNotificationsSeen =
                  _ref.data.markAllNotificationsSeen;
              })
              .catch(function(err) {
                // error
              });
          };

          _this.subscribeToWebPush = function() {
            Object(
              __WEBPACK_IMPORTED_MODULE_25__helpers_events__['b' /* track */]
            )('browser push notifications', 'prompt triggered');
            _this.setState({
              webPushPromptLoading: true,
            });
            __WEBPACK_IMPORTED_MODULE_24__helpers_web_push_manager__[
              'a' /* default */
            ]
              .subscribe()
              .then(function(subscription) {
                Object(
                  __WEBPACK_IMPORTED_MODULE_25__helpers_events__[
                    'b' /* track */
                  ]
                )('browser push notifications', 'subscribed');
                Object(
                  __WEBPACK_IMPORTED_MODULE_23__helpers_localStorage__[
                    'b' /* removeItemFromStorage */
                  ]
                )('webPushPromptDismissed');
                _this.setState({
                  webPushPromptLoading: false,
                  showWebPushPrompt: false,
                });
                return _this.props.subscribeToWebPush(subscription);
              })
              .catch(function(err) {
                Object(
                  __WEBPACK_IMPORTED_MODULE_25__helpers_events__[
                    'b' /* track */
                  ]
                )('browser push notifications', 'blocked');
                _this.setState({
                  webPushPromptLoading: false,
                });
                return _this.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_26__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )(
                    'error',
                    "Oops, we couldn't enable browser notifications for you. Please try again!"
                  )
                );
              });
          };

          _this.dismissWebPushRequest = function() {
            _this.setState({
              showWebPushPrompt: false,
            });
            Object(
              __WEBPACK_IMPORTED_MODULE_25__helpers_events__['b' /* track */]
            )('browser push notifications', 'dismissed');
            Object(
              __WEBPACK_IMPORTED_MODULE_23__helpers_localStorage__[
                'c' /* storeItem */
              ]
            )('webPushPromptDismissed', { timestamp: Date.now() });
          };

          _this.state = {
            showWebPushPrompt: false,
            webPushPromptLoading: false,
            scrollElement: null,
          };
          return _this;
        }

        _createClass(NotificationsPure, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              var _this2 = this;

              this.markAllNotificationsSeen();
              this.setState({
                // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
                // the AppViewWrapper which is the scrolling part of the site.
                scrollElement: document.getElementById(
                  'scroller-for-thread-feed'
                ),
              });

              if (
                Object(
                  __WEBPACK_IMPORTED_MODULE_23__helpers_localStorage__[
                    'a' /* getItemFromStorage */
                  ]
                )('webPushPromptDismissed')
              ) {
                return this.setState({
                  showWebPushPrompt: false,
                });
              }

              __WEBPACK_IMPORTED_MODULE_24__helpers_web_push_manager__[
                'a' /* default */
              ]
                .getPermissionState()
                .then(function(result) {
                  if (result === 'prompt') {
                    Object(
                      __WEBPACK_IMPORTED_MODULE_25__helpers_events__[
                        'b' /* track */
                      ]
                    )('browser push notifications', 'prompted');
                    _this2.setState({
                      showWebPushPrompt: true,
                    });
                  }
                });
            },
          },
          {
            key: 'shouldComponentUpdate',
            value: function shouldComponentUpdate(nextProps) {
              var curr = this.props;
              // fetching more
              if (
                curr.data.networkStatus === 7 &&
                nextProps.data.networkStatus === 3
              )
                return false;
              return true;
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this3 = this;

              var _props = this.props,
                currentUser = _props.currentUser,
                data = _props.data;

              if (!currentUser) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_17__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 163,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_16__components_column__[
                      'a' /* Column */
                    ],
                    {
                      type: 'primary',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 164,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_29__components_upsell__[
                        'h' /* UpsellSignIn */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 165,
                        },
                        __self: this,
                      }
                    )
                  )
                );
              }

              if (!data || data.error || data.loading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_17__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 173,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_30__components_viewError__[
                      'a' /* default */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 174,
                      },
                      __self: this,
                    }
                  )
                );
              }

              var _generateMetaInfo = __WEBPACK_IMPORTED_MODULE_32_shared_generate_meta_info___default()(
                  {
                    type: 'notifications',
                  }
                ),
                title = _generateMetaInfo.title,
                description = _generateMetaInfo.description;

              if (
                !data.notifications ||
                data.notifications.edges.length === 0
              ) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_17__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 185,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_16__components_column__[
                      'a' /* Column */
                    ],
                    {
                      type: 'primary',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 186,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_18__components_head__[
                        'a' /* default */
                      ],
                      {
                        title: title,
                        description: description,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 187,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_29__components_upsell__[
                        'g' /* UpsellNullNotifications */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 188,
                        },
                        __self: this,
                      }
                    )
                  )
                );
              }

              var notifications = data.notifications.edges
                .map(function(notification) {
                  return Object(
                    __WEBPACK_IMPORTED_MODULE_5__utils__[
                      'e' /* parseNotification */
                    ]
                  )(notification.node);
                })
                .filter(function(notification) {
                  return notification.context.type !== 'DIRECT_MESSAGE_THREAD';
                });

              notifications = Object(
                __WEBPACK_IMPORTED_MODULE_5__utils__[
                  'a' /* getDistinctNotifications */
                ]
              )(notifications);
              notifications = Object(
                __WEBPACK_IMPORTED_MODULE_22__helpers_utils__[
                  'f' /* sortByDate */
                ]
              )(notifications, 'modifiedAt', 'desc');

              var scrollElement = this.state.scrollElement;

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_21__components_globals__[
                  'a' /* FlexCol */
                ],
                {
                  style: { flex: '1 1 auto', maxHeight: 'calc(100% - 48px)' },
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 206,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_18__components_head__[
                    'a' /* default */
                  ],
                  {
                    title: title,
                    description: description,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 207,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_19__views_titlebar__[
                    'a' /* default */
                  ],
                  {
                    title: 'Notifications',
                    provideBack: false,
                    noComposer: true,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 208,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_17__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 209,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_16__components_column__[
                      'a' /* Column */
                    ],
                    {
                      type: 'primary',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 210,
                      },
                      __self: this,
                    },
                    this.state.showWebPushPrompt &&
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_31__components_browserNotificationRequest__[
                          'a' /* default */
                        ],
                        {
                          onSubscribe: this.subscribeToWebPush,
                          onDismiss: this.dismissWebPushRequest,
                          loading: this.state.webPushPromptLoading,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 212,
                          },
                          __self: this,
                        }
                      ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_3_react_infinite_scroller_with_scroll_element___default.a,
                      {
                        pageStart: 0,
                        loadMore: data.fetchMore,
                        hasMore: data.hasNextPage,
                        loader: __WEBPACK_IMPORTED_MODULE_0_react__[
                          'createElement'
                        ](
                          __WEBPACK_IMPORTED_MODULE_20__components_loading__[
                            'n' /* LoadingThread */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 222,
                            },
                            __self: this,
                          }
                        ),
                        useWindow: false,
                        initialLoad: false,
                        scrollElement: scrollElement,
                        threshold: 750,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 218,
                        },
                        __self: this,
                      },
                      notifications.map(function(notification) {
                        switch (notification.event) {
                          case 'MESSAGE_CREATED': {
                            return __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_6__components_newMessageNotification__[
                                'b' /* NewMessageNotification */
                              ],
                              {
                                key: notification.id,
                                notification: notification,
                                currentUser: currentUser,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 232,
                                },
                                __self: _this3,
                              }
                            );
                          }
                          case 'REACTION_CREATED': {
                            return __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_7__components_newReactionNotification__[
                                'b' /* NewReactionNotification */
                              ],
                              {
                                key: notification.id,
                                notification: notification,
                                currentUser: currentUser,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 241,
                                },
                                __self: _this3,
                              }
                            );
                          }
                          case 'CHANNEL_CREATED': {
                            return __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_8__components_newChannelNotification__[
                                'b' /* NewChannelNotification */
                              ],
                              {
                                key: notification.id,
                                notification: notification,
                                currentUser: currentUser,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 250,
                                },
                                __self: _this3,
                              }
                            );
                          }
                          case 'USER_JOINED_COMMUNITY': {
                            return __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_13__components_newUserInCommunityNotification__[
                                'b' /* NewUserInCommunityNotification */
                              ],
                              {
                                key: notification.id,
                                notification: notification,
                                currentUser: currentUser,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 259,
                                },
                                __self: _this3,
                              }
                            );
                          }
                          case 'THREAD_CREATED': {
                            return __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_9__components_newThreadNotification__[
                                'b' /* NewThreadNotification */
                              ],
                              {
                                key: notification.id,
                                notification: notification,
                                currentUser: currentUser,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 268,
                                },
                                __self: _this3,
                              }
                            );
                          }
                          case 'COMMUNITY_INVITE': {
                            return __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_10__components_communityInviteNotification__[
                                'a' /* CommunityInviteNotification */
                              ],
                              {
                                key: notification.id,
                                notification: notification,
                                currentUser: currentUser,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 277,
                                },
                                __self: _this3,
                              }
                            );
                          }
                          case 'MENTION_MESSAGE': {
                            return __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_11__components_mentionMessageNotification__[
                                'a' /* MentionMessageNotification */
                              ],
                              {
                                key: notification.id,
                                notification: notification,
                                currentUser: currentUser,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 286,
                                },
                                __self: _this3,
                              }
                            );
                          }
                          case 'MENTION_THREAD': {
                            return __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_12__components_mentionThreadNotification__[
                                'a' /* MentionThreadNotification */
                              ],
                              {
                                key: notification.id,
                                notification: notification,
                                currentUser: currentUser,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 295,
                                },
                                __self: _this3,
                              }
                            );
                          }
                          case 'PRIVATE_CHANNEL_REQUEST_SENT': {
                            return __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_15__components_privateChannelRequestSentNotification__[
                                'b' /* PrivateChannelRequestSent */
                              ],
                              {
                                key: notification.id,
                                notification: notification,
                                currentUser: currentUser,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 304,
                                },
                                __self: _this3,
                              }
                            );
                          }
                          case 'PRIVATE_CHANNEL_REQUEST_APPROVED': {
                            return __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_14__components_privateChannelRequestApprovedNotification__[
                                'b' /* PrivateChannelRequestApproved */
                              ],
                              {
                                key: notification.id,
                                notification: notification,
                                currentUser: currentUser,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 313,
                                },
                                __self: _this3,
                              }
                            );
                          }
                          default: {
                            return null;
                          }
                        }
                      })
                    )
                  )
                )
              );
            },
          },
        ]);

        return NotificationsPure;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var mapStateToProps = function mapStateToProps(state) {
        return {
          currentUser: state.users.currentUser,
        };
      };

      /* harmony default export */ __webpack_exports__[
        'default'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_28__api_web_push_subscriptions__[
          'a' /* subscribeToWebPush */
        ],
        __WEBPACK_IMPORTED_MODULE_27__api_notification__[
          'b' /* getNotifications */
        ],
        __WEBPACK_IMPORTED_MODULE_20__components_loading__[
          'r' /* displayLoadingNotifications */
        ],
        __WEBPACK_IMPORTED_MODULE_27__api_notification__[
          'e' /* markNotificationsSeenMutation */
        ],
        // $FlowIssue
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(
          mapStateToProps
        ),
        __WEBPACK_IMPORTED_MODULE_4__components_infiniteScroll__[
          'a' /* withInfiniteScroll */
        ]
      )(NotificationsPure);

      /***/
    },
});
//# sourceMappingURL=Notifications.chunk.js.map
