webpackHotUpdate(2, {
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

  /***/ './src/components/threadComposer/components/composer.js':
    /*!**************************************************************!*\
  !*** ./src/components/threadComposer/components/composer.js ***!
  \**************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_textarea_autosize__ = __webpack_require__(
        /*! react-textarea-autosize */ './node_modules/react-textarea-autosize/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_router__ = __webpack_require__(
        /*! react-router */ './node_modules/react-router/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helpers_events__ = __webpack_require__(
        /*! ../../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__actions_composer__ = __webpack_require__(
        /*! ../../../actions/composer */ './src/actions/composer.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__actions_dashboardFeed__ = __webpack_require__(
        /*! ../../../actions/dashboardFeed */ './src/actions/dashboardFeed.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__actions_toasts__ = __webpack_require__(
        /*! ../../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__draftjs_editor__ = __webpack_require__(
        /*! ../../draftjs-editor */ './src/components/draftjs-editor/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_shared_draft_utils__ = __webpack_require__(
        /*! shared/draft-utils */ './shared/draft-utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_shared_draft_utils___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_10_shared_draft_utils__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__queries__ = __webpack_require__(
        /*! ../queries */ './src/components/threadComposer/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__mutations__ = __webpack_require__(
        /*! ../mutations */ './src/components/threadComposer/mutations.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__helpers_utils__ = __webpack_require__(
        /*! ../../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_validator_lib_isURL__ = __webpack_require__(
        /*! validator/lib/isURL */ './node_modules/validator/lib/isURL.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_validator_lib_isURL___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_14_validator_lib_isURL__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__helpers_regexps__ = __webpack_require__(
        /*! ../../../helpers/regexps */ './src/helpers/regexps.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__buttons__ = __webpack_require__(
        /*! ../../buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_globals__ = __webpack_require__(
        /*! ../../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__loading__ = __webpack_require__(
        /*! ../../loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__viewNetworkHandler__ = __webpack_require__(
        /*! ../../viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__style__ = __webpack_require__(
        /*! ../style */ './src/components/threadComposer/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/components/threadComposer/components/composer.js';

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

      var ThreadComposerWithData = (function(_React$Component) {
        _inherits(ThreadComposerWithData, _React$Component);

        function ThreadComposerWithData(props) {
          _classCallCheck(this, ThreadComposerWithData);

          var _this = _possibleConstructorReturn(
            this,
            (
              ThreadComposerWithData.__proto__ ||
              Object.getPrototypeOf(ThreadComposerWithData)
            ).call(this, props)
          );

          _initialiseProps.call(_this);

          _this.state = {
            isMounted: true,
            title: props.title || '',
            body:
              props.body ||
              Object(
                __WEBPACK_IMPORTED_MODULE_10_shared_draft_utils__[
                  'fromPlainText'
                ]
              )(''),
            availableCommunities: [],
            availableChannels: [],
            activeCommunity: '',
            activeChannel: '',
            isPublishing: false,
            linkPreview: null,
            linkPreviewTrueUrl: '',
            linkPreviewLength: 0,
            fetchingLinkPreview: false,
            postWasPublished: false,
          };
          return _this;
        }

        _createClass(ThreadComposerWithData, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              var _this2 = this;

              this.setState({ isMounted: true });
              this.props.data.refetch().then(function(result) {
                // we have to rebuild a new props object to pass to `this.handleIncomingProps`
                // in order to retain all the previous props passed in from the parent
                // component and the initial data functions provided by apollo
                var newProps = Object.assign(
                  {},
                  _this2.props,
                  Object.assign({}, _this2.props, {
                    data: Object.assign({}, _this2.props.data, {
                      user: Object.assign(
                        {},
                        _this2.props.data.user,
                        result.data.user
                      ),
                    }),
                  })
                );
                _this2.handleIncomingProps(newProps);
              });
              this.refs.titleTextarea.focus();
            },
          },
          {
            key: 'componentWillUpdate',
            value: function componentWillUpdate(nextProps) {
              var isOpen = nextProps.isOpen;

              if (isOpen) {
                // $FlowIssue
                document.addEventListener(
                  'keydown',
                  this.handleKeyPress,
                  false
                );
              } else {
                // $FlowIssue
                document.removeEventListener(
                  'keydown',
                  this.handleKeyPress,
                  false
                );
              }
            },
          },
          {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
              this.setState({ isMounted: false });
              // $FlowIssue
              document.removeEventListener(
                'keydown',
                this.handleKeyPress,
                false
              );
              var postWasPublished = this.state.postWasPublished;

              // if a post was published, in this session, clear redux so that the next
              // composer open will start fresh

              if (postWasPublished) return this.closeComposer('clear');

              // otherwise, clear the composer normally and save the state
              return this.closeComposer();
            },
          },
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
              var _this3 = this;

              var curr = this.props;
              var isMounted = this.state.isMounted;

              if (!isMounted) return;
              if (prevProps.isLoading && !curr.isLoading)
                return this.handleIncomingProps(this.props);

              var _state = this.state,
                availableCommunities = _state.availableCommunities,
                availableChannels = _state.availableChannels;

              var activeCommunity = void 0;

              if (prevProps.activeCommunity !== this.props.activeCommunity) {
                activeCommunity = this.props.activeCommunity
                  ? availableCommunities.filter(function(community) {
                      return community.slug === _this3.props.activeCommunity;
                    })[0].id
                  : availableCommunities[0].id;

                this.setState({
                  activeCommunity: activeCommunity,
                });
              }

              if (prevProps.activeChannel !== this.props.activeChannel) {
                var activeCommunityChannels = availableChannels.filter(function(
                  channel
                ) {
                  return channel.community.id === activeCommunity;
                });
                var _activeChannel = [];

                // Get the active channel if there is one
                if (this.props.activeChannel) {
                  _activeChannel = activeCommunityChannels.filter(function(
                    channel
                  ) {
                    return channel.slug === _this3.props.activeChannel;
                  });
                } else {
                  // Try and get the default channel for the active community
                  _activeChannel = activeCommunityChannels.filter(function(
                    channel
                  ) {
                    return channel.isDefault;
                  });
                  // If there is no default channel capitulate and take the first one
                  if (_activeChannel.length === 0) {
                    _activeChannel = activeCommunityChannels;
                    // If there are more than one default ones, try and choose the "General" one if it exists
                  } else if (_activeChannel.length > 1) {
                    var generalChannel = _activeChannel.filter(function(
                      channel
                    ) {
                      return channel.slug === 'general';
                    });
                    if (generalChannel.length > 0)
                      _activeChannel = generalChannel;
                  }
                }

                // ensure that if no items were found for some reason, we don't crash the app
                // and instead just set null values on the composer
                _activeChannel =
                  _activeChannel.length > 0 ? _activeChannel[0].id : null;

                this.setState({
                  activeChannel: _activeChannel,
                });
              }
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this4 = this;

              var _state2 = this.state,
                title = _state2.title,
                availableChannels = _state2.availableChannels,
                availableCommunities = _state2.availableCommunities,
                activeCommunity = _state2.activeCommunity,
                activeChannel = _state2.activeChannel,
                isPublishing = _state2.isPublishing,
                linkPreview = _state2.linkPreview,
                linkPreviewTrueUrl = _state2.linkPreviewTrueUrl,
                fetchingLinkPreview = _state2.fetchingLinkPreview;
              var _props = this.props,
                isOpen = _props.isOpen,
                isLoading = _props.isLoading,
                isInbox = _props.isInbox;

              if (availableCommunities && availableChannels) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_20__style__['d' /* Container */],
                  {
                    isOpen: isOpen,
                    isInbox: isInbox,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 585,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_20__style__['g' /* Overlay */],
                    {
                      isOpen: isOpen,
                      onClick: this.closeComposer,
                      isInbox: isInbox,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 586,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_20__style__['b' /* Composer */],
                    {
                      isOpen: isOpen,
                      isInbox: isInbox,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 591,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_20__style__[
                        'e' /* ContentContainer */
                      ],
                      {
                        isOpen: isOpen,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 592,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_2_react_textarea_autosize__[
                          'a' /* default */
                        ],
                        {
                          onChange: this.changeTitle,
                          style:
                            __WEBPACK_IMPORTED_MODULE_20__style__[
                              'k' /* ThreadTitle */
                            ],
                          value: this.state.title,
                          placeholder: 'A title for your conversation...',
                          ref: 'titleTextarea',
                          autoFocus: true,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 593,
                          },
                          __self: this,
                        }
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_9__draftjs_editor__[
                          'a' /* default */
                        ],
                        {
                          onChange: this.changeBody,
                          state: this.state.body,
                          style:
                            __WEBPACK_IMPORTED_MODULE_20__style__[
                              'j' /* ThreadDescription */
                            ],
                          editorRef: function editorRef(editor) {
                            return (_this4.bodyEditor = editor);
                          },
                          editorKey: 'thread-composer',
                          placeholder: 'Write more thoughts here...',
                          className: 'threadComposer',
                          showLinkPreview: true,
                          linkPreview: {
                            loading: fetchingLinkPreview,
                            remove: this.removeLinkPreview,
                            trueUrl: linkPreviewTrueUrl,
                            data: linkPreview,
                          },
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 602,
                          },
                          __self: this,
                        }
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_20__style__[
                          'a' /* Actions */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 619,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_17__components_globals__[
                            'b' /* FlexRow */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 620,
                            },
                            __self: this,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_20__style__[
                              'f' /* Dropdowns */
                            ],
                            {
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 621,
                              },
                              __self: this,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              'select',
                              {
                                onChange: this.setActiveCommunity,
                                value: activeCommunity,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 622,
                                },
                                __self: this,
                              },
                              availableCommunities.map(function(community) {
                                return __WEBPACK_IMPORTED_MODULE_0_react__[
                                  'createElement'
                                ](
                                  'option',
                                  {
                                    key: community.id,
                                    value: community.id,
                                    __source: {
                                      fileName: _jsxFileName,
                                      lineNumber: 628,
                                    },
                                    __self: _this4,
                                  },
                                  community.name
                                );
                              })
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              'select',
                              {
                                onChange: this.setActiveChannel,
                                value: activeChannel,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 634,
                                },
                                __self: this,
                              },
                              availableChannels
                                .filter(function(channel) {
                                  return (
                                    channel.community.id === activeCommunity
                                  );
                                })
                                .map(function(channel, i) {
                                  return __WEBPACK_IMPORTED_MODULE_0_react__[
                                    'createElement'
                                  ](
                                    'option',
                                    {
                                      key: channel.id,
                                      value: channel.id,
                                      __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 644,
                                      },
                                      __self: _this4,
                                    },
                                    channel.name
                                  );
                                })
                            )
                          )
                        ),
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_17__components_globals__[
                            'b' /* FlexRow */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 652,
                            },
                            __self: this,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_16__buttons__[
                              'f' /* TextButton */
                            ],
                            {
                              hoverColor: 'warn.alt',
                              onClick: this.closeComposer,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 653,
                              },
                              __self: this,
                            },
                            'Cancel'
                          ),
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_16__buttons__[
                              'a' /* Button */
                            ],
                            {
                              onClick: this.publishThread,
                              loading: isPublishing,
                              disabled: !title || isPublishing,
                              color: 'brand',
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 659,
                              },
                              __self: this,
                            },
                            'Publish'
                          )
                        )
                      )
                    )
                  )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_18__loading__[
                    'd' /* LoadingComposer */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 676,
                    },
                    __self: this,
                  }
                );
              }

              return null;
            },
          },
        ]);

        return ThreadComposerWithData;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var _initialiseProps = function _initialiseProps() {
        var _this5 = this;

        this.handleIncomingProps = function(props) {
          var isMounted = _this5.state.isMounted;

          if (!isMounted) return;
          /*
      Create a new array of communities only containing the `node` data from
      graphQL. Then filter the resulting channel to remove any communities
      that don't have any channels yet
    */

          // if the user doesn't exist, bust outta here
          if (!props.data.user || props.data.user === undefined) return;

          var availableCommunities = props.data.user.communityConnection.edges
            .map(function(edge) {
              return edge.node;
            })
            .filter(function(community) {
              return (
                community.communityPermissions.isMember ||
                community.communityPermissions.isOwner
              );
            })
            .sort(function(a, b) {
              var bc = parseInt(b.communityPermissions.reputation, 10);
              var ac = parseInt(a.communityPermissions.reputation, 10);
              return bc <= ac ? -1 : 1;
            });

          /*
      Iterate through each of our community nodes to construct a new array
      of possible channels
       returns an array of array, where each parent array represents a community
      and each child array represents the channels within that parent
      community
    */
          var availableChannels = props.data.user.channelConnection.edges
            .map(function(edge) {
              return edge.node;
            })
            .filter(function(channel) {
              return (
                channel.channelPermissions.isMember ||
                channel.channelPermissions.isOwner
              );
            })
            .filter(function(channel) {
              if (!channel.isPrivate) return channel;
              if (!channel.community.isPro) return null;
              return channel;
            });

          /*
      If a user is viewing a communit or channel, we use the url as a prop
      to set a default activeCommunity and activeChannel
       If no defaults are set, we use the first available community, and then
      find the first available channel within that available community
    */
          var activeCommunityFromPropsOrState =
            props.activeCommunity || _this5.state.activeCommunity;

          var activeCommunity =
            availableCommunities &&
            (activeCommunityFromPropsOrState
              ? availableCommunities.filter(function(community) {
                  return (
                    community.slug.toLowerCase() ===
                    activeCommunityFromPropsOrState.toLowerCase()
                  );
                })
              : availableCommunities);

          activeCommunity =
            activeCommunity && activeCommunity.length > 0
              ? activeCommunity[0].id
              : null;

          if (!activeCommunity) {
            return props.data.refetch();
          } else {
            _this5.setActiveStuff(
              availableCommunities,
              availableChannels,
              activeCommunity
            );
          }
        };

        this.setActiveStuff = function(
          availableCommunities,
          availableChannels,
          activeCommunity
        ) {
          var props = _this5.props;
          var isMounted = _this5.state.isMounted;

          if (!isMounted) return;
          // get the channels for the proper community
          var activeCommunityChannels = availableChannels.filter(function(
            channel
          ) {
            return channel.community.id === activeCommunity;
          });
          var activeChannel = [];

          // Get the active channel if there is one
          if (props.activeChannel) {
            activeChannel = activeCommunityChannels.filter(function(channel) {
              return (
                channel.slug.toLowerCase() === props.activeChannel.toLowerCase()
              );
            });
          } else {
            // Try and get the default channel for the active community
            activeChannel = activeCommunityChannels.filter(function(channel) {
              return channel.isDefault;
            });
            // If there is no default channel capitulate and take the first one
            if (activeChannel.length === 0) {
              activeChannel = activeCommunityChannels;
            } else if (activeChannel.length > 1) {
              var generalChannel = activeChannel.filter(function(channel) {
                return channel.slug === 'general';
              });
              if (generalChannel.length > 0) activeChannel = generalChannel;
            }
          }

          // ensure that if no items were found for some reason, we don't crash the app
          // and instead just set null values on the composer
          activeChannel = activeChannel.length > 0 ? activeChannel[0].id : null;

          _this5.setState({
            title: props.title || '',
            body:
              props.body ||
              Object(
                __WEBPACK_IMPORTED_MODULE_10_shared_draft_utils__[
                  'fromPlainText'
                ]
              )(''),
            availableCommunities: availableCommunities,
            availableChannels: availableChannels,
            activeCommunity: activeCommunity,
            activeChannel: activeChannel,
            isPublishing: false,
            linkPreview: null,
            linkPreviewTrueUrl: '',
            linkPreviewLength: 0,
            fetchingLinkPreview: false,
          });
        };

        this.handleKeyPress = function(e) {
          // if person taps esc, close the dialog
          if (e.keyCode === 27) {
            _this5.closeComposer();
          }
        };

        this.changeTitle = function(e) {
          var title = e.target.value;
          if (/\n$/g.test(title)) {
            _this5.bodyEditor.focus();
            return;
          }
          _this5.setState({
            title: title,
          });
        };

        this.changeBody = function(body) {
          _this5.listenForUrl(body);
          _this5.setState({
            body: body,
          });
        };

        this.closeComposer = function(clear) {
          // we will clear the composer if it unmounts as a result of a post
          // being published, that way the next composer open will start fresh
          if (clear)
            return _this5.props.dispatch(
              Object(
                __WEBPACK_IMPORTED_MODULE_6__actions_composer__[
                  'c' /* closeComposer */
                ]
              )('', '')
            );

          // otherwise, we will save the editor state to rehydrate the title and
          // body if the user reopens the composer in the same session
          var _state3 = _this5.state,
            title = _state3.title,
            body = _state3.body;

          _this5.props.dispatch(
            Object(
              __WEBPACK_IMPORTED_MODULE_6__actions_composer__[
                'c' /* closeComposer */
              ]
            )(title, body)
          );
        };

        this.setActiveCommunity = function(e) {
          var newActiveCommunity = e.target.value;
          var activeCommunityChannels = _this5.state.availableChannels.filter(
            function(channel) {
              return channel.community.id === newActiveCommunity;
            }
          );
          var newActiveCommunityData = _this5.state.availableCommunities.find(
            function(community) {
              return community.id === newActiveCommunity;
            }
          );
          var newActiveChannel =
            activeCommunityChannels.find(function(channel) {
              // If there is an active channel and we're switching back to the currently open community
              // select that channel
              if (
                _this5.props.activeChannel &&
                _this5.props.activeCommunity === newActiveCommunityData.slug
              ) {
                return channel.slug === _this5.props.activeChannel;
              }
              // Otherwise select the default one
              return channel.isDefault;
              // Default to the first channel if no default one can be found
            }) || activeCommunityChannels[0];

          _this5.setState({
            activeCommunity: newActiveCommunity,
            activeChannel: newActiveChannel.id,
          });
        };

        this.setActiveChannel = function(e) {
          var activeChannel = e.target.value;

          _this5.setState({
            activeChannel: activeChannel,
          });
        };

        this.publishThread = function() {
          // if no title and no channel is set, don't allow a thread to be published
          if (!_this5.state.title || !_this5.state.activeChannel) {
            return;
          }

          // isPublishing will change the publish button to a loading spinner
          _this5.setState({
            isPublishing: true,
          });

          // define new constants in order to construct the proper shape of the
          // input for the publishThread mutation
          var _state4 = _this5.state,
            activeChannel = _state4.activeChannel,
            activeCommunity = _state4.activeCommunity,
            title = _state4.title,
            body = _state4.body,
            linkPreview = _state4.linkPreview,
            linkPreviewTrueUrl = _state4.linkPreviewTrueUrl;

          var channelId = activeChannel;
          var communityId = activeCommunity;
          var jsonBody = Object(
            __WEBPACK_IMPORTED_MODULE_10_shared_draft_utils__['toJSON']
          )(body);

          var content = {
            title: title,
            body: JSON.stringify(jsonBody),
          };

          var attachments = [];
          if (linkPreview) {
            var attachmentData = JSON.stringify(
              Object.assign({}, linkPreview, {
                trueUrl: linkPreviewTrueUrl,
              })
            );
            attachments.push({
              attachmentType: 'linkPreview',
              data: attachmentData,
            });
          }

          // Get the images
          var filesToUpload = Object.keys(jsonBody.entityMap)
            .filter(function(key) {
              return (
                jsonBody.entityMap[key].type === 'image' &&
                jsonBody.entityMap[key].data.file &&
                jsonBody.entityMap[key].data.file.constructor === File
              );
            })
            .map(function(key) {
              return jsonBody.entityMap[key].data.file;
            });

          // this.props.mutate comes from a higher order component defined at the
          // bottom of this file
          _this5.props
            .mutate({
              variables: {
                thread: {
                  channelId: channelId,
                  communityId: communityId,
                  type: 'DRAFTJS',
                  content: content,
                  attachments: attachments,
                  filesToUpload: filesToUpload,
                },
              },
            })
            // after the mutation occurs, it will either return an error or the new
            // thread that was published
            .then(function(_ref) {
              var data = _ref.data;

              // get the thread id to redirect the user
              var id = data.publishThread.id;

              Object(
                __WEBPACK_IMPORTED_MODULE_5__helpers_events__['b' /* track */]
              )('thread', 'published', null);

              // stop the loading spinner on the publish button
              _this5.setState({
                postWasPublished: true,
                isPublishing: false,
              });

              // redirect the user to the thread
              // if they are in the inbox, select it
              _this5.props.isInbox
                ? _this5.props.dispatch(
                    Object(
                      __WEBPACK_IMPORTED_MODULE_7__actions_dashboardFeed__[
                        'c' /* changeActiveThread */
                      ]
                    )(id)
                  )
                : _this5.props.history.push('?thread=' + id);

              _this5.props.dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_8__actions_toasts__[
                    'a' /* addToastWithTimeout */
                  ]
                )('success', 'Thread published!')
              );

              _this5.props.dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_6__actions_composer__[
                    'c' /* closeComposer */
                  ]
                )('', '')
              );
            })
            .catch(function(err) {
              _this5.setState({
                isPublishing: false,
              });
              _this5.props.dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_8__actions_toasts__[
                    'a' /* addToastWithTimeout */
                  ]
                )('error', err.message)
              );
            });
        };

        this.listenForUrl = function(state) {
          var _state5 = _this5.state,
            linkPreview = _state5.linkPreview,
            linkPreviewLength = _state5.linkPreviewLength;

          if (linkPreview !== null) return;

          var lastChangeType = state.getLastChangeType();
          if (
            lastChangeType !== 'backspace-character' &&
            lastChangeType !== 'insert-characters'
          ) {
            return;
          }

          var text = Object(
            __WEBPACK_IMPORTED_MODULE_10_shared_draft_utils__['toPlainText']
          )(state);

          if (
            !__WEBPACK_IMPORTED_MODULE_15__helpers_regexps__[
              'a' /* ENDS_IN_WHITESPACE */
            ].test(text)
          )
            return;

          var toCheck = text.match(
            __WEBPACK_IMPORTED_MODULE_15__helpers_regexps__['e' /* URLS */]
          );

          if (toCheck) {
            var len = toCheck.length;
            if (linkPreviewLength === len) return; // no new links, don't recheck

            var urlToCheck = toCheck[len - 1].trim();

            if (!/^https?:\/\//i.test(urlToCheck)) {
              urlToCheck = 'https://' + urlToCheck;
            }

            if (
              !__WEBPACK_IMPORTED_MODULE_14_validator_lib_isURL___default()(
                urlToCheck
              )
            )
              return;
            _this5.setState({ fetchingLinkPreview: true });

            Object(
              __WEBPACK_IMPORTED_MODULE_13__helpers_utils__[
                'c' /* getLinkPreviewFromUrl */
              ]
            )(urlToCheck)
              .then(function(data) {
                _this5.setState(function(prevState) {
                  return {
                    linkPreview: Object.assign({}, data, {
                      trueUrl: urlToCheck,
                    }),
                    linkPreviewTrueUrl: urlToCheck,
                    linkPreviewLength: prevState.linkPreviewLength + 1,
                    fetchingLinkPreview: false,
                    error: null,
                  };
                });
              })
              .catch(function(err) {
                _this5.setState({
                  error:
                    "Oops, that URL didn't seem to want to work. You can still publish your story anyways 👍",
                  fetchingLinkPreview: false,
                });
              });
          }
        };

        this.removeLinkPreview = function() {
          _this5.setState({
            linkPreview: null,
            linkPreviewTrueUrl: null,
          });
        };
      };

      var map = function map(state) {
        return {
          isOpen: state.composer.isOpen,
          title: state.composer.title,
          body: state.composer.body,
        };
      };
      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        // $FlowIssue
        Object(__WEBPACK_IMPORTED_MODULE_4_react_redux__['a' /* connect */])(
          map
        ),
        __WEBPACK_IMPORTED_MODULE_11__queries__[
          'a' /* getComposerCommunitiesAndChannels */
        ],
        __WEBPACK_IMPORTED_MODULE_12__mutations__['a' /* publishThread */],
        __WEBPACK_IMPORTED_MODULE_19__viewNetworkHandler__['a' /* default */],
        __WEBPACK_IMPORTED_MODULE_3_react_router__['e' /* withRouter */]
      )(ThreadComposerWithData);

      /***/
    },

  /***/ './src/components/threadComposer/style.js':
    /*!************************************************!*\
  !*** ./src/components/threadComposer/style.js ***!
  \************************************************/
    /*! exports provided: Container, Composer, Overlay, Placeholder, PlaceholderLabel, ContentContainer, Actions, Dropdowns, ComposerUpsell, UpsellPulse, UpsellDot, ThreadTitle, ThreadDescription */
    /*! exports used: Actions, Composer, ComposerUpsell, Container, ContentContainer, Dropdowns, Overlay, Placeholder, PlaceholderLabel, ThreadDescription, ThreadTitle, UpsellDot, UpsellPulse */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return Container;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return Composer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'g',
        function() {
          return Overlay;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'h',
        function() {
          return Placeholder;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'i',
        function() {
          return PlaceholderLabel;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return ContentContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return Actions;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'f',
        function() {
          return Dropdowns;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return ComposerUpsell;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'm',
        function() {
          return UpsellPulse;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'l',
        function() {
          return UpsellDot;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'k',
        function() {
          return ThreadTitle;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'j',
        function() {
          return ThreadDescription;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__card__ = __webpack_require__(
        /*! ../card */ './src/components/card/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__globals__ = __webpack_require__(
        /*! ../globals */ './src/components/globals/index.js'
      );

      var Container = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_2__globals__['b' /* FlexRow */]).withConfig({
        displayName: 'style__Container',
        componentId: 's1633ckv-0',
      })(
        [
          'align-self:stretch;display:flex;justify-content:center;@media (max-width:768px){display:',
          ';position:fixed;height:calc(100vh - 56px);width:100%;top:8px;flex-direction:column;justify-content:flex-start;z-index:',
          ';}',
        ],
        function(props) {
          return props.isOpen ? 'block' : 'none';
        },
        __WEBPACK_IMPORTED_MODULE_2__globals__['r' /* zIndex */].composer
      );

      var Composer = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_1__card__['a' /* Card */]).withConfig({
        displayName: 'style__Composer',
        componentId: 's1633ckv-1',
      })(
        [
          'margin-bottom:16px;position:relative;z-index:',
          ';width:100%;display:block;min-height:64px;border-radius:12px;transition:',
          ';&:hover{transition:none;box-shadow:',
          ' ',
          ';}@media (max-width:768px){width:calc(100% - 16px);margin:48px 8px;height:calc(100% - 112px);min-height:240px;pointer-events:all;}',
        ],
        function(props) {
          return props.isInbox
            ? '3001'
            : __WEBPACK_IMPORTED_MODULE_2__globals__['r' /* zIndex */].composer;
        },
        __WEBPACK_IMPORTED_MODULE_2__globals__['n' /* Transition */].hover.off,
        __WEBPACK_IMPORTED_MODULE_2__globals__['j' /* Shadow */].high,
        function(_ref) {
          var theme = _ref.theme;
          return Object(__WEBPACK_IMPORTED_MODULE_2__globals__['p' /* hexa */])(
            theme.text.placeholder,
            0.5
          );
        }
      );

      var Overlay = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Overlay',
        componentId: 's1633ckv-2',
      })(['', ';'], function(props) {
        return props.isOpen
          ? '\n      position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      width: 100%;\n      height: 100%;\n      z-index: ' +
              (props.isInbox
                ? '3000'
                : __WEBPACK_IMPORTED_MODULE_2__globals__['r' /* zIndex */]
                    .composer - 1) +
              ';\n      background: #000;\n      pointer-events: auto;\n      opacity: 0.4;\n    '
          : '\n      opacity: 0;\n      pointer-events: none;\n\n    ';
      });

      var Placeholder = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Placeholder',
        componentId: 's1633ckv-3',
      })(
        [
          '',
          ' display:',
          ';justify-content:flex-start;align-items:center;cursor:pointer;padding:16px;color:',
          ';transition:',
          ';&:hover{transition:',
          ';color:',
          ';}@media (max-width:768px){opacity:0;}',
        ],
        /* either the placeholder *or* the content container shows at a time. */ '',
        function(props) {
          return props.isOpen ? 'none' : 'flex';
        },
        function(props) {
          return props.theme.text.alt;
        },
        __WEBPACK_IMPORTED_MODULE_2__globals__['n' /* Transition */].hover.off,
        __WEBPACK_IMPORTED_MODULE_2__globals__['n' /* Transition */].hover.on,
        function(props) {
          return props.theme.brand.alt;
        }
      );

      var PlaceholderLabel = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h3.withConfig({
        displayName: 'style__PlaceholderLabel',
        componentId: 's1633ckv-4',
      })(['font-size:20px;font-weight:800;margin-left:8px;']);

      var ContentContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__ContentContainer',
        componentId: 's1633ckv-5',
      })(
        ['display:', ';@media (max-width:768px){width:100%;height:100%;}'],
        function(props) {
          return props.isOpen ? 'block' : 'none';
        }
      );

      var Actions = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_2__globals__['a' /* FlexCol */]).withConfig({
        displayName: 'style__Actions',
        componentId: 's1633ckv-6',
      })(
        [
          'background:#f8fbfe;border-top:2px solid ',
          ';padding:8px 8px 8px 0;border-radius:0 0 12px 12px;width:100%;display:flex;justify-content:space-between;align-items:flex-end;@media (max-width:768px){position:absolute;bottom:0;flex-direction:column;align-items:flex-end;padding:8px;}',
        ],
        function(props) {
          return props.theme.bg.border;
        }
      );

      var Dropdowns = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_2__globals__['b' /* FlexRow */]).withConfig({
        displayName: 'style__Dropdowns',
        componentId: 's1633ckv-7',
      })(
        [
          'display:flex;align-items:center;margin-bottom:16px;select{max-width:224px;display:block;padding:8px 12px;border:none;border:2px solid ',
          ';border-radius:8px;box-shadow:none;color:',
          ';font-weight:600;font-size:14px;box-sizing:border-box;background-color:#fff;background-image:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;cursor:pointer;margin-left:8px;}@media (max-width:768px){width:100%;justify-content:flex-start;margin-bottom:8px;select:nth-of-type(2){flex:1 0 auto;margin-left:4px;}}}',
        ],
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.theme.text.default;
        }
      );

      var ComposerUpsell = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__ComposerUpsell',
        componentId: 's1633ckv-8',
      })(
        [
          'position:relative;padding:4px 16px;background:',
          ';border-bottom:2px solid ',
          ';color:#fff;text-align:center;border-radius:12px 12px 0 0;p{font-size:14px;font-weight:700;}',
        ],
        function(props) {
          return props.theme.brand.alt;
        },
        function(props) {
          return props.theme.brand.alt;
        }
      );

      var UpsellPulse = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__UpsellPulse',
        componentId: 's1633ckv-9',
      })(
        [
          'width:10px;height:10px;border:5px solid ',
          ';-webkit-border-radius:30px;-moz-border-radius:30px;border-radius:30px;background-color:',
          ';z-index:',
          ';position:absolute;top:-4px;left:-4px;box-shadow:0 0 0 2px #fff;',
        ],
        function(props) {
          return props.theme.brand.alt;
        },
        function(props) {
          return props.theme.brand.alt;
        },
        __WEBPACK_IMPORTED_MODULE_2__globals__['r' /* zIndex */].composer
      );

      var pulse = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['e' /* keyframes */]
      )([
        '0%{-webkit-transform:scale(0);-moz-transform:scale(0);opacity:0.0;}25%{-webkit-transform:scale(0);-moz-transform:scale(0);opacity:0.1;}50%{-webkit-transform:scale(0.1);-moz-transform:scale(0.1);opacity:0.3;}75%{-webkit-transform:scale(0.5);-moz-transform:scale(0.5);opacity:0.5;}100%{-webkit-transform:scale(1);-moz-transform:scale(1);opacity:0.0;}',
      ]);

      var UpsellDot = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__UpsellDot',
        componentId: 's1633ckv-10',
      })(
        [
          'border:10px solid ',
          ';background:transparent;-webkit-border-radius:60px;-moz-border-radius:60px;border-radius:60px;height:50px;width:50px;-webkit-animation:',
          ' 3s ease-out;-moz-animation:',
          ' 3s ease-out;animation:',
          ' 3s ease-out;-webkit-animation-iteration-count:infinite;-moz-animation-iteration-count:infinite;animation-iteration-count:infinite;position:absolute;top:-24px;left:-24px;z-index:',
          ';opacity:0;',
        ],
        function(props) {
          return props.theme.brand.default;
        },
        pulse,
        pulse,
        pulse,
        __WEBPACK_IMPORTED_MODULE_2__globals__['r' /* zIndex */].composer
      );

      // these are style objects because i'm custom styling another react component to handle autoresizing

      var ThreadTitle = {
        fontSize: '20px',
        padding: '16px 24px 0 24px',
        outline: 'none',
        border: '0',
        lineHeight: '1.4',
        fontWeight: '800',
        boxShadow: 'none',
        width: '100%',
        color: '#171A21',
        whiteSpace: 'pre-wrap',
        borderRadius: '12px 12px 0 0',
      };

      var ThreadDescription = {
        fontSize: '16px',
        fontWeight: '500',
        width: '100%',
        height: 'calc(100% - 132px)',
        display: 'inline-block',
        lineHeight: '1.5',
        padding: '0 24px 24px 24px',
        outline: 'none',
        border: '0',
        boxShadow: 'none',
        color: '#171A21',
        whiteSpace: 'pre-wrap',
        overflowY: 'scroll',
        position: 'relative',
        top: '6px',
      };

      /***/
    },

  /***/ './src/views/community/components/memberGrid.js':
    /*!******************************************************!*\
  !*** ./src/views/community/components/memberGrid.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_1_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_community__ = __webpack_require__(
        /*! ../../../api/community */ './src/api/community.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_grid__ = __webpack_require__(
        /*! ../../../components/grid */ './src/components/grid/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_globals__ = __webpack_require__(
        /*! ../../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_card__ = __webpack_require__(
        /*! ../../../components/card */ './src/components/card/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_profile__ = __webpack_require__(
        /*! ../../../components/profile */ './src/components/profile/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_viewError__ = __webpack_require__(
        /*! ../../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__style__ = __webpack_require__(
        /*! ../style */ './src/views/community/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/community/components/memberGrid.js';

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

      //$FlowFixMe

      //$FlowFixMe

      var CommunityMemberGrid = (function(_React$Component) {
        _inherits(CommunityMemberGrid, _React$Component);

        function CommunityMemberGrid() {
          _classCallCheck(this, CommunityMemberGrid);

          return _possibleConstructorReturn(
            this,
            (
              CommunityMemberGrid.__proto__ ||
              Object.getPrototypeOf(CommunityMemberGrid)
            ).apply(this, arguments)
          );
        }

        _createClass(CommunityMemberGrid, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                _props$data = _props.data,
                community = _props$data.community,
                fetchMore = _props$data.fetchMore,
                isLoading = _props.isLoading,
                isFetchingMore = _props.isFetchingMore;

              if (community) {
                var members = community.memberConnection.edges;

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_4__components_globals__[
                    'a' /* FlexCol */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 38,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_3__components_grid__[
                      'a' /* default */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 39,
                      },
                      __self: this,
                    },
                    members.map(function(member) {
                      var user = member.node;
                      return __WEBPACK_IMPORTED_MODULE_0_react__[
                        'createElement'
                      ](
                        __WEBPACK_IMPORTED_MODULE_7__components_profile__[
                          'd' /* UserProfile */
                        ],
                        {
                          key: user.id,
                          data: { user: user },
                          username: user.username,
                          profileSize: 'simple',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 43,
                          },
                          __self: _this2,
                        }
                      );
                    })
                  ),
                  community.memberConnection.pageInfo.hasNextPage &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_10__style__[
                        'f' /* StyledButton */
                      ],
                      {
                        loading: isFetchingMore,
                        onClick: function onClick() {
                          return fetchMore();
                        },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 53,
                        },
                        __self: this,
                      },
                      'Load more...'
                    )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_6__components_loading__[
                    'j' /* LoadingProfileGrid */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 62,
                    },
                    __self: this,
                  }
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_5__components_card__['a' /* Card */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 66,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_9__components_viewError__[
                    'a' /* default */
                  ],
                  {
                    refresh: true,
                    heading:
                      'We weren\u2019t able to fetch the members of this community.',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 67,
                    },
                    __self: this,
                  }
                )
              );
            },
          },
        ]);

        return CommunityMemberGrid;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_2__api_community__[
          'k' /* getCommunityMembersQuery */
        ],
        __WEBPACK_IMPORTED_MODULE_8__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(CommunityMemberGrid);

      /***/
    },

  /***/ './src/views/community/style.js':
    /*!**************************************!*\
  !*** ./src/views/community/style.js ***!
  \**************************************/
    /*! exports provided: LogoutButton, CoverRow, CoverColumn, CoverButton, SegmentedControl, Segment, SearchContainer, SearchInput, StyledButton */
    /*! exports used: CoverColumn, CoverRow, LogoutButton, SearchContainer, SearchInput, StyledButton */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return LogoutButton;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return CoverRow;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return CoverColumn;
        }
      );
      /* unused harmony export CoverButton */
      /* unused harmony export SegmentedControl */
      /* unused harmony export Segment */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return SearchContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return SearchInput;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'f',
        function() {
          return StyledButton;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_buttons__ = __webpack_require__(
        /*! ../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_card__ = __webpack_require__(
        /*! ../../components/card */ './src/components/card/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_globals__ = __webpack_require__(
        /*! ../../components/globals */ './src/components/globals/index.js'
      );

      var LogoutButton = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__components_buttons__['a' /* Button */]
      ).withConfig({
        displayName: 'style__LogoutButton',
        componentId: 'hht6fk-0',
      })(
        [
          'width:100%;margin:16px 0;padding:16px 0;background-image:none;background-color:',
          ';&:hover{background-color:',
          ';}@media (max-width:768px){display:none;}',
        ],
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.warn.default;
        }
      );

      var CoverRow = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_3__components_globals__['b' /* FlexRow */]
      ).withConfig({
        displayName: 'style__CoverRow',
        componentId: 'hht6fk-1',
      })(
        [
          'align-items:flex-start;',
          ' > .inset{position:relative;top:-64px;@media (max-width:768px){top:auto;flex:none;}}@media (max-width:768px){flex-direction:column;> div{margin-top:0;padding-top:2px;}}',
        ],
        /* See class .flexy below - there's a hack on this element bc reasons 🙄 */ ''
      );

      var CoverColumn = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_3__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__CoverColumn',
        componentId: 'hht6fk-2',
      })(
        [
          'width:90%;max-width:1024px;padding-top:32px;',
          ' > .flexy{display:flex;}@media (max-width:768px){padding-top:0;width:100%;overflow-y:scroll;}',
        ],
        /* For some goddamn reason, CoverRow will *not* take this property... ughhhhhhhhh */ ''
      );

      var CoverButton = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__components_buttons__['d' /* IconButton */]
      ).withConfig({
        displayName: 'style__CoverButton',
        componentId: 'hht6fk-3',
      })([
        'position:absolute;right:16px;top:16px;flex:0 0 auto;@media (max-width:768px){bottom:16px;top:auto;}',
      ]);

      var SegmentedControl = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_3__components_globals__['b' /* FlexRow */]
      ).withConfig({
        displayName: 'style__SegmentedControl',
        componentId: 'hht6fk-4',
      })(
        [
          'align-self:flex-end;margin-top:-24px;margin-bottom:8px;padding:8px 4px;@media (max-width:768px){background-color:',
          ';align-self:stretch;margin:0;padding:16px 8px;margin-bottom:2px;}',
        ],
        function(props) {
          return props.theme.bg.default;
        }
      );

      var Segment = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_3__components_globals__['b' /* FlexRow */]
      ).withConfig({
        displayName: 'style__Segment',
        componentId: 'hht6fk-5',
      })(
        [
          'padding:4px 16px;justify-content:center;align-items:center;text-align:center;line-height:1;font-size:14px;font-weight:',
          ';color:',
          ';cursor:pointer;+ div{border-left:2px solid ',
          ';}&:hover{color:',
          ';}@media (max-width:768px){flex:auto;justify-content:space-around;}',
        ],
        function(props) {
          return props.selected ? '900' : '500';
        },
        function(props) {
          return props.selected
            ? props.theme.text.default
            : props.theme.text.alt;
        },
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.selected
            ? props.theme.text.default
            : props.theme.text.default;
        }
      );

      var SearchContainer = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_card__['b' /* default */]
      ).withConfig({
        displayName: 'style__SearchContainer',
        componentId: 'hht6fk-6',
      })(
        [
          'margin-bottom:16px;position:relative;z-index:',
          ';width:100%;display:block;min-height:64px;border-radius:12px;transition:',
          ';&:hover{transition:none;box-shadow:',
          ' ',
          ';}@media (max-width:768px){border-radius:0;pointer-events:all;margin-bottom:0;}',
        ],
        __WEBPACK_IMPORTED_MODULE_3__components_globals__['r' /* zIndex */]
          .search,
        __WEBPACK_IMPORTED_MODULE_3__components_globals__['n' /* Transition */]
          .hover.off,
        __WEBPACK_IMPORTED_MODULE_3__components_globals__['j' /* Shadow */]
          .high,
        function(_ref) {
          var theme = _ref.theme;
          return Object(
            __WEBPACK_IMPORTED_MODULE_3__components_globals__['p' /* hexa */]
          )(theme.text.placeholder, 0.5);
        }
      );

      var SearchInput = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].input.withConfig({
        displayName: 'style__SearchInput',
        componentId: 'hht6fk-7',
      })(
        [
          'justify-content:flex-start;align-items:center;cursor:pointer;padding:20px;color:',
          ';transition:',
          ';font-size:20px;font-weight:800;margin-left:8px;width:97%;border-radius:12px;',
        ],
        function(props) {
          return props.theme.text.default;
        },
        __WEBPACK_IMPORTED_MODULE_3__components_globals__['n' /* Transition */]
          .hover.off
      );

      var StyledButton = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__components_buttons__['a' /* Button */]
      ).withConfig({
        displayName: 'style__StyledButton',
        componentId: 'hht6fk-8',
      })([
        'flex:none;@media (max-width:768px){margin:2px 0;padding:16px 0;width:100%;border-radius:0;}',
      ]);

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
});
//# sourceMappingURL=2.96358f5c7f2339a17fbf.hot-update.js.map
