webpackHotUpdate(0, {
  /***/ './src/components/menu/style.js':
    /*!**************************************!*\
  !*** ./src/components/menu/style.js ***!
  \**************************************/
    /*! exports provided: Wrapper, Absolute, MenuContainer, MenuOverlay */
    /*! exports used: Absolute, MenuContainer, MenuOverlay, Wrapper */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return Wrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return Absolute;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return MenuContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return MenuOverlay;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_globals__ = __webpack_require__(
        /*! ../../components/globals */ './src/components/globals/index.js'
      );

      var Wrapper = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Wrapper',
        componentId: 'wya8k2-0',
      })(['display:inline-block;', ';'], function(props) {
        return (
          props.darkContext &&
          Object(
            __WEBPACK_IMPORTED_MODULE_0_styled_components__['b' /* css */]
          )(
            [
              '> button{color:',
              ';transition:',
              ';&:hover{color:',
              ';transform:scale(1.1);transition:',
              ';}}',
            ],
            function(props) {
              return props.theme.text.reverse;
            },
            __WEBPACK_IMPORTED_MODULE_1__components_globals__[
              'n' /* Transition */
            ].hover.off,
            function(props) {
              return props.theme.text.reverse;
            },
            __WEBPACK_IMPORTED_MODULE_1__components_globals__[
              'n' /* Transition */
            ].hover.on
          )
        );
      });

      var Absolute = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Absolute',
        componentId: 'wya8k2-1',
      })(
        [
          'display:',
          ';position:fixed;left:0;top:0;bottom:0;right:0;width:100vw;min-width:100vw;height:100%;min-height:100%;z-index:1;> button{color:',
          ';z-index:2;align-self:flex-start;margin-top:',
          ';margin-left:8px;}',
        ],
        function(props) {
          return props.open ? 'flex' : 'none';
        },
        function(props) {
          return props.theme.text.reverse;
        },
        function(props) {
          return props.hasNavBar ? '56px' : '8px';
        }
      );

      var MenuContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__MenuContainer',
        componentId: 'wya8k2-2',
      })(
        [
          'position:relative;display:flex;flex-direction:column;align-content:start;justify-content:stretch;left:0;top:0;bottom:0;height:',
          ';width:300px;color:',
          ';background-color:',
          ';background-image:',
          ';box-shadow:',
          ' ',
          ';padding-top:',
          ';z-index:',
          ';',
        ],
        function(props) {
          return props.hasTabBar ? 'calc(100% - 48px)' : '100%';
        },
        function(props) {
          return props.theme.brand.alt;
        },
        function(props) {
          return props.theme.bg.default;
        },
        function(props) {
          return Object(
            __WEBPACK_IMPORTED_MODULE_1__components_globals__[
              'c' /* Gradient */
            ]
          )(props.theme.bg.default, props.theme.bg.wash);
        },
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['j' /* Shadow */]
          .high,
        function(props) {
          return Object(
            __WEBPACK_IMPORTED_MODULE_1__components_globals__['p' /* hexa */]
          )(props.theme.bg.reverse, 0.25);
        },
        function(props) {
          return props.hasNavBar ? '48px' : '0';
        },
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['r' /* zIndex */]
          .fullscreen + 1
      );

      var MenuOverlay = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__MenuOverlay',
        componentId: 'wya8k2-3',
      })(
        [
          'position:absolute;left:0;top:0;bottom:0;right:0;width:100vw;min-width:100vw;height:100vh;min-height:100vh;background-color:',
          ';',
        ],
        function(props) {
          return Object(
            __WEBPACK_IMPORTED_MODULE_1__components_globals__['p' /* hexa */]
          )(props.theme.bg.reverse, 0.5);
        }
      );

      /***/
    },

  /***/ './src/views/dashboard/components/upsellExploreCommunities.js':
    /*!********************************************************************!*\
  !*** ./src/views/dashboard/components/upsellExploreCommunities.js ***!
  \********************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__explore_queries__ = __webpack_require__(
        /*! ../../explore/queries */ './src/views/explore/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_3_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__style__ = __webpack_require__(
        /*! ../style */ './src/views/dashboard/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_globals__ = __webpack_require__(
        /*! ../../../components/globals */ './src/components/globals/index.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/dashboard/components/upsellExploreCommunities.js';

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

      var getRandom = function getRandom(arr, n) {
        var result = new Array(n),
          len = arr.length,
          taken = new Array(len);
        if (n > len) return arr;
        while (n--) {
          var x = Math.floor(Math.random() * len);
          result[n] = arr[x in taken ? taken[x] : x];
          taken[x] = --len;
        }
        return result;
      };

      var UpsellExploreCommunities = (function(_React$Component) {
        _inherits(UpsellExploreCommunities, _React$Component);

        function UpsellExploreCommunities() {
          _classCallCheck(this, UpsellExploreCommunities);

          var _this = _possibleConstructorReturn(
            this,
            (
              UpsellExploreCommunities.__proto__ ||
              Object.getPrototypeOf(UpsellExploreCommunities)
            ).call(this)
          );

          _this.state = {
            communitiesToJoin: [],
          };
          return _this;
        }

        _createClass(UpsellExploreCommunities, [
          {
            key: 'shouldComponentUpdate',
            value: function shouldComponentUpdate(nextProps, nextState) {
              if (
                nextState.communitiesToJoin.length !==
                this.state.communitiesToJoin.length
              )
                return true;
              if (
                !this.props.data.topCommunities &&
                nextProps.data.topCommunities
              )
                return true;
              if (this.props.activeCommunity !== nextProps.activeCommunity)
                return true;
              return false;
            },
          },
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
              if (
                (!prevProps.data.topCommunities &&
                  this.props.data.topCommunities &&
                  this.props.data.topCommunities.length > 0) ||
                (this.props.data.topCommunities &&
                  this.state.communitiesToJoin.length === 0)
              ) {
                var joinedCommunityIds = this.props.communities.map(function(
                  c
                ) {
                  return c.id;
                });

                // don't upsell communities the user has already joined
                var filteredTopCommunities = this.props.data.topCommunities.filter(
                  function(c) {
                    return joinedCommunityIds.indexOf(c.id) < 0;
                  }
                );
                // get five random ones
                var randomTopCommunities = getRandom(filteredTopCommunities, 5);

                return this.setState({
                  communitiesToJoin: randomTopCommunities,
                });
              }

              if (
                prevProps.communities.length !== this.props.communities.length
              ) {
                var _joinedCommunityIds = this.props.communities.map(function(
                  c
                ) {
                  return c.id;
                });
                var filteredStateCommunities = this.state.communitiesToJoin.filter(
                  function(c) {
                    return _joinedCommunityIds.indexOf(c.id) < 0;
                  }
                );
                var _filteredTopCommunities = this.props.data.topCommunities.filter(
                  function(c) {
                    return _joinedCommunityIds.indexOf(c.id) < 0;
                  }
                );
                var newRandom = getRandom(_filteredTopCommunities, 1);
                var newArr = [].concat(
                  _toConsumableArray(filteredStateCommunities),
                  [newRandom[0]]
                );
                return this.setState({
                  communitiesToJoin: newArr,
                });
              }
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var activeCommunity = this.props.activeCommunity;
              var communitiesToJoin = this.state.communitiesToJoin;

              if (communitiesToJoin && communitiesToJoin.length > 0) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_6__components_globals__[
                    'b' /* FlexRow */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 90,
                    },
                    __self: this,
                  },
                  communitiesToJoin.map(function(c) {
                    return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_5__style__[
                        'g' /* CommunityListAvatar */
                      ],
                      {
                        active: c.id === activeCommunity,
                        src: c.profilePhoto,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 93,
                        },
                        __self: _this2,
                      }
                    );
                  })
                );
              }

              return null;
            },
          },
        ]);

        return UpsellExploreCommunities;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_3_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_1__explore_queries__[
          'b' /* getTopCommunities */
        ],
        __WEBPACK_IMPORTED_MODULE_4__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(UpsellExploreCommunities);

      /***/
    },

  /***/ './src/views/dashboardThread/style.js':
    /*!********************************************!*\
  !*** ./src/views/dashboardThread/style.js ***!
  \********************************************/
    /*! exports provided: Container, Thread, NullContainer, NullThread, Heading, Subheading */
    /*! exports used: Container, Thread */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return Container;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return Thread;
        }
      );
      /* unused harmony export NullContainer */
      /* unused harmony export NullThread */
      /* unused harmony export Heading */
      /* unused harmony export Subheading */
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_globals__ = __webpack_require__(
        /*! ../../components/globals */ './src/components/globals/index.js'
      );

      // $FlowFixMe

      var Container = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Container',
        componentId: 's1nebi9a-0',
      })([
        'display:flex;flex:auto;align-self:stretch;overflow-y:hidden;height:100%;max-height:100%;position:relative;',
      ]);

      var Thread = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Thread',
        componentId: 's1nebi9a-1',
      })(
        [
          'display:flex;background:',
          ';flex:auto;z-index:',
          ';flex-direction:column;max-width:100%;',
        ],
        function(props) {
          return props.theme.bg.wash;
        },
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['r' /* zIndex */]
          .chrome - 2
      );

      var NullContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__NullContainer',
        componentId: 's1nebi9a-2',
      })([
        'display:flex;flex:auto;align-self:stretch;overflow-y:hidden;padding:32px;height:100%;',
      ]);

      var NullThread = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__NullThread',
        componentId: 's1nebi9a-3',
      })(
        [
          'display:flex;flex:auto;z-index:',
          ';flex-direction:column;max-width:100%;border-radius:8px;align-items:center;justify-content:center;button{padding:16px 24px;font-size:18px;font-weight:600;}',
        ],
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['r' /* zIndex */]
          .slider + 3
      );

      var Heading = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h3.withConfig({
        displayName: 'style__Heading',
        componentId: 's1nebi9a-4',
      })(
        [
          'font-size:24px;font-weight:700;color:',
          ';margin:48px 24px 16px;text-align:center;',
        ],
        function(props) {
          return props.theme.text.default;
        }
      );

      var Subheading = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h4.withConfig({
        displayName: 'style__Subheading',
        componentId: 's1nebi9a-5',
      })(
        [
          'font-size:18px;font-weight:400;color:',
          ';margin:0 48px 32px;max-width:600px;text-align:center;',
        ],
        function(props) {
          return props.theme.text.alt;
        }
      );

      /***/
    },
});
//# sourceMappingURL=0.96358f5c7f2339a17fbf.hot-update.js.map
