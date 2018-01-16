webpackJsonp([13], {
  /***/ './src/components/editForm/style.js':
    /*!******************************************!*\
  !*** ./src/components/editForm/style.js ***!
  \******************************************/
    /*! exports provided: StyledCard, Form, FormTitle, Subtitle, Description, TertiaryActionContainer, Actions, PhotoPreview, GeneralNotice, ImageInputWrapper, Location, Loading */
    /*! exports used: Actions, Description, Form, FormTitle, GeneralNotice, ImageInputWrapper, Loading, Location, StyledCard, TertiaryActionContainer */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'i',
        function() {
          return StyledCard;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return Form;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return FormTitle;
        }
      );
      /* unused harmony export Subtitle */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return Description;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'j',
        function() {
          return TertiaryActionContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return Actions;
        }
      );
      /* unused harmony export PhotoPreview */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return GeneralNotice;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'f',
        function() {
          return ImageInputWrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'h',
        function() {
          return Location;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'g',
        function() {
          return Loading;
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

      var StyledCard = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_1__card__['b' /* default */]).withConfig({
        displayName: 'style__StyledCard',
        componentId: 's1ir041a-0',
      })(['padding:16px;']);

      var Form = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].form.withConfig({
        displayName: 'style__Form',
        componentId: 's1ir041a-1',
      })([
        'display:inline-block;flex-direction:column;align-self:stretch;flex:none;max-width:100%;',
      ]);

      var FormTitle = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h1.withConfig({
        displayName: 'style__FormTitle',
        componentId: 's1ir041a-2',
      })(
        [
          'font-size:20px;color:',
          ';font-weight:800;line-height:1.2;flex:1 0 auto;',
          ';',
        ],
        function(props) {
          return props.theme.text.default;
        },
        __WEBPACK_IMPORTED_MODULE_2__globals__['o' /* Truncate */]
      );

      var Subtitle = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h4.withConfig({
        displayName: 'style__Subtitle',
        componentId: 's1ir041a-3',
      })(
        ['font-size:14px;color:', ';line-height:1.3;width:100%;', ';'],
        function(props) {
          return props.theme.text.alt;
        },
        __WEBPACK_IMPORTED_MODULE_2__globals__['o' /* Truncate */]
      );

      var Description = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].p.withConfig({
        displayName: 'style__Description',
        componentId: 's1ir041a-4',
      })(
        [
          'font-size:14px;color:',
          ';padding:8px 0 16px;line-height:1.4;a{color:',
          ';}',
        ],
        function(props) {
          return props.theme.text.default;
        },
        function(props) {
          return props.theme.brand.default;
        }
      );

      var TertiaryActionContainer = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_2__globals__['b' /* FlexRow */]).withConfig({
        displayName: 'style__TertiaryActionContainer',
        componentId: 's1ir041a-5',
      })(['justify-content:flex-start;flex-grow:1;']);

      var Actions = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_2__globals__['b' /* FlexRow */]).withConfig({
        displayName: 'style__Actions',
        componentId: 's1ir041a-6',
      })(
        [
          'margin-top:24px;justify-content:flex-start;flex-direction:row-reverse;border-top:1px solid ',
          ';padding-top:16px;button + button{margin-left:8px;}',
        ],
        function(props) {
          return props.theme.bg.border;
        }
      );

      var PhotoPreview = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__PhotoPreview',
        componentId: 's1ir041a-7',
      })(
        [
          "position:relative;width:48px;height:48px;object-fit:cover;border-radius:4px;background-image:url('",
          "')",
        ],
        function(props) {
          return props.src;
        }
      );

      var GeneralNotice = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__GeneralNotice',
        componentId: 's1ir041a-8',
      })(
        [
          'padding:8px 12px;font-size:12px;font-weight:500;color:',
          ';background:',
          ';border-radius:4px;margin-top:24px;line-height:1.4;display:inline-block;',
        ],
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.bg.wash;
        }
      );

      var ImageInputWrapper = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_2__globals__['a' /* FlexCol */]).withConfig({
        displayName: 'style__ImageInputWrapper',
        componentId: 's1ir041a-9',
      })([
        'position:relative;flex:0 0 auto;margin-top:8px;margin-bottom:24px;> label:nth-of-type(2){position:absolute;bottom:-24px;left:24px;}',
      ]);

      var Location = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(__WEBPACK_IMPORTED_MODULE_2__globals__['b' /* FlexRow */]).withConfig({
        displayName: 'style__Location',
        componentId: 's1ir041a-10',
      })(
        [
          'font-weight:500;color:',
          ';font-size:14px;margin-bottom:8px;> div{color:',
          ';}> span{padding:0 4px;color:',
          ';}> a:hover{color:',
          ';text-decoration:underline;}@media (max-width:768px){display:none;}',
        ],
        function(_ref) {
          var theme = _ref.theme;
          return theme.text.alt;
        },
        function(_ref2) {
          var theme = _ref2.theme;
          return theme.text.placeholder;
        },
        function(_ref3) {
          var theme = _ref3.theme;
          return theme.text.placeholder;
        },
        function(_ref4) {
          var theme = _ref4.theme;
          return theme.brand.alt;
        }
      );

      var Loading = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__Loading',
        componentId: 's1ir041a-11',
      })(['display:inline-block;position:absolute;right:19px;top:45px;']);

      /***/
    },

  /***/ './src/components/settingsViews/header.js':
    /*!************************************************!*\
  !*** ./src/components/settingsViews/header.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style__ = __webpack_require__(
        /*! ./style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__avatar__ = __webpack_require__(
        /*! ../avatar */ './src/components/avatar/index.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/components/settingsViews/header.js';

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

      var Header = (function(_React$Component) {
        _inherits(Header, _React$Component);

        function Header() {
          _classCallCheck(this, Header);

          return _possibleConstructorReturn(
            this,
            (Header.__proto__ || Object.getPrototypeOf(Header)).apply(
              this,
              arguments
            )
          );
        }

        _createClass(Header, [
          {
            key: 'render',
            value: function render() {
              var _props = this.props,
                avatar = _props.avatar,
                subheading = _props.subheading,
                heading = _props.heading;

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_2__style__['k' /* StyledHeader */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 23,
                  },
                  __self: this,
                },
                avatar &&
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_3__avatar__['a' /* default */],
                    {
                      community: avatar.community,
                      src: avatar.profilePhoto,
                      size: '48',
                      radius: 8,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 25,
                      },
                      __self: this,
                    }
                  ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_2__style__['c' /* HeaderText */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 32,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                      'a' /* default */
                    ],
                    {
                      to: subheading.to,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 33,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_2__style__[
                        'm' /* Subheading */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 34,
                        },
                        __self: this,
                      },
                      subheading.label
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_2__style__['d' /* Heading */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 36,
                      },
                      __self: this,
                    },
                    heading
                  )
                )
              );
            },
          },
        ]);

        return Header;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__['a'] = Header;

      /***/
    },

  /***/ './src/components/settingsViews/subnav.js':
    /*!************************************************!*\
  !*** ./src/components/settingsViews/subnav.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style__ = __webpack_require__(
        /*! ./style */ './src/components/settingsViews/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/components/settingsViews/subnav.js';

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

      var Subnav = (function(_React$Component) {
        _inherits(Subnav, _React$Component);

        function Subnav() {
          _classCallCheck(this, Subnav);

          return _possibleConstructorReturn(
            this,
            (Subnav.__proto__ || Object.getPrototypeOf(Subnav)).apply(
              this,
              arguments
            )
          );
        }

        _createClass(Subnav, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                activeTab = _props.activeTab,
                items = _props.items;

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_2__style__['l' /* StyledSubnav */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 21,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_2__style__['n' /* SubnavList */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 22,
                    },
                    __self: this,
                  },
                  items.map(function(item, i) {
                    return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_2__style__[
                        'o' /* SubnavListItem */
                      ],
                      {
                        key: i,
                        active: activeTab === item.activeLabel,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 25,
                        },
                        __self: _this2,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                          'a' /* default */
                        ],
                        {
                          to: item.to,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 26,
                          },
                          __self: _this2,
                        },
                        item.label
                      )
                    );
                  })
                )
              );
            },
          },
        ]);

        return Subnav;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__['a'] = Subnav;

      /***/
    },

  /***/ './src/components/threadFeed/style.js':
    /*!********************************************!*\
  !*** ./src/components/threadFeed/style.js ***!
  \********************************************/
    /*! exports provided: FetchMoreButton, Divider */
    /*! exports used: Divider, FetchMoreButton */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return FetchMoreButton;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return Divider;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__buttons__ = __webpack_require__(
        /*! ../buttons */ './src/components/buttons/index.js'
      );

      // $FlowFixMe

      var FetchMoreButton = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__buttons__['e' /* OutlineButton */]
      ).withConfig({
        displayName: 'style__FetchMoreButton',
        componentId: 'cit1tg-0',
      })(
        [
          'width:100%;padding:16px 0;@media (max-width:768px){padding:32px 0;border-radius:0;background:#fff;font-size:16px;font-weight:600;color:',
          ';border:none;box-shadow:none;border-top:2px solid ',
          ';&:hover{background:',
          ';border-radius:0;box-shadow:none;}}',
        ],
        function(props) {
          return props.theme.brand.default;
        },
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.theme.bg.wash;
        }
      );

      var Divider = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Divider',
        componentId: 'cit1tg-1',
      })(
        [
          'border-bottom:2px solid ',
          ';width:100%;display:block;padding-top:24px;margin-bottom:24px;',
        ],
        function(props) {
          return props.theme.bg.border;
        }
      );

      /***/
    },

  /***/ './src/views/channelSettings/components/blockedUsers.js':
    /*!**************************************************************!*\
  !*** ./src/views/channelSettings/components/blockedUsers.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_listItems__ = __webpack_require__(
        /*! ../../../components/listItems */ './src/components/listItems/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__api_channel__ = __webpack_require__(
        /*! ../../../api/channel */ './src/api/channel.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_viewError__ = __webpack_require__(
        /*! ../../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/channelSettings/components/blockedUsers.js';

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

      var BlockedUsers = (function(_React$Component) {
        _inherits(BlockedUsers, _React$Component);

        function BlockedUsers() {
          _classCallCheck(this, BlockedUsers);

          return _possibleConstructorReturn(
            this,
            (
              BlockedUsers.__proto__ || Object.getPrototypeOf(BlockedUsers)
            ).apply(this, arguments)
          );
        }

        _createClass(BlockedUsers, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                data = _props.data,
                unblock = _props.unblock,
                isLoading = _props.isLoading;

              if (data && data.channel) {
                var _blockedUsers = data.channel.blockedUsers;

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_6__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 38,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_6__components_settingsViews_style__[
                      'i' /* SectionTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 39,
                      },
                      __self: this,
                    },
                    'Blocked Users'
                  ),
                  _blockedUsers.length > 0 &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                        'd' /* Description */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 41,
                        },
                        __self: this,
                      },
                      'Blocked users can not see threads or messages posted in this channel. They will still be able to join any other public channels in the Spectrum community and request access to other private channels.'
                    ),
                  _blockedUsers.length > 0 &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                        'n' /* Notice */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 50,
                        },
                        __self: this,
                      },
                      'Unblocking a user will ',
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        'b',
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 51,
                          },
                          __self: this,
                        },
                        'not'
                      ),
                      ' add them to this channel. It will only allow them to re-request access in the future as long as this channel remains private.'
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                      'h' /* ListContainer */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 57,
                      },
                      __self: this,
                    },
                    _blockedUsers &&
                      _blockedUsers.map(function(user) {
                        return __WEBPACK_IMPORTED_MODULE_0_react__[
                          'createElement'
                        ](
                          'section',
                          {
                            key: user.id,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 61,
                            },
                            __self: _this2,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_2__components_listItems__[
                              'g' /* UserListItem */
                            ],
                            {
                              user: user,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 62,
                              },
                              __self: _this2,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_3__components_buttons__[
                                'f' /* TextButton */
                              ],
                              {
                                onClick: function onClick() {
                                  return unblock(user.id);
                                },
                                label: true,
                                hoverColor: 'warn.alt',
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 63,
                                },
                                __self: _this2,
                              },
                              'Unblock'
                            )
                          )
                        );
                      }),
                    _blockedUsers.length <= 0 &&
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                          'd' /* Description */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 76,
                          },
                          __self: this,
                        },
                        'There are no blocked users in this channel.'
                      )
                  )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_6__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 87,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__components_loading__[
                      'a' /* Loading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 88,
                      },
                      __self: this,
                    }
                  )
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_6__components_settingsViews_style__[
                  'f' /* SectionCard */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 94,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_viewError__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 95,
                    },
                    __self: this,
                  }
                )
              );
            },
          },
        ]);

        return BlockedUsers;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_5__api_channel__[
          'e' /* getBlockedUsersQuery */
        ],
        __WEBPACK_IMPORTED_MODULE_7__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(BlockedUsers);

      /***/
    },

  /***/ './src/views/channelSettings/components/channelMembers.js':
    /*!****************************************************************!*\
  !*** ./src/views/channelSettings/components/channelMembers.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_listItems__ = __webpack_require__(
        /*! ../../../components/listItems */ './src/components/listItems/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_2_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__api_channel__ = __webpack_require__(
        /*! ../../../api/channel */ './src/api/channel.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_threadFeed_style__ = __webpack_require__(
        /*! ../../../components/threadFeed/style */ './src/components/threadFeed/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_viewError__ = __webpack_require__(
        /*! ../../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/channelSettings/components/channelMembers.js';

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

      var ChannelMembers = (function(_Component) {
        _inherits(ChannelMembers, _Component);

        function ChannelMembers() {
          _classCallCheck(this, ChannelMembers);

          return _possibleConstructorReturn(
            this,
            (
              ChannelMembers.__proto__ || Object.getPrototypeOf(ChannelMembers)
            ).apply(this, arguments)
          );
        }

        _createClass(ChannelMembers, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                _props$data = _props.data,
                channel = _props$data.channel,
                fetchMore = _props$data.fetchMore,
                data = _props.data,
                isLoading = _props.isLoading,
                isFetchingMore = _props.isFetchingMore;

              if (data && data.channel) {
                var members =
                  channel.memberConnection &&
                  channel.memberConnection.edges.map(function(member) {
                    return member.node;
                  });
                var totalCount =
                  channel.metaData && channel.metaData.members.toLocaleString();

                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 42,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                      'i' /* SectionTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 43,
                      },
                      __self: this,
                    },
                    totalCount === 1
                      ? totalCount + ' member'
                      : totalCount + ' members'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                      'h' /* ListContainer */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 49,
                      },
                      __self: this,
                    },
                    members &&
                      members.map(function(user) {
                        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'section',
                          {
                            key: user.id,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 53,
                            },
                            __self: _this2,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_1__components_listItems__[
                              'g' /* UserListItem */
                            ],
                            {
                              user: user,
                              reputationTipText: 'Rep in this community',
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 54,
                              },
                              __self: _this2,
                            }
                          )
                        );
                      })
                  ),
                  channel.memberConnection.pageInfo.hasNextPage &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                        'i' /* ListFooter */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 64,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_5__components_threadFeed_style__[
                          'b' /* FetchMoreButton */
                        ],
                        {
                          color: 'brand.default',
                          loading: isFetchingMore,
                          onClick: function onClick() {
                            return fetchMore();
                          },
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 65,
                          },
                          __self: this,
                        },
                        'Load more'
                      )
                    )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 80,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__components_loading__[
                      'a' /* Loading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 81,
                      },
                      __self: this,
                    }
                  )
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                  'f' /* SectionCard */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 87,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_6__components_viewError__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 88,
                    },
                    __self: this,
                  }
                )
              );
            },
          },
        ]);

        return ChannelMembers;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_4__api_channel__[
          'g' /* getChannelMembersQuery */
        ],
        __WEBPACK_IMPORTED_MODULE_7__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(ChannelMembers);

      /***/
    },

  /***/ './src/views/channelSettings/components/editForm.js':
    /*!**********************************************************!*\
  !*** ./src/views/channelSettings/components/editForm.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_1_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_router__ = __webpack_require__(
        /*! react-router */ './node_modules/react-router/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helpers_events__ = __webpack_require__(
        /*! ../../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__api_channel__ = __webpack_require__(
        /*! ../../../api/channel */ './src/api/channel.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__actions_modals__ = __webpack_require__(
        /*! ../../../actions/modals */ './src/actions/modals.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__actions_toasts__ = __webpack_require__(
        /*! ../../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_upsell__ = __webpack_require__(
        /*! ../../../components/upsell */ './src/components/upsell/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_formElements__ = __webpack_require__(
        /*! ../../../components/formElements */ './src/components/formElements/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_editForm_style__ = __webpack_require__(
        /*! ../../../components/editForm/style */ './src/components/editForm/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/channelSettings/components/editForm.js';

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

      var ChannelWithData = (function(_React$Component) {
        _inherits(ChannelWithData, _React$Component);

        function ChannelWithData(props) {
          _classCallCheck(this, ChannelWithData);

          var _this = _possibleConstructorReturn(
            this,
            (
              ChannelWithData.__proto__ ||
              Object.getPrototypeOf(ChannelWithData)
            ).call(this, props)
          );

          _initialiseProps.call(_this);

          var channel = _this.props.channel;

          _this.state = {
            name: channel.name,
            slug: channel.slug,
            description: channel.description,
            isPrivate: channel.isPrivate || false,
            channelId: channel.id,
            channelData: channel,
            isLoading: false,
          };
          return _this;
        }

        _createClass(ChannelWithData, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _state = this.state,
                name = _state.name,
                slug = _state.slug,
                description = _state.description,
                isPrivate = _state.isPrivate,
                isLoading = _state.isLoading;
              var channel = this.props.channel;

              if (!channel) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_11__components_upsell__[
                    'a' /* NullCard */
                  ],
                  {
                    bg: 'channel',
                    heading: "This channel doesn't exist yet.",
                    copy: 'Want to make it?',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 186,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_10__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 192,
                      },
                      __self: this,
                    },
                    'Create'
                  )
                );
              } else {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_13__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 197,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_14__components_editForm_style__[
                      'h' /* Location */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 198,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_4_src_components_link__[
                        'a' /* default */
                      ],
                      {
                        to: '/' + channel.community.slug + '/' + channel.slug,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 199,
                        },
                        __self: this,
                      },
                      'View Channel'
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_13__components_settingsViews_style__[
                      'i' /* SectionTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 203,
                      },
                      __self: this,
                    },
                    'Channel Settings'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_14__components_editForm_style__[
                      'c' /* Form */
                    ],
                    {
                      onSubmit: this.save,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 204,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__components_formElements__[
                        'd' /* Input */
                      ],
                      {
                        defaultValue: name,
                        id: 'name',
                        onChange: this.handleChange,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 205,
                        },
                        __self: this,
                      },
                      'Name'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__components_formElements__[
                        'h' /* UnderlineInput */
                      ],
                      {
                        defaultValue: slug,
                        disabled: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 208,
                        },
                        __self: this,
                      },
                      'URL: /' + channel.community.slug + '/'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__components_formElements__[
                        'g' /* TextArea */
                      ],
                      {
                        id: 'description',
                        defaultValue: description,
                        onChange: this.handleChange,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 211,
                        },
                        __self: this,
                      },
                      'Description'
                    ),
                    isPrivate
                      ? __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_14__components_editForm_style__[
                            'b' /* Description */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 228,
                            },
                            __self: this,
                          },
                          'Only approved people on Spectrum can see the threads, messages, and members in this channel. You can manually approve users who request to join this channel.'
                        )
                      : __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_14__components_editForm_style__[
                            'b' /* Description */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 234,
                            },
                            __self: this,
                          },
                          'Anyone on Spectrum can join this channel, post threads and messages, and will be able to see other members. If you want to create private channels,',
                          ' ',
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            'a',
                            {
                              href: 'mailto:hi@spectrum.chat',
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 238,
                              },
                              __self: this,
                            },
                            'get in touch'
                          ),
                          '.'
                        ),
                    // if the user is moving from private to public
                    this.props.channel.isPrivate &&
                      !isPrivate &&
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                          'n' /* Notice */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 246,
                          },
                          __self: this,
                        },
                        'When a private channel is made public all pending users will be added as members of the channel. Blocked users will remain blocked from viewing all content in this channel but in the future any new person will be able to join.'
                      ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_14__components_editForm_style__[
                        'a' /* Actions */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 254,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_10__components_buttons__[
                          'a' /* Button */
                        ],
                        {
                          onClick: this.save,
                          loading: isLoading,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 255,
                          },
                          __self: this,
                        },
                        'Save'
                      ),
                      slug !== 'general' &&
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_14__components_editForm_style__[
                            'j' /* TertiaryActionContainer */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 259,
                            },
                            __self: this,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_10__components_buttons__[
                              'd' /* IconButton */
                            ],
                            {
                              glyph: 'delete',
                              tipText: 'Delete ' + name,
                              tipLocation: 'top-right',
                              color: 'text.placeholder',
                              hoverColor: 'warn.alt',
                              onClick: function onClick(e) {
                                return _this2.triggerDeleteChannel(
                                  e,
                                  channel.id
                                );
                              },
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 260,
                              },
                              __self: this,
                            }
                          )
                        )
                    ),
                    slug === 'general' &&
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_14__components_editForm_style__[
                          'e' /* GeneralNotice */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 273,
                          },
                          __self: this,
                        },
                        "The General channel is the default channel for your community. It can't be deleted or private, but you can still change the name and description."
                      )
                  )
                );
              }
            },
          },
        ]);

        return ChannelWithData;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var _initialiseProps = function _initialiseProps() {
        var _this3 = this;

        this.handleChange = function(e) {
          var key = e.target.id;
          var value = e.target.value;
          var isPrivate = _this3.state.isPrivate;

          var newState = {};
          // checkboxes should reverse the value
          if (key === 'isPrivate') {
            newState[key] = !isPrivate;
          } else {
            newState[key] = value;
          }

          _this3.setState(function(prevState) {
            return Object.assign({}, prevState, Object.assign({}, newState));
          });
        };

        this.save = function(e) {
          e.preventDefault();
          var _state2 = _this3.state,
            name = _state2.name,
            slug = _state2.slug,
            description = _state2.description,
            isPrivate = _state2.isPrivate,
            channelId = _state2.channelId;

          var input = {
            name: name,
            slug: slug,
            description: description,
            isPrivate: isPrivate,
            channelId: channelId,
          };

          _this3.setState({
            isLoading: true,
          });

          // if privacy changed in this edit
          if (_this3.props.channel.isPrivate !== isPrivate) {
            Object(
              __WEBPACK_IMPORTED_MODULE_5__helpers_events__['b' /* track */]
            )('channel', 'privacy changed to ' + isPrivate.toString(), null);
          }

          _this3.props
            .editChannel(input)
            .then(function(_ref) {
              var editChannel = _ref.data.editChannel;

              var channel = editChannel;

              Object(
                __WEBPACK_IMPORTED_MODULE_5__helpers_events__['b' /* track */]
              )('channel', 'edited', null);

              _this3.setState({
                isLoading: false,
              });

              // the mutation returns a channel object. if it exists,
              if (channel !== undefined) {
                _this3.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_8__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('success', 'Channel saved!')
                );
              }
            })
            .catch(function(err) {
              _this3.setState({
                isLoading: false,
              });

              _this3.props.dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_8__actions_toasts__[
                    'a' /* addToastWithTimeout */
                  ]
                )('error', err.message)
              );
            });
        };

        this.triggerDeleteChannel = function(e, channelId) {
          e.preventDefault();
          Object(
            __WEBPACK_IMPORTED_MODULE_5__helpers_events__['b' /* track */]
          )('channel', 'delete inited', null);
          var _state3 = _this3.state,
            name = _state3.name,
            channelData = _state3.channelData;

          var message = __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
            'div',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 146,
              },
              __self: _this3,
            },
            __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
              'p',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 147,
                },
                __self: _this3,
              },
              'Are you sure you want to delete',
              ' ',
              __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                'b',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 149,
                  },
                  __self: _this3,
                },
                channelData.community.name,
                '/',
                name
              ),
              '?'
            ),
            channelData.metaData.threads > 0 &&
              __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                'p',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 155,
                  },
                  __self: _this3,
                },
                'The ',
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  'b',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 156,
                    },
                    __self: _this3,
                  },
                  channelData.metaData.threads,
                  ' threads'
                ),
                ' posted in this channel will be deleted.'
              ),
            __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
              'p',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 160,
                },
                __self: _this3,
              },
              'All messages, reactions, and media shared in this channel will be deleted.'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
              'p',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 164,
                },
                __self: _this3,
              },
              __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                'b',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 165,
                  },
                  __self: _this3,
                },
                'This cannot be undone.'
              )
            )
          );

          return _this3.props.dispatch(
            Object(
              __WEBPACK_IMPORTED_MODULE_7__actions_modals__['b' /* openModal */]
            )('DELETE_DOUBLE_CHECK_MODAL', {
              id: channelId,
              entity: 'channel',
              message: message,
              redirect: '/' + channelData.community.slug,
            })
          );
        };
      };

      var Channel = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_6__api_channel__[
          'c' /* deleteChannelMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_6__api_channel__[
          'd' /* editChannelMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_3_react_router__['e' /* withRouter */]
      )(ChannelWithData);
      /* harmony default export */ __webpack_exports__['a'] = Object(
        __WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */]
      )()(Channel);

      /***/
    },

  /***/ './src/views/channelSettings/components/overview.js':
    /*!**********************************************************!*\
  !*** ./src/views/channelSettings/components/overview.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__editForm__ = __webpack_require__(
        /*! ./editForm */ './src/views/channelSettings/components/editForm.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pendingUsers__ = __webpack_require__(
        /*! ./pendingUsers */ './src/views/channelSettings/components/pendingUsers.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__blockedUsers__ = __webpack_require__(
        /*! ./blockedUsers */ './src/views/channelSettings/components/blockedUsers.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__channelMembers__ = __webpack_require__(
        /*! ./channelMembers */ './src/views/channelSettings/components/channelMembers.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/channelSettings/components/overview.js';

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

      // import { ChannelInvitationForm } from '../../../components/emailInvitationForm';

      var Overview = (function(_React$Component) {
        _inherits(Overview, _React$Component);

        function Overview() {
          _classCallCheck(this, Overview);

          return _possibleConstructorReturn(
            this,
            (Overview.__proto__ || Object.getPrototypeOf(Overview)).apply(
              this,
              arguments
            )
          );
        }

        _createClass(Overview, [
          {
            key: 'render',
            value: function render() {
              var channel = this.props.channel;

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_1__components_settingsViews_style__[
                  'j' /* SectionsContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 25,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_1__components_settingsViews_style__[
                    'a' /* Column */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 26,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_2__editForm__['a' /* default */],
                    {
                      channel: channel,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 27,
                      },
                      __self: this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_1__components_settingsViews_style__[
                    'a' /* Column */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 39,
                    },
                    __self: this,
                  },
                  channel.isPrivate &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      'span',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 41,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_5__channelMembers__[
                          'a' /* default */
                        ],
                        {
                          channel: channel,
                          id: channel.id,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 42,
                          },
                          __self: this,
                        }
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_3__pendingUsers__[
                          'a' /* default */
                        ],
                        {
                          togglePending: this.props.togglePending,
                          channel: channel,
                          id: channel.id,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 43,
                          },
                          __self: this,
                        }
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_4__blockedUsers__[
                          'a' /* default */
                        ],
                        {
                          unblock: this.props.unblock,
                          channel: channel,
                          id: channel.id,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 48,
                          },
                          __self: this,
                        }
                      )
                    ),
                  !channel.isPrivate &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_5__channelMembers__[
                        'a' /* default */
                      ],
                      {
                        id: channel.id,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 55,
                        },
                        __self: this,
                      }
                    )
                )
              );
            },
          },
        ]);

        return Overview;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__['a'] = Overview;

      /***/
    },

  /***/ './src/views/channelSettings/components/pendingUsers.js':
    /*!**************************************************************!*\
  !*** ./src/views/channelSettings/components/pendingUsers.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_listItems__ = __webpack_require__(
        /*! ../../../components/listItems */ './src/components/listItems/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__api_channel__ = __webpack_require__(
        /*! ../../../api/channel */ './src/api/channel.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_viewError__ = __webpack_require__(
        /*! ../../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/channelSettings/components/pendingUsers.js';

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

      var PendingUsers = (function(_React$Component) {
        _inherits(PendingUsers, _React$Component);

        function PendingUsers() {
          _classCallCheck(this, PendingUsers);

          return _possibleConstructorReturn(
            this,
            (
              PendingUsers.__proto__ || Object.getPrototypeOf(PendingUsers)
            ).apply(this, arguments)
          );
        }

        _createClass(PendingUsers, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                data = _props.data,
                isLoading = _props.isLoading,
                togglePending = _props.togglePending;

              if (data && data.channel) {
                var _pendingUsers = data.channel.pendingUsers;

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_9__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 37,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_9__components_settingsViews_style__[
                      'i' /* SectionTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 38,
                      },
                      __self: this,
                    },
                    'Pending Users'
                  ),
                  _pendingUsers.length > 0 &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_8__components_listItems_style__[
                        'd' /* Description */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 40,
                        },
                        __self: this,
                      },
                      'Approving requests will allow a person to view all threads and messages in this channel, as well as allow them to post their own threads.'
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_8__components_listItems_style__[
                      'h' /* ListContainer */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 47,
                      },
                      __self: this,
                    },
                    _pendingUsers &&
                      _pendingUsers.map(function(user) {
                        return __WEBPACK_IMPORTED_MODULE_0_react__[
                          'createElement'
                        ](
                          'section',
                          {
                            key: user.id,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 51,
                            },
                            __self: _this2,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_2__components_listItems__[
                              'g' /* UserListItem */
                            ],
                            {
                              user: user,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 52,
                              },
                              __self: _this2,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              'div',
                              {
                                style: { display: 'flex' },
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 53,
                                },
                                __self: _this2,
                              },
                              __WEBPACK_IMPORTED_MODULE_0_react__[
                                'createElement'
                              ](
                                __WEBPACK_IMPORTED_MODULE_3__components_buttons__[
                                  'f' /* TextButton */
                                ],
                                {
                                  onClick: function onClick() {
                                    return togglePending(user.id, 'block');
                                  },
                                  label: true,
                                  hoverColor: 'warn.alt',
                                  icon: 'minus',
                                  __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 54,
                                  },
                                  __self: _this2,
                                },
                                'Block'
                              ),
                              __WEBPACK_IMPORTED_MODULE_0_react__[
                                'createElement'
                              ](
                                __WEBPACK_IMPORTED_MODULE_3__components_buttons__[
                                  'f' /* TextButton */
                                ],
                                {
                                  onClick: function onClick() {
                                    return togglePending(user.id, 'approve');
                                  },
                                  label: true,
                                  hoverColor: 'brand.default',
                                  icon: 'plus',
                                  __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 63,
                                  },
                                  __self: _this2,
                                },
                                'Approve'
                              )
                            )
                          )
                        );
                      }),
                    _pendingUsers.length <= 0 &&
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_8__components_listItems_style__[
                          'd' /* Description */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 78,
                          },
                          __self: this,
                        },
                        'There are no pending requests to join this channel.'
                      )
                  )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_9__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 89,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__components_loading__[
                      'a' /* Loading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 90,
                      },
                      __self: this,
                    }
                  )
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_9__components_settingsViews_style__[
                  'f' /* SectionCard */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 96,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_7__components_viewError__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 97,
                    },
                    __self: this,
                  }
                )
              );
            },
          },
        ]);

        return PendingUsers;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_6__api_channel__[
          'h' /* getPendingUsersQuery */
        ],
        __WEBPACK_IMPORTED_MODULE_5__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(PendingUsers);

      /***/
    },

  /***/ './src/views/channelSettings/index.js':
    /*!********************************************!*\
  !*** ./src/views/channelSettings/index.js ***!
  \********************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__queries__ = __webpack_require__(
        /*! ./queries */ './src/views/channelSettings/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_events__ = __webpack_require__(
        /*! ../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__ = __webpack_require__(
        /*! ../../components/appViewWrapper */ './src/components/appViewWrapper/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_loading__ = __webpack_require__(
        /*! ../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__actions_toasts__ = __webpack_require__(
        /*! ../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_upsell__ = __webpack_require__(
        /*! ../../components/upsell */ './src/components/upsell/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__api_channel__ = __webpack_require__(
        /*! ../../api/channel */ './src/api/channel.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__titlebar__ = __webpack_require__(
        /*! ../titlebar */ './src/views/titlebar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_viewError__ = __webpack_require__(
        /*! ../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_settingsViews_style__ = __webpack_require__(
        /*! ../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_settingsViews_header__ = __webpack_require__(
        /*! ../../components/settingsViews/header */ './src/components/settingsViews/header.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_overview__ = __webpack_require__(
        /*! ./components/overview */ './src/views/channelSettings/components/overview.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_settingsViews_subnav__ = __webpack_require__(
        /*! ../../components/settingsViews/subnav */ './src/components/settingsViews/subnav.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/channelSettings/index.js';

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

      var ChannelSettings = (function(_React$Component) {
        _inherits(ChannelSettings, _React$Component);

        function ChannelSettings() {
          var _ref;

          var _temp, _this, _ret;

          _classCallCheck(this, ChannelSettings);

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
                ChannelSettings.__proto__ ||
                Object.getPrototypeOf(ChannelSettings)).call.apply(
                _ref,
                [this].concat(args)
              )
            )),
            _this)),
            (_this.togglePending = function(userId, action) {
              var _this$props = _this.props,
                channel = _this$props.data.channel,
                togglePendingUser = _this$props.togglePendingUser,
                dispatch = _this$props.dispatch;

              var input = {
                channelId: channel.id,
                userId: userId,
                action: action,
              };

              togglePendingUser(input)
                .then(function(_ref2) {
                  var togglePendingUser = _ref2.data.togglePendingUser;

                  // the mutation returns a channel object. if it exists,
                  if (togglePendingUser !== undefined) {
                    if (action === 'block') {
                      Object(
                        __WEBPACK_IMPORTED_MODULE_4__helpers_events__[
                          'b' /* track */
                        ]
                      )('channel', 'blocked pending user', null);
                    }

                    if (action === 'approve') {
                      Object(
                        __WEBPACK_IMPORTED_MODULE_4__helpers_events__[
                          'b' /* track */
                        ]
                      )('channel', 'approved pending user', null);
                    }

                    dispatch(
                      Object(
                        __WEBPACK_IMPORTED_MODULE_7__actions_toasts__[
                          'a' /* addToastWithTimeout */
                        ]
                      )('success', 'Saved!')
                    );
                  }
                })
                .catch(function(err) {
                  dispatch(
                    Object(
                      __WEBPACK_IMPORTED_MODULE_7__actions_toasts__[
                        'a' /* addToastWithTimeout */
                      ]
                    )('error', err.message)
                  );
                });
            }),
            (_this.unblock = function(userId) {
              var _this$props2 = _this.props,
                channel = _this$props2.data.channel,
                unblockUser = _this$props2.unblockUser,
                dispatch = _this$props2.dispatch;

              var input = {
                channelId: channel.id,
                userId: userId,
              };

              unblockUser(input)
                .then(function(_ref3) {
                  var unblockUser = _ref3.data.unblockUser;

                  // the mutation returns a channel object. if it exists,
                  if (unblockUser !== undefined) {
                    Object(
                      __WEBPACK_IMPORTED_MODULE_4__helpers_events__[
                        'b' /* track */
                      ]
                    )('channel', 'unblocked user', null);
                    dispatch(
                      Object(
                        __WEBPACK_IMPORTED_MODULE_7__actions_toasts__[
                          'a' /* addToastWithTimeout */
                        ]
                      )('success', 'User was un-blocked.')
                    );
                  }
                })
                .catch(function(err) {
                  dispatch(
                    Object(
                      __WEBPACK_IMPORTED_MODULE_7__actions_toasts__[
                        'a' /* addToastWithTimeout */
                      ]
                    )('error', err.message)
                  );
                });
            }),
            _temp)),
            _possibleConstructorReturn(_this, _ret)
          );
        }

        _createClass(ChannelSettings, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                channel = _props.data.channel,
                match = _props.match,
                location = _props.location,
                isLoading = _props.isLoading,
                hasError = _props.hasError;
              var _match$params = match.params,
                communitySlug = _match$params.communitySlug,
                channelSlug = _match$params.channelSlug;

              // this is hacky, but will tell us if we're viewing analytics or the root settings view

              var pathname = location.pathname;
              var lastIndex = pathname.lastIndexOf('/');
              var activeTab = pathname.substr(lastIndex + 1);

              if (channel) {
                var _channel$channelPermi = channel.channelPermissions,
                  isModerator = _channel$channelPermi.isModerator,
                  isOwner = _channel$channelPermi.isOwner;

                var userHasPermissions =
                  isOwner ||
                  isModerator ||
                  channel.community.communityPermissions.isOwner ||
                  channel.community.communityPermissions.isModerator;

                if (!userHasPermissions) {
                  return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__[
                      'a' /* default */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 111,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_11__titlebar__[
                        'a' /* default */
                      ],
                      {
                        title: 'Channel settings',
                        provideBack: true,
                        backRoute: '/' + communitySlug,
                        noComposer: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 112,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__components_viewError__[
                        'a' /* default */
                      ],
                      {
                        heading:
                          'You don\u2019t have permission to manage this channel.',
                        subheading:
                          'Head back to the ' +
                          channel.community.name +
                          ' community to get back on track.',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 118,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_8__components_upsell__[
                          'c' /* Upsell404Channel */
                        ],
                        {
                          community: communitySlug,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 124,
                          },
                          __self: this,
                        }
                      )
                    )
                  );
                }

                var ActiveView = function ActiveView() {
                  switch (activeTab) {
                    case 'settings':
                      return __WEBPACK_IMPORTED_MODULE_0_react__[
                        'createElement'
                      ](
                        __WEBPACK_IMPORTED_MODULE_15__components_overview__[
                          'a' /* default */
                        ],
                        {
                          community: channel.community,
                          channel: channel,
                          communitySlug: communitySlug,
                          togglePending: _this2.togglePending,
                          unblock: _this2.unblock,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 134,
                          },
                          __self: _this2,
                        }
                      );
                    default:
                      return null;
                  }
                };

                var subnavItems = [
                  {
                    to:
                      '/' +
                      channel.community.slug +
                      '/' +
                      channel.slug +
                      '/settings',
                    label: 'Overview',
                    activeLabel: 'settings',
                  },
                ];

                var subheading = {
                  to: '/' + channel.community.slug + '/settings',
                  label: 'Return to ' + channel.community.name + ' settings',
                };

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 161,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_11__titlebar__['a' /* default */],
                    {
                      title: channel.name + ' \xB7 ' + channel.community.name,
                      subtitle: 'Settings',
                      provideBack: true,
                      backRoute:
                        '/' + channel.community.slug + '/' + channel.slug,
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 162,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_13__components_settingsViews_style__[
                      'p' /* View */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 170,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_14__components_settingsViews_header__[
                        'a' /* default */
                      ],
                      {
                        subheading: subheading,
                        heading: channel.name + ' Settings',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 171,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_16__components_settingsViews_subnav__[
                        'a' /* default */
                      ],
                      {
                        items: subnavItems,
                        activeTab: activeTab,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 175,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      ActiveView,
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 177,
                        },
                        __self: this,
                      }
                    )
                  )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_6__components_loading__[
                    'a' /* Loading */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 184,
                    },
                    __self: this,
                  }
                );
              }

              if (hasError) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 189,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_11__titlebar__['a' /* default */],
                    {
                      title: 'Channel not found',
                      provideBack: true,
                      backRoute: '/' + communitySlug + '/' + channelSlug,
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 190,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_12__components_viewError__[
                      'a' /* default */
                    ],
                    {
                      refresh: true,
                      heading: 'There was an error fetching this channel.',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 196,
                      },
                      __self: this,
                    }
                  )
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__[
                  'a' /* default */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 205,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_11__titlebar__['a' /* default */],
                  {
                    title: 'Channel not found',
                    provideBack: true,
                    backRoute: '/' + communitySlug,
                    noComposer: true,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 206,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_12__components_viewError__[
                    'a' /* default */
                  ],
                  {
                    heading: 'We couldn\u2019t find a channel with this name.',
                    subheading:
                      'Head back to the ' +
                      communitySlug +
                      ' community to get back on track.',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 212,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_8__components_upsell__[
                      'c' /* Upsell404Channel */
                    ],
                    {
                      community: communitySlug,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 216,
                      },
                      __self: this,
                    }
                  )
                )
              );
            },
          },
        ]);

        return ChannelSettings;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'default'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        // $FlowIssue
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_3__queries__['a' /* getThisChannel */],
        __WEBPACK_IMPORTED_MODULE_10__api_channel__[
          'l' /* togglePendingUserInChannelMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_10__api_channel__[
          'm' /* unblockUserInChannelMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_9__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(ChannelSettings);

      /***/
    },

  /***/ './src/views/channelSettings/queries.js':
    /*!**********************************************!*\
  !*** ./src/views/channelSettings/queries.js ***!
  \**********************************************/
    /*! exports provided: getThisChannel */
    /*! exports used: getThisChannel */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return getThisChannel;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo__ = __webpack_require__(
        /*! react-apollo */ './node_modules/react-apollo/react-apollo.browser.umd.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_fragments_channel_channelInfo__ = __webpack_require__(
        /*! ../../api/fragments/channel/channelInfo */ './src/api/fragments/channel/channelInfo.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_fragments_community_communityInfo__ = __webpack_require__(
        /*! ../../api/fragments/community/communityInfo */ './src/api/fragments/community/communityInfo.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_fragments_channel_channelMetaData__ = __webpack_require__(
        /*! ../../api/fragments/channel/channelMetaData */ './src/api/fragments/channel/channelMetaData.js'
      );
      var _templateObject = _taggedTemplateLiteral(
        [
          '\n    query thisChannel($channelSlug: String, $communitySlug: String) {\n\t\t\tchannel(channelSlug: $channelSlug, communitySlug: $communitySlug) {\n        ...channelInfo\n        community {\n          ...communityInfo\n        }\n        ...channelMetaData\n      }\n\t\t}\n    ',
          '\n    ',
          '\n    ',
          '\n\t',
        ],
        [
          '\n    query thisChannel($channelSlug: String, $communitySlug: String) {\n\t\t\tchannel(channelSlug: $channelSlug, communitySlug: $communitySlug) {\n        ...channelInfo\n        community {\n          ...communityInfo\n        }\n        ...channelMetaData\n      }\n\t\t}\n    ',
          '\n    ',
          '\n    ',
          '\n\t',
        ]
      );

      function _taggedTemplateLiteral(strings, raw) {
        return Object.freeze(
          Object.defineProperties(strings, {
            raw: { value: Object.freeze(raw) },
          })
        );
      }

      var getThisChannel = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(
        Object(__WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql'])(
          _templateObject,
          __WEBPACK_IMPORTED_MODULE_1__api_fragments_channel_channelInfo__[
            'a' /* channelInfoFragment */
          ],
          __WEBPACK_IMPORTED_MODULE_2__api_fragments_community_communityInfo__[
            'a' /* communityInfoFragment */
          ],
          __WEBPACK_IMPORTED_MODULE_3__api_fragments_channel_channelMetaData__[
            'a' /* channelMetaDataFragment */
          ]
        ),
        {
          options: function options(_ref) {
            var match = _ref.match;
            return {
              variables: {
                channelSlug: match.params.channelSlug.toLowerCase(),
                communitySlug: match.params.communitySlug.toLowerCase(),
              },
              fetchPolicy: 'network-only',
            };
          },
        }
      );

      /***/
    },
});
//# sourceMappingURL=channelSettings.chunk.js.map
