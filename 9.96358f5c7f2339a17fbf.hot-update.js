webpackHotUpdate(9, {
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

  /***/ './src/views/splash/view.js':
    /*!**********************************!*\
  !*** ./src/views/splash/view.js ***!
  \**********************************/
    /*! exports provided: Overview, Centralized, CommunitySearch, Chat, Sell, Yours, PageFooter, UserPricing, Plans, ContactInfo, TermsSection */
    /*! exports used: Centralized, Chat, CommunitySearch, ContactInfo, Overview, PageFooter, Plans, Sell, TermsSection, Yours */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return Overview;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return Centralized;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return CommunitySearch;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return Chat;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'h',
        function() {
          return Sell;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'j',
        function() {
          return Yours;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'f',
        function() {
          return PageFooter;
        }
      );
      /* unused harmony export UserPricing */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'g',
        function() {
          return Plans;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return ContactInfo;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'i',
        function() {
          return TermsSection;
        }
      );
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_icons__ = __webpack_require__(
        /*! ../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_avatar__ = __webpack_require__(
        /*! ../../components/avatar */ './src/components/avatar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_privacy__ = __webpack_require__(
        /*! ../../components/privacy */ './src/components/privacy/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_terms__ = __webpack_require__(
        /*! ../../components/terms */ './src/components/terms/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_globals__ = __webpack_require__(
        /*! ../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_buttons__ = __webpack_require__(
        /*! ../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__explore_components_search__ = __webpack_require__(
        /*! ../explore/components/search */ './src/views/explore/components/search.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_viewSegment__ = __webpack_require__(
        /*! ../../components/viewSegment */ './src/components/viewSegment/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_illustrations__ = __webpack_require__(
        /*! ../../components/illustrations */ './src/components/illustrations/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_logos__ = __webpack_require__(
        /*! ./components/logos */ './src/views/splash/components/logos.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__style__ = __webpack_require__(
        /*! ./style */ './src/views/splash/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__nav__ = __webpack_require__(
        /*! ./nav */ './src/views/splash/nav.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/splash/view.js',
        _this = this;

      var Section = function Section(props) {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_10__components_viewSegment__[
            'a' /* default */
          ],
          Object.assign({}, props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 67,
            },
            __self: _this,
          }),
          props.children
        );
      };

      var Overview = function Overview(props) {
        var ThisContent = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['h' /* Content */]).withConfig({
          displayName: 'view__ThisContent',
          componentId: 'suq3ji-0',
        })(['max-width:100vw;margin-top:24px;']);

        var Text = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_7__components_globals__['a' /* FlexCol */]
        ).withConfig({
          displayName: 'view__Text',
          componentId: 'suq3ji-1',
        })([
          'margin:120px 32px 120px 32px;text-align:left;align-items:flex-start;z-index:2;@media (max-width:768px){margin-top:0;margin-bottom:16px;text-align:center;align-items:center;}',
        ]);

        var ThisCopy = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['i' /* Copy */]).withConfig({
          displayName: 'view__ThisCopy',
          componentId: 'suq3ji-2',
        })([
          'line-height:1.6;font-weight:500;max-width:580px;@media (max-width:768px){text-align:center;}',
        ]);

        var ThisTagline = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['N' /* Tagline */]).withConfig({
          displayName: 'view__ThisTagline',
          componentId: 'suq3ji-3',
        })([
          'margin-bottom:16px;font-size:40px;@media (max-width:768px){font-size:24px;}',
        ]);

        var Actions = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['q' /* Flexer */]).withConfig({
          displayName: 'view__Actions',
          componentId: 'suq3ji-4',
        })([
          'margin-top:48px;align-items:flex-start;justify-content:space-between;@media (max-width:768px){align-items:center;}',
        ]);

        var ThisSecondaryCTA = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_13__style__['J' /* SecondaryCTA */]
        ).withConfig({
          displayName: 'view__ThisSecondaryCTA',
          componentId: 'suq3ji-5',
        })(
          [
            'margin-left:16px;font-size:16px;border:2px solid ',
            ';@media (max-width:768px){margin-left:0;margin-top:16px;}',
          ],
          function(props) {
            return props.theme.text.reverse;
          }
        );

        var ThisText = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(Text).withConfig({
          displayName: 'view__ThisText',
          componentId: 'suq3ji-6',
        })([
          'position:relative;right:20vw;@media (max-width:1400px){right:15vw;}@media (max-width:1200px){right:0;}',
        ]);

        var ThisPrimaryCTA = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_13__style__['I' /* PrimaryCTA */]
        ).withConfig({
          displayName: 'view__ThisPrimaryCTA',
          componentId: 'suq3ji-7',
        })(['font-size:16px;']);

        var Img = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
          'c' /* default */
        ].img.withConfig({
          displayName: 'view__Img',
          componentId: 'suq3ji-8',
        })([
          'position:absolute;top:32px;bottom:0;left:calc(25vw + 480px);max-height:calc(100% - 32px);z-index:0;@media (max-width:1400px){left:calc(20vw + 480px);}@media (max-width:1200px){display:none;}@media (max-width:768px){display:none;}',
        ]);

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          Section,
          {
            background: 'constellations',
            goop: 2,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 167,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_14__nav__['a' /* default */],
            {
              dark: true,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 168,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            ThisContent,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 169,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              ThisText,
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 170,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisTagline,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 171,
                  },
                  __self: _this,
                },
                'The community platform for the future.'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisCopy,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 172,
                  },
                  __self: _this,
                },
                'The internet was built for communities.'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisCopy,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 173,
                  },
                  __self: _this,
                },
                'But, as the web has changed and improved radically, community software has hardly improved since the heyday of messageboards and IRC.'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisCopy,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 178,
                  },
                  __self: _this,
                },
                'Spectrum makes it easy to grow safe, successful online communities that are built to last.'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                Actions,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 182,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                    'a' /* default */
                  ],
                  {
                    to: '/login',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 183,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    ThisPrimaryCTA,
                    {
                      icon: 'welcome',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 184,
                      },
                      __self: _this,
                    },
                    'Join Spectrum'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                    'a' /* default */
                  ],
                  {
                    to: '/new/community',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 186,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    ThisSecondaryCTA,
                    {
                      icon: 'plus-fill',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 187,
                      },
                      __self: _this,
                    },
                    'Create your community'
                  )
                )
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Img, {
              src: '/img/diagram.svg',
              __source: {
                fileName: _jsxFileName,
                lineNumber: 193,
              },
              __self: _this,
            })
          )
        );
      };

      var Centralized = function Centralized(props) {
        var ThisContent = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['h' /* Content */]).withConfig({
          displayName: 'view__ThisContent',
          componentId: 'suq3ji-9',
        })(['img{margin:24px 0;}']);

        var Text = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_7__components_globals__['a' /* FlexCol */]
        ).withConfig({
          displayName: 'view__Text',
          componentId: 'suq3ji-10',
        })([
          'margin:40px 16px 64px;@media (max-width:768px){margin-top:20px;margin-bottom:44px;}',
        ]);

        var ThisCopy = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['i' /* Copy */]).withConfig({
          displayName: 'view__ThisCopy',
          componentId: 'suq3ji-11',
        })(['font-weight:400;margin-top:16px;']);

        var ThisPrimaryCTA = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_13__style__['I' /* PrimaryCTA */]
        ).withConfig({
          displayName: 'view__ThisPrimaryCTA',
          componentId: 'suq3ji-12',
        })(
          [
            'margin-top:32px;background-color:',
            ';background-image:',
            ';color:',
            ';&:hover{color:',
            ';}',
          ],
          function(props) {
            return props.theme.brand.alt;
          },
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__[
                'c' /* Gradient */
              ]
            )(props.theme.brand.alt, props.theme.brand.default);
          },
          function(props) {
            return props.theme.text.reverse;
          },
          function(props) {
            return props.theme.text.reverse;
          }
        );

        var Actions = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
          'c' /* default */
        ].div.withConfig({
          displayName: 'view__Actions',
          componentId: 'suq3ji-13',
        })(['@media (max-width:768px){display:flex;justify-content:center;}']);

        var ThisTagline = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['N' /* Tagline */]).withConfig({
          displayName: 'view__ThisTagline',
          componentId: 'suq3ji-14',
        })(['@media (max-width:768px){margin-bottom:0;}']);

        var LogoSection = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
          'c' /* default */
        ].div.withConfig({
          displayName: 'view__LogoSection',
          componentId: 'suq3ji-15',
        })([
          'display:flex;align-self:center;max-width:80vw;justify-content:center;align-items:center;flex-wrap:wrap;z-index:2;margin-bottom:40px;img{margin-top:32px;margin-right:32px;&:last-of-type{margin-right:0;}}',
        ]);

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          Section,
          {
            goop: 6,
            color: 'space.alt',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 266,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            ThisContent,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 267,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_11__components_illustrations__[
                'g' /* Discover */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 268,
                },
                __self: _this,
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              Text,
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 269,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisTagline,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 270,
                  },
                  __self: _this,
                },
                'Grow together'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisCopy,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 271,
                  },
                  __self: _this,
                },
                'By building on Spectrum, communities become easily discoverable through search, curation, and even other community members.'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisCopy,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 275,
                  },
                  __self: _this,
                },
                'It also means no more managing multiple logins or playing whack-a-mole with different notifications and preferences. Everyone wins!'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                Actions,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 280,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                    'a' /* default */
                  ],
                  {
                    to: '/explore',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 281,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    ThisPrimaryCTA,
                    {
                      icon: 'explore',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 282,
                      },
                      __self: _this,
                    },
                    'Explore communities'
                  )
                )
              )
            )
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            LogoSection,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 289,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_12__components_logos__[
                'd' /* FigmaLogo */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 290,
                },
                __self: _this,
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_12__components_logos__[
                'b' /* BootstrapLogo */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 291,
                },
                __self: _this,
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_12__components_logos__[
                'c' /* ExpoLogo */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 292,
                },
                __self: _this,
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_12__components_logos__[
                'i' /* ZeitLogo */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 293,
                },
                __self: _this,
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_12__components_logos__[
                'h' /* SketchLogo */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 294,
                },
                __self: _this,
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_12__components_logos__[
                'a' /* AbstractLogo */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 295,
                },
                __self: _this,
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_12__components_logos__[
                'g' /* RealmLogo */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 296,
                },
                __self: _this,
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_12__components_logos__[
                'f' /* NodeLogo */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 297,
                },
                __self: _this,
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_12__components_logos__[
                'e' /* InvisionLogo */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 298,
                },
                __self: _this,
              }
            )
          )
        );
      };

      var CommunitySearch = function CommunitySearch(props) {
        var ThisContent = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['h' /* Content */]).withConfig({
          displayName: 'view__ThisContent',
          componentId: 'suq3ji-16',
        })([
          'flex-direction:column;width:640px;align-content:center;align-self:center;margin-top:40px;margin-bottom:40px;padding:16px;@media (max-width:640px){margin-top:80px;margin-bottom:0;width:100%;}',
        ]);

        var ThisTagline = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['N' /* Tagline */]).withConfig({
          displayName: 'view__ThisTagline',
          componentId: 'suq3ji-17',
        })(['margin-bottom:16px;']);

        var ThisCopy = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['i' /* Copy */]).withConfig({
          displayName: 'view__ThisCopy',
          componentId: 'suq3ji-18',
        })([
          'font-size:18px;margin-bottom:32px;font-weight:500;text-align:center;max-width:640px;@media (max-width:768px){text-align:left;}',
        ]);

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          Section,
          {
            goop: 4,
            background: 'bright',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 336,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            ThisContent,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 337,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              ThisTagline,
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 338,
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
                  lineNumber: 339,
                },
                __self: _this,
              },
              'Try searching for topics like "crypto" or for products like "React"!'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_9__explore_components_search__[
                'a' /* default */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 342,
                },
                __self: _this,
              }
            )
          )
        );
      };

      var Chat = function Chat(props) {
        var ThisContent = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['h' /* Content */]).withConfig({
          displayName: 'view__ThisContent',
          componentId: 'suq3ji-19',
        })([
          'overflow:hidden;margin:40px 16px;@media (max-width:768px){margin-bottom:0;}',
        ]);

        var ThisCopy = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['i' /* Copy */]).withConfig({
          displayName: 'view__ThisCopy',
          componentId: 'suq3ji-20',
        })(['font-weight:400;margin-top:16px;']);

        var ThisPrimaryCTA = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_13__style__['I' /* PrimaryCTA */]
        ).withConfig({
          displayName: 'view__ThisPrimaryCTA',
          componentId: 'suq3ji-21',
        })(
          [
            'background-color:',
            ';background-image:',
            ';color:',
            ';margin-top:32px;&:hover{color:',
            ';}',
          ],
          function(props) {
            return props.theme.brand.alt;
          },
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__[
                'c' /* Gradient */
              ]
            )(props.theme.brand.alt, props.theme.brand.default);
          },
          function(props) {
            return props.theme.text.reverse;
          },
          function(props) {
            return props.theme.text.reverse;
          }
        );

        var Actions = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
          'c' /* default */
        ].div.withConfig({
          displayName: 'view__Actions',
          componentId: 'suq3ji-22',
        })(['@media (max-width:768px){display:flex;justify-content:center;}']);

        var ThisTagline = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['N' /* Tagline */]).withConfig({
          displayName: 'view__ThisTagline',
          componentId: 'suq3ji-23',
        })(['@media (max-width:768px){margin-bottom:0;}']);

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          Section,
          {
            goop: 7,
            color: 'bg.reverse',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 389,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            ThisContent,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 390,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_11__components_illustrations__[
                'f' /* Conversation */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 391,
                },
                __self: _this,
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__[
                'a' /* FlexCol */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 392,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisTagline,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 393,
                  },
                  __self: _this,
                },
                'Real-time messaging with long-term value'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisCopy,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 394,
                  },
                  __self: _this,
                },
                'Conversations on Spectrum are real-time chat, just like your favorite messaging app. But on Spectrum, conversations continue to provide value to more and more people over time.'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisCopy,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 399,
                  },
                  __self: _this,
                },
                'Every conversation gets a unique link to make it easy for people to discover, share, or save for later.'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                Actions,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 404,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                    'a' /* default */
                  ],
                  {
                    to: '/thread/764331db-16dd-4fc4-a2c5-aabd735a64a9',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 405,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    ThisPrimaryCTA,
                    {
                      icon: 'message-fill',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 406,
                      },
                      __self: _this,
                    },
                    'Check out a conversation'
                  )
                )
              )
            )
          )
        );
      };

      var Sell = function Sell(props) {
        var Text = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_7__components_globals__['a' /* FlexCol */]
        ).withConfig({
          displayName: 'view__Text',
          componentId: 'suq3ji-24',
        })(['align-items:center;margin:40px 0;']);

        var ThisContent = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['h' /* Content */]).withConfig({
          displayName: 'view__ThisContent',
          componentId: 'suq3ji-25',
        })(['']);

        var ThisTagline = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['N' /* Tagline */]).withConfig({
          displayName: 'view__ThisTagline',
          componentId: 'suq3ji-26',
        })(['margin-bottom:0;margin-left:16px;margin-right:16px;']);

        var Actions = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['q' /* Flexer */]).withConfig({
          displayName: 'view__Actions',
          componentId: 'suq3ji-27',
        })(['margin-bottom:48px;justify-content:center;']);

        var ThisSection = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(Section).withConfig({
          displayName: 'view__ThisSection',
          componentId: 'suq3ji-28',
        })(['margin-bottom:40px;']);

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          ThisSection,
          {
            goop: 2,
            background: 'dark',
            color: 'bg.reverse',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 439,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            ThisContent,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 440,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              Text,
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 441,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisTagline,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 442,
                  },
                  __self: _this,
                },
                'Spectrum saves you time and money'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_13__style__['g' /* Bullets */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 443,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_13__style__['c' /* Bullet */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 444,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__style__[
                      'e' /* BulletHeading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 445,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__[
                        'f' /* BulletTitle */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 446,
                        },
                        __self: _this,
                      },
                      'Supercharge support'
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__style__['d' /* BulletCopy */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 448,
                      },
                      __self: _this,
                    },
                    'Stop wasting time with endless private customer support threads answering the same question over and over.'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__style__['d' /* BulletCopy */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 452,
                      },
                      __self: _this,
                    },
                    'Now your team can have conversations with your community as a whole and chat privately when a particular issue is sensitive.'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_13__style__['c' /* Bullet */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 457,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__style__[
                      'e' /* BulletHeading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 458,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__[
                        'f' /* BulletTitle */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 459,
                        },
                        __self: _this,
                      },
                      'Bring people together'
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__style__['d' /* BulletCopy */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 461,
                      },
                      __self: _this,
                    },
                    'Spectrum gives your top supporters and advocates a place to share their knowledge, empower others, and foster a place of belonging for everyone.'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_13__style__['c' /* Bullet */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 467,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__style__[
                      'e' /* BulletHeading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 468,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__[
                        'f' /* BulletTitle */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 469,
                        },
                        __self: _this,
                      },
                      'Tighten your feedback loop'
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__style__['d' /* BulletCopy */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 471,
                      },
                      __self: _this,
                    },
                    "There's no better feedback than the insights that come directly from your customers."
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__style__['d' /* BulletCopy */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 475,
                      },
                      __self: _this,
                    },
                    'Think of Spectrum as a new direct line to discovering what your audience wants the most.'
                  )
                )
              )
            )
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            Actions,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 483,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                'a' /* default */
              ],
              {
                to: '/new/community',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 484,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_13__style__['I' /* PrimaryCTA */],
                {
                  icon: 'plus-fill',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 485,
                  },
                  __self: _this,
                },
                'Start building your community'
              )
            )
          )
        );
      };

      var Yours = function Yours(props) {
        var ThisContent = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['h' /* Content */]).withConfig({
          displayName: 'view__ThisContent',
          componentId: 'suq3ji-29',
        })([
          'margin:60px 16px 16px;font-size:18px;align-items:center;text-align:left;',
        ]);

        var ThisTagline = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['N' /* Tagline */]).withConfig({
          displayName: 'view__ThisTagline',
          componentId: 'suq3ji-30',
        })(['text-align:center;align-self:center;']);

        var ThisSecondaryCTA = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_13__style__['J' /* SecondaryCTA */]
        ).withConfig({
          displayName: 'view__ThisSecondaryCTA',
          componentId: 'suq3ji-31',
        })(
          [
            'margin-left:16px;font-size:16px;border:2px solid ',
            ';@media (max-width:768px){margin-left:0;margin-top:16px;}',
          ],
          function(props) {
            return props.theme.text.reverse;
          }
        );

        var ThisPrimaryCTA = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_13__style__['I' /* PrimaryCTA */]
        ).withConfig({
          displayName: 'view__ThisPrimaryCTA',
          componentId: 'suq3ji-32',
        })(
          [
            'font-size:16px;color:',
            ';&:hover{color:',
            ';box-shadow:',
            ' #000;}',
          ],
          function(props) {
            return props.theme.text.default;
          },
          function(props) {
            return props.theme.brand.alt;
          },
          __WEBPACK_IMPORTED_MODULE_7__components_globals__['j' /* Shadow */]
            .high
        );

        var Actions = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['q' /* Flexer */]).withConfig({
          displayName: 'view__Actions',
          componentId: 'suq3ji-33',
        })([
          'margin-top:32px;justify-content:center;> a{display:inline-block;}@media (max-width:768px){justify-content:center;}',
        ]);

        var Quotes = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
          'c' /* default */
        ].div.withConfig({
          displayName: 'view__Quotes',
          componentId: 'suq3ji-34',
        })([
          'display:flex;flex:auto;align-items:start;justify-content:center;padding:40px 0;max-width:100vw;flex-wrap:wrap;margin-left:-32px;@media (max-width:768px){display:none;}',
        ]);

        var Quote = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
          'c' /* default */
        ].div.withConfig({
          displayName: 'view__Quote',
          componentId: 'suq3ji-35',
        })(
          [
            'display:flex;flex-direction:column;align-items:flex-start;background-color:white;width:400px;min-width:320px;flex:none;box-shadow:0 8px 16px #000;color:',
            ';position:relative;padding:24px;transition:',
            ';margin-top:32px;margin-left:32px;&:hover{box-shadow:0 0px 32px ',
            ';transition:',
            ';> div{color:',
            ';transition:',
            ';}}',
          ],
          function(props) {
            return props.theme.text.default;
          },
          __WEBPACK_IMPORTED_MODULE_7__components_globals__[
            'n' /* Transition */
          ].hover.off,
          function(props) {
            return props.theme.brand.alt;
          },
          __WEBPACK_IMPORTED_MODULE_7__components_globals__[
            'n' /* Transition */
          ].hover.on,
          function(props) {
            return props.theme.brand.alt;
          },
          __WEBPACK_IMPORTED_MODULE_7__components_globals__[
            'n' /* Transition */
          ].hover.on
        );

        var Pullquote = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
          'c' /* default */
        ].p.withConfig({
          displayName: 'view__Pullquote',
          componentId: 'suq3ji-36',
        })([
          'padding:0;padding-left:16px;line-height:1.6;margin:16px 8px 8px 8px;font-size:16px;position:relative;z-index:2;',
        ]);

        var Signature = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_2_src_components_link__['a' /* default */]
        ).withConfig({
          displayName: 'view__Signature',
          componentId: 'suq3ji-37',
        })(
          [
            'font-weight:700;font-size:14px;display:flex;align-items:center;margin-top:16px;margin-left:8px;div{margin-right:8px;}span{color:',
            ';font-weight:400;margin-left:4px;}',
          ],
          function(props) {
            return props.theme.text.alt;
          }
        );

        var Rule = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_7__components_globals__[
            'h' /* HorizontalRule */
          ]
        ).withConfig({
          displayName: 'view__Rule',
          componentId: 'suq3ji-38',
        })(
          [
            'color:',
            ';transition:',
            ';hr{color:inherit;border-color:currentColor;}',
          ],
          function(props) {
            return props.theme.brand.border;
          },
          __WEBPACK_IMPORTED_MODULE_7__components_globals__[
            'n' /* Transition */
          ].hover.off
        );

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          Section,
          {
            goop: 0,
            background: 'reverse',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 623,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            ThisContent,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 624,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__[
                'a' /* FlexCol */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 625,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                ThisTagline,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 626,
                  },
                  __self: _this,
                },
                "You're gonna love Spectrum."
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                Quotes,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 627,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Quote,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 628,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    Rule,
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 629,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'hr',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 630,
                        },
                        __self: _this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_3__components_icons__[
                        'a' /* default */
                      ],
                      {
                        glyph: 'quote',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 631,
                        },
                        __self: _this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'hr',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 632,
                        },
                        __self: _this,
                      }
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    Pullquote,
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 634,
                      },
                      __self: _this,
                    },
                    'okay, honestly Spectrum is the best thing that happened to me regarding social interaction in 2017'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    Signature,
                    {
                      to: 'https://spectrum.chat/users/Traykov',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 638,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_4__components_avatar__[
                        'a' /* default */
                      ],
                      {
                        size: '40',
                        src:
                          'https://spectrum.imgix.net/users/ZN37gjzZ31PKVPmd6E4ZTlZJa7Z2/5sasho.png.0.17582088793809425?auto=compress&w=64&dpr=2&format=png',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 639,
                        },
                        __self: _this,
                      }
                    ),
                    'Alexander Traykov',
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'span',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 642,
                        },
                        __self: _this,
                      },
                      '@Traykov'
                    )
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Quote,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 645,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    Rule,
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 646,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'hr',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 647,
                        },
                        __self: _this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_3__components_icons__[
                        'a' /* default */
                      ],
                      {
                        glyph: 'quote',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 648,
                        },
                        __self: _this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'hr',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 649,
                        },
                        __self: _this,
                      }
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    Pullquote,
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 651,
                      },
                      __self: _this,
                    },
                    'Spectrum will take the place that Reddit used to have a long time ago for communities (especially tech) to freely share ideas and interact. Except realtime and trolling-free'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    Signature,
                    {
                      to: 'https://spectrum.chat/users/rauchg',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 656,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_4__components_avatar__[
                        'a' /* default */
                      ],
                      {
                        size: '40',
                        src:
                          'https://spectrum-imgp.imgix.net/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F871555682608136205%2FyMs8Gnot_normal.jpg?w=128&h=128&ixlib=js-1.1.1&s=cc42ed724e75265fbb959ec43c910be2',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 657,
                        },
                        __self: _this,
                      }
                    ),
                    'Guillermo Rauch ',
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'span',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 660,
                        },
                        __self: _this,
                      },
                      '@rauchg'
                    )
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Quote,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 663,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    Rule,
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 664,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'hr',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 665,
                        },
                        __self: _this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_3__components_icons__[
                        'a' /* default */
                      ],
                      {
                        glyph: 'quote',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 666,
                        },
                        __self: _this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'hr',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 667,
                        },
                        __self: _this,
                      }
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    Pullquote,
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 669,
                      },
                      __self: _this,
                    },
                    'Spectrum is definitely a product worth looking out for. Huge fan and been lovely to be a part of the unique communities.'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    Signature,
                    {
                      to: 'https://www.spectrum.chat/users/tayler-m-odea',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 673,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_4__components_avatar__[
                        'a' /* default */
                      ],
                      {
                        size: '40',
                        src:
                          'https://spectrum-imgp.imgix.net/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F900025975278157824%2FmydeOAGa_normal.jpg?w=128&h=128&ixlib=js-1.1.1&s=a50556fe67cb087d5083b9d1342711ab',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 674,
                        },
                        __self: _this,
                      }
                    ),
                    "Tayler O'Dea ",
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'span',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 677,
                        },
                        __self: _this,
                      },
                      '@tayler-m-odea'
                    )
                  )
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                Actions,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 681,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                    'a' /* default */
                  ],
                  {
                    to: '/login',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 682,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    ThisPrimaryCTA,
                    {
                      icon: 'welcome',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 683,
                      },
                      __self: _this,
                    },
                    'Join Spectrum'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                    'a' /* default */
                  ],
                  {
                    to: '/explore',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 685,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    ThisSecondaryCTA,
                    {
                      icon: 'explore',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 686,
                      },
                      __self: _this,
                    },
                    'Explore communities'
                  )
                )
              )
            )
          )
        );
      };

      var PageFooter = function PageFooter(props) {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_13__style__['r' /* Footer */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 699,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_7__components_globals__[
              'b' /* FlexRow */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 700,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                'a' /* default */
              ],
              {
                to: '/',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 701,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__components_icons__[
                  'a' /* default */
                ],
                {
                  glyph: 'logo',
                  size: 32,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 702,
                  },
                  __self: _this,
                }
              )
            )
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_13__style__['q' /* Flexer */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 705,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_13__style__['v' /* LinkBlock */],
              {
                href: '/privacy',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 706,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 707,
                  },
                  __self: _this,
                },
                'Privacy'
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_13__style__['v' /* LinkBlock */],
              {
                href: '/terms',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 709,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 710,
                  },
                  __self: _this,
                },
                'Terms'
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_13__style__['v' /* LinkBlock */],
              {
                href: 'https://github.com/withspectrum/code-of-conduct',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 712,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 713,
                  },
                  __self: _this,
                },
                'Code of Conduct'
              )
            )
          )
        );
      };

      var UserPricing = function UserPricing(props) {
        var Text = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_7__components_globals__['a' /* FlexCol */]
        ).withConfig({
          displayName: 'view__Text',
          componentId: 'suq3ji-39',
        })([
          'margin:120px 16px 120px 16px;text-align:center;align-items:center;z-index:2;@media (max-width:768px){margin-bottom:16px;}p{margin-top:16px;& + p{margin-top:32px;}}b{font-weight:900;}',
        ]);

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          Section,
          {
            background: 'dark',
            goop: 1,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 745,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_13__style__['h' /* Content */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 746,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              Text,
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 747,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_13__style__['N' /* Tagline */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 748,
                  },
                  __self: _this,
                },
                'Spectrum will always be free for users.'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_13__style__['i' /* Copy */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 749,
                  },
                  __self: _this,
                },
                'Unlimited usage. Zero ads.'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_13__style__['i' /* Copy */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 750,
                  },
                  __self: _this,
                },
                "We'll never sell your data either."
              )
            )
          )
        );
      };

      var Plans = function Plans(props) {
        var Text = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(
          __WEBPACK_IMPORTED_MODULE_7__components_globals__['a' /* FlexCol */]
        ).withConfig({
          displayName: 'view__Text',
          componentId: 'suq3ji-40',
        })(
          [
            'margin:48px 16px;text-align:left;align-items:start;z-index:2;',
            '{margin-top:16px;margin-left:32px;}@media (max-width:768px){margin:0;z-index:1;}',
          ],
          __WEBPACK_IMPORTED_MODULE_13__style__['i' /* Copy */]
        );

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          Section,
          {
            background: 'illustrated',
            goop: 1,
            color: 'space.dark',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 776,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_14__nav__['a' /* default */],
            {
              location: 'pricing',
              __source: {
                fileName: _jsxFileName,
                lineNumber: 777,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_13__style__['h' /* Content */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 778,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              Text,
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 779,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_13__style__['u' /* Layout */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 780,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_13__style__['F' /* PricingGrid */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 781,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__style__['s' /* Free */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 782,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__['O' /* Title */],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 783,
                        },
                        __self: _this,
                      },
                      'Open'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__['j' /* Cost */],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 784,
                        },
                        __self: _this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_13__style__[
                          'k' /* CostNumber */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 785,
                          },
                          __self: _this,
                        },
                        'Free'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_13__style__[
                          'l' /* CostSubtext */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 786,
                          },
                          __self: _this,
                        },
                        'forever'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__[
                        'm' /* Description */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 788,
                        },
                        __self: _this,
                      },
                      'Build your community on a platform purpose-built for constructive public communities.'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__[
                        'p' /* FeatureList */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 792,
                        },
                        __self: _this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_13__style__[
                          'o' /* Feature */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 793,
                          },
                          __self: _this,
                        },
                        'Never lose a thing. Spectrum gives you',
                        ' ',
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'b',
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 795,
                            },
                            __self: _this,
                          },
                          'unlimited members, channels, messages, and file uploads'
                        ),
                        ' ',
                        'by default.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_13__style__[
                          'o' /* Feature */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 800,
                          },
                          __self: _this,
                        },
                        "Find that conversation you're looking for with",
                        ' ',
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'b',
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 802,
                            },
                            __self: _this,
                          },
                          'permalinked, search-indexed chat threads'
                        ),
                        '.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_13__style__[
                          'o' /* Feature */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 804,
                          },
                          __self: _this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'b',
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 805,
                            },
                            __self: _this,
                          },
                          'Simple, powerful moderation'
                        ),
                        ' with automated toxicity monitoring and clear guidelines set by our open source',
                        ' ',
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'a',
                          {
                            href:
                              'https://github.com/withspectrum/code-of-conduct',
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 807,
                            },
                            __self: _this,
                          },
                          'Code of Conduct'
                        ),
                        '.'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__[
                        'E' /* PlanFooter */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 812,
                        },
                        __self: _this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                          'a' /* default */
                        ],
                        {
                          to: '/new/community',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 813,
                          },
                          __self: _this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_13__style__[
                            't' /* FreePrimaryCTA */
                          ],
                          {
                            icon: 'plus-fill',
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 814,
                            },
                            __self: _this,
                          },
                          'Create my community'
                        )
                      )
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__style__['C' /* Paid */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 820,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__['O' /* Title */],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 821,
                        },
                        __self: _this,
                      },
                      'Standard'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__['j' /* Cost */],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 822,
                        },
                        __self: _this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_13__style__[
                          'k' /* CostNumber */
                        ],
                        {
                          per: 'month',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 823,
                          },
                          __self: _this,
                        },
                        '100'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_13__style__[
                          'l' /* CostSubtext */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 824,
                          },
                          __self: _this,
                        },
                        'per 1,000 members'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__[
                        'm' /* Description */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 826,
                        },
                        __self: _this,
                      },
                      'Take your community to the next level with top-tier moderation and support tools.'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__[
                        'p' /* FeatureList */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 830,
                        },
                        __self: _this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_13__style__[
                          'o' /* Feature */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 831,
                          },
                          __self: _this,
                        },
                        'Keep team conversations confidential with',
                        ' ',
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'b',
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 833,
                            },
                            __self: _this,
                          },
                          'invite-only, private channels'
                        ),
                        '.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_13__style__[
                          'o' /* Feature */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 835,
                          },
                          __self: _this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'b',
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 836,
                            },
                            __self: _this,
                          },
                          'Community analytics'
                        ),
                        " provide a bird's-eye view of community behavior and ROI."
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_13__style__[
                          'o' /* Feature */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 839,
                          },
                          __self: _this,
                        },
                        'Empower your team with ',
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'b',
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 840,
                            },
                            __self: _this,
                          },
                          'additional moderators'
                        ),
                        '.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_13__style__[
                          'o' /* Feature */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 842,
                          },
                          __self: _this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'b',
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 843,
                            },
                            __self: _this,
                          },
                          'Priority support'
                        ),
                        ' for moderation and technical issues.'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__style__[
                        'E' /* PlanFooter */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 846,
                        },
                        __self: _this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                          'a' /* default */
                        ],
                        {
                          to: '/new/community',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 847,
                          },
                          __self: _this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_13__style__[
                            'D' /* PaidPrimaryCTA */
                          ],
                          {
                            icon: 'plus-fill',
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 848,
                            },
                            __self: _this,
                          },
                          'Create my community'
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        );
      };

      var ContactInfo = function ContactInfo() {
        var ThisContent = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['h' /* Content */]).withConfig({
          displayName: 'view__ThisContent',
          componentId: 'suq3ji-41',
        })(['flex-direction:column;align-items:center;> h2{margin:0 32px;}']);

        var Grid = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
          'c' /* default */
        ].div.withConfig({
          displayName: 'view__Grid',
          componentId: 'suq3ji-42',
        })([
          'margin:32px;display:grid;grid-template-columns:repeat(2,400px);grid-template-rows:repeat(2,minmax(240px,auto));grid-row-gap:32px;grid-column-gap:32px;@media (max-width:768px){margin:32px 0;align-self:stretch;grid-template-columns:1fr;grid-template-rows:repeat(4,minmax(240px,auto));}',
        ]);

        var HelpCard = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
          'c' /* default */
        ].div.withConfig({
          displayName: 'view__HelpCard',
          componentId: 'suq3ji-43',
        })(
          [
            'background-color:',
            ';box-shadow:0 8px 32px ',
            ";display:grid;grid-template-columns:1fr;grid-row-gap:16px;grid-template-rows:auto auto auto;grid-template-areas:'lede' 'flavor' 'button';padding:32px;justify-items:center;> a > button{font-size:16px;font-weight:700;align-self:end;}b{font-weight:700;}@media (max-width:768px){padding:32px auto;}",
          ],
          function(props) {
            return props.theme.bg.default;
          },
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__['p' /* hexa */]
            )(props.theme.brand.default, 0.2);
          }
        );

        var BugCard = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(HelpCard).withConfig({
          displayName: 'view__BugCard',
          componentId: 'suq3ji-44',
        })(
          [
            '',
            ' button{background-color:',
            ';background-image:',
            ';&:hover{box-shadow:0 4px 32px ',
            ';}}',
          ],
          '' /* box-shadow: 0 8px 32px ${props => hexa(props.theme.warn.dark, 0.2)}; */,
          function(props) {
            return props.theme.warn.alt;
          },
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__[
                'c' /* Gradient */
              ]
            )(props.theme.warn.alt, props.theme.warn.default);
          },
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__['p' /* hexa */]
            )(props.theme.warn.dark, 0.25);
          }
        );

        var FeatCard = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(HelpCard).withConfig({
          displayName: 'view__FeatCard',
          componentId: 'suq3ji-45',
        })(
          [
            '',
            ' button{background-color:',
            ';background-image:',
            ';&:hover{box-shadow:0 4px 32px ',
            ';}}',
          ],
          '' /* box-shadow: 0 8px 32px ${props => hexa(props.theme.success.dark, 0.2)}; */,
          function(props) {
            return props.theme.success.alt;
          },
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__[
                'c' /* Gradient */
              ]
            )(props.theme.success.alt, props.theme.success.default);
          },
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__['p' /* hexa */]
            )(props.theme.success.dark, 0.25);
          }
        );

        var EmailCard = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(HelpCard).withConfig({
          displayName: 'view__EmailCard',
          componentId: 'suq3ji-46',
        })(
          [
            '',
            ' button{background-color:',
            ';background-image:',
            ';&:hover{box-shadow:0 4px 32px ',
            ';}}',
          ],
          '' /* box-shadow: 0 8px 32px ${props => hexa(props.theme.special.dark, 0.2)}; */,
          function(props) {
            return props.theme.special.default;
          },
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__[
                'c' /* Gradient */
              ]
            )(props.theme.special.alt, props.theme.special.default);
          },
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__['p' /* hexa */]
            )(props.theme.special.dark, 0.25);
          }
        );

        var TweetCard = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(HelpCard).withConfig({
          displayName: 'view__TweetCard',
          componentId: 'suq3ji-47',
        })(
          [
            '',
            ' button{background-color:',
            ';background-image:',
            ';&:hover{box-shadow:0 4px 32px ',
            ';}}',
          ],
          '' /* box-shadow: 0 8px 32px ${props => hexa(props.theme.space.default, 0.2)}; */,
          function(props) {
            return props.theme.social.twitter.alt;
          },
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__[
                'c' /* Gradient */
              ]
            )(
              props.theme.social.twitter.alt,
              props.theme.social.twitter.default
            );
          },
          function(props) {
            return Object(
              __WEBPACK_IMPORTED_MODULE_7__components_globals__['p' /* hexa */]
            )(props.theme.space.dark, 0.25);
          }
        );

        var Lede = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
          'c' /* default */
        ].h4.withConfig({
          displayName: 'view__Lede',
          componentId: 'suq3ji-48',
        })(['font-size:24px;font-weight:900;text-align:center;']);

        var Flavor = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
          'c' /* default */
        ].p.withConfig({
          displayName: 'view__Flavor',
          componentId: 'suq3ji-49',
        })(['font-size:16px;text-align:center;']);

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          Section,
          {
            goop: 4,
            color: 'brand.alt',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 977,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_14__nav__['a' /* default */],
            {
              location: 'support',
              __source: {
                fileName: _jsxFileName,
                lineNumber: 978,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            ThisContent,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 979,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_13__style__['N' /* Tagline */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 980,
                },
                __self: _this,
              },
              'What can we help you with?'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              Grid,
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 981,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                BugCard,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 982,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Lede,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 983,
                    },
                    __self: _this,
                  },
                  'Find a bug?'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Flavor,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 984,
                    },
                    __self: _this,
                  },
                  'Join our ',
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'b',
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 985,
                      },
                      __self: _this,
                    },
                    'Hugs n Bugs'
                  ),
                  " channel to check if there's already a fix or report a new issue!"
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                    'a' /* default */
                  ],
                  {
                    to: '/spectrum/hugs-n-bugs',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 988,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      icon: 'bug',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 989,
                      },
                      __self: _this,
                    },
                    'Join spectrum/hugs-n-bugs'
                  )
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                FeatCard,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 992,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Lede,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 993,
                    },
                    __self: _this,
                  },
                  'Need some more features?'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Flavor,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 994,
                    },
                    __self: _this,
                  },
                  'Jump into our ',
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'b',
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 995,
                      },
                      __self: _this,
                    },
                    'Feature Requests'
                  ),
                  ' channel and tell us what you want or add onto existing requests from others!'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_2_src_components_link__[
                    'a' /* default */
                  ],
                  {
                    to: '/spectrum/feature-requests',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 998,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      icon: 'idea',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 999,
                      },
                      __self: _this,
                    },
                    'Join spectrum/feature-requests'
                  )
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                EmailCard,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1002,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Lede,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 1003,
                    },
                    __self: _this,
                  },
                  'Something else?'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Flavor,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 1004,
                    },
                    __self: _this,
                  },
                  "Concerned about something on Spectrum? Shoot us an email and we'll take care of it right away."
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'a',
                  {
                    href: 'mailto:support@spectrum.chat',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 1008,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      icon: 'email',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 1009,
                      },
                      __self: _this,
                    },
                    'Email support@spectrum.chat'
                  )
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                TweetCard,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1012,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Lede,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 1013,
                    },
                    __self: _this,
                  },
                  'Looking for updates?'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Flavor,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 1014,
                    },
                    __self: _this,
                  },
                  'We post news, release notes, and threads from all over Spectrum on Twitter!'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'a',
                  {
                    href: 'https://twitter.com/withspectrum',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 1018,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      icon: 'twitter',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 1019,
                      },
                      __self: _this,
                    },
                    '@withspectrum on Twitter'
                  )
                )
              )
            )
          )
        );
      };

      var TermsSection = function TermsSection() {
        var ThisContent = Object(
          __WEBPACK_IMPORTED_MODULE_1_styled_components__['c' /* default */]
        )(__WEBPACK_IMPORTED_MODULE_13__style__['h' /* Content */]).withConfig({
          displayName: 'view__ThisContent',
          componentId: 'suq3ji-50',
        })([
          'margin:32px;align-items:flex-start;justify-content:space-around;> p:not(:first-of-type){margin-top:0;}h1{margin-top:16px;font-size:24px;line-height:1.2;font-weight:900;}h2{font-size:18px;line-height:1.2;font-weight:900;margin-top:16px;margin-bottom:4px;}p,ul{font-size:18px;margin-top:8px;}li{margin-top:8px;}',
        ]);

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          Section,
          {
            background: 'brand',
            goop: 6,
            color: 'bg.reverse',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 1065,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            ThisContent,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1066,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_13__style__['i' /* Copy */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1067,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_6__components_terms__[
                  'a' /* default */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1068,
                  },
                  __self: _this,
                }
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_13__style__['i' /* Copy */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1070,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_5__components_privacy__[
                  'a' /* default */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1071,
                  },
                  __self: _this,
                }
              )
            )
          )
        );
      };

      /***/
    },
});
//# sourceMappingURL=9.96358f5c7f2339a17fbf.hot-update.js.map
