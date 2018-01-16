webpackJsonp([15], {
  /***/ './src/views/pages/style.js':
    /*!**********************************!*\
  !*** ./src/views/pages/style.js ***!
  \**********************************/
    /*! exports provided: PageContainer, Section, Heading, Subheading, PropsList, ComponentContainer, Component, Code, Swatch, Spacer */
    /*! exports used: Code, Component, ComponentContainer, Heading, PageContainer, PropsList, Section, Subheading, Swatch */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return PageContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'g',
        function() {
          return Section;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return Heading;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'h',
        function() {
          return Subheading;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'f',
        function() {
          return PropsList;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return ComponentContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return Component;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return Code;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'i',
        function() {
          return Swatch;
        }
      );
      /* unused harmony export Spacer */
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* eslint no-eval: 0 */

      var PageContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__PageContainer',
        componentId: 's1qb1h7s-0',
      })([
        'width:100%;height:100%;display:flex;flex:0 0 auto;flex-direction:column;',
      ]);

      var Section = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].section.withConfig({
        displayName: 'style__Section',
        componentId: 's1qb1h7s-1',
      })(
        [
          'display:flex;flex-direction:',
          ';padding:',
          ';width:100%;flex:0 0 auto;border-bottom:1px solid ',
          ';flex-wrap:wrap;',
        ],
        function(props) {
          return props.container ? 'column' : 'row';
        },
        function(props) {
          return props.container ? '32px' : '0';
        },
        function(props) {
          return props.container ? props.theme.bg.border : 'transparent';
        }
      );

      var Heading = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h2.withConfig({
        displayName: 'style__Heading',
        componentId: 's1qb1h7s-2',
      })(
        [
          'font-size:32px;font-weight:900;line-height:1.4;display:block;margin-bottom:16px;margin-left:8px;color:',
          ';',
        ],
        function(props) {
          return props.theme.text.default;
        }
      );

      var Subheading = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h3.withConfig({
        displayName: 'style__Subheading',
        componentId: 's1qb1h7s-3',
      })(
        [
          'margin-left:8px;margin-bottom:8px;font-size:14px;text-transform:uppercase;font-weight:800;color:',
          ';',
        ],
        function(props) {
          return props.theme.text.alt;
        }
      );

      var PropsList = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].ul.withConfig({
        displayName: 'style__PropsList',
        componentId: 's1qb1h7s-4',
      })(
        [
          'font-size:14px;font-weight:400;margin-left:8px;margin-bottom:32px;p{max-width:500px;margin-top:4px;line-height:1.6;}li{list-style-type:none;margin:16px 0;}li:first-child{margin-top:0;}li:last-child{margin-bottom:0;}code{display:inline;background:#eef1f5;border-radius:4px;padding:0 4px 2px;line-height:1;border:1px solid ',
          ';}pre{background:#fff;border:1px solid ',
          ';display:inline-block;font-size:14px;padding:2px 8px;border-radius:4px;}',
        ],
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.theme.bg.border;
        }
      );

      var ComponentContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__ComponentContainer',
        componentId: 's1qb1h7s-5',
      })(
        [
          'background:',
          ';border-radius:4px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);flex-grow:1;margin:8px;width:calc( ',
          ' );max-width:calc(50% - 16px);',
        ],
        function(props) {
          return props.theme.bg.wash;
        },
        function(props) {
          return props.width ? props.width + ' - 16px' : '50% - 16px';
        }
      );

      var Component = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Component',
        componentId: 's1qb1h7s-6',
      })(
        [
          'background:',
          ';padding:16px;border-bottom:1px solid ',
          ';display:flex;position:relative;align-items:center;justify-content:center;',
        ],
        function(props) {
          return props.reverse
            ? props.theme.text.default
            : props.transparent ? 'transparent' : '#fff';
        },
        function(props) {
          return props.reverse ? 'none' : props.theme.bg.border;
        }
      );

      var Code = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Code',
        componentId: 's1qb1h7s-7',
      })([
        'margin:8px;border-radius:4px;padding:16px;background:#282c34;color:#abb2bf;cursor:pointer;font-family:monospace;font-size:14px;line-height:1.4;font-weight:500;width:calc(100% - 16px);&::-moz-selection{background:#2c323d;color:#ffffff;}&::selection{background:#2c323d;color:#ffffff;}',
      ]);

      var Swatch = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__Swatch',
        componentId: 's1qb1h7s-8',
      })(
        [
          'width:100%;height:48px;border-radius:4px;background-color:',
          ';',
          ';',
        ],
        function(props) {
          return eval('props.theme.' + props.color);
        },
        function(props) {
          return props.color === 'bg.default' || props.color === 'text.reverse'
            ? 'border: 1px solid ' + props.theme.bg.border
            : '';
        }
      );

      var Spacer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Spacer',
        componentId: 's1qb1h7s-9',
      })(['height:', ';'], function(props) {
        return props.height;
      });

      /***/
    },

  /***/ './src/views/pages/styleGuide.js':
    /*!***************************************!*\
  !*** ./src/views/pages/styleGuide.js ***!
  \***************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_withHandlers__ = __webpack_require__(
        /*! recompose/withHandlers */ './node_modules/recompose/withHandlers.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_withHandlers___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_2_recompose_withHandlers__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style__ = __webpack_require__(
        /*! ./style */ './src/views/pages/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_icons__ = __webpack_require__(
        /*! ../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_buttons__ = __webpack_require__(
        /*! ../../components/buttons */ './src/components/buttons/index.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/pages/styleGuide.js',
        _this = this;

      // $FlowFixMe

      // $FlowFixMe

      var enhance = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_2_recompose_withHandlers___default()({
          highlightAndCopy: function highlightAndCopy(props) {
            return function(e) {
              var range = document.createRange();
              range.selectNode(e.target);
              window.getSelection().addRange(range);
              document.execCommand('copy');
            };
          },
          toString: function toString(props) {
            return function(e) {};
          },
        })
      );

      var glyphList = [
        'attachment',
        'channel',
        'channel-private',
        'checkbox',
        'checkmark',
        'community',
        'delete',
        'door-enter',
        'door-leave',
        'down',
        'down-fill',
        'edit',
        'emoji',
        'everything',
        'explore',
        'facebook',
        'flag',
        'flag-fill',
        'freeze',
        'home',
        'like',
        'like-fill',
        'link',
        'logo',
        'menu',
        'message',
        'message-fill',
        'message-new',
        'minus',
        'minus-fill',
        'notification',
        'notification-fill',
        'payment',
        'person',
        'photo',
        'photo-fill',
        'plus',
        'plus-fill',
        'post',
        'post-cancel',
        'post-fill',
        'private',
        'private-unlocked',
        'profile',
        'profile-fill',
        'search',
        'send',
        'send-fill',
        'settings',
        'share',
        'twitter',
        'up',
        'up-fill',
        'view-back',
        'view-close',
        'view-forward',
        'view-reload',
      ];

      var StyleGuidePure = enhance(function(_ref) {
        var highlightAndCopy = _ref.highlightAndCopy,
          toString = _ref.toString;
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_3__style__['e' /* PageContainer */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 94,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3__style__['g' /* Section */],
            {
              container: true,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 96,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['d' /* Heading */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 97,
                },
                __self: _this,
              },
              'Colors'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['h' /* Subheading */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 98,
                },
                __self: _this,
              },
              'Palette'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['g' /* Section */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 99,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 100,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 101,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'brand.default',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 102,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 104,
                    },
                    __self: _this,
                  },
                  'props.theme.brand.default'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 107,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 108,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'brand.alt',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 109,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 111,
                    },
                    __self: _this,
                  },
                  'props.theme.brand.alt'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 114,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 115,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'space.dark',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 116,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 118,
                    },
                    __self: _this,
                  },
                  'props.theme.space.dark'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 121,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 122,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'space.alt',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 123,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 125,
                    },
                    __self: _this,
                  },
                  'props.theme.space.alt'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 128,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 129,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'brand.wash',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 130,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 132,
                    },
                    __self: _this,
                  },
                  'props.theme.brand.wash'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 135,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 136,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'warn.default',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 137,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 139,
                    },
                    __self: _this,
                  },
                  'props.theme.warn.default'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 142,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 143,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'warn.alt',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 144,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 146,
                    },
                    __self: _this,
                  },
                  'props.theme.warn.alt'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 149,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 150,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'success.default',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 151,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 153,
                    },
                    __self: _this,
                  },
                  'props.theme.success.default'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 158,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 159,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'success.alt',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 160,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 162,
                    },
                    __self: _this,
                  },
                  'props.theme.success.alt'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 165,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 166,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'bg.default',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 167,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 169,
                    },
                    __self: _this,
                  },
                  'props.theme.bg.default'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 172,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 173,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'bg.reverse',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 174,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 176,
                    },
                    __self: _this,
                  },
                  'props.theme.bg.reverse'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 179,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 180,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'bg.wash',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 181,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 183,
                    },
                    __self: _this,
                  },
                  'props.theme.bg.wash'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 186,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 187,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'text.default',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 188,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 190,
                    },
                    __self: _this,
                  },
                  'props.theme.text.default'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 193,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 194,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'text.alt',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 195,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 197,
                    },
                    __self: _this,
                  },
                  'props.theme.text.alt'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 200,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 201,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'text.reverse',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 202,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 204,
                    },
                    __self: _this,
                  },
                  'props.theme.text.reverse'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 207,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 208,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'text.placeholder',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 209,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 211,
                    },
                    __self: _this,
                  },
                  'props.theme.text.placeholder'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 216,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 217,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'generic.default',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 218,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 220,
                    },
                    __self: _this,
                  },
                  'props.theme.generic.default'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 225,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 226,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'generic.alt',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 227,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 229,
                    },
                    __self: _this,
                  },
                  'props.theme.generic.alt'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 232,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 233,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'bg.inactive',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 234,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 236,
                    },
                    __self: _this,
                  },
                  'props.theme.bg.inactive'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 239,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 240,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'bg.border',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 241,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 243,
                    },
                    __self: _this,
                  },
                  'props.theme.bg.border'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 246,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 247,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'social.facebook.default',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 248,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 250,
                    },
                    __self: _this,
                  },
                  'props.theme.social.facebook.default'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  width: '25%',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 255,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 256,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['i' /* Swatch */],
                    {
                      color: 'social.twitter.default',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 257,
                      },
                      __self: _this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 259,
                    },
                    __self: _this,
                  },
                  'props.theme.social.twitter.default'
                )
              )
            )
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3__style__['g' /* Section */],
            {
              container: true,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 267,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['d' /* Heading */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 268,
                },
                __self: _this,
              },
              'Icons'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['h' /* Subheading */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 269,
                },
                __self: _this,
              },
              'Props'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['f' /* PropsList */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 271,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'li',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 272,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'pre',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 273,
                    },
                    __self: _this,
                  },
                  'glyph: String'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'p',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 274,
                    },
                    __self: _this,
                  },
                  'Gets passed into a switch statement which will return the proper svg path .'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'li',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 279,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'pre',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 280,
                    },
                    __self: _this,
                  },
                  'size: Int'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'p',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 281,
                    },
                    __self: _this,
                  },
                  'Describes the size (in px) that an icon should be rendered at. Use only with ',
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'pre',
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 283,
                      },
                      __self: _this,
                    },
                    '-fill'
                  ),
                  ' variants - stroked icons are drawn at specific sizes to maintain consistent stroke width and level of detail.'
                )
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['h' /* Subheading */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 290,
                },
                __self: _this,
              },
              'Examples'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['g' /* Section */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 291,
                },
                __self: _this,
              },
              glyphList.map(function(glyph, i) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__[
                    'c' /* ComponentContainer */
                  ],
                  {
                    key: i,
                    width: '25%',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 294,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 295,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_4__components_icons__[
                        'a' /* default */
                      ],
                      {
                        glyph: glyph,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 296,
                        },
                        __self: _this,
                      }
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                    {
                      onClick: highlightAndCopy,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 298,
                      },
                      __self: _this,
                    },
                    "<Icon glyph='" + glyph + "' />"
                  )
                );
              })
            )
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3__style__['g' /* Section */],
            {
              container: true,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 308,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['d' /* Heading */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 309,
                },
                __self: _this,
              },
              'Buttons'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['h' /* Subheading */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 310,
                },
                __self: _this,
              },
              'Props'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['f' /* PropsList */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 312,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'li',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 313,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'pre',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 314,
                    },
                    __self: _this,
                  },
                  "size: 'small' | 'large'"
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'p',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 315,
                    },
                    __self: _this,
                  },
                  'Adjusts padding for different contexts. Defaults to a midway size between small and large.'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'li',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 320,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'pre',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 321,
                    },
                    __self: _this,
                  },
                  'disabled: Boolean'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'p',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 322,
                    },
                    __self: _this,
                  },
                  'Lowers opacity and turns off interactions while disabled.'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'li',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 324,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'pre',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 325,
                    },
                    __self: _this,
                  },
                  'loading: Boolean'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'p',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 326,
                    },
                    __self: _this,
                  },
                  'Replaces the button label or button icon with an inline spinner.'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'li',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 330,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'pre',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 331,
                    },
                    __self: _this,
                  },
                  'icon: String'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'p',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 332,
                    },
                    __self: _this,
                  },
                  'Insert an icon into the button using any library icon.'
                )
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['h' /* Subheading */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 336,
                },
                __self: _this,
              },
              'All Buttons'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_3__style__['g' /* Section */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 337,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 338,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 339,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 340,
                      },
                      __self: _this,
                    },
                    'Button'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 342,
                    },
                    __self: _this,
                  },
                  '<Button>Button</Button>'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 345,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 346,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      color: 'warn',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 347,
                      },
                      __self: _this,
                    },
                    'Button'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 349,
                    },
                    __self: _this,
                  },
                  "<Button color={'warn'}>Button</Button>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 354,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 355,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      color: 'pro',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 356,
                      },
                      __self: _this,
                    },
                    'Button'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 358,
                    },
                    __self: _this,
                  },
                  "<Button color={'pro'}>Button</Button>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 363,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 364,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      color: 'success',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 365,
                      },
                      __self: _this,
                    },
                    'Button'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 367,
                    },
                    __self: _this,
                  },
                  "<Button color={'success'}>Button</Button>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 372,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 373,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'e' /* OutlineButton */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 374,
                      },
                      __self: _this,
                    },
                    'Outline Button'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 376,
                    },
                    __self: _this,
                  },
                  '<OutlineButton>Outline Button</OutlineButton>'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 381,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 382,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'e' /* OutlineButton */
                    ],
                    {
                      color: 'warn',
                      icon: 'post',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 383,
                      },
                      __self: _this,
                    },
                    'Outline Button with Icon'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 387,
                    },
                    __self: _this,
                  },
                  "<OutlineButton color={'warn'} icon={'post'}>Outline Button with Icon</OutlineButton>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 392,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 393,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'e' /* OutlineButton */
                    ],
                    {
                      color: 'pro',
                      icon: 'post',
                      loading: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 394,
                      },
                      __self: _this,
                    },
                    'Loading Outline Button with Icon'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 398,
                    },
                    __self: _this,
                  },
                  "<OutlineButton color={'pro'} icon={'post'} loading={true}>Loading Outline Button with Icon</OutlineButton>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 403,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 404,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'f' /* TextButton */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 405,
                      },
                      __self: _this,
                    },
                    'Button'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 407,
                    },
                    __self: _this,
                  },
                  '<TextButton>Button</TextButton>'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 412,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 413,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'f' /* TextButton */
                    ],
                    {
                      icon: 'messages',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 414,
                      },
                      __self: _this,
                    },
                    'Link Button with Icon'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 416,
                    },
                    __self: _this,
                  },
                  "<TextButton icon={'messages'}>Link Button with Icon</TextButton>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 421,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 422,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'f' /* TextButton */
                    ],
                    {
                      icon: 'messages',
                      loading: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 423,
                      },
                      __self: _this,
                    },
                    'Loading Link Button with Icon'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 427,
                    },
                    __self: _this,
                  },
                  "<TextButton icon={'messages'} loading={true}>Loading Link Button with Icon</TextButton>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 432,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 433,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      loading: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 434,
                      },
                      __self: _this,
                    },
                    'Button Loading'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 436,
                    },
                    __self: _this,
                  },
                  '<Button loading={true}>Button Loading</Button>'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 441,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 442,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      icon: 'messages',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 443,
                      },
                      __self: _this,
                    },
                    'Button with Icon'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 445,
                    },
                    __self: _this,
                  },
                  "<Button icon={'messages'}>Button with Icon</Button>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 450,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 451,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      disabled: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 452,
                      },
                      __self: _this,
                    },
                    'Button Disabled'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 454,
                    },
                    __self: _this,
                  },
                  '<Button disabled={true}>Button Disabled</Button>'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 459,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 460,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      size: 'small',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 461,
                      },
                      __self: _this,
                    },
                    'Button Small'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 463,
                    },
                    __self: _this,
                  },
                  "<Button size={'small'}>Button Small</Button>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 468,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 469,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      size: 'small',
                      loading: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 470,
                      },
                      __self: _this,
                    },
                    'Button Small Loading'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 474,
                    },
                    __self: _this,
                  },
                  "<Button size={'small'} loading={true}>Button Small Loading</Button>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 479,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 480,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      size: 'small',
                      icon: 'share',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 481,
                      },
                      __self: _this,
                    },
                    'Button Small wtih Icon'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 485,
                    },
                    __self: _this,
                  },
                  "<Button size={'small'} icon={'share'}>Button Small wtih Icon</Button>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 490,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 491,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      size: 'large',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 492,
                      },
                      __self: _this,
                    },
                    'Button Large'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 494,
                    },
                    __self: _this,
                  },
                  "<Button size={'large'}>Button Large</Button>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 499,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 500,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      size: 'large',
                      icon: 'explore',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 501,
                      },
                      __self: _this,
                    },
                    'Button Large with Icon'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 505,
                    },
                    __self: _this,
                  },
                  "<Button size={'large'} icon={'explore'}>Button Large with Icon</Button>"
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__style__[
                  'c' /* ComponentContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 510,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['b' /* Component */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 511,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      size: 'large',
                      loading: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 512,
                      },
                      __self: _this,
                    },
                    'Button Large Loading'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__style__['a' /* Code */],
                  {
                    onClick: highlightAndCopy,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 516,
                    },
                    __self: _this,
                  },
                  "<Button size={'large'} loading={true}>Button Large Loading</Button>"
                )
              )
            )
          )
        );
      });

      var StyleGuide = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()()(
        StyleGuidePure
      );
      /* harmony default export */ __webpack_exports__['default'] = StyleGuide;

      /***/
    },
});
//# sourceMappingURL=StyleGuide.chunk.js.map
