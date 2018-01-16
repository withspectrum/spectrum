webpackHotUpdate(12, {
  /***/ './src/components/scrollRow/style.js':
    /*!*******************************************!*\
  !*** ./src/components/scrollRow/style.js ***!
  \*******************************************/
    /*! exports provided: ScrollableFlexRow */
    /*! exports used: ScrollableFlexRow */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return ScrollableFlexRow;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__globals__ = __webpack_require__(
        /*! ../globals */ './src/components/globals/index.js'
      );

      var ScrollableFlexRow = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_1__globals__['b' /* FlexRow */]).withConfig({
        displayName: 'style__ScrollableFlexRow',
        componentId: 'xp8jz4-0',
      })([
        'overflow-x:scroll;flex-wrap:nowrap;background:transparent;cursor:pointer;cursor:hand;cursor:grab;&:active{cursor:grabbing;}',
      ]);

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

  /***/ './src/views/explore/components/communitySearchWrapper.js':
    /*!****************************************************************!*\
  !*** ./src/views/explore/components/communitySearchWrapper.js ***!
  \****************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_globals__ = __webpack_require__(
        /*! ../../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_viewSegment__ = __webpack_require__(
        /*! ../../../components/viewSegment */ './src/components/viewSegment/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__api_constants__ = __webpack_require__(
        /*! ../../../api/constants */ './src/api/constants.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__splash_style__ = __webpack_require__(
        /*! ../../splash/style */ './src/views/splash/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/explore/components/communitySearchWrapper.js',
        _this = this;

      // $FlowFixMe
      var CommunitySearchWrapper = function CommunitySearchWrapper(props) {
        var ThisContent = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_7__splash_style__['h' /* Content */]
        ).withConfig({
          displayName: 'communitySearchWrapper__ThisContent',
          componentId: 's19kd5qk-0',
        })([
          'flex-direction:column;width:640px;align-content:center;align-self:center;margin-top:40px;margin-bottom:0;padding:16px;@media (max-width:640px){margin-top:80px;margin-bottom:0;width:100%;}',
        ]);

        var PrimaryCTA = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_5__components_buttons__['a' /* Button */]
        ).withConfig({
          displayName: 'communitySearchWrapper__PrimaryCTA',
          componentId: 's19kd5qk-1',
        })(
          [
            'padding:12px 16px;font-weight:700;font-size:14px;border-radius:12px;background-color:',
            ';background-image:none;color:',
            ';transition:',
            ';z-index:',
            ';&:hover{background-color:',
            ';color:',
            ';box-shadow:',
            ' ',
            ';transition:',
            ';}',
          ],
          function(props) {
            return props.theme.bg.default;
          },
          function(props) {
            return props.theme.brand.alt;
          },
          __WEBPACK_IMPORTED_MODULE_3__components_globals__[
            'n' /* Transition */
          ].hover.off,
          __WEBPACK_IMPORTED_MODULE_3__components_globals__['r' /* zIndex */]
            .card,
          function(props) {
            return props.theme.bg.default;
          },
          function(props) {
            return props.theme.brand.default;
          },
          __WEBPACK_IMPORTED_MODULE_3__components_globals__['j' /* Shadow */]
            .high,
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_3__components_globals__['p' /* hexa */]
            )(props.theme.bg.reverse, 0.5);
          },
          __WEBPACK_IMPORTED_MODULE_3__components_globals__[
            'n' /* Transition */
          ].hover.on
        );

        var SecondaryContent = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(ThisContent).withConfig({
          displayName: 'communitySearchWrapper__SecondaryContent',
          componentId: 's19kd5qk-2',
        })(['margin-top:0;margin-bottom:0;']);

        var ThisTagline = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_7__splash_style__['N' /* Tagline */]
        ).withConfig({
          displayName: 'communitySearchWrapper__ThisTagline',
          componentId: 's19kd5qk-3',
        })(['margin-bottom:0;']);

        var SecondaryTagline = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(ThisTagline).withConfig({
          displayName: 'communitySearchWrapper__SecondaryTagline',
          componentId: 's19kd5qk-4',
        })(['font-size:20px;font-weight:900;margin-top:0;margin-bottom:2px;']);

        var ThisCopy = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_7__splash_style__['i' /* Copy */]
        ).withConfig({
          displayName: 'communitySearchWrapper__ThisCopy',
          componentId: 's19kd5qk-5',
        })([
          'font-size:16px;margin-bottom:16px;font-weight:500;text-align:center;max-width:640px;@media (max-width:768px){text-align:left;}',
        ]);

        var SecondaryCopy = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(ThisCopy).withConfig({
          displayName: 'communitySearchWrapper__SecondaryCopy',
          componentId: 's19kd5qk-6',
        })(['margin-bottom:16px;']);

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_4__components_viewSegment__[
            'a' /* default */
          ],
          {
            goop: 3,
            background: 'constellations',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 77,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            ThisContent,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 78,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              ThisTagline,
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 79,
                },
                __self: _this,
              },
              'Find a community for you!'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              ThisCopy,
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 80,
                },
                __self: _this,
              },
              'Try searching for topics like "crypto" or for products like "React"'
            ),
            props.children,
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              SecondaryContent,
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 84,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                SecondaryTagline,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 85,
                  },
                  __self: _this,
                },
                '...or create your own community'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                SecondaryCopy,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 86,
                  },
                  __self: _this,
                },
                'Building communities on Spectrum is easy and free!'
              ),
              props.currentUser
                ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                      'a' /* default */
                    ],
                    {
                      to: '/new/community',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 90,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      PrimaryCTA,
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 91,
                        },
                        __self: _this,
                      },
                      'Get Started'
                    )
                  )
                : __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                      'a' /* default */
                    ],
                    {
                      to:
                        '/login?r=' +
                        __WEBPACK_IMPORTED_MODULE_6__api_constants__[
                          'a' /* CLIENT_URL */
                        ] +
                        '/new/community',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 94,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      PrimaryCTA,
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 95,
                        },
                        __self: _this,
                      },
                      'Get Started'
                    )
                  )
            )
          )
        );
      };

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = CommunitySearchWrapper;

      /***/
    },

  /***/ './src/views/explore/components/search.js':
    /*!************************************************!*\
  !*** ./src/views/explore/components/search.js ***!
  \************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom__ = __webpack_require__(
        /*! react-dom */ './node_modules/react-dom/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_6_react_dom__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__helpers_utils__ = __webpack_require__(
        /*! ../../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__api_community__ = __webpack_require__(
        /*! ../../../api/community */ './src/api/community.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_globals__ = __webpack_require__(
        /*! ../../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__style__ = __webpack_require__(
        /*! ../style */ './src/views/explore/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/explore/components/search.js';

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

      // $FlowFixMe

      // $FlowFixMe

      // $FlowFixMe

      var Search = (function(_Component) {
        _inherits(Search, _Component);

        function Search() {
          _classCallCheck(this, Search);

          var _this = _possibleConstructorReturn(
            this,
            (Search.__proto__ || Object.getPrototypeOf(Search)).call(this)
          );

          _this.search = function(searchString) {
            var client = _this.props.client;

            // start the input loading spinner

            _this.setState({
              searchIsLoading: true,
            });

            // trigger the query
            client
              .query({
                query:
                  __WEBPACK_IMPORTED_MODULE_8__api_community__[
                    'b' /* SEARCH_COMMUNITIES_QUERY */
                  ],
                variables: { string: searchString, amount: 30 },
              })
              .then(function(_ref) {
                var searchCommunities = _ref.data.searchCommunities;

                var searchResults = searchCommunities;
                var sorted = searchResults.slice().sort(function(a, b) {
                  return b.metaData.members - a.metaData.members;
                });

                if (!sorted || sorted.length === 0) {
                  return _this.setState({
                    searchResults: [],
                    searchIsLoading: false,
                    focusedSearchResult: '',
                  });
                } else {
                  return _this.setState({
                    searchResults: sorted,
                    searchIsLoading: false,
                    focusedSearchResult: sorted[0].id,
                  });
                }
              });
          };

          _this.handleKeyPress = function(e) {
            // destructure the whole state object
            var _this$state = _this.state,
              searchResults = _this$state.searchResults,
              focusedSearchResult = _this$state.focusedSearchResult;

            var input = Object(
              __WEBPACK_IMPORTED_MODULE_6_react_dom__['findDOMNode']
            )(_this.refs.input);
            var searchResultIds =
              searchResults &&
              searchResults.map(function(community) {
                return community.id;
              });
            var indexOfFocusedSearchResult = searchResultIds.indexOf(
              focusedSearchResult
            );

            // if person presses escape
            if (e.keyCode === 27) {
              _this.setState({
                searchResults: [],
                searchIsLoading: false,
                searchString: '',
              });

              input.focus();
              return;
            }

            // if user presses enter
            if (e.keyCode === 13) {
              if (
                searchResults.length === 0 ||
                searchResults[indexOfFocusedSearchResult] === undefined
              )
                return;
              var slug = searchResults[indexOfFocusedSearchResult].slug;
              return _this.props.history.push('/' + slug);
            }

            // if person presses down
            if (e.keyCode === 40) {
              if (indexOfFocusedSearchResult === searchResults.length - 1)
                return;
              if (searchResults.length <= 1) return;

              return _this.setState({
                focusedSearchResult:
                  searchResults[indexOfFocusedSearchResult + 1].id,
              });
            }

            // if person presses up
            if (e.keyCode === 38) {
              if (indexOfFocusedSearchResult === 0) return;
              if (searchResults.length <= 1) return;

              return _this.setState({
                focusedSearchResult:
                  searchResults[indexOfFocusedSearchResult - 1].id,
              });
            }
          };

          _this.handleChange = function(e) {
            var string = e.target.value.toLowerCase().trim();

            // set the searchstring to state
            _this.setState({
              searchString: e.target.value,
            });

            // trigger a new search based on the search input
            _this.search(string);
          };

          _this.onFocus = function(e) {
            var val = e.target.val;
            if (!val || val.length === 0) return;

            var string = val.toLowerCase().trim();
            _this.search(string);

            return _this.setState({
              isFocused: true,
            });
          };

          _this.state = {
            searchString: '',
            searchResults: [],
            searchIsLoading: false,
            focusedSearchResult: '',
            isFocused: true,
          };

          // only kick off search query every 200ms
          _this.search = Object(
            __WEBPACK_IMPORTED_MODULE_7__helpers_utils__['h' /* throttle */]
          )(_this.search, 500);
          return _this;
        }

        _createClass(Search, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              document.addEventListener('keydown', this.handleKeyPress, false);
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
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _state = this.state,
                searchString = _state.searchString,
                searchIsLoading = _state.searchIsLoading,
                searchResults = _state.searchResults,
                focusedSearchResult = _state.focusedSearchResult,
                isFocused = _state.isFocused;

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_10__style__['u' /* SearchWrapper */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 189,
                  },
                  __self: this,
                },
                searchIsLoading &&
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__style__[
                      't' /* SearchSpinnerContainer */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 191,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_9__components_globals__[
                        'l' /* Spinner */
                      ],
                      {
                        size: 16,
                        color: 'brand.default',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 192,
                        },
                        __self: this,
                      }
                    )
                  ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_10__style__[
                    'j' /* SearchInputWrapper */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 195,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__style__['h' /* SearchIcon */],
                    {
                      glyph: 'search',
                      onClick: this.onFocus,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 196,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__style__[
                      'i' /* SearchInput */
                    ],
                    {
                      ref: 'input',
                      type: 'text',
                      value: searchString,
                      placeholder: 'Search for communities or topics...',
                      onChange: this.handleChange,
                      onFocus: this.onFocus,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 197,
                      },
                      __self: this,
                    }
                  )
                ),
                // user has typed in a search string
                searchString &&
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__style__[
                      's' /* SearchResultsDropdown */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 209,
                      },
                      __self: this,
                    },
                    searchResults.length > 0 &&
                      searchResults.map(function(community) {
                        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_10__style__[
                            'l' /* SearchResult */
                          ],
                          {
                            focused: focusedSearchResult === community.id,
                            key: community.id,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 213,
                            },
                            __self: _this2,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_10__style__[
                              'k' /* SearchLink */
                            ],
                            {
                              to: '/' + community.slug,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 217,
                              },
                              __self: _this2,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_10__style__[
                                'm' /* SearchResultImage */
                              ],
                              {
                                community: community,
                                src: community.profilePhoto,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 218,
                                },
                                __self: _this2,
                              }
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_10__style__[
                                'r' /* SearchResultTextContainer */
                              ],
                              {
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 222,
                                },
                                __self: _this2,
                              },
                              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_10__style__[
                                  'n' /* SearchResultMetaWrapper */
                                ],
                                {
                                  __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 223,
                                  },
                                  __self: _this2,
                                },
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                  __WEBPACK_IMPORTED_MODULE_10__style__[
                                    'p' /* SearchResultName */
                                  ],
                                  {
                                    __source: {
                                      fileName: _jsxFileName,
                                      lineNumber: 224,
                                    },
                                    __self: _this2,
                                  },
                                  community.name
                                ),
                                community.metaData &&
                                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                    __WEBPACK_IMPORTED_MODULE_10__style__[
                                      'o' /* SearchResultMetadata */
                                    ],
                                    {
                                      __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 226,
                                      },
                                      __self: _this2,
                                    },
                                    community.metaData.members,
                                    ' members'
                                  )
                              )
                            )
                          )
                        );
                      }),
                    searchResults.length === 0 &&
                      isFocused &&
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_10__style__[
                          'l' /* SearchResult */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 239,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_10__style__[
                            'r' /* SearchResultTextContainer */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 240,
                            },
                            __self: this,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_10__style__[
                              'q' /* SearchResultNull */
                            ],
                            {
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 241,
                              },
                              __self: this,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              'p',
                              {
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 242,
                                },
                                __self: this,
                              },
                              'No communities found matching "',
                              searchString,
                              '"'
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_4_src_components_link__[
                                'a' /* default */
                              ],
                              {
                                to: '/new/community',
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 243,
                                },
                                __self: this,
                              },
                              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                                  'a' /* Button */
                                ],
                                {
                                  __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 244,
                                  },
                                  __self: this,
                                },
                                'Create a Community'
                              )
                            )
                          )
                        )
                      )
                  )
              );
            },
          },
        ]);

        return Search;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_3_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_1_react_apollo__['withApollo'],
        __WEBPACK_IMPORTED_MODULE_2_react_router__['e' /* withRouter */]
      )(Search);

      /***/
    },

  /***/ './src/views/explore/style.js':
    /*!************************************!*\
  !*** ./src/views/explore/style.js ***!
  \************************************/
    /*! exports provided: Wrapper, ViewTitle, ViewSubtitle, ListCard, Section, SectionWrapper, ViewHeader, SectionWithGradientTransition, SectionTitle, SectionSubtitle, Row, Item, ItemTitle, ItemCopy, ItemMeta, ButtonContainer, ItemButton, Constellations, ErrorState, SearchWrapper, SearchInputWrapper, SearchIcon, SearchInput, SearchSpinnerContainer, SearchResultsDropdown, SearchResultTextContainer, SearchResult, SearchLink, SearchResultImage, SearchResultMetaWrapper, SearchResultName, SearchResultMetadata, SearchResultNull, ListWithTitle, ListTitle, ListWrapper, ListItem, Collections, CollectionWrapper, CategoryWrapper, LoadingContainer */
    /*! exports used: CategoryWrapper, CollectionWrapper, Collections, ListTitle, ListWithTitle, ListWrapper, LoadingContainer, SearchIcon, SearchInput, SearchInputWrapper, SearchLink, SearchResult, SearchResultImage, SearchResultMetaWrapper, SearchResultMetadata, SearchResultName, SearchResultNull, SearchResultTextContainer, SearchResultsDropdown, SearchSpinnerContainer, SearchWrapper, Wrapper */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'v',
        function() {
          return Wrapper;
        }
      );
      /* unused harmony export ViewTitle */
      /* unused harmony export ViewSubtitle */
      /* unused harmony export ListCard */
      /* unused harmony export Section */
      /* unused harmony export SectionWrapper */
      /* unused harmony export ViewHeader */
      /* unused harmony export SectionWithGradientTransition */
      /* unused harmony export SectionTitle */
      /* unused harmony export SectionSubtitle */
      /* unused harmony export Row */
      /* unused harmony export Item */
      /* unused harmony export ItemTitle */
      /* unused harmony export ItemCopy */
      /* unused harmony export ItemMeta */
      /* unused harmony export ButtonContainer */
      /* unused harmony export ItemButton */
      /* unused harmony export Constellations */
      /* unused harmony export ErrorState */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'u',
        function() {
          return SearchWrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'j',
        function() {
          return SearchInputWrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'h',
        function() {
          return SearchIcon;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'i',
        function() {
          return SearchInput;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        't',
        function() {
          return SearchSpinnerContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        's',
        function() {
          return SearchResultsDropdown;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'r',
        function() {
          return SearchResultTextContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'l',
        function() {
          return SearchResult;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'k',
        function() {
          return SearchLink;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'm',
        function() {
          return SearchResultImage;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'n',
        function() {
          return SearchResultMetaWrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'p',
        function() {
          return SearchResultName;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'o',
        function() {
          return SearchResultMetadata;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'q',
        function() {
          return SearchResultNull;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return ListWithTitle;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return ListTitle;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'f',
        function() {
          return ListWrapper;
        }
      );
      /* unused harmony export ListItem */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return Collections;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return CollectionWrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return CategoryWrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'g',
        function() {
          return LoadingContainer;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_globals__ = __webpack_require__(
        /*! ../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_card__ = __webpack_require__(
        /*! ../../components/card */ './src/components/card/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_listItems_style__ = __webpack_require__(
        /*! ../../components/listItems/style */ './src/components/listItems/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_icons__ = __webpack_require__(
        /*! ../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_avatar__ = __webpack_require__(
        /*! ../../components/avatar */ './src/components/avatar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_scrollRow__ = __webpack_require__(
        /*! ../../components/scrollRow */ './src/components/scrollRow/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_buttons__ = __webpack_require__(
        /*! ../../components/buttons */ './src/components/buttons/index.js'
      );

      // $FlowFixMe

      // $FlowFixMe

      var Wrapper = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__Wrapper',
        componentId: 's839mu6-0',
      })(
        [
          'flex:1 0 auto;width:100%;background-color:',
          ';overflow:auto;overflow-x:hidden;z-index:',
          ';align-self:stretch;',
        ],
        function(_ref) {
          var theme = _ref.theme;
          return theme.bg.default;
        },
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */].base
      );

      var ViewTitle = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['d' /* H1 */]
      ).withConfig({
        displayName: 'style__ViewTitle',
        componentId: 's839mu6-1',
      })(
        [
          'margin-left:48px;margin-top:48px;font-size:32px;font-weight:900;color:',
          ';position:relative;z-index:',
          ';@media (max-width:768px){margin-left:16px;margin-top:16px;}',
        ],
        function(_ref2) {
          var theme = _ref2.theme;
          return theme.text.reverse;
        },
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */].base
      );

      var ViewSubtitle = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['e' /* H2 */]
      ).withConfig({
        displayName: 'style__ViewSubtitle',
        componentId: 's839mu6-2',
      })(
        [
          'margin-left:48px;color:',
          ';position:relative;z-index:',
          ';@media (max-width:768px){margin-left:16px;font-size:16px;line-height:20px;}',
        ],
        function(_ref3) {
          var theme = _ref3.theme;
          return theme.text.reverse;
        },
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */].base
      );

      var ListCard = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_4__components_listItems_style__[
          'p' /* StyledCard */
        ]
      ).withConfig({
        displayName: 'style__ListCard',
        componentId: 's839mu6-3',
      })([
        'padding:0;@media (max-width:768px){display:flex;margin-bottom:32px;}',
      ]);

      var Section = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__Section',
        componentId: 's839mu6-4',
      })(
        [
          'padding:32px;padding-top:0;display:flex;flex:none;justify-content:space-between;position:relative;z-index:',
          ';align-self:stretch;@media (max-width:768px){padding:0;}',
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */].base
      );

      var SectionWrapper = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['b' /* FlexRow */]
      ).withConfig({
        displayName: 'style__SectionWrapper',
        componentId: 's839mu6-5',
      })([
        'flex:none;align-items:flex-start;justify-content:center;@media (max-width:768px){flex-direction:column;}',
      ]);

      var ViewHeader = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(Section).withConfig({
        displayName: 'style__ViewHeader',
        componentId: 's839mu6-6',
      })(
        [
          'flex:none;padding:120px 0 0 0;justify-content:flex-end;background-color:',
          ';background-image:',
          ';@media (max-width:768px){padding:48px 24px 0 24px;}',
        ],
        function(_ref4) {
          var theme = _ref4.theme;
          return theme.space.dark;
        },
        function(_ref5) {
          var theme = _ref5.theme;
          return (
            'radial-gradient(farthest-corner at 50% 100%, ' +
            Object(
              __WEBPACK_IMPORTED_MODULE_2__components_globals__['p' /* hexa */]
            )(theme.brand.alt, 0.75) +
            ', ' +
            theme.space.dark +
            ' )'
          );
        }
      );

      var SectionWithGradientTransition = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(Section).withConfig({
        displayName: 'style__SectionWithGradientTransition',
        componentId: 's839mu6-7',
      })(
        ['background-image:', ';@media (max-width:768px){padding:32px;}'],
        function(_ref6) {
          var theme = _ref6.theme;
          return (
            'linear-gradient(' + theme.bg.default + ', ' + theme.bg.wash + ')'
          );
        }
      );

      var SectionTitle = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['e' /* H2 */]
      ).withConfig({
        displayName: 'style__SectionTitle',
        componentId: 's839mu6-8',
      })(
        [
          'color:',
          ';margin-left:16px;font-size:32px;margin-bottom:16px;font-weight:800;@media (max-width:768px){font-size:24px;}',
        ],
        function(_ref7) {
          var theme = _ref7.theme;
          return theme.text.default;
        }
      );

      var SectionSubtitle = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['f' /* H3 */]
      ).withConfig({
        displayName: 'style__SectionSubtitle',
        componentId: 's839mu6-9',
      })(
        [
          'color:',
          ';margin-bottom:8px;margin-left:48px;@media (max-width:768px){margin-left:16px;}',
        ],
        function(_ref8) {
          var theme = _ref8.theme;
          return theme.text.default;
        }
      );

      var Row = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_7__components_scrollRow__['a' /* default */]
      ).withConfig({
        displayName: 'style__Row',
        componentId: 's839mu6-10',
      })([
        "max-width:100%;width:100%;flex:0 0 320px;padding:8px 16px 32px 16px;overflow-x:scroll;align-items:flex-start;&:after,&:before{content:'';display:inline-block;flex:0 0 32px;align-self:stretch;background-color:transparent;}",
      ]);

      var Item = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__Item',
        componentId: 's839mu6-11',
      })(
        [
          'padding:16px;flex:0 0 280px;flex-order:',
          ';background-color:',
          ';color:',
          ';border-radius:16px;margin-right:24px;justify-content:space-between;position:relative;opacity:',
          ';box-shadow:',
          ' ',
          ';transition:',
          ';&:hover{box-shadow:',
          ' ',
          ';transition:',
          ';opacity:1;}',
        ],
        function(props) {
          return props.active ? '2' : '1';
        },
        function(_ref9) {
          var theme = _ref9.theme;
          return theme.bg.default;
        },
        function(_ref10) {
          var theme = _ref10.theme;
          return theme.text.default;
        },
        function(props) {
          return props.active ? '0.85' : '1';
        },
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['j' /* Shadow */].low,
        function(props) {
          return Object(
            __WEBPACK_IMPORTED_MODULE_2__components_globals__['p' /* hexa */]
          )(props.theme.text.placeholder, 1);
        },
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['n' /* Transition */]
          .hover.off,
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['j' /* Shadow */]
          .high,
        function(props) {
          return Object(
            __WEBPACK_IMPORTED_MODULE_2__components_globals__['p' /* hexa */]
          )(props.theme.text.placeholder, 1);
        },
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['n' /* Transition */]
          .hover.on
      );

      var ItemTitle = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['e' /* H2 */]
      ).withConfig({
        displayName: 'style__ItemTitle',
        componentId: 's839mu6-12',
      })(['font-weight:700;color:', ';'], function(_ref11) {
        var theme = _ref11.theme;
        return theme.text.default;
      });

      var ItemCopy = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['i' /* P */]
      ).withConfig({
        displayName: 'style__ItemCopy',
        componentId: 's839mu6-13',
      })(['color:', ';margin:8px 0;'], function(_ref12) {
        var theme = _ref12.theme;
        return theme.text.default;
      });

      var ItemMeta = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(ItemCopy).withConfig({
        displayName: 'style__ItemMeta',
        componentId: 's839mu6-14',
      })(['font-weight:900;color:', ';'], function(_ref13) {
        var theme = _ref13.theme;
        return theme.text.placeholder;
      });

      var ButtonContainer = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['b' /* FlexRow */]
      ).withConfig({
        displayName: 'style__ButtonContainer',
        componentId: 's839mu6-15',
      })(
        ['justify-content:', ';align-items:center;> div{margin-right:8px;}'],
        function(props) {
          return props.center ? 'center' : 'flex-end';
        }
      );

      var ItemButton = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_8__components_buttons__['a' /* Button */]
      ).withConfig({
        displayName: 'style__ItemButton',
        componentId: 's839mu6-16',
      })(
        [
          'font-weight:700;color:',
          ';background-color:',
          ';background-image:',
          ';box-shadow:none;transition:',
          ';&:hover{box-shadow:none;}',
        ],
        function(_ref14) {
          var theme = _ref14.theme;
          return theme.text.reverse;
        },
        function(props) {
          return props.joined
            ? props.theme.bg.inactive
            : props.theme.brand.default;
        },
        function(props) {
          return props.joined
            ? 'none'
            : Object(
                __WEBPACK_IMPORTED_MODULE_2__components_globals__[
                  'c' /* Gradient */
                ]
              )(props.theme.brand.alt, props.theme.brand.default);
        },
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['n' /* Transition */]
          .hover.on
      );

      var Constellations = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Constellations',
        componentId: 's839mu6-17',
      })(
        [
          'background-color:transparent;background:url(/img/constellations.svg) center top no-repeat;position:absolute;background-size:cover 100%;z-index:',
          ';height:calc(100% + 4px);width:110%;top:-10px;bottom:0;left:0;right:0;pointer-events:none;',
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .background
      );

      var ErrorState = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__ErrorState',
        componentId: 's839mu6-18',
      })([
        'width:100%;margin-top:32px;h2{text-align:center;opacity:0.5;}p{text-align:center;opacity:0.5;}&:not(:first-of-type){display:none;}',
      ]);

      var SearchWrapper = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_3__components_card__['b' /* default */]
      ).withConfig({
        displayName: 'style__SearchWrapper',
        componentId: 's839mu6-19',
      })(
        [
          'position:relative;margin-bottom:0;padding:12px 16px;box-shadow:',
          ' ',
          ';transition:',
          ';z-index:',
          ';&:hover{box-shadow:',
          ' ',
          ';transition:',
          ';}',
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['j' /* Shadow */].low,
        function(props) {
          return Object(
            __WEBPACK_IMPORTED_MODULE_2__components_globals__['p' /* hexa */]
          )(props.theme.bg.reverse, 0.15);
        },
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['n' /* Transition */]
          .hover.off,
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .search,
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['j' /* Shadow */]
          .high,
        function(props) {
          return Object(
            __WEBPACK_IMPORTED_MODULE_2__components_globals__['p' /* hexa */]
          )(props.theme.bg.reverse, 0.25);
        },
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['n' /* Transition */]
          .hover.on
      );

      var SearchInputWrapper = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['b' /* FlexRow */]
      ).withConfig({
        displayName: 'style__SearchInputWrapper',
        componentId: 's839mu6-20',
      })(['flex:auto;color:', ';'], function(props) {
        return props.theme.text.placeholder;
      });

      var SearchIcon = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_5__components_icons__['a' /* default */]
      ).withConfig({
        displayName: 'style__SearchIcon',
        componentId: 's839mu6-21',
      })(['']);

      var SearchInput = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].input.withConfig({
        displayName: 'style__SearchInput',
        componentId: 's839mu6-22',
      })(
        [
          'font-size:16px;padding:4px 20px;flex:auto;position:relative;z-index:',
          ';&:hover{}',
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .search
      );

      var SearchSpinnerContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__SearchSpinnerContainer',
        componentId: 's839mu6-23',
      })(
        [
          'position:absolute;top:12px;right:12px;width:32px;height:32px;z-index:',
          ';',
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['r' /* zIndex */]
          .search + 1
      );

      var SearchResultsDropdown = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].ul.withConfig({
        displayName: 'style__SearchResultsDropdown',
        componentId: 's839mu6-24',
      })(
        [
          'border-radius:8px;overflow:hidden;box-shadow:',
          ' ',
          ';position:absolute;top:64px;left:0;display:inline-block;width:100%;flex:auto;max-height:400px;overflow-y:auto;background:',
          ';@media (max-width:768px){border-radius:0 0 8px 8px;}',
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['j' /* Shadow */].mid,
        function(props) {
          return Object(
            __WEBPACK_IMPORTED_MODULE_2__components_globals__['p' /* hexa */]
          )(props.theme.bg.reverse, 0.1);
        },
        function(props) {
          return props.theme.bg.default;
        }
      );

      var SearchResultTextContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__SearchResultTextContainer',
        componentId: 's839mu6-25',
      })(['display:flex;flex-direction:column;flex:auto;']);

      var SearchResult = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].li.withConfig({
        displayName: 'style__SearchResult',
        componentId: 's839mu6-26',
      })(
        [
          'display:flex;background:',
          ';border-bottom:2px solid ',
          ';&:hover{background:',
          ';cursor:pointer;h2{color:',
          ';}p{color:',
          ';}}h2{color:',
          ';}p{color:',
          ';}&:only-child{border-bottom:none;}&:last-child{border-bottom:none;}',
        ],
        function(props) {
          return props.focused ? props.theme.brand.alt : props.theme.bg.default;
        },
        function(props) {
          return props.focused ? 'transparent' : props.theme.bg.border;
        },
        function(props) {
          return props.theme.brand.alt;
        },
        function(props) {
          return props.theme.text.reverse;
        },
        function(props) {
          return props.theme.text.reverse;
        },
        function(props) {
          return props.focused
            ? props.theme.text.reverse
            : props.theme.text.default;
        },
        function(props) {
          return props.focused
            ? props.theme.text.reverse
            : props.theme.text.alt;
        }
      );

      var SearchLink = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1_src_components_link__['a' /* default */]
      ).withConfig({
        displayName: 'style__SearchLink',
        componentId: 's839mu6-27',
      })(
        [
          'display:flex;align-items:center;width:100%;',
          ' padding:8px 16px 8px 8px;',
        ],
        Object(
          __WEBPACK_IMPORTED_MODULE_2__components_globals__['o' /* Truncate */]
        )()
      );

      var SearchResultImage = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_6__components_avatar__['a' /* default */]
      ).withConfig({
        displayName: 'style__SearchResultImage',
        componentId: 's839mu6-28',
      })(['']);

      var SearchResultMetaWrapper = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__SearchResultMetaWrapper',
        componentId: 's839mu6-29',
      })(['margin-left:16px;']);

      var SearchResultName = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h2.withConfig({
        displayName: 'style__SearchResultName',
        componentId: 's839mu6-30',
      })(['font-size:16px;font-weight:700;line-height:1.4;']);

      var SearchResultMetadata = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].p.withConfig({
        displayName: 'style__SearchResultMetadata',
        componentId: 's839mu6-31',
      })(['font-size:14px;font-weight:400;line-height:1.4;']);

      var SearchResultNull = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__SearchResultNull',
        componentId: 's839mu6-32',
      })(
        [
          'display:flex;flex-direction:column;justify-content:center;align-items:center;padding:24px;background-color:',
          ';border:0;&:hover{border:0;p{color:',
          ';}}a{margin-top:16px;}p{text-align:center;font-size:14px;font-weight:400;color:',
          ';text-align:center;font-size:18px;font-weight:600;}',
        ],
        function(props) {
          return props.theme.bg.default;
        },
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.text.alt;
        }
      );

      var ListWithTitle = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__ListWithTitle',
        componentId: 's839mu6-33',
      })(['flex:auto;']);

      var ListTitle = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['e' /* H2 */]
      ).withConfig({
        displayName: 'style__ListTitle',
        componentId: 's839mu6-34',
      })(
        [
          'border-bottom:1px solid ',
          ';padding-bottom:8px;padding-left:16px;font-weight:500;font-size:18px;margin-top:32px;@media (max-width:768px){padding-left:32px;}',
        ],
        function(props) {
          return props.theme.bg.border;
        }
      );

      var ListWrapper = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['b' /* FlexRow */]
      ).withConfig({
        displayName: 'style__ListWrapper',
        componentId: 's839mu6-35',
      })([
        'display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));align-items:stretch;',
      ]);

      var ListItem = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_globals__['b' /* FlexRow */]
      ).withConfig({
        displayName: 'style__ListItem',
        componentId: 's839mu6-36',
      })(['']);

      var Collections = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Collections',
        componentId: 's839mu6-37',
      })(['display:flex;flex-direction:column;flex:auto;']);

      var CollectionWrapper = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__CollectionWrapper',
        componentId: 's839mu6-38',
      })([
        'display:flex;flex-direction:column;padding:0 32px;flex:auto;@media (max-width:768px){padding:0;}',
      ]);

      var CategoryWrapper = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__CategoryWrapper',
        componentId: 's839mu6-39',
      })([
        'display:flex;flex-direction:column;justify-content:flex-start;flex:none;',
      ]);

      var LoadingContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__LoadingContainer',
        componentId: 's839mu6-40',
      })(['padding:32px;']);

      /***/
    },
});
//# sourceMappingURL=12.96358f5c7f2339a17fbf.hot-update.js.map
