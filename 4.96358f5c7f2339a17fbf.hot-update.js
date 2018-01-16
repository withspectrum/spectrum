webpackHotUpdate(4, {
  /***/ './src/components/newActivityIndicator/index.js':
    /*!******************************************************!*\
  !*** ./src/components/newActivityIndicator/index.js ***!
  \******************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_newActivityIndicator__ = __webpack_require__(
        /*! ../../actions/newActivityIndicator */ './src/actions/newActivityIndicator.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__globals__ = __webpack_require__(
        /*! ../globals */ './src/components/globals/index.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/components/newActivityIndicator/index.js';

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

      var Pill = __WEBPACK_IMPORTED_MODULE_3_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'newActivityIndicator__Pill',
        componentId: 'orjwdh-0',
      })(
        [
          'padding:',
          ';border-radius:20px;color:',
          ';background:',
          ';};font-size:14px;display:flex;align-items:center;justify-content:center;align-self:center;position:fixed;top:0;opacity:',
          ';pointer-events:',
          ';left:50%;z-index:9999;transform:translateX(-50%) translateY(',
          ');font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,0.3);transition:all 0.2s ease-in-out;cursor:pointer;&:hover{transform:translateX(-50%) translateY(78px);transition:all 0.2s ease-in-out;}&:active{transform:translateX(-50%) translateY(80px);transition:all 0.1s ease-in-out;}@media (max-width:768px){transform:translateX(-50%) translateY(',
          ');&:hover{transform:translateX(-50%) translateY(58px);transition:all 0.2s ease-in-out;}&:active{transform:translateX(-50%) translateY(60px);transition:all 0.1s ease-in-out;}}',
        ],
        function(props) {
          return props.refetching ? '8px' : '8px 16px';
        },
        function(props) {
          return props.theme.text.reverse;
        },
        function(props) {
          return Object(
            __WEBPACK_IMPORTED_MODULE_4__globals__['c' /* Gradient */]
          )(props.theme.brand.alt, props.theme.brand.default);
        },
        function(props) {
          return props.active ? '1' : '0';
        },
        function(props) {
          return props.active ? 'auto' : 'none';
        },
        function(props) {
          return props.active ? '80px' : '60px';
        },
        function(props) {
          return props.active ? '60px' : '40px';
        }
      );

      var scrollTo = function scrollTo(element, to, duration) {
        if (duration < 0) return;
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 2;

        setTimeout(function() {
          element.scrollTop = element.scrollTop + perTick;
          scrollTo(element, to, duration - 2);
        }, 10);
      };

      var Indicator = (function(_Component) {
        _inherits(Indicator, _Component);

        function Indicator() {
          _classCallCheck(this, Indicator);

          var _this = _possibleConstructorReturn(
            this,
            (Indicator.__proto__ || Object.getPrototypeOf(Indicator)).call(this)
          );

          _this.clearActivityIndicator = function() {
            // if the user clicks on the new activity indicator, scroll them to the top of the feed and dismiss the indicator
            setTimeout(function() {
              return _this.props.dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_2__actions_newActivityIndicator__[
                    'b' /* clearActivityIndicator */
                  ]
                )()
              );
            }, 120);
            scrollTo(_this.state.elem, 0, 80);
          };

          _this.state = {
            elem: null,
          };
          return _this;
        }

        _createClass(Indicator, [
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
              if (prevProps !== this.props) {
                this.setState({
                  // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
                  // the AppViewWrapper which is the scrolling part of the site.
                  elem: document.getElementById(this.props.elem),
                });
              }
            },
          },
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              var elem = document.getElementById(this.props.elem);
              this.setState({
                // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
                // the AppViewWrapper which is the scrolling part of the site.
                elem: elem,
              });

              // if the component mounted while the user is scrolled to the top, immediately clear the redux store of the activity indicator - since the user can see the top of the feed, they don't need an indicator
              if (elem.scrollTop < window.innerHeight / 2) {
                this.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_2__actions_newActivityIndicator__[
                      'b' /* clearActivityIndicator */
                    ]
                  )()
                );
              }
            },
          },
          {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
              // when the component unmounts, clear the state so that at next mount we will always get a new scrollTop position for the scroll element
              this.setState({
                elem: null,
              });
            },
          },
          {
            key: 'render',
            value: function render() {
              var elem = this.state.elem;

              var active = false;

              // if the scroll element exists, and the user has scrolled at least half of the screen (e.g. the top of the feed is out of view), then the user should see a new activity indicator
              if (elem) {
                active = elem.scrollTop > window.innerHeight / 2;
              }

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                Pill,
                {
                  active: active,
                  onClick: this.clearActivityIndicator,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 128,
                  },
                  __self: this,
                },
                'New conversations!'
              );
            },
          },
        ]);

        return Indicator;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__['a'] = Object(
        __WEBPACK_IMPORTED_MODULE_1_react_redux__['a' /* connect */]
      )()(Indicator);

      /***/
    },

  /***/ './src/components/segmentedControl/index.js':
    /*!**************************************************!*\
  !*** ./src/components/segmentedControl/index.js ***!
  \**************************************************/
    /*! exports provided: SegmentedControl, Segment, DesktopSegment, MobileSegment */
    /*! exports used: DesktopSegment, MobileSegment, Segment, SegmentedControl */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return SegmentedControl;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return Segment;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return DesktopSegment;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return MobileSegment;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__globals__ = __webpack_require__(
        /*! ../globals */ './src/components/globals/index.js'
      );

      var SegmentedControl = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_1__globals__['b' /* FlexRow */]).withConfig({
        displayName: 'segmentedControl__SegmentedControl',
        componentId: 's1a8lx7m-0',
      })(
        [
          'align-self:stretch;margin:0 32px;margin-top:16px;border-bottom:2px solid ',
          ';align-items:stretch;min-height:48px;@media (max-width:768px){background-color:',
          ';align-self:stretch;margin:0;margin-bottom:2px;}',
        ],
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.theme.bg.default;
        }
      );

      var Segment = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_1__globals__['b' /* FlexRow */]).withConfig({
        displayName: 'segmentedControl__Segment',
        componentId: 's1a8lx7m-1',
      })(
        [
          'padding:8px 24px;justify-content:center;align-items:center;text-align:center;line-height:1;font-size:18px;font-weight:500;color:',
          ';cursor:pointer;position:relative;top:2px;border-bottom:2px solid ',
          ';.icon{margin-right:8px;}',
          ';&:hover{color:',
          ';}@media (max-width:768px){flex:auto;justify-content:center;margin-top:32px;text-align:center;.icon{margin-right:0;}}',
        ],
        function(props) {
          return props.selected
            ? props.theme.text.default
            : props.theme.text.alt;
        },
        function(props) {
          return props.selected ? props.theme.text.default : 'transparent';
        },
        function(props) {
          return (
            props.selected &&
            Object(
              __WEBPACK_IMPORTED_MODULE_0_styled_components__['b' /* css */]
            )(['border-bottom:2px solid ', ';'], function(props) {
              return props.theme.bg.reverse;
            })
          );
        },
        function(props) {
          return props.theme.text.default;
        }
      );

      var DesktopSegment = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(Segment).withConfig({
        displayName: 'segmentedControl__DesktopSegment',
        componentId: 's1a8lx7m-2',
      })(['@media (max-width:768px){display:none;}']);

      var MobileSegment = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(Segment).withConfig({
        displayName: 'segmentedControl__MobileSegment',
        componentId: 's1a8lx7m-3',
      })(['@media (min-width:768px){display:none;}']);

      /***/
    },

  /***/ './src/views/communitySettings/components/importSlack.js':
    /*!***************************************************************!*\
  !*** ./src/views/communitySettings/components/importSlack.js ***!
  \***************************************************************/
    /*! exports provided: ImportSlackWithoutCard, ImportSlackWithCard, default */
    /*! exports used: ImportSlackWithoutCard, default */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return ImportSlackWithoutCard;
        }
      );
      /* unused harmony export ImportSlackWithCard */
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_textarea_autosize__ = __webpack_require__(
        /*! react-textarea-autosize */ './node_modules/react-textarea-autosize/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_toasts__ = __webpack_require__(
        /*! ../../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__api_slackImport__ = __webpack_require__(
        /*! ../../../api/slackImport */ './src/api/slackImport.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_icons__ = __webpack_require__(
        /*! ../../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__style__ = __webpack_require__(
        /*! ../style */ './src/views/communitySettings/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_formElements__ = __webpack_require__(
        /*! ../../../components/formElements */ './src/components/formElements/index.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/communitySettings/components/importSlack.js',
        _this2 = this;

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

      var ImportSlack = (function(_React$Component) {
        _inherits(ImportSlack, _React$Component);

        function ImportSlack() {
          _classCallCheck(this, ImportSlack);

          var _this = _possibleConstructorReturn(
            this,
            (ImportSlack.__proto__ || Object.getPrototypeOf(ImportSlack)).call(
              this
            )
          );

          _this.sendInvites = function() {
            var community = _this.props.data.community;
            var _this$state = _this.state,
              customMessageError = _this$state.customMessageError,
              customMessageString = _this$state.customMessageString,
              hasCustomMessage = _this$state.hasCustomMessage;

            _this.props.hasInvitedPeople && _this.props.hasInvitedPeople();

            var customMessage =
              hasCustomMessage && !customMessageError
                ? customMessageString
                : null;

            _this.setState({
              isSendingInvites: true,
            });

            _this.props
              .sendSlackInvites({
                id: community.id,
                customMessage: customMessage,
              })
              .then(function(_ref) {
                var sendSlackInvites = _ref.data.sendSlackInvites;

                _this.setState({
                  isSendingInvites: false,
                  hasCustomMessage: false,
                });
                _this.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_4__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('success', 'Your invitations are being sent!')
                );
              })
              .catch(function(err) {
                _this.setState({
                  isSendingInvites: false,
                });
                _this.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_4__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('error', err.message)
                );
              });
          };

          _this.handleChange = function(e) {
            var customMessageString = e.target.value;
            if (customMessageString.length > 500) {
              _this.setState({
                customMessageString: customMessageString,
                customMessageError: true,
              });
            } else {
              _this.setState({
                customMessageString: customMessageString,
                customMessageError: false,
              });
            }
          };

          _this.toggleCustomMessage = function() {
            var hasCustomMessage = _this.state.hasCustomMessage;

            _this.setState({
              hasCustomMessage: !hasCustomMessage,
            });
          };

          _this.state = {
            isSendingInvites: false,
            hasCustomMessage: false,
            customMessageString: '',
            customMessageError: false,
          };
          return _this;
        }

        _createClass(ImportSlack, [
          {
            key: 'render',
            value: function render() {
              var _props = this.props,
                _props$data = _props.data,
                community = _props$data.community,
                startPolling = _props$data.startPolling,
                stopPolling = _props$data.stopPolling,
                isLoading = _props.isLoading;
              var _state = this.state,
                isSendingInvites = _state.isSendingInvites,
                customMessageString = _state.customMessageString,
                hasCustomMessage = _state.hasCustomMessage,
                customMessageError = _state.customMessageError;

              if (community) {
                // if no import has been created yet, we won't have a team name or a record at all
                var noImport =
                  !community.slackImport || !community.slackImport.teamName;
                // if an import has been created, but does not have members data yet
                var partialImport =
                  community.slackImport &&
                  community.slackImport.teamName &&
                  !community.slackImport.members;
                // if an import has been created and we have members
                var fullImport =
                  community.slackImport && community.slackImport.members;
                var hasAlreadyBeenSent =
                  fullImport && community.slackImport.sent;

                var url = this.props.isOnboarding
                  ? 'https://slack.com/oauth/authorize?&client_id=201769987287.200380534417&scope=users:read.email,users:read,team:read,admin&state=' +
                    community.id +
                    '&redirect_uri=' +
                    (true
                      ? 'http://localhost:3001/api/slack/onboarding'
                      : 'https://spectrum.chat/api/slack/onboarding')
                  : 'https://slack.com/oauth/authorize?&client_id=201769987287.200380534417&scope=users:read.email,users:read,team:read,admin&state=' +
                    community.id +
                    '&redirect_uri=' +
                    (true
                      ? 'http://localhost:3001/api/slack'
                      : 'https://spectrum.chat/api/slack');

                if (noImport) {
                  return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    'div',
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 153,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_11__components_settingsViews_style__[
                        'i' /* SectionTitle */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 154,
                        },
                        __self: this,
                      },
                      'Invite a Slack Team'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                        'd' /* Description */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 155,
                        },
                        __self: this,
                      },
                      'Easily invite your team from an existing Slack team to Spectrum. Get started by connecting your team below.',
                      ' '
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                        'n' /* Notice */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 159,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        'strong',
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 160,
                          },
                          __self: this,
                        },
                        'Note:'
                      ),
                      ' We will not invite any of your team members until you\u2019re ready. We will prompt for admin access to ensure that you own the Slack team.'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_11__components_settingsViews_style__[
                        'g' /* SectionCardFooter */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 164,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        'a',
                        {
                          href: url,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 165,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_7__components_buttons__[
                            'a' /* Button */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 166,
                            },
                            __self: this,
                          },
                          'Connect a Slack Team'
                        )
                      )
                    )
                  );
                } else if (partialImport) {
                  startPolling(5000);
                  return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    'div',
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 174,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_11__components_settingsViews_style__[
                        'i' /* SectionTitle */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 175,
                        },
                        __self: this,
                      },
                      'Invite a Slack Team'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_11__components_settingsViews_style__[
                        'g' /* SectionCardFooter */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 176,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_7__components_buttons__[
                          'a' /* Button */
                        ],
                        {
                          loading: true,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 177,
                          },
                          __self: this,
                        },
                        'Connecting with Slack...'
                      )
                    )
                  );
                } else if (fullImport) {
                  stopPolling();
                  var members = JSON.parse(community.slackImport.members);
                  var teamName = community.slackImport.teamName;
                  var count = members.length.toLocaleString();

                  if (hasAlreadyBeenSent) {
                    return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      'div',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 189,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_11__components_settingsViews_style__[
                          'i' /* SectionTitle */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 190,
                          },
                          __self: this,
                        },
                        'Invite your Slack team'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                          'd' /* Description */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 191,
                          },
                          __self: this,
                        },
                        'This community has been connected to the',
                        ' ',
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          'strong',
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 193,
                            },
                            __self: this,
                          },
                          teamName
                        ),
                        ' Slack team. We found ',
                        count,
                        ' members with email addresses - you have already invited them to join your community.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_11__components_settingsViews_style__[
                          'g' /* SectionCardFooter */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 197,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_7__components_buttons__[
                            'a' /* Button */
                          ],
                          {
                            disabled: true,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 198,
                            },
                            __self: this,
                          },
                          'Invites sent to ',
                          count,
                          ' people'
                        )
                      )
                    );
                  } else {
                    return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      'div',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 204,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_11__components_settingsViews_style__[
                          'i' /* SectionTitle */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 205,
                          },
                          __self: this,
                        },
                        'Invite a Slack Team'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                          'd' /* Description */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 206,
                          },
                          __self: this,
                        },
                        'This community has been connected to the',
                        ' ',
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          'strong',
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 208,
                            },
                            __self: this,
                          },
                          teamName
                        ),
                        ' Slack team. We found ',
                        count,
                        ' members with email addresses - you can invite them to your Spectrum community in one click.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_10__style__[
                          'e' /* CustomMessageToggle */
                        ],
                        {
                          onClick: this.toggleCustomMessage,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 213,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_8__components_icons__[
                            'a' /* default */
                          ],
                          {
                            glyph: hasCustomMessage ? 'view-close' : 'post',
                            size: 20,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 214,
                            },
                            __self: this,
                          }
                        ),
                        hasCustomMessage
                          ? 'Remove custom message'
                          : 'Optional: Add a custom message to your invitation'
                      ),
                      hasCustomMessage &&
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_3_react_textarea_autosize__[
                            'a' /* default */
                          ],
                          {
                            autoFocus: true,
                            value: customMessageString,
                            placeholder: 'Write something sweet here...',
                            style: Object.assign(
                              {},
                              __WEBPACK_IMPORTED_MODULE_10__style__[
                                'd' /* CustomMessageTextAreaStyles */
                              ],
                              {
                                border: customMessageError
                                  ? '1px solid #E3353C'
                                  : '1px solid #DFE7EF',
                              }
                            ),
                            onChange: this.handleChange,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 224,
                            },
                            __self: this,
                          }
                        ),
                      hasCustomMessage &&
                        customMessageError &&
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_13__components_formElements__[
                            'c' /* Error */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 240,
                            },
                            __self: this,
                          },
                          'Your custom invitation message can be up to 500 characters.'
                        ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_11__components_settingsViews_style__[
                          'g' /* SectionCardFooter */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 245,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_7__components_buttons__[
                            'a' /* Button */
                          ],
                          {
                            gradientTheme: 'success',
                            onClick: this.sendInvites,
                            loading: isSendingInvites,
                            disabled: hasCustomMessage && customMessageError,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 246,
                            },
                            __self: this,
                          },
                          'Invite ',
                          count,
                          ' people to Spectrum'
                        )
                      )
                    );
                  }
                }
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_6__components_loading__[
                    'a' /* Loading */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 262,
                    },
                    __self: this,
                  }
                );
              }

              return null;
            },
          },
        ]);

        return ImportSlack;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var ImportSlackCard = function ImportSlackCard(props) {
        return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
          __WEBPACK_IMPORTED_MODULE_11__components_settingsViews_style__[
            'f' /* SectionCard */
          ],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 270,
            },
            __self: _this2,
          },
          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
            ImportSlack,
            Object.assign({}, props, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 271,
              },
              __self: _this2,
            })
          )
        );
      };

      var ImportSlackNoCard = function ImportSlackNoCard(props) {
        return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
          ImportSlack,
          Object.assign({}, props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 275,
            },
            __self: _this2,
          })
        );
      };

      var ImportSlackWithoutCard = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_5__api_slackImport__[
          'b' /* sendSlackInvitationsMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_5__api_slackImport__[
          'a' /* getSlackImport */
        ],
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_9__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(ImportSlackNoCard);
      var ImportSlackWithCard = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_5__api_slackImport__[
          'b' /* sendSlackInvitationsMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_5__api_slackImport__[
          'a' /* getSlackImport */
        ],
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_9__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(ImportSlackCard);
      /* harmony default export */ __webpack_exports__[
        'b'
      ] = ImportSlackWithCard;

      /***/
    },

  /***/ './src/views/newCommunity/components/share/style.js':
    /*!**********************************************************!*\
  !*** ./src/views/newCommunity/components/share/style.js ***!
  \**********************************************************/
    /*! exports provided: ButtonRow, InputRow, Input */
    /*! exports used: ButtonRow, Input, InputRow */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return ButtonRow;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return InputRow;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return Input;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_globals__ = __webpack_require__(
        /*! ../../../../components/globals */ './src/components/globals/index.js'
      );

      // $FlowFixMe

      var ButtonRow = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__ButtonRow',
        componentId: 's1j39tdd-0',
      })([
        'display:flex;flex-direction:row;flex:1;flex-wrap:wrap;margin-top:16px;justify-content:center;a,button{margin-top:16px;}a:first-of-type,button:first-of-type{margin-left:0;margin-right:16px;}a > button:first-of-type{margin:0;}',
      ]);

      var InputRow = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__InputRow',
        componentId: 's1j39tdd-1',
      })([
        'display:flex;flex-direction:row;flex:1;flex-wrap:wrap;margin:16px;justify-content:center;position:relative;max-width:100%;',
      ]);

      var Input = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Input',
        componentId: 's1j39tdd-2',
      })(
        [
          'padding:4px 12px;border-radius:8px;border:2px solid ',
          ';background:#fff;font-weight:500;color:',
          ';padding-right:72px;position:relative;display:flex;align-self:center;max-width:100%;z-index:',
          ';&:hover{cursor:pointer;&:after{background:',
          ";}}&:after{content:'COPY';font-size:11px;font-weight:600;color:",
          ';text-transform:uppercase;position:absolute;top:0;right:0;bottom:0;background:#fff;padding:4px 12px;border-left:2px solid ',
          ';border-radius:0 8px 8px 0;z-index:',
          ';line-height:2.1;}',
        ],
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.theme.text.alt;
        },
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['r' /* zIndex */]
          .form,
        function(props) {
          return props.theme.bg.wash;
        },
        function(props) {
          return props.theme.brand.default;
        },
        function(props) {
          return props.theme.bg.border;
        },
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['r' /* zIndex */]
          .form + 1
      );

      /***/
    },

  /***/ './src/views/user/style.js':
    /*!*********************************!*\
  !*** ./src/views/user/style.js ***!
  \*********************************/
    /*! exports provided: Row, Col, RowLabel, SearchContainer, SearchInput */
    /*! exports used: SearchContainer, SearchInput */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* unused harmony export Row */
      /* unused harmony export Col */
      /* unused harmony export RowLabel */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return SearchContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return SearchInput;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_globals__ = __webpack_require__(
        /*! ../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_card__ = __webpack_require__(
        /*! ../../components/card */ './src/components/card/index.js'
      );

      var Row = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['b' /* FlexRow */]
      ).withConfig({
        displayName: 'style__Row',
        componentId: 's1evw37o-0',
      })(
        [
          'padding:8px 16px;align-items:center;width:100%;color:',
          ';div{margin-top:2px;margin-right:8px;color:inherit;}span{line-height:1;color:inherit;}&:hover{background-color:',
          ';color:',
          ';}',
        ],
        function(_ref) {
          var theme = _ref.theme;
          return theme.text.alt;
        },
        function(_ref2) {
          var theme = _ref2.theme;
          return theme.brand.alt;
        },
        function(_ref3) {
          var theme = _ref3.theme;
          return theme.text.reverse;
        }
      );

      var Col = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__Col',
        componentId: 's1evw37o-1',
      })(['width:100%;a + a > div{border-top:2px solid ', ';}'], function(
        _ref4
      ) {
        var theme = _ref4.theme;
        return theme.bg.wash;
      });

      var RowLabel = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__RowLabel',
        componentId: 's1evw37o-2',
      })(['font-weight:600;']);

      var SearchContainer = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_card__['b' /* default */]
      ).withConfig({
        displayName: 'style__SearchContainer',
        componentId: 's1evw37o-3',
      })(
        [
          'margin-bottom:16px;position:relative;z-index:',
          ';width:100%;display:block;min-height:64px;border-radius:12px;transition:',
          ';&:hover{transition:none;box-shadow:',
          ' ',
          ';}@media (max-width:768px){border-radius:0;pointer-events:all;margin-bottom:0;}',
        ],
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['r' /* zIndex */]
          .search,
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['n' /* Transition */]
          .hover.off,
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['j' /* Shadow */]
          .high,
        function(_ref5) {
          var theme = _ref5.theme;
          return Object(
            __WEBPACK_IMPORTED_MODULE_1__components_globals__['p' /* hexa */]
          )(theme.text.placeholder, 0.5);
        }
      );

      var SearchInput = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].input.withConfig({
        displayName: 'style__SearchInput',
        componentId: 's1evw37o-4',
      })(
        [
          'justify-content:flex-start;align-items:center;cursor:pointer;padding:20px;color:',
          ';transition:',
          ';font-size:20px;font-weight:800;margin-left:8px;width:97%;border-radius:12px;',
        ],
        function(props) {
          return props.theme.text.default;
        },
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['n' /* Transition */]
          .hover.off
      );

      /***/
    },
});
//# sourceMappingURL=4.96358f5c7f2339a17fbf.hot-update.js.map
