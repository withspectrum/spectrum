webpackHotUpdate(8, {
  /***/ './src/views/directMessages/components/avatars.js':
    /*!********************************************************!*\
  !*** ./src/views/directMessages/components/avatars.js ***!
  \********************************************************/
    /*! exports provided: renderAvatars */
    /*! exports used: renderAvatars */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return renderAvatars;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(
        /*! react */ './node_modules/react/react.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_avatar__ = __webpack_require__(
        /*! ../../../components/avatar */ './src/components/avatar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style__ = __webpack_require__(
        /*! ./style */ './src/views/directMessages/components/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/directMessages/components/avatars.js',
        _this = this;

      var renderAvatars = function renderAvatars(users) {
        if (users.length === 1) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__style__['a' /* AvatarContainer */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 14,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1__components_avatar__[
                'a' /* default */
              ],
              {
                user: users[0],
                isOnline: users[0].isOnline,
                onlineSize: 'large',
                size: 44,
                radius: 44,
                src: users[0].profilePhoto,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 15,
                },
                __self: _this,
              }
            )
          );
        }

        if (users.length === 2) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__style__['C' /* TwoAvatarContainer */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 29,
              },
              __self: _this,
            },
            users.map(function(user) {
              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_2__style__['D' /* TwoAvatarWrap */],
                {
                  key: user.id,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 32,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_1__components_avatar__[
                    'a' /* default */
                  ],
                  {
                    user: user,
                    isOnline: user.isOnline,
                    size: 34,
                    radius: 34,
                    src: user.profilePhoto,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 33,
                    },
                    __self: _this,
                  }
                )
              );
            })
          );
        }

        if (users.length === 3) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__style__[
              'A' /* ThreeAvatarContainer */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 49,
              },
              __self: _this,
            },
            users.map(function(user) {
              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_1__components_avatar__[
                  'a' /* default */
                ],
                {
                  user: user,
                  isOnline: user.isOnline,
                  onlineSize: 'small',
                  key: user.id,
                  size: 20,
                  radius: 20,
                  src: user.profilePhoto,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 52,
                  },
                  __self: _this,
                }
              );
            })
          );
        }

        if (users.length === 4) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__style__[
              'A' /* ThreeAvatarContainer */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 69,
              },
              __self: _this,
            },
            users.map(function(user) {
              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_1__components_avatar__[
                  'a' /* default */
                ],
                {
                  user: user,
                  isOnline: user.isOnline,
                  onlineSize: 'small',
                  key: user.id,
                  size: 19,
                  radius: 19,
                  src: user.profilePhoto,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 72,
                  },
                  __self: _this,
                }
              );
            })
          );
        }

        if (users.length > 4) {
          var remainder = users.length % 4;

          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__style__[
              'A' /* ThreeAvatarContainer */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 91,
              },
              __self: _this,
            },
            users.map(function(user, i) {
              while (i < 3) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_1__components_avatar__[
                    'a' /* default */
                  ],
                  {
                    user: user,
                    isOnline: user.isOnline,
                    onlineSize: 'small',
                    key: user.id,
                    size: 19,
                    radius: 19,
                    src: user.profilePhoto,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 95,
                    },
                    __self: _this,
                  }
                );
              }

              return null;
            }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2__style__['n' /* Remainder */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 110,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 111,
                  },
                  __self: _this,
                },
                '+',
                remainder
              )
            )
          );
        }

        return null;
      };

      /***/
    },

  /***/ './src/views/directMessages/components/header.js':
    /*!*******************************************************!*\
  !*** ./src/views/directMessages/components/header.js ***!
  \*******************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_shared_generate_meta_info__ = __webpack_require__(
        /*! shared/generate-meta-info */ './shared/generate-meta-info.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_shared_generate_meta_info___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_1_shared_generate_meta_info__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_head__ = __webpack_require__(
        /*! ../../../components/head */ './src/components/head/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style__ = __webpack_require__(
        /*! ./style */ './src/views/directMessages/components/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/directMessages/components/header.js',
        _this = this;

      var Header = function Header(_ref) {
        var thread = _ref.thread,
          currentUser = _ref.currentUser;

        var trimmedUsers = thread.participants.filter(function(user) {
          return user.userId !== currentUser.id;
        });

        var photos = trimmedUsers.map(function(user) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3__style__['k' /* PhotoWrapper */],
            {
              key: user.id,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 19,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['j' /* Photo */],
              {
                user: user,
                size: 60,
                radius: 60,
                isOnline: user.isOnline,
                onlineSize: 'large',
                src: user.profilePhoto,
                link: user.username ? '/users/' + user.username : null,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 20,
                },
                __self: _this,
              }
            )
          );
        });

        var names = trimmedUsers
          .map(function(user) {
            return user.name;
          })
          .join(', ');
        var username =
          trimmedUsers.length === 1 && trimmedUsers[0].username
            ? trimmedUsers[0].username
            : '';

        var _generateMetaInfo = __WEBPACK_IMPORTED_MODULE_1_shared_generate_meta_info___default()(
            {
              type: 'directMessage',
              data: {
                title: '' + names,
                description: 'Conversation with ' + names,
              },
            }
          ),
          title = _generateMetaInfo.title,
          description = _generateMetaInfo.description;

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_3__style__['y' /* StyledHeader */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 47,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__components_head__['a' /* default */],
            {
              title: title,
              description: description,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 48,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3__style__['l' /* PhotosContainer */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 49,
              },
              __self: _this,
            },
            photos
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Names */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 50,
              },
              __self: _this,
            },
            names
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3__style__['E' /* Username */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 51,
              },
              __self: _this,
            },
            username && '@' + username
          )
        );
      };

      /* harmony default export */ __webpack_exports__['a'] = Header;

      /***/
    },

  /***/ './src/views/directMessages/components/messageThreadListItem.js':
    /*!**********************************************************************!*\
  !*** ./src/views/directMessages/components/messageThreadListItem.js ***!
  \**********************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_utils__ = __webpack_require__(
        /*! ../../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__avatars__ = __webpack_require__(
        /*! ./avatars */ './src/views/directMessages/components/avatars.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__style__ = __webpack_require__(
        /*! ./style */ './src/views/directMessages/components/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/directMessages/components/messageThreadListItem.js';

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

      // $FlowFixMe

      var ListCardItemDirectMessageThread = (function(_Component) {
        _inherits(ListCardItemDirectMessageThread, _Component);

        function ListCardItemDirectMessageThread() {
          _classCallCheck(this, ListCardItemDirectMessageThread);

          return _possibleConstructorReturn(
            this,
            (
              ListCardItemDirectMessageThread.__proto__ ||
              Object.getPrototypeOf(ListCardItemDirectMessageThread)
            ).apply(this, arguments)
          );
        }

        _createClass(ListCardItemDirectMessageThread, [
          {
            key: 'render',
            value: function render() {
              var _props = this.props,
                thread = _props.thread,
                currentUser = _props.currentUser,
                active = _props.active;

              // convert the server time to an iso timestamp

              var timestamp = new Date(thread.threadLastActive).getTime();

              // get the difference in a readable format (e.g 'a week ago')
              var threadTimeDifference = Object(
                __WEBPACK_IMPORTED_MODULE_2__helpers_utils__[
                  'i' /* timeDifference */
                ]
              )(Date.now(), timestamp);

              // filter currentUser out
              var participants = thread.participants.filter(function(user) {
                return user.userId !== currentUser.id;
              });
              // concat a string of users' names for thread messages
              var participantsArray =
                participants.length > 1
                  ? participants
                      .map(function(user) {
                        return user.name;
                      })
                      .join(', ')
                      .replace(/,(?!.*,)/gim, ' and')
                  : participants[0].name;
              // pass participants to a helper function to generate the avatar displays
              var avatars = Object(
                __WEBPACK_IMPORTED_MODULE_3__avatars__['a' /* renderAvatars */]
              )(participants);

              var currentParticipant = thread.participants.filter(function(
                user
              ) {
                return user.userId === currentUser.id;
              })[0];

              var currentParticipantLastActiveTimestamp = new Date(
                currentParticipant.lastSeen
              ).getTime();

              var isUnread = currentParticipantLastActiveTimestamp < timestamp;
              isUnread = active ? false : isUnread;

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_4__style__['G' /* Wrapper */],
                {
                  active: active,
                  isUnread: isUnread,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 53,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                    'a' /* default */
                  ],
                  {
                    to: '/messages/' + thread.id,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 54,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_4__style__['o' /* Row */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 55,
                      },
                      __self: this,
                    },
                    avatars,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_4__style__[
                        'f' /* MessageGroupTextContainer */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 57,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_4__style__[
                          'e' /* MessageGroupByline */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 58,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_4__style__[
                            'F' /* Usernames */
                          ],
                          {
                            isUnread: isUnread,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 59,
                            },
                            __self: this,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            'p',
                            {
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 60,
                              },
                              __self: this,
                            },
                            participantsArray
                          )
                        ),
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_4__style__[
                            'B' /* Timestamp */
                          ],
                          {
                            isUnread: isUnread,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 62,
                            },
                            __self: this,
                          },
                          threadTimeDifference
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_4__style__['h' /* Meta */],
                        {
                          isUnread: isUnread,
                          nowrap: true,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 66,
                          },
                          __self: this,
                        },
                        thread.snippet
                      )
                    )
                  )
                )
              );
            },
          },
        ]);

        return ListCardItemDirectMessageThread;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = ListCardItemDirectMessageThread;

      /***/
    },

  /***/ './src/views/directMessages/components/messages.js':
    /*!*********************************************************!*\
  !*** ./src/views/directMessages/components/messages.js ***!
  \*********************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_1_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_messages__ = __webpack_require__(
        /*! ../../../helpers/messages */ './src/helpers/messages.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_messageGroup__ = __webpack_require__(
        /*! ../../../components/messageGroup */ './src/components/messageGroup/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_globals__ = __webpack_require__(
        /*! ../../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_nextPageButton__ = __webpack_require__(
        /*! ../../../components/nextPageButton */ './src/components/nextPageButton/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__queries__ = __webpack_require__(
        /*! ../queries */ './src/views/directMessages/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__api_directMessageThread__ = __webpack_require__(
        /*! ../../../api/directMessageThread */ './src/api/directMessageThread.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__mutations__ = __webpack_require__(
        /*! ../mutations */ './src/views/directMessages/mutations.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__style__ = __webpack_require__(
        /*! ./style */ './src/views/directMessages/components/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/directMessages/components/messages.js';

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

      var MessagesWithData = (function(_React$Component) {
        _inherits(MessagesWithData, _React$Component);

        function MessagesWithData() {
          var _ref;

          var _temp, _this, _ret;

          _classCallCheck(this, MessagesWithData);

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
                MessagesWithData.__proto__ ||
                Object.getPrototypeOf(MessagesWithData)).call.apply(
                _ref,
                [this].concat(args)
              )
            )),
            _this)),
            (_this.state = {
              subscription: null,
            }),
            (_this.subscribe = function() {
              _this.setState({
                subscription: _this.props.subscribeToNewMessages(),
              });
            }),
            (_this.unsubscribe = function() {
              var subscription = _this.state.subscription;

              if (subscription) {
                // This unsubscribes the subscription
                subscription();
              }
            }),
            _temp)),
            _possibleConstructorReturn(_this, _ret)
          );
        }

        _createClass(MessagesWithData, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              this.props.forceScrollToBottom();
              this.subscribe();
            },
          },
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prev) {
              var _this2 = this;

              var _props = this.props,
                contextualScrollToBottom = _props.contextualScrollToBottom,
                data = _props.data,
                setLastSeen = _props.setLastSeen;

              if (this.props.data.loading) {
                this.unsubscribe();
              }

              if (
                prev.data.networkStatus === 1 &&
                prev.data.loading &&
                !this.props.data.loading
              ) {
                this.subscribe();
                setTimeout(function() {
                  return _this2.props.forceScrollToBottom();
                });
              }
              // force scroll to bottom when a message is sent in the same thread
              if (
                prev.data.messages !== data.messages &&
                contextualScrollToBottom
              ) {
                // mark this thread as unread when new messages come in and i'm viewing it
                setLastSeen(data.directMessageThread.id);
                contextualScrollToBottom();
              }
            },
          },
          {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
              this.unsubscribe();
            },
          },
          {
            key: 'render',
            value: function render() {
              var _props2 = this.props,
                _props2$data = _props2.data,
                messages = _props2$data.messages,
                hasNextPage = _props2$data.hasNextPage,
                fetchMore = _props2$data.fetchMore,
                hasError = _props2.hasError,
                isLoading = _props2.isLoading,
                isFetchingMore = _props2.isFetchingMore,
                toggleReaction = _props2.toggleReaction;

              if (hasError) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  'div',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 100,
                    },
                    __self: this,
                  },
                  'Error!'
                );
              }

              // NOTE(@mxstbr): The networkStatus check shouldn't be there, but if I remove
              // it the loading indicator doesn't show when switching between threads which
              // is hella annoying as the old msgs stick around until the new ones are there.
              // TODO: FIXME and remove the networkStatus === 7
              if (isFetchingMore || (messages && messages.length > 0)) {
                var unsortedMessages = messages.map(function(message) {
                  return message.node;
                });

                var unique = function unique(array) {
                  var processed = [];
                  for (var i = array.length - 1; i >= 0; i--) {
                    if (processed.indexOf(array[i].id) < 0) {
                      processed.push(array[i].id);
                    } else {
                      array.splice(i, 1);
                    }
                  }
                  return array;
                };

                var uniqueMessages = unique(unsortedMessages);
                var sortedMessages = Object(
                  __WEBPACK_IMPORTED_MODULE_2__helpers_messages__[
                    'a' /* sortAndGroupMessages */
                  ]
                )(uniqueMessages);

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_11__style__[
                    'g' /* MessagesScrollWrapper */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 126,
                    },
                    __self: this,
                  },
                  hasNextPage &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_7__components_nextPageButton__[
                        'a' /* default */
                      ],
                      {
                        isFetchingMore: isFetchingMore,
                        fetchMore: fetchMore,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 128,
                        },
                        __self: this,
                      }
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_3__components_messageGroup__[
                      'c' /* default */
                    ],
                    {
                      toggleReaction: toggleReaction,
                      messages: sortedMessages,
                      forceScrollToBottom: this.props.forceScrollToBottom,
                      contextualScrollToBottom: this.props
                        .contextualScrollToBottom,
                      threadId: this.props.id,
                      threadType: 'directMessageThread',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 133,
                      },
                      __self: this,
                    }
                  )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_4__components_loading__[
                    'a' /* Loading */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 146,
                    },
                    __self: this,
                  }
                );
              }

              return null;
            },
          },
        ]);

        return MessagesWithData;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var Messages = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_10__mutations__[
          'a' /* toggleReactionMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_9__api_directMessageThread__[
          'd' /* setLastSeenMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_8__queries__[
          'b' /* getDirectMessageThreadMessages */
        ],
        __WEBPACK_IMPORTED_MODULE_6__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(MessagesWithData);

      /* harmony default export */ __webpack_exports__['a'] = Messages;

      /***/
    },

  /***/ './src/views/directMessages/components/style.js':
    /*!******************************************************!*\
  !*** ./src/views/directMessages/components/style.js ***!
  \******************************************************/
    /*! exports provided: ThreadsListScrollContainer, Wrapper, Col, Row, Heading, Meta, Description, MessageGroupTextContainer, MessageGroupByline, Usernames, Timestamp, Snippet, AvatarContainer, TwoAvatarContainer, TwoAvatarWrap, ThreeAvatarContainer, Remainder, ComposerInputWrapper, Grow, ComposerInput, SearchSpinnerContainer, SearchResultsDropdown, SearchResult, SearchResultImage, SearchResultTextContainer, SearchResultDisplayName, SearchResultUsername, SearchResultNull, SelectedUsersPills, Pill, StyledHeader, PhotosContainer, PhotoWrapper, Photo, Names, Username, MessagesScrollWrapper */
    /*! exports used: AvatarContainer, ComposerInput, ComposerInputWrapper, Grow, MessageGroupByline, MessageGroupTextContainer, MessagesScrollWrapper, Meta, Names, Photo, PhotoWrapper, PhotosContainer, Pill, Remainder, Row, SearchResult, SearchResultDisplayName, SearchResultImage, SearchResultNull, SearchResultTextContainer, SearchResultUsername, SearchResultsDropdown, SearchSpinnerContainer, SelectedUsersPills, StyledHeader, ThreadsListScrollContainer, ThreeAvatarContainer, Timestamp, TwoAvatarContainer, TwoAvatarWrap, Username, Usernames, Wrapper */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'z',
        function() {
          return ThreadsListScrollContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'G',
        function() {
          return Wrapper;
        }
      );
      /* unused harmony export Col */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'o',
        function() {
          return Row;
        }
      );
      /* unused harmony export Heading */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'h',
        function() {
          return Meta;
        }
      );
      /* unused harmony export Description */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'f',
        function() {
          return MessageGroupTextContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return MessageGroupByline;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'F',
        function() {
          return Usernames;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'B',
        function() {
          return Timestamp;
        }
      );
      /* unused harmony export Snippet */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return AvatarContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'C',
        function() {
          return TwoAvatarContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'D',
        function() {
          return TwoAvatarWrap;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'A',
        function() {
          return ThreeAvatarContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'n',
        function() {
          return Remainder;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return ComposerInputWrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return Grow;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return ComposerInput;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'w',
        function() {
          return SearchSpinnerContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'v',
        function() {
          return SearchResultsDropdown;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'p',
        function() {
          return SearchResult;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'r',
        function() {
          return SearchResultImage;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        't',
        function() {
          return SearchResultTextContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'q',
        function() {
          return SearchResultDisplayName;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'u',
        function() {
          return SearchResultUsername;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        's',
        function() {
          return SearchResultNull;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'x',
        function() {
          return SelectedUsersPills;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'm',
        function() {
          return Pill;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'y',
        function() {
          return StyledHeader;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'l',
        function() {
          return PhotosContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'k',
        function() {
          return PhotoWrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'j',
        function() {
          return Photo;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'i',
        function() {
          return Names;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'E',
        function() {
          return Username;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'g',
        function() {
          return MessagesScrollWrapper;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_avatar__ = __webpack_require__(
        /*! ../../../components/avatar */ './src/components/avatar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_globals__ = __webpack_require__(
        /*! ../../../components/globals */ './src/components/globals/index.js'
      );

      var ThreadsListScrollContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__ThreadsListScrollContainer',
        componentId: 's1g9hl7x-0',
      })([
        'display:flex;flex-direction:column;flex-grow:1;overflow-y:auto;max-height:100%;',
      ]);

      var Wrapper = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__Wrapper',
        componentId: 's1g9hl7x-1',
      })(
        [
          'flex:0 0 auto;justify-content:center;max-width:100%;height:64px;position:relative;background:',
          ';box-shadow:',
          ";a{padding:8px 12px;}&:after{content:'';position:absolute;bottom:0;left:16px;width:calc(100% - 16px);border-bottom:1px solid ",
          ';}&:first-of-type a{padding-top:8px;}&:last-of-type a{padding-bottom:16px;&:after{display:none;}}&:hover{cursor:pointer;background:',
          ';}',
        ],
        function(props) {
          return props.active ? props.theme.bg.wash : '#fff';
        },
        function(props) {
          return props.isUnread
            ? 'inset -2px 0 0 ' + props.theme.brand.default
            : 'none';
        },
        function(props) {
          return props.theme.bg.wash;
        },
        function(props) {
          return props.theme.bg.wash;
        }
      );

      var Col = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__Col',
        componentId: 's1g9hl7x-2',
      })(['flex:1;']);

      var Row = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['b' /* FlexRow */]
      ).withConfig({
        displayName: 'style__Row',
        componentId: 's1g9hl7x-3',
      })([
        'flex:0 0 auto;align-items:center;a{display:flex;align-items:center;}',
      ]);

      var Heading = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['f' /* H3 */]
      ).withConfig({
        displayName: 'style__Heading',
        componentId: 's1g9hl7x-4',
      })(['font-weight:700;']);

      var Meta = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['g' /* H4 */]
      ).withConfig({
        displayName: 'style__Meta',
        componentId: 's1g9hl7x-5',
      })(
        ['font-weight:', ';color:', ';', ';'],
        function(props) {
          return props.isUnread ? 600 : 400;
        },
        function(props) {
          return props.isUnread
            ? props.theme.text.default
            : props.theme.text.alt;
        },
        function(props) {
          return props.nowrap
            ? Object(
                __WEBPACK_IMPORTED_MODULE_2__components_globals__[
                  'o' /* Truncate */
                ]
              )()
            : '';
        }
      );

      var Description = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['i' /* P */]
      ).withConfig({
        displayName: 'style__Description',
        componentId: 's1g9hl7x-6',
      })(['margin-top:8px;font-weight:400;color:', ';'], function(_ref) {
        var theme = _ref.theme;
        return theme.text.default;
      });

      var MessageGroupTextContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__MessageGroupTextContainer',
        componentId: 's1g9hl7x-7',
      })([
        'display:flex;flex-direction:column;flex:1 0 calc(100% - 64px);overflow:hidden;position:relative;top:-1px;',
      ]);

      var MessageGroupByline = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__MessageGroupByline',
        componentId: 's1g9hl7x-8',
      })([
        'display:flex;flex-direction:row;justify-content:space-between;align-items:baseline;',
      ]);

      var Usernames = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__Usernames',
        componentId: 's1g9hl7x-9',
      })(
        [
          'display:flex;overflow:hidden;flex-wrap:nowrap;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;color:',
          ';font-weight:',
          ';line-height:1.1;margin-bottom:1px;font-size:14px;flex:1 1 100%;p{',
          ';}',
        ],
        function(_ref2) {
          var theme = _ref2.theme;
          return theme.text.default;
        },
        function(props) {
          return props.isUnread ? 800 : 600;
        },
        Object(
          __WEBPACK_IMPORTED_MODULE_2__components_globals__['o' /* Truncate */]
        )()
      );

      var Timestamp = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__Timestamp',
        componentId: 's1g9hl7x-10',
      })(
        [
          'font-size:12px;text-align:right;color:',
          ';padding-right:4px;display:inline-block;flex:1 0 auto;margin-left:8px;',
        ],
        function(props) {
          return props.isUnread ? props.theme.brand.default : '#909aa7';
        }
      );

      var Snippet = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].p.withConfig({
        displayName: 'style__Snippet',
        componentId: 's1g9hl7x-11',
      })(
        [
          'font-size:13px;font-weight:',
          ';color:',
          ';padding-right:4px;display:inline-block;line-height:1.3;margin-top:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
        ],
        function(props) {
          return props.unread ? 700 : 500;
        },
        function(props) {
          return props.unread ? props.theme.text.default : props.theme.text.alt;
        }
      );

      var AvatarContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__AvatarContainer',
        componentId: 's1g9hl7x-12',
      })([
        'margin-right:16px;width:44px;height:44px;position:relative;img{box-shadow:0 0 0 2px #fff;}',
      ]);

      var TwoAvatarContainer = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(AvatarContainer).withConfig({
        displayName: 'style__TwoAvatarContainer',
        componentId: 's1g9hl7x-13',
      })(
        [
          'width:60px;height:60px;position:relative;span{margin:1px;&:first-child{position:absolute;z-index:',
          ';top:4px;left:0;}&:last-child{position:absolute;z-index:',
          ';bottom:4px;right:0;}}',
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .avatar,
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .avatar + 1
      );

      var TwoAvatarWrap = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(AvatarContainer).withConfig({
        displayName: 'style__TwoAvatarWrap',
        componentId: 's1g9hl7x-14',
      })(
        [
          '&:first-child{position:absolute;z-index:',
          ';top:4px;left:0;width:34px;height:34px;}&:last-child{position:absolute;z-index:',
          ';bottom:4px;right:0;margin:0;width:34px;height:34px;}',
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .avatar,
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .avatar + 1
      );

      var ThreeAvatarContainer = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(AvatarContainer).withConfig({
        displayName: 'style__ThreeAvatarContainer',
        componentId: 's1g9hl7x-15',
      })([
        'display:flex;flex-wrap:wrap;justify-content:center;img{margin:1px;&:last-child{margin-top:0;}}',
      ]);

      var Remainder = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__Remainder',
        componentId: 's1g9hl7x-16',
      })(
        [
          'border-radius:19px;width:19px;height:19px;padding:0 2px;font-size:9px;font-weight:700;color:',
          ';background:',
          ';margin:2px 1px 1px 2px;overflow:hidden;display:flex;justify-content:center;align-items:center;',
        ],
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.bg.wash;
        }
      );

      var ComposerInputWrapper = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__ComposerInputWrapper',
        componentId: 's1g9hl7x-17',
      })([
        'position:relative;display:flex;flex-direction:column;width:100%;display:block;',
      ]);

      var Grow = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Grow',
        componentId: 's1g9hl7x-18',
      })(
        [
          'flex:1 1 auto;justify-content:center;align-items:stretch;background:',
          ';width:100%;height:100%;',
        ],
        function(props) {
          return props.theme.bg.wash;
        }
      );

      var ComposerInput = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].input.withConfig({
        displayName: 'style__ComposerInput',
        componentId: 's1g9hl7x-19',
      })(
        [
          'font-size:16px;padding:15px 16px;width:100%;border-bottom:1px solid ',
          ';position:relative;z-index:',
          ';@media (max-width:768px){padding:20px 16px;}',
        ],
        function(props) {
          return props.theme.bg.border;
        },
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .search
      );

      var SearchSpinnerContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__SearchSpinnerContainer',
        componentId: 's1g9hl7x-20',
      })(
        [
          'position:absolute;top:8px;right:8px;width:32px;height:32px;z-index:',
          ';',
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .loading
      );

      var SearchResultsDropdown = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].ul.withConfig({
        displayName: 'style__SearchResultsDropdown',
        componentId: 's1g9hl7x-21',
      })(
        [
          'border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);position:absolute;top:',
          ';left:8px;display:inline-block;width:320px;max-height:420px;overflow-y:scroll;z-index:',
          ';@media (max-width:768px){width:100%;left:0;border-radius:0 0 8px 8px;}',
        ],
        function(props) {
          return props.moved ? '104px' : '60px';
        },
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .dropdown
      );

      var SearchResult = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].li.withConfig({
        displayName: 'style__SearchResult',
        componentId: 's1g9hl7x-22',
      })(
        [
          'display:flex;align-items:center;border-bottom:1px solid ',
          ';background:',
          ';width:100%;',
          ' padding:8px 16px 8px 8px;&:only-child{border-bottom:none;}&:last-child{border-bottom:none;}&:hover{background:',
          ';cursor:pointer;}',
        ],
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.focused ? props.theme.bg.wash : '#fff';
        },
        Object(
          __WEBPACK_IMPORTED_MODULE_2__components_globals__['o' /* Truncate */]
        )(),
        function(props) {
          return props.theme.bg.wash;
        }
      );

      var SearchResultImage = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__components_avatar__['a' /* default */]
      ).withConfig({
        displayName: 'style__SearchResultImage',
        componentId: 's1g9hl7x-23',
      })(['margin-right:8px;']);

      var SearchResultTextContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__SearchResultTextContainer',
        componentId: 's1g9hl7x-24',
      })(['display:flex;flex-direction:column;flex:1 1 auto;']);

      var SearchResultDisplayName = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].p.withConfig({
        displayName: 'style__SearchResultDisplayName',
        componentId: 's1g9hl7x-25',
      })(
        ['font-size:14px;font-weight:600;color:', ';line-height:1.4;'],
        function(props) {
          return props.theme.text.default;
        }
      );

      var SearchResultUsername = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].p.withConfig({
        displayName: 'style__SearchResultUsername',
        componentId: 's1g9hl7x-26',
      })(
        ['font-size:12px;font-weight:500;color:', ';line-height:1.4;'],
        function(props) {
          return props.theme.text.alt;
        }
      );

      var SearchResultNull = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].p.withConfig({
        displayName: 'style__SearchResultNull',
        componentId: 's1g9hl7x-27',
      })(
        ['text-align:center;font-size:14px;font-weight:400;color:', ';'],
        function(props) {
          return props.theme.text.alt;
        }
      );

      var SelectedUsersPills = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].ul.withConfig({
        displayName: 'style__SelectedUsersPills',
        componentId: 's1g9hl7x-28',
      })(
        [
          'position:relative;width:100%;font-size:16px;padding:9px 12px;width:100%;z-index:',
          ';background:#fff;',
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .chatInput + 1
      );

      var Pill = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].li.withConfig({
        displayName: 'style__Pill',
        componentId: 's1g9hl7x-29',
      })(
        [
          'list-style-type:none;display:inline-block;font-size:14px;background:',
          ';box-shadow:inset 0 0 1px rgba(123,22,255,0.15);color:',
          ';border-radius:4px;padding:2px 12px;margin-right:4px;',
        ],
        function(props) {
          return props.selected
            ? props.theme.brand.default
            : Object(
                __WEBPACK_IMPORTED_MODULE_2__components_globals__[
                  'p' /* hexa */
                ]
              )(props.theme.brand.default, 0.1);
        },
        function(props) {
          return props.selected
            ? props.theme.bg.default
            : props.theme.brand.default;
        }
      );

      var StyledHeader = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__StyledHeader',
        componentId: 's1g9hl7x-30',
      })(
        [
          'display:flex;flex:',
          ';justify-content:center;align-items:center;align-self:',
          ';flex-direction:column;width:100%;background:',
          ';padding:32px;padding-bottom:0;',
        ],
        function(props) {
          return props.fill ? '1 0 auto' : '0 0 auto';
        },
        function(props) {
          return props.fill ? 'center' : 'flex-start';
        },
        function(props) {
          return props.wash ? props.theme.bg.wash : '#fff';
        }
      );

      var PhotosContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__PhotosContainer',
        componentId: 's1g9hl7x-31',
      })(['display:block;padding:8px 0;']);

      var PhotoWrapper = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__PhotoWrapper',
        componentId: 's1g9hl7x-32',
      })(['margin:0 6px;display:inline-block;']);

      var Photo = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__components_avatar__['a' /* default */]
      ).withConfig({
        displayName: 'style__Photo',
        componentId: 's1g9hl7x-33',
      })(['border:1px solid #fff;']);

      var Names = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h2.withConfig({
        displayName: 'style__Names',
        componentId: 's1g9hl7x-34',
      })(
        [
          'display:block;font-weight:800;font-size:24px;color:',
          ';text-align:center;line-height:1.4;',
        ],
        function(_ref3) {
          var theme = _ref3.theme;
          return theme.text.default;
        }
      );

      var Username = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h3.withConfig({
        displayName: 'style__Username',
        componentId: 's1g9hl7x-35',
      })(
        [
          'display:block;font-weight:500;font-size:14px;color:',
          ';margin:0;display:flex;',
        ],
        function(_ref4) {
          var theme = _ref4.theme;
          return theme.text.alt;
        }
      );

      var MessagesScrollWrapper = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__MessagesScrollWrapper',
        componentId: 's1g9hl7x-36',
      })(['width:100%;flex:1 0 auto;padding-top:24px;']);

      /***/
    },

  /***/ './src/views/directMessages/components/threadsList.js':
    /*!************************************************************!*\
  !*** ./src/views/directMessages/components/threadsList.js ***!
  \************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__messageThreadListItem__ = __webpack_require__(
        /*! ./messageThreadListItem */ './src/views/directMessages/components/messageThreadListItem.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_infinite_scroller_with_scroll_element__ = __webpack_require__(
        /*! react-infinite-scroller-with-scroll-element */ './node_modules/react-infinite-scroller-with-scroll-element/dist/InfiniteScroll.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_infinite_scroller_with_scroll_element___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_2_react_infinite_scroller_with_scroll_element__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__style__ = __webpack_require__(
        /*! ./style */ './src/views/directMessages/components/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/directMessages/components/threadsList.js';

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

      var ThreadsList = (function(_React$Component) {
        _inherits(ThreadsList, _React$Component);

        function ThreadsList() {
          var _ref;

          var _temp, _this, _ret;

          _classCallCheck(this, ThreadsList);

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
                ThreadsList.__proto__ ||
                Object.getPrototypeOf(ThreadsList)).call.apply(
                _ref,
                [this].concat(args)
              )
            )),
            _this)),
            (_this.state = {
              scrollElement: null,
            }),
            _temp)),
            _possibleConstructorReturn(_this, _ret)
          );
        }

        _createClass(ThreadsList, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              this.setState({
                // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
                // the AppViewWrapper which is the scrolling part of the site.
                scrollElement: document.getElementById(
                  'scroller-for-dm-threads'
                ),
              });
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                threads = _props.threads,
                currentUser = _props.currentUser,
                active = _props.active,
                fetchMore = _props.fetchMore,
                hasNextPage = _props.hasNextPage;
              var scrollElement = this.state.scrollElement;

              if (!threads || threads.length === 0) {
                return null;
              }

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_4__style__[
                  'z' /* ThreadsListScrollContainer */
                ],
                {
                  id: 'scroller-for-dm-threads',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 42,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_2_react_infinite_scroller_with_scroll_element___default.a,
                  {
                    pageStart: 0,
                    loadMore: fetchMore,
                    hasMore: hasNextPage,
                    loader: __WEBPACK_IMPORTED_MODULE_0_react__[
                      'createElement'
                    ](
                      __WEBPACK_IMPORTED_MODULE_3__components_loading__[
                        'e' /* LoadingDM */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 47,
                        },
                        __self: this,
                      }
                    ),
                    useWindow: false,
                    initialLoad: false,
                    scrollElement: scrollElement,
                    threshold: 30,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 43,
                    },
                    __self: this,
                  },
                  threads.map(function(thread) {
                    return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_1__messageThreadListItem__[
                        'a' /* default */
                      ],
                      {
                        thread: thread,
                        key: thread.id,
                        currentUser: currentUser,
                        active: active === thread.id,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 55,
                        },
                        __self: _this2,
                      }
                    );
                  })
                )
              );
            },
          },
        ]);

        return ThreadsList;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__['a'] = ThreadsList;

      /***/
    },

  /***/ './src/views/directMessages/containers/newThread.js':
    /*!**********************************************************!*\
  !*** ./src/views/directMessages/containers/newThread.js ***!
  \**********************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_apollo__ = __webpack_require__(
        /*! react-apollo */ './node_modules/react-apollo/react-apollo.browser.umd.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_apollo___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_1_react_apollo__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__(
        /*! react-router */ './node_modules/react-router/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_3_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_head__ = __webpack_require__(
        /*! ../../../components/head */ './src/components/head/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_shared_generate_meta_info__ = __webpack_require__(
        /*! shared/generate-meta-info */ './shared/generate-meta-info.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_shared_generate_meta_info___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_6_shared_generate_meta_info__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_messages__ = __webpack_require__(
        /*! ../components/messages */ './src/views/directMessages/components/messages.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_header__ = __webpack_require__(
        /*! ../components/header */ './src/views/directMessages/components/header.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_chatInput__ = __webpack_require__(
        /*! ../../../components/chatInput */ './src/components/chatInput/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__style__ = __webpack_require__(
        /*! ../style */ './src/views/directMessages/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_react_dom__ = __webpack_require__(
        /*! react-dom */ './node_modules/react-dom/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_react_dom___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_11_react_dom__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__queries__ = __webpack_require__(
        /*! ../queries */ './src/views/directMessages/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__helpers_utils__ = __webpack_require__(
        /*! ../../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__helpers_events__ = __webpack_require__(
        /*! ../../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__api_user__ = __webpack_require__(
        /*! ../../../api/user */ './src/api/user.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_globals__ = __webpack_require__(
        /*! ../../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__actions_toasts__ = __webpack_require__(
        /*! ../../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__actions_directMessageThreads__ = __webpack_require__(
        /*! ../../../actions/directMessageThreads */ './src/actions/directMessageThreads.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__api_directMessageThread__ = __webpack_require__(
        /*! ../../../api/directMessageThread */ './src/api/directMessageThread.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_style__ = __webpack_require__(
        /*! ../components/style */ './src/views/directMessages/components/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/directMessages/containers/newThread.js';

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

      var NewThread = (function(_Component) {
        _inherits(NewThread, _Component);

        function NewThread(props) {
          _classCallCheck(this, NewThread);

          var _this = _possibleConstructorReturn(
            this,
            (NewThread.__proto__ || Object.getPrototypeOf(NewThread)).call(
              this,
              props
            )
          );

          _this.search = function(string) {
            // if the user has cleared the search input, make sure there are no search
            // results or focused users
            if (!string || string.length === 0) {
              return _this.setState({
                searchResults: [],
                focusedSearchResult: '',
              });
            }

            var selectedUsersForNewThread =
              _this.state.selectedUsersForNewThread;
            var _this$props = _this.props,
              currentUser = _this$props.currentUser,
              client = _this$props.client;

            // start the input loading spinner

            _this.setState({
              searchIsLoading: true,
            });

            // trigger the query
            client
              .query({
                query:
                  __WEBPACK_IMPORTED_MODULE_15__api_user__[
                    'b' /* SEARCH_USERS_QUERY */
                  ],
                variables: {
                  string: string,
                },
              })
              .then(function(_ref) {
                var searchUsers = _ref.data.searchUsers;

                // if we return users from the search query, stop the loading
                // spinner, populate the searchResults array, and focus the first
                // result
                if (searchUsers.length > 0) {
                  // create an array of user ids if the user has already selected people
                  // for the thread
                  var selectedUsersIds =
                    selectedUsersForNewThread &&
                    selectedUsersForNewThread.map(function(user) {
                      return user.id;
                    });

                  // filter the search results to only show users who aren't already selected
                  // then filter that list to remove the currentUser so you can't message yourself

                  var _searchResults = selectedUsersForNewThread
                    ? searchUsers
                        .filter(function(user) {
                          return selectedUsersIds.indexOf(user.id) < 0;
                        })
                        .filter(function(user) {
                          return user.id !== currentUser.id;
                        })
                    : searchUsers.filter(function(user) {
                        return user.id !== currentUser.id;
                      });

                  _this.setState({
                    // if the search results are totally filtered out of the selectedUsers,
                    // return an empty array
                    searchResults:
                      _searchResults.length > 0 ? _searchResults : [],
                    searchIsLoading: false,
                    // if all results are filtered, clear the focused search result
                    focusedSearchResult:
                      _searchResults.length > 0 ? _searchResults[0].id : '',
                  });
                  // otherwise if no results are found, clear the above
                } else {
                  _this.setState({
                    searchResults: [],
                    searchIsLoading: false,
                    focusedSearchResult: '',
                  });
                }
              });
          };

          _this.handleKeyPress = function(e) {
            // if the thread slider is open, we shouldn't be doing anything in DMs
            if (_this.props.threadSliderIsOpen) return;

            // destructure the whole state object
            var _this$state = _this.state,
              searchString = _this$state.searchString,
              searchResults = _this$state.searchResults,
              selectedUsersForNewThread = _this$state.selectedUsersForNewThread,
              focusedSearchResult = _this$state.focusedSearchResult,
              focusedSelectedUser = _this$state.focusedSelectedUser,
              chatInputIsFocused = _this$state.chatInputIsFocused;

            // create a reference to the input - we will use this to call .focus()
            // after certain events (like pressing backspace or enter)

            var input = Object(
              __WEBPACK_IMPORTED_MODULE_11_react_dom__['findDOMNode']
            )(_this.refs.input);

            // create temporary arrays of IDs from the searchResults and selectedUsers
            // to more easily manipulate the ids
            var searchResultIds =
              searchResults &&
              searchResults.map(function(user) {
                return user.id;
              });

            var indexOfFocusedSearchResult = searchResultIds.indexOf(
              focusedSearchResult
            );

            /*
        if a user presses backspace
        1. Determine if they have focused on a selectedUser pill - if so, they
           are trying to delete it
        2. Determine if there are any more characters left in the search string.
           If so, they are just typing a search query as normal
        3. If there are no more characters left in the search string, we need
           to check if the user has already selected people to message. If so,
           we remove the last one in the array
        4. If no more characters are in the search query, and no users are
           selected to be messaged, we can just return and clear out unneeded
           state
      */
            if (e.keyCode === 8) {
              // 0. if the chat input is focused, don't do anything
              if (chatInputIsFocused) return;

              // 1. If there is a selectedUser that has been focused, delete it
              if (focusedSelectedUser) {
                var newSelectedUsers = selectedUsersForNewThread.filter(
                  function(user) {
                    return user.id !== focusedSelectedUser;
                  }
                );

                _this.setState({
                  selectedUsersForNewThread: newSelectedUsers,
                  focusedSelectedUser: '',
                  existingThreadBasedOnSelectedUsers: '',
                  existingThreadWithMessages: {},
                });

                // recheckfor an existing direct message thread on the server
                _this.getMessagesForExistingDirectMessageThread();

                // focus the search input
                input.focus();

                return;
              }

              // 2. If there are more characters left in the search string
              if (searchString.length > 0) return;

              // 3. The user is trying to delete selected users. If one isn't selected,
              //    select it.
              //    Note: If the user presses backspace again it will trigger step #1
              //    above
              if (
                selectedUsersForNewThread.length > 0 &&
                !focusedSelectedUser
              ) {
                // recheck for an existing thread if the user stops searching but
                // still has selected users for the new thread
                _this.getMessagesForExistingDirectMessageThread();

                var focused =
                  selectedUsersForNewThread[
                    selectedUsersForNewThread.length - 1
                  ].id;

                _this.setState({
                  focusedSelectedUser: focused,
                });

                return;
              }

              // 4
              input.focus();
              return;
            }

            /*
        If the person presses escape:
        1. If there are focused selected users, clear them
        2. If there are search results, clear them to hide the dropdown
      */
            if (e.keyCode === 27) {
              // 0. if the chat input is focused, don't do anything
              if (chatInputIsFocused) return;

              _this.setState({
                searchResults: [],
                searchIsLoading: false,
                loadingExistingThreadMessages: false,
                focusedSelectedUser: '',
              });

              input.focus();
              return;
            }

            /*
        if person presses down
        1. If the user is at the last item in the search results, don't
        do anything
        2. Focus the next user in the search results
      */
            if (e.keyCode === 40) {
              // 0. if the chat input is focused, don't do anything
              if (chatInputIsFocused) return;

              // 1
              if (indexOfFocusedSearchResult === searchResults.length - 1)
                return;
              if (searchResults.length === 1) return;

              // 2
              _this.setState({
                focusedSearchResult:
                  searchResults[indexOfFocusedSearchResult + 1].id,
              });

              return;
            }

            /*
        if person presses up
        1. If the user is at the first`` item in the search results, don't
        do anything
        2. Focus the previous user in the search results
      */
            if (e.keyCode === 38) {
              // 0. if the chat input is focused, don't do anything
              if (chatInputIsFocused) return;

              // 1
              if (indexOfFocusedSearchResult === 0) return;
              if (searchResults.length === 1) return;

              // 2
              _this.setState({
                focusedSearchResult:
                  searchResults[indexOfFocusedSearchResult - 1].id,
              });

              return;
            }

            /*
        if person presses enter
        1. If there are search results and one of them is focused, add that user
        to the selectedUsers state, clear the searchString, clear the searchResults,
        and stop loading. Then kick off a new search to see if there is an
        existing thread containing the selected users
        2. Otherwise do nothing
      */
            if (e.keyCode === 13) {
              // 0. if the chat input is focused, don't do anything
              if (chatInputIsFocused) return;
              if (!searchResults || searchResults.length === 0) return;

              // 1
              _this.addUserToSelectedUsersList(
                searchResults[indexOfFocusedSearchResult]
              );
              return;
            }
          };

          _this.setFocusedSelectedUser = function(id) {
            _this.setState({
              focusedSelectedUser: id,
            });

            return;
          };

          _this.addUserToSelectedUsersList = function(user) {
            var selectedUsersForNewThread =
              _this.state.selectedUsersForNewThread;

            // add the new user to the state array

            selectedUsersForNewThread.push(user);
            _this.setState({
              selectedUsersForNewThread: selectedUsersForNewThread,
              searchResults: [],
              searchString: '',
              focusedSearchResult: '',
              searchIsLoading: false,
              existingThreadBasedOnSelectedUsers: '',
              existingThreadWithMessages: {},
            });

            // trigger a new search for an existing thread
            _this.getMessagesForExistingDirectMessageThread();
          };

          _this.handleChange = function(e) {
            var existingThreadBasedOnSelectedUsers =
              _this.state.existingThreadBasedOnSelectedUsers;

            // unfocus any selected user pills

            _this.setState({
              focusedSelectedUser: '',
            });

            // if a user keeps typing, assume they aren't trying to message a different
            // set of people
            if (existingThreadBasedOnSelectedUsers) {
              _this.setState({
                loadingExistingThreadMessages: false,
              });
            }

            var string = e.target.value.toLowerCase().trim();

            // set the searchstring to state
            _this.setState({
              searchString: e.target.value,
            });

            // trigger a new search based on the search input
            _this.search(string);
          };

          _this.getMessagesForExistingDirectMessageThread = function() {
            var _this$props2 = _this.props,
              threads = _this$props2.threads,
              currentUser = _this$props2.currentUser,
              client = _this$props2.client;
            var selectedUsersForNewThread =
              _this.state.selectedUsersForNewThread;

            if (!threads) {
              return;
            }

            // user hasn't created any dm threads yet,
            if (threads && threads.length === 0) {
              return;
            }

            // if there are no selected users in the thread
            if (selectedUsersForNewThread.length === 0) {
              _this.setState({
                existingThreadBasedOnSelectedUsers: '',
                loadingExistingThreadMessages: false,
              });

              return;
            }

            /*
        If we made it here it means that the user has selected people to message
        in the composer and that they have some existing threads that were
        already returned from the server. What we need to do now is determine
        if the selectedUsers in the composer exactly match the users of an
        existing thread.
         We'll do this by:
        1. Creating a new array of the user's existing DM threads with the
        following shape:
          {
            id
            users: [ id ]
          }
        where the users array does *not* contain the currentUser id. It has
        to be cleared becaues the composer input does *not* contain the current
        user.
         2. For each of these threads, we'll sort the users, sort the composer's
        selected users and look for a match.
      */

            // 1. Create a new array of cleaned up threads objects
            var cleanedExistingThreads = threads.map(function(thread) {
              return {
                id: thread.id,
                participants: thread.participants
                  .filter(function(user) {
                    return user.userId !== currentUser.id;
                  })
                  .map(function(user) {
                    return user.userId;
                  }),
              };
            });

            // 2. Sort both arrays of user IDs and look for a match
            var sortedSelectedUsersForNewThread = selectedUsersForNewThread
              .map(function(user) {
                return user.id;
              })
              .sort()
              .join('');

            // will return null or an object
            var existingThread = cleanedExistingThreads.filter(function(
              thread
            ) {
              var sortedUsers = thread.participants.sort().join('');

              if (sortedUsers === sortedSelectedUsersForNewThread) {
                return thread;
              } else {
                return null;
              }
            });

            // if an existing thread was found, set it to the state and get the messages
            // from the server
            if (existingThread.length > 0) {
              _this.setState({
                loadingExistingThreadMessages: true,
                existingThreadBasedOnSelectedUsers: existingThread[0].id,
              });

              client
                .query({
                  query:
                    __WEBPACK_IMPORTED_MODULE_12__queries__[
                      'a' /* GET_DIRECT_MESSAGE_THREAD_QUERY */
                    ],
                  variables: {
                    id: existingThread[0].id,
                  },
                })
                .then(function(_ref2) {
                  var directMessageThread = _ref2.data.directMessageThread;

                  // stop loading
                  _this.setState({
                    loadingExistingThreadMessages: false,
                  });

                  // if messages were found
                  if (directMessageThread.id) {
                    _this.setState({
                      existingThreadWithMessages: directMessageThread,
                    });
                    // if no messages were found
                  } else {
                    _this.setState({
                      existingThreadWithMessages: {},
                      existingThreadBasedOnSelectedUsers: '',
                    });
                  }
                });
            }
          };

          _this.forceScrollToBottom = function() {
            if (!_this.scrollBody) return;
            var node = _this.scrollBody;
            node.scrollTop = node.scrollHeight - node.clientHeight;
          };

          _this.createThread = function(_ref3) {
            var messageBody = _ref3.messageBody,
              messageType = _ref3.messageType,
              file = _ref3.file;
            var _this$state2 = _this.state,
              selectedUsersForNewThread =
                _this$state2.selectedUsersForNewThread,
              threadIsBeingCreated = _this$state2.threadIsBeingCreated;

            // if no users have been selected, break out of this function and throw
            // an error

            if (selectedUsersForNewThread.length === 0) {
              return _this.props.dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_17__actions_toasts__[
                    'a' /* addToastWithTimeout */
                  ]
                )('error', 'Choose some people to send this message to first!')
              );
            }

            var input = {
              participants: selectedUsersForNewThread.map(function(user) {
                return user.id;
              }),
              message: {
                messageType: messageType,
                threadType: 'directMessageThread',
                content: {
                  body: messageBody ? messageBody : '',
                },
                file: file ? file : null,
              },
            };

            var isPrivate = selectedUsersForNewThread.length > 1 ? true : false;

            if (threadIsBeingCreated) {
              return;
            } else {
              _this.setState({
                threadIsBeingCreated: true,
              });

              _this.props
                .createDirectMessageThread(input)
                .then(function(_ref4) {
                  var createDirectMessageThread =
                    _ref4.data.createDirectMessageThread;

                  if (!createDirectMessageThread) {
                    _this.props.dispatch(
                      Object(
                        __WEBPACK_IMPORTED_MODULE_17__actions_toasts__[
                          'a' /* addToastWithTimeout */
                        ]
                      )(
                        'error',
                        'Failed to create direct message thread, please try again!'
                      )
                    );
                    return;
                  }
                  Object(
                    __WEBPACK_IMPORTED_MODULE_14__helpers_events__[
                      'b' /* track */
                    ]
                  )('direct message thread', (isPrivate ? 'private thread' : 'group thread') + ' created', null);

                  _this.setState({
                    threadIsBeingCreated: false,
                  });

                  _this.props.setActiveThread(createDirectMessageThread.id);
                  _this.props.history.push(
                    '/messages/' + createDirectMessageThread.id
                  );
                })
                .catch(function(err) {
                  // if an error happened, the user can try to resend the message to
                  // create a new thread
                  _this.setState({
                    threadIsBeingCreated: false,
                  });

                  _this.props.dispatch(
                    Object(
                      __WEBPACK_IMPORTED_MODULE_17__actions_toasts__[
                        'a' /* addToastWithTimeout */
                      ]
                    )('error', err.message)
                  );
                });
            }
          };

          _this.onChatInputFocus = function() {
            _this.setState({
              chatInputIsFocused: true,
            });
          };

          _this.onChatInputBlur = function() {
            _this.setState({
              chatInputIsFocused: false,
            });
          };

          _this.state = {
            // user types in a string that returns all users whose username
            // or displayName contains the string
            searchString: '',
            // the query returns an array of user objects. this is used to populate
            // the search dropdown
            searchResults: [],
            // if the query is still fetching, a loading indicator appears in
            // the search bar
            searchIsLoading: false,
            // as a user selects users for the new direct message thread, we add
            // them to an array. this array will be used for two functions:
            // 1. Map against the user's existing DM threads to see if a thread
            //    with the selected users already exists
            // 2. If no existing thread is found, this is the array that will be
            //    used in the DMThread creation mutation
            selectedUsersForNewThread: [],
            // represents a userId of a search result that is currently "focused"
            // in the search dropdown. This allows a user to press up/down, or enter
            // to quickly navigation the search results dropdown
            focusedSearchResult: '',
            // when users have been added to `selectedUsersForNewThread`, they can
            // be removed by either backspacing them away, or a user can click on
            // the person's name, and then press backspace, to remove that specific
            // user
            focusedSelectedUser: '',
            // if an existing thread is found based on the selected users, we will
            // kick off a query to get that thread's messages and load it inline
            // we will also use this object to make sure the chat input sends messages
            // to the existing thread and doesn't create a new one
            existingThreadBasedOnSelectedUsers: '',
            // after we get the messages from the server, we'll store the full object
            existingThreadWithMessages: {},
            // if the query is loading, we show a centered spinner in the middle of
            // the page where the messages will appear
            loadingExistingThreadMessages: false,
            // if the user is focused on the chat input, we want 'enter' to send
            // a message and create the dm group, and ignore other logic around
            // pressing the 'enter' key
            chatInputIsFocused: false,
            // set to true while a thread is being created, to prevent a user pressing
            // enter twice and accidentally creating two threads
            threadIsBeingCreated: false,
          };

          // only kick off search query every 200ms
          _this.search = Object(
            __WEBPACK_IMPORTED_MODULE_13__helpers_utils__['h' /* throttle */]
          )(_this.search, 200);
          return _this;
        }

        /*
    takes a string that gets sent to the server and matched against all
    user's displayNames and usernames
  */

        /*
    This method is used to determine if the selected users in the new thread
    being composed match an existing DM thread for the current user. If we
    find a match, we should load the messages for that thread and prepare
    the chatInput to send any messages to that existing thread.
     If no matches are found, we will return a falsey value which will tell
    the chat input that it is creating a new thread based on the current
    array of selectedUsers in the state
  */

        _createClass(NewThread, [
          {
            key: 'componentWillMount',
            value: function componentWillMount() {
              // can take an optional param of an array of user objects to automatically
              // populate the new message composer
              var initNewThreadWithUser = this.props.initNewThreadWithUser;

              // if the prop is present, add the users to the selected users state

              if (initNewThreadWithUser.length > 0) {
                this.setState({
                  selectedUsersForNewThread: [].concat(
                    _toConsumableArray(initNewThreadWithUser)
                  ),
                });
              }
            },
            /*
      Add event listeners when the component mounts - will be listening
      for up, down, backspace, escape, and enter, to trigger different
      functions depending on the context or state of the composer
    */
          },
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              document.addEventListener('keydown', this.handleKeyPress, false);

              var _props = this.props,
                initNewThreadWithUser = _props.initNewThreadWithUser,
                threadSliderIsOpen = _props.threadSliderIsOpen;

              // if someone is viewing a thread, don't focus here

              if (threadSliderIsOpen) return;

              // focus the composer input if no users were already in the composer
              if (initNewThreadWithUser.length === 0) {
                var input = Object(
                  __WEBPACK_IMPORTED_MODULE_11_react_dom__['findDOMNode']
                )(this.refs.input);
                return input.focus();
              }

              this.chatInput.triggerFocus();

              // clear the redux store of this inited user, in case the person
              // sends more messages later in the session
              this.props.dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_18__actions_directMessageThreads__[
                    'a' /* clearDirectMessagesComposer */
                  ]
                )()
              );

              if (this.state.selectedUsersForNewThread.length > 0) {
                // trigger a new search for an existing thread with these users
                this.getMessagesForExistingDirectMessageThread();
              }
            },
          },
          {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
              document.removeEventListener(
                'keydown',
                this.handleKeyPress,
                false
              );
            },
          },
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate() {
              this.forceScrollToBottom();
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _state = this.state,
                searchString = _state.searchString,
                selectedUsersForNewThread = _state.selectedUsersForNewThread,
                searchIsLoading = _state.searchIsLoading,
                searchResults = _state.searchResults,
                focusedSelectedUser = _state.focusedSelectedUser,
                focusedSearchResult = _state.focusedSearchResult,
                existingThreadBasedOnSelectedUsers =
                  _state.existingThreadBasedOnSelectedUsers,
                loadingExistingThreadMessages =
                  _state.loadingExistingThreadMessages,
                existingThreadWithMessages = _state.existingThreadWithMessages;
              var _props2 = this.props,
                currentUser = _props2.currentUser,
                hideOnMobile = _props2.hideOnMobile;

              var _generateMetaInfo = __WEBPACK_IMPORTED_MODULE_6_shared_generate_meta_info___default()(
                  {
                    type: 'directMessage',
                    data: {
                      title: 'New message',
                      description: null,
                    },
                  }
                ),
                title = _generateMetaInfo.title,
                description = _generateMetaInfo.description;

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_10__style__[
                  'b' /* MessagesContainer */
                ],
                {
                  hideOnMobile: hideOnMobile,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 688,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_4__components_head__[
                    'a' /* default */
                  ],
                  {
                    title: title,
                    description: description,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 689,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_20__components_style__[
                    'c' /* ComposerInputWrapper */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 690,
                    },
                    __self: this,
                  },
                  // if users have been selected, show them as pills
                  selectedUsersForNewThread.length > 0 &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_20__components_style__[
                        'x' /* SelectedUsersPills */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 693,
                        },
                        __self: this,
                      },
                      selectedUsersForNewThread.map(function(user) {
                        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_20__components_style__[
                            'm' /* Pill */
                          ],
                          {
                            selected: focusedSelectedUser === user.id,
                            onClick: function onClick() {
                              return _this2.setFocusedSelectedUser(user.id);
                            },
                            key: user.id,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 696,
                            },
                            __self: _this2,
                          },
                          user.name
                        );
                      })
                    ),
                  searchIsLoading &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_20__components_style__[
                        'w' /* SearchSpinnerContainer */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 709,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_16__components_globals__[
                          'l' /* Spinner */
                        ],
                        {
                          size: 16,
                          color: 'brand.default',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 710,
                          },
                          __self: this,
                        }
                      )
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_20__components_style__[
                      'b' /* ComposerInput */
                    ],
                    {
                      ref: 'input',
                      type: 'text',
                      value: searchString,
                      placeholder: 'Search for people...',
                      onChange: this.handleChange,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 714,
                      },
                      __self: this,
                    }
                  ),
                  // user has typed in a search string
                  searchString &&
                    //if there are selected users already, we manually shift
                    // the search results position down
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_20__components_style__[
                        'v' /* SearchResultsDropdown */
                      ],
                      {
                        moved: selectedUsersForNewThread.length > 0,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 726,
                        },
                        __self: this,
                      },
                      searchResults.length > 0 &&
                        searchResults.map(function(user) {
                          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_20__components_style__[
                              'p' /* SearchResult */
                            ],
                            {
                              focused: focusedSearchResult === user.id,
                              key: user.id,
                              onClick: function onClick() {
                                return _this2.addUserToSelectedUsersList(user);
                              },
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 730,
                              },
                              __self: _this2,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_20__components_style__[
                                'r' /* SearchResultImage */
                              ],
                              {
                                user: user,
                                isOnline: user.isOnline,
                                size: 32,
                                radius: 32,
                                src: user.profilePhoto,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 735,
                                },
                                __self: _this2,
                              }
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_20__components_style__[
                                't' /* SearchResultTextContainer */
                              ],
                              {
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 742,
                                },
                                __self: _this2,
                              },
                              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_20__components_style__[
                                  'q' /* SearchResultDisplayName */
                                ],
                                {
                                  __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 743,
                                  },
                                  __self: _this2,
                                },
                                user.name
                              ),
                              user.username &&
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                  __WEBPACK_IMPORTED_MODULE_20__components_style__[
                                    'u' /* SearchResultUsername */
                                  ],
                                  {
                                    __source: {
                                      fileName: _jsxFileName,
                                      lineNumber: 747,
                                    },
                                    __self: _this2,
                                  },
                                  '@',
                                  user.username
                                )
                            )
                          );
                        }),
                      searchResults.length === 0 &&
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_20__components_style__[
                            'p' /* SearchResult */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 757,
                            },
                            __self: this,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_20__components_style__[
                              't' /* SearchResultTextContainer */
                            ],
                            {
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 758,
                              },
                              __self: this,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_20__components_style__[
                                's' /* SearchResultNull */
                              ],
                              {
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 759,
                                },
                                __self: this,
                              },
                              'No users found matching "',
                              searchString,
                              '"'
                            )
                          )
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_10__style__['e' /* ViewContent */],
                  {
                    moved: selectedUsersForNewThread.length > 0,
                    innerRef: function innerRef(scrollBody) {
                      return (_this2.scrollBody = scrollBody);
                    },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 769,
                    },
                    __self: this,
                  },
                  existingThreadWithMessages &&
                    existingThreadWithMessages.id &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_8__components_header__[
                        'a' /* default */
                      ],
                      {
                        thread: existingThreadWithMessages,
                        currentUser: currentUser,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 775,
                        },
                        __self: this,
                      }
                    ),
                  existingThreadBasedOnSelectedUsers &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_7__components_messages__[
                        'a' /* default */
                      ],
                      {
                        id: existingThreadBasedOnSelectedUsers,
                        currentUser: currentUser,
                        forceScrollToBottom: this.forceScrollToBottom,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 782,
                        },
                        __self: this,
                      }
                    ),
                  !existingThreadBasedOnSelectedUsers &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_20__components_style__[
                        'd' /* Grow */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 790,
                        },
                        __self: this,
                      },
                      loadingExistingThreadMessages &&
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_16__components_globals__[
                            'l' /* Spinner */
                          ],
                          {
                            size: 16,
                            color: 'brand.default',
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 792,
                            },
                            __self: this,
                          }
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__components_chatInput__[
                    'a' /* default */
                  ],
                  {
                    thread:
                      existingThreadBasedOnSelectedUsers ||
                      'newDirectMessageThread',
                    createThread: this.createThread,
                    onFocus: this.onChatInputFocus,
                    onBlur: this.onChatInputBlur,
                    threadType: 'directMessageThread',
                    onRef: function onRef(chatInput) {
                      return (_this2.chatInput = chatInput);
                    },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 797,
                    },
                    __self: this,
                  }
                )
              );
            },
          },
        ]);

        return NewThread;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var mapStateToProps = function mapStateToProps(state) {
        return {
          initNewThreadWithUser:
            state.directMessageThreads.initNewThreadWithUser,
          threadSliderIsOpen: state.threadSlider.isOpen,
        };
      };

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_3_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_1_react_apollo__['withApollo'],
        __WEBPACK_IMPORTED_MODULE_2_react_router__['e' /* withRouter */],
        __WEBPACK_IMPORTED_MODULE_19__api_directMessageThread__[
          'a' /* createDirectMessageThreadMutation */
        ],
        Object(__WEBPACK_IMPORTED_MODULE_5_react_redux__['a' /* connect */])(
          mapStateToProps
        )
      )(NewThread);

      /***/
    },
});
//# sourceMappingURL=8.96358f5c7f2339a17fbf.hot-update.js.map
