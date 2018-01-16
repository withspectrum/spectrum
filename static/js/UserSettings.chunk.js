webpackJsonp([7], {
  /***/ './node_modules/validator/lib/isByteLength.js':
    /*!****************************************************!*\
  !*** ./node_modules/validator/lib/isByteLength.js ***!
  \****************************************************/
    /*! dynamic exports provided */
    /*! all exports used */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _typeof =
        typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
          ? function(obj) {
              return typeof obj;
            }
          : function(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj;
            };

      exports.default = isByteLength;

      var _assertString = __webpack_require__(
        /*! ./util/assertString */ './node_modules/validator/lib/util/assertString.js'
      );

      var _assertString2 = _interopRequireDefault(_assertString);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      /* eslint-disable prefer-rest-params */
      function isByteLength(str, options) {
        (0, _assertString2.default)(str);
        var min = void 0;
        var max = void 0;
        if (
          (typeof options === 'undefined' ? 'undefined' : _typeof(options)) ===
          'object'
        ) {
          min = options.min || 0;
          max = options.max;
        } else {
          // backwards compatibility: isByteLength(str, min [, max])
          min = arguments[1];
          max = arguments[2];
        }
        var len = encodeURI(str).split(/%..|./).length - 1;
        return len >= min && (typeof max === 'undefined' || len <= max);
      }
      module.exports = exports['default'];

      /***/
    },

  /***/ './node_modules/validator/lib/isEmail.js':
    /*!***********************************************!*\
  !*** ./node_modules/validator/lib/isEmail.js ***!
  \***********************************************/
    /*! dynamic exports provided */
    /*! exports used: default */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.default = isEmail;

      var _assertString = __webpack_require__(
        /*! ./util/assertString */ './node_modules/validator/lib/util/assertString.js'
      );

      var _assertString2 = _interopRequireDefault(_assertString);

      var _merge = __webpack_require__(
        /*! ./util/merge */ './node_modules/validator/lib/util/merge.js'
      );

      var _merge2 = _interopRequireDefault(_merge);

      var _isByteLength = __webpack_require__(
        /*! ./isByteLength */ './node_modules/validator/lib/isByteLength.js'
      );

      var _isByteLength2 = _interopRequireDefault(_isByteLength);

      var _isFQDN = __webpack_require__(
        /*! ./isFQDN */ './node_modules/validator/lib/isFQDN.js'
      );

      var _isFQDN2 = _interopRequireDefault(_isFQDN);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var default_email_options = {
        allow_display_name: false,
        require_display_name: false,
        allow_utf8_local_part: true,
        require_tld: true,
      };

      /* eslint-disable max-len */
      /* eslint-disable no-control-regex */
      var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\,\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
      var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
      var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
      var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
      var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
      /* eslint-enable max-len */
      /* eslint-enable no-control-regex */

      function isEmail(str, options) {
        (0, _assertString2.default)(str);
        options = (0, _merge2.default)(options, default_email_options);

        if (options.require_display_name || options.allow_display_name) {
          var display_email = str.match(displayName);
          if (display_email) {
            str = display_email[1];
          } else if (options.require_display_name) {
            return false;
          }
        }

        var parts = str.split('@');
        var domain = parts.pop();
        var user = parts.join('@');

        var lower_domain = domain.toLowerCase();
        if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
          user = user.replace(/\./g, '').toLowerCase();
        }

        if (
          !(0, _isByteLength2.default)(user, { max: 64 }) ||
          !(0, _isByteLength2.default)(domain, { max: 254 })
        ) {
          return false;
        }

        if (
          !(0, _isFQDN2.default)(domain, { require_tld: options.require_tld })
        ) {
          return false;
        }

        if (user[0] === '"') {
          user = user.slice(1, user.length - 1);
          return options.allow_utf8_local_part
            ? quotedEmailUserUtf8.test(user)
            : quotedEmailUser.test(user);
        }

        var pattern = options.allow_utf8_local_part
          ? emailUserUtf8Part
          : emailUserPart;

        var user_parts = user.split('.');
        for (var i = 0; i < user_parts.length; i++) {
          if (!pattern.test(user_parts[i])) {
            return false;
          }
        }

        return true;
      }
      module.exports = exports['default'];

      /***/
    },

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

  /***/ './src/components/editForm/index.js':
    /*!******************************************!*\
  !*** ./src/components/editForm/index.js ***!
  \******************************************/
    /*! exports provided: EditForm, UserEditForm */
    /*! exports used: UserEditForm */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* unused harmony export EditForm */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return UserEditForm;
        }
      );
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user__ = __webpack_require__(
        /*! ./user */ './src/components/editForm/user.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/components/editForm/index.js',
        _this = this;

      var EditFormPure = function EditFormPure(props) {
        var type = props.type;

        switch (type) {
          default:
          case 'user': {
            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2__user__['a' /* default */],
              Object.assign({}, props, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 11,
                },
                __self: _this,
              })
            );
          }
        }
      };

      var EditForm = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()()(
        EditFormPure
      );
      var UserEditForm = function UserEditForm(props) {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          EditForm,
          Object.assign({ type: 'user' }, props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 22,
            },
            __self: _this,
          })
        );
      };

      /***/
    },

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

  /***/ './src/components/editForm/user.js':
    /*!*****************************************!*\
  !*** ./src/components/editForm/user.js ***!
  \*****************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router__ = __webpack_require__(
        /*! react-router */ './node_modules/react-router/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_slugg__ = __webpack_require__(
        /*! slugg */ './node_modules/slugg/slugg.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_slugg___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_2_slugg__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_apollo__ = __webpack_require__(
        /*! react-apollo */ './node_modules/react-apollo/react-apollo.browser.umd.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_apollo___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_3_react_apollo__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_4_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__helpers_events__ = __webpack_require__(
        /*! ../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__helpers_utils__ = __webpack_require__(
        /*! ../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__buttons__ = __webpack_require__(
        /*! ../buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_icons__ = __webpack_require__(
        /*! ../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__formElements__ = __webpack_require__(
        /*! ../formElements */ './src/components/formElements/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__style__ = __webpack_require__(
        /*! ./style */ './src/components/editForm/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_globals__ = __webpack_require__(
        /*! ../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__api_user__ = __webpack_require__(
        /*! ../../api/user */ './src/api/user.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__actions_toasts__ = __webpack_require__(
        /*! ../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__helpers_images__ = __webpack_require__(
        /*! ../../helpers/images */ './src/helpers/images.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_listItems_style__ = __webpack_require__(
        /*! ../../components/listItems/style */ './src/components/listItems/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/components/editForm/user.js';

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

      // $FlowFixMe

      // $FlowFixMe

      //$FlowFixMe

      //$FlowFixMe

      // $FlowFixMe

      var UserWithData = (function(_Component) {
        _inherits(UserWithData, _Component);

        function UserWithData(props) {
          _classCallCheck(this, UserWithData);

          var _this = _possibleConstructorReturn(
            this,
            (
              UserWithData.__proto__ || Object.getPrototypeOf(UserWithData)
            ).call(this, props)
          );

          _initialiseProps.call(_this);

          var user = _this.props.currentUser;

          _this.state = {
            website: user.website ? user.website : '',
            name: user.name ? user.name : '',
            username: user.username ? user.username : '',
            description: user.description ? user.description : '',
            image: user.profilePhoto,
            coverPhoto: user.coverPhoto,
            file: null,
            coverFile: null,
            descriptionError: false,
            nameError: false,
            createError: false,
            isLoading: false,
            photoSizeError: '',
            proGifError: false,
            usernameError: '',
            isUsernameSearching: false,
          };

          _this.search = Object(
            __WEBPACK_IMPORTED_MODULE_8__helpers_utils__['h' /* throttle */]
          )(_this.search, 500);
          return _this;
        }

        _createClass(UserWithData, [
          {
            key: 'render',
            value: function render() {
              var _state = this.state,
                name = _state.name,
                username = _state.username,
                description = _state.description,
                website = _state.website,
                image = _state.image,
                coverPhoto = _state.coverPhoto,
                descriptionError = _state.descriptionError,
                createError = _state.createError,
                nameError = _state.nameError,
                isLoading = _state.isLoading,
                photoSizeError = _state.photoSizeError,
                proGifError = _state.proGifError,
                usernameError = _state.usernameError,
                isUsernameSearching = _state.isUsernameSearching;

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_12__style__['i' /* StyledCard */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 389,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_12__style__['h' /* Location */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 390,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__components_icons__[
                      'a' /* default */
                    ],
                    {
                      glyph: 'view-back',
                      size: 16,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 391,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_6_src_components_link__[
                      'a' /* default */
                    ],
                    {
                      to: '/users/' + username,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 392,
                      },
                      __self: this,
                    },
                    'Return to Profile'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_12__style__['d' /* FormTitle */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 394,
                    },
                    __self: this,
                  },
                  'Profile Settings'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_12__style__['c' /* Form */],
                  {
                    onSubmit: this.save,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 395,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_12__style__[
                      'f' /* ImageInputWrapper */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 396,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_11__formElements__[
                        'b' /* CoverInput */
                      ],
                      {
                        onChange: this.setCoverPhoto,
                        defaultValue: coverPhoto,
                        preview: true,
                        allowGif: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 397,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_11__formElements__[
                        'e' /* PhotoInput */
                      ],
                      {
                        onChange: this.setProfilePhoto,
                        defaultValue: image,
                        user: true,
                        allowGif: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 403,
                        },
                        __self: this,
                      }
                    )
                  ),
                  photoSizeError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_17__components_listItems_style__[
                        'n' /* Notice */
                      ],
                      {
                        style: { marginTop: '32px' },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 412,
                        },
                        __self: this,
                      },
                      photoSizeError
                    ),
                  proGifError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_17__components_listItems_style__[
                        'n' /* Notice */
                      ],
                      {
                        style: { marginTop: '32px' },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 416,
                        },
                        __self: this,
                      },
                      'Upgrade to Pro to use a gif as your profile or cover photo',
                      ' ',
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        {
                          role: 'img',
                          'aria-label': 'finger pointing right emoji',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 418,
                          },
                          __self: this,
                        },
                        '\uD83D\uDC49'
                      )
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__formElements__[
                      'd' /* Input */
                    ],
                    {
                      type: 'text',
                      defaultValue: name,
                      onChange: this.changeName,
                      placeholder: "What's your name?",
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 424,
                      },
                      __self: this,
                    },
                    'Name'
                  ),
                  nameError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_11__formElements__[
                        'c' /* Error */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 433,
                        },
                        __self: this,
                      },
                      'Names can be up to 50 characters.'
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__formElements__[
                      'd' /* Input */
                    ],
                    {
                      type: 'text',
                      defaultValue: username,
                      onChange: this.changeUsername,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 435,
                      },
                      __self: this,
                    },
                    'Username',
                    isUsernameSearching &&
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_12__style__[
                          'g' /* Loading */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 442,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_13__components_globals__[
                            'l' /* Spinner */
                          ],
                          {
                            size: 16,
                            color: 'brand.default',
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 443,
                            },
                            __self: this,
                          }
                        )
                      )
                  ),
                  usernameError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_17__components_listItems_style__[
                        'n' /* Notice */
                      ],
                      {
                        style: { marginTop: '16px' },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 449,
                        },
                        __self: this,
                      },
                      usernameError
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__formElements__[
                      'g' /* TextArea */
                    ],
                    {
                      defaultValue: description,
                      onChange: this.changeDescription,
                      placeholder: 'Introduce yourself to the class...',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 452,
                      },
                      __self: this,
                    },
                    'Bio'
                  ),
                  descriptionError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_11__formElements__[
                        'c' /* Error */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 460,
                        },
                        __self: this,
                      },
                      'Bios can be up to 140 characters.'
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__formElements__[
                      'd' /* Input */
                    ],
                    {
                      defaultValue: website,
                      onChange: this.changeWebsite,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 462,
                      },
                      __self: this,
                    },
                    'Optional: Add your website'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_12__style__['a' /* Actions */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 466,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_9__buttons__['a' /* Button */],
                      {
                        disabled:
                          !name || nameError || !username || usernameError,
                        loading: isLoading,
                        onClick: this.save,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 467,
                        },
                        __self: this,
                      },
                      'Save'
                    )
                  ),
                  createError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_11__formElements__[
                        'c' /* Error */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 477,
                        },
                        __self: this,
                      },
                      'Please fix any errors above to save your profile.'
                    )
                )
              );
            },
          },
        ]);

        return UserWithData;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var _initialiseProps = function _initialiseProps() {
        var _this2 = this;

        this.changeName = function(e) {
          var name = e.target.value;
          if (name.length > 50) {
            _this2.setState({
              name: name,
              nameError: true,
            });

            return;
          }
          _this2.setState({
            name: name,
            nameError: false,
          });
        };

        this.changeDescription = function(e) {
          var description = e.target.value;
          if (description.length >= 140) {
            _this2.setState({
              descriptionError: true,
            });
            return;
          }

          _this2.setState({
            description: description,
            descriptionError: false,
          });
        };

        this.changeWebsite = function(e) {
          var website = e.target.value;
          _this2.setState({
            website: website,
          });
        };

        this.setProfilePhoto = function(e) {
          var reader = new FileReader();
          var file = e.target.files[0];

          _this2.setState({
            isLoading: true,
          });

          if (!file) return;

          if (
            file &&
            file.size >
              __WEBPACK_IMPORTED_MODULE_16__helpers_images__[
                'a' /* FREE_USER_MAX_IMAGE_SIZE_BYTES */
              ] &&
            !_this2.props.currentUser.isPro
          ) {
            return _this2.setState({
              photoSizeError:
                'Upgrade to Pro to upload files up to ' +
                __WEBPACK_IMPORTED_MODULE_16__helpers_images__[
                  'd' /* PRO_USER_MAX_IMAGE_SIZE_STRING */
                ] +
                '. Otherwise, try uploading a photo less than ' +
                __WEBPACK_IMPORTED_MODULE_16__helpers_images__[
                  'b' /* FREE_USER_MAX_IMAGE_SIZE_STRING */
                ] +
                '.',
              isLoading: false,
            });
          }

          if (
            file &&
            file.size >
              __WEBPACK_IMPORTED_MODULE_16__helpers_images__[
                'c' /* PRO_USER_MAX_IMAGE_SIZE_BYTES */
              ] &&
            _this2.props.currentUser.isPro
          ) {
            return _this2.setState({
              photoSizeError:
                'Try uploading a file less than ' +
                __WEBPACK_IMPORTED_MODULE_16__helpers_images__[
                  'd' /* PRO_USER_MAX_IMAGE_SIZE_STRING */
                ] +
                '.',
              isLoading: false,
            });
          }

          if (
            file &&
            file.type === 'image/gif' &&
            !_this2.props.currentUser.isPro
          ) {
            return _this2.setState({
              isLoading: false,
              proGifError: true,
            });
          }

          reader.onloadend = function() {
            Object(
              __WEBPACK_IMPORTED_MODULE_7__helpers_events__['b' /* track */]
            )('user', 'profile photo uploaded', null);

            _this2.setState({
              file: file,
              image: reader.result,
              photoSizeError: '',
              proGifError: false,
              isLoading: false,
            });
          };

          reader.readAsDataURL(file);
        };

        this.setCoverPhoto = function(e) {
          var reader = new FileReader();
          var file = e.target.files[0];

          if (!file) return;

          _this2.setState({
            isLoading: true,
          });

          if (
            file &&
            file.size >
              __WEBPACK_IMPORTED_MODULE_16__helpers_images__[
                'a' /* FREE_USER_MAX_IMAGE_SIZE_BYTES */
              ] &&
            !_this2.props.currentUser.isPro
          ) {
            return _this2.setState({
              photoSizeError:
                'Upgrade to Pro to upload files up to ' +
                __WEBPACK_IMPORTED_MODULE_16__helpers_images__[
                  'd' /* PRO_USER_MAX_IMAGE_SIZE_STRING */
                ] +
                '. Otherwise, try uploading a photo less than ' +
                __WEBPACK_IMPORTED_MODULE_16__helpers_images__[
                  'b' /* FREE_USER_MAX_IMAGE_SIZE_STRING */
                ] +
                '.',
              isLoading: false,
            });
          }

          if (
            file &&
            file.size >
              __WEBPACK_IMPORTED_MODULE_16__helpers_images__[
                'c' /* PRO_USER_MAX_IMAGE_SIZE_BYTES */
              ] &&
            _this2.props.currentUser.isPro
          ) {
            return _this2.setState({
              photoSizeError:
                'Try uploading a file less than ' +
                __WEBPACK_IMPORTED_MODULE_16__helpers_images__[
                  'd' /* PRO_USER_MAX_IMAGE_SIZE_STRING */
                ] +
                '.',
              isLoading: false,
            });
          }

          if (
            file &&
            file.type === 'image/gif' &&
            !_this2.props.currentUser.isPro
          ) {
            return _this2.setState({
              isLoading: false,
              proGifError: true,
            });
          }

          reader.onloadend = function() {
            Object(
              __WEBPACK_IMPORTED_MODULE_7__helpers_events__['b' /* track */]
            )('user', 'cover photo uploaded', null);

            _this2.setState({
              coverFile: file,
              coverPhoto: reader.result,
              photoSizeError: '',
              proGifError: false,
              isLoading: false,
            });
          };

          reader.readAsDataURL(file);
        };

        this.save = function(e) {
          e.preventDefault();

          Object(
            __WEBPACK_IMPORTED_MODULE_7__helpers_events__['b' /* track */]
          )('user', 'edited', null);

          var _state2 = _this2.state,
            name = _state2.name,
            description = _state2.description,
            website = _state2.website,
            file = _state2.file,
            coverFile = _state2.coverFile,
            photoSizeError = _state2.photoSizeError,
            username = _state2.username,
            usernameError = _state2.usernameError;

          var input = {
            name: name,
            description: description,
            website: website,
            file: file,
            coverFile: coverFile,
            username: username,
          };

          if (photoSizeError || usernameError) {
            return;
          }

          _this2.setState({
            isLoading: true,
          });

          _this2.props
            .editUser(input)
            .then(function(_ref) {
              var editUser = _ref.data.editUser;

              var user = editUser;

              _this2.setState({
                isLoading: false,
              });

              // the mutation returns a user object. if it exists,
              if (user !== undefined) {
                _this2.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_15__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('success', 'Changes saved!')
                );
                _this2.setState({
                  file: null,
                });
                window.location.href = '/users/' + user.username;
              }
            })
            .catch(function(err) {
              _this2.setState({
                isLoading: false,
              });

              _this2.props.dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_15__actions_toasts__[
                    'a' /* addToastWithTimeout */
                  ]
                )('error', err.message)
              );
            });
        };

        this.changeUsername = function(e) {
          var username = e.target.value.trim();
          username = __WEBPACK_IMPORTED_MODULE_2_slugg___default()(username);

          _this2.setState({
            usernameError: '',
            username: username,
          });

          if (username.length > 20) {
            return _this2.setState({
              usernameError: 'Usernames can be up to 20 characters',
            });
          } else if (username.length === 0) {
            _this2.setState({
              usernameError:
                'Be sure to set a username so that people can find you!',
            });
          } else {
            _this2.setState({
              usernameError: '',
            });
          }

          _this2.search(username);
        };

        this.search = function(username) {
          if (username.length > 20) {
            return _this2.setState({
              usernameError: 'Usernames can be up to 20 characters',
              isUsernameSearching: false,
            });
          } else if (username.length === 0) {
            return _this2.setState({
              usernameError:
                'Be sure to set a username so that people can find you!',
              isUsernameSearching: false,
            });
          } else {
            _this2.setState({
              usernameError: '',
              isUsernameSearching: true,
            });

            // check the db to see if this channel slug exists
            _this2.props.client
              .query({
                query:
                  __WEBPACK_IMPORTED_MODULE_14__api_user__[
                    'a' /* CHECK_UNIQUE_USERNAME_QUERY */
                  ],
                variables: {
                  username: username,
                },
              })
              .then(function(_ref2) {
                var data = _ref2.data,
                  user = _ref2.data.user;

                if (_this2.state.username.length > 20) {
                  return _this2.setState({
                    usernameError: 'Usernames can be up to 20 characters',
                    isUsernameSearching: false,
                  });
                } else if (user && user.id) {
                  return _this2.setState({
                    usernameError: 'This username is already taken, sorry!',
                    isUsernameSearching: false,
                  });
                } else {
                  return _this2.setState({
                    usernameError: '',
                    isUsernameSearching: false,
                  });
                }
              });
          }
        };
      };

      var map = function map(state) {
        return {
          currentUser: state.users.currentUser,
        };
      };

      var UserSettings = __WEBPACK_IMPORTED_MODULE_4_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_14__api_user__['d' /* editUserMutation */],
        __WEBPACK_IMPORTED_MODULE_1_react_router__['e' /* withRouter */],
        __WEBPACK_IMPORTED_MODULE_3_react_apollo__['withApollo'],
        Object(__WEBPACK_IMPORTED_MODULE_5_react_redux__['a' /* connect */])(
          map
        )
      )(UserWithData);
      /* harmony default export */ __webpack_exports__['a'] = UserSettings;

      /***/
    },

  /***/ './src/views/userSettings/components/emailSettings.js':
    /*!************************************************************!*\
  !*** ./src/views/userSettings/components/emailSettings.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_2_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_toasts__ = __webpack_require__(
        /*! ../../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__api_user__ = __webpack_require__(
        /*! ../../../api/user */ './src/api/user.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_formElements__ = __webpack_require__(
        /*! ../../../components/formElements */ './src/components/formElements/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_icons__ = __webpack_require__(
        /*! ../../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_validator_lib_isEmail__ = __webpack_require__(
        /*! validator/lib/isEmail */ './node_modules/validator/lib/isEmail.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_validator_lib_isEmail___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_8_validator_lib_isEmail__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__style__ = __webpack_require__(
        /*! ../style */ './src/views/userSettings/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/userSettings/components/emailSettings.js';

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

      var parseNotificationTypes = function parseNotificationTypes(
        notifications
      ) {
        var types = Object.keys(notifications.types).filter(function(type) {
          return type !== '__typename';
        });
        return types.map(function(type) {
          if (!notifications.types[type]) return {};
          switch (type) {
            case 'newMessageInThreads':
              return {
                type: type,
                emailValue: notifications.types[type].email,
                label:
                  "Email me when people respond in the threads and private conversations where I'm active - this includes direct messages.",
                display: 'flex-start',
              };
            case 'newDirectMessage':
              return {
                type: type,
                emailValue: notifications.types[type].email,
                label: 'Email me when I receive new direct messages.',
                display: 'center',
              };
            case 'newThreadCreated':
              return {
                type: type,
                emailValue: notifications.types[type].email,
                label:
                  'Email me when a new thread is published in channels where I receive notifications.',
                display: 'flex-start',
              };
            case 'dailyDigest':
              return {
                type: type,
                emailValue: notifications.types[type].email,
                label:
                  'Email me every day with the top conversations in my communities.',
                display: 'center',
              };
            case 'weeklyDigest':
              return {
                type: type,
                emailValue: notifications.types[type].email,
                label:
                  'Email me once every week with the top conversations in my communities',
                display: 'center',
              };
            case 'newMention':
              return {
                type: type,
                emailValue: notifications.types[type].email,
                label: 'Email me if someone @mentions me on Spectrum',
                display: 'flex-start',
              };
            default:
            case 'null':
              return {};
          }
        });
      };

      var EmailSettings = (function(_Component) {
        _inherits(EmailSettings, _Component);

        function EmailSettings() {
          _classCallCheck(this, EmailSettings);

          var _this = _possibleConstructorReturn(
            this,
            (
              EmailSettings.__proto__ || Object.getPrototypeOf(EmailSettings)
            ).call(this)
          );

          _this.handleEmailChange = function(e) {
            _this.setState({
              email: e.target.value,
              emailError: '',
            });
          };

          _this.saveEmail = function(e) {
            e.preventDefault();
            var email = _this.state.email;
            var updateUserEmail = _this.props.updateUserEmail;

            if (
              !__WEBPACK_IMPORTED_MODULE_8_validator_lib_isEmail___default()(
                email
              )
            ) {
              return _this.setState({
                emailError: 'Please enter a valid email address',
              });
            }

            return updateUserEmail(email)
              .then(function(_ref) {
                var updateUserEmail = _ref.data.updateUserEmail;

                _this.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_3__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )(
                    'success',
                    'A confirmation email has been sent to ' + email + '!'
                  )
                );
                return _this.setState({
                  email: '',
                });
              })
              .catch(function(err) {
                _this.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_3__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('error', err.message)
                );
              });
          };

          _this.handleChange = function(e) {
            var notificationType = e.target.id;
            var deliveryMethod = 'email';
            var input = {
              deliveryMethod: deliveryMethod,
              notificationType: notificationType,
            };

            _this.props
              .toggleNotificationSettings(input)
              .then(function(_ref2) {
                var toggleNotificationSettings =
                  _ref2.data.toggleNotificationSettings;

                _this.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_3__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('success', 'Settings saved!')
                );
              })
              .catch(function(err) {
                _this.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_3__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('error', err.message)
                );
              });
          };

          _this.state = {
            email: '',
            emailError: '',
          };
          return _this;
        }

        _createClass(EmailSettings, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                notifications = _props.currentUser.settings.notifications,
                currentUser = _props.currentUser;
              var emailError = this.state.emailError;

              var settings = parseNotificationTypes(notifications).filter(
                function(notification) {
                  return notification.hasOwnProperty('emailValue');
                }
              );

              if (!currentUser.email) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                    'p' /* StyledCard */
                  ],
                  {
                    smallOnly: this.props.smallOnly,
                    largeOnly: this.props.largeOnly,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 166,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                      'j' /* ListHeader */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 170,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                        'g' /* LargeListHeading */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 171,
                        },
                        __self: this,
                      },
                      'Turn on email notifications'
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                      'h' /* ListContainer */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 173,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                        'd' /* Description */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 174,
                        },
                        __self: this,
                      },
                      "You can customize your email notifications to keep up to date on what's important to you on Spectrum. Enter your email below and we'll send you a confirmation link."
                    ),
                    currentUser.pendingEmail &&
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                          'n' /* Notice */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 181,
                          },
                          __self: this,
                        },
                        'A confirmation link was sent to ',
                        currentUser.pendingEmail,
                        '. You can resend the confirmation below, or enter a new email address.'
                      ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_10__style__[
                        'b' /* EmailForm */
                      ],
                      {
                        onSubmit: this.saveEmail,
                        style: { marginTop: '8px', marginBottom: '8px' },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 187,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_5__components_formElements__[
                          'd' /* Input */
                        ],
                        {
                          type: 'email',
                          defaultValue: null,
                          onChange: this.handleEmailChange,
                          placeholder: 'Add your email address',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 191,
                          },
                          __self: this,
                        },
                        'Email Address'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_7__components_buttons__[
                          'a' /* Button */
                        ],
                        {
                          onClick: this.saveEmail,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 200,
                          },
                          __self: this,
                        },
                        'Save'
                      )
                    ),
                    emailError &&
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_5__components_formElements__[
                          'c' /* Error */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 202,
                          },
                          __self: this,
                        },
                        emailError
                      )
                  )
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                  'p' /* StyledCard */
                ],
                {
                  smallOnly: this.props.smallOnly,
                  largeOnly: this.props.largeOnly,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 209,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                    'j' /* ListHeader */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 213,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                      'g' /* LargeListHeading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 214,
                      },
                      __self: this,
                    },
                    'Email Preferences'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                    'h' /* ListContainer */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 216,
                    },
                    __self: this,
                  },
                  settings.map(function(setting, i) {
                    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_10__style__[
                        'c' /* EmailListItem */
                      ],
                      {
                        key: i,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 219,
                        },
                        __self: _this2,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_5__components_formElements__[
                          'a' /* Checkbox */
                        ],
                        {
                          checked: setting.emailValue,
                          onChange: _this2.handleChange,
                          id: setting.type,
                          align: setting.display,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 220,
                          },
                          __self: _this2,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_10__style__[
                            'a' /* CheckboxContent */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 226,
                            },
                            __self: _this2,
                          },
                          setting.label,
                          setting.type === 'newMessageInThreads' &&
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                                'n' /* Notice */
                              ],
                              {
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 229,
                                },
                                __self: _this2,
                              },
                              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                'strong',
                                {
                                  __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 230,
                                  },
                                  __self: _this2,
                                },
                                'Trying to mute a specific conversation?'
                              ),
                              ' ',
                              'You can turn off email notifications for individual threads by clicking on the notification icon',
                              ' ',
                              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                                  'f' /* InlineIcon */
                                ],
                                {
                                  __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 235,
                                  },
                                  __self: _this2,
                                },
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                  __WEBPACK_IMPORTED_MODULE_6__components_icons__[
                                    'a' /* default */
                                  ],
                                  {
                                    glyph: 'notification',
                                    size: '16',
                                    __source: {
                                      fileName: _jsxFileName,
                                      lineNumber: 236,
                                    },
                                    __self: _this2,
                                  }
                                )
                              ),
                              ' ',
                              'at the top of a post.'
                            ),
                          setting.type === 'newThreadCreated' &&
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                                'n' /* Notice */
                              ],
                              {
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 243,
                                },
                                __self: _this2,
                              },
                              "You can turn off email notifications for individual channels by turning thread notifications off on in the sidebar of the individual channel's page."
                            ),
                          setting.type === 'newMention' &&
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                                'n' /* Notice */
                              ],
                              {
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 251,
                                },
                                __self: _this2,
                              },
                              'If you mute a specific conversation, new @mentions will not send you an email.'
                            )
                        )
                      )
                    );
                  })
                )
              );
            },
          },
        ]);

        return EmailSettings;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_4__api_user__[
          'h' /* toggleNotificationSettingsMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_4__api_user__[
          'i' /* updateUserEmailMutation */
        ],
        Object(__WEBPACK_IMPORTED_MODULE_1_react_redux__['a' /* connect */])()
      )(EmailSettings);

      /***/
    },

  /***/ './src/views/userSettings/components/invoices.js':
    /*!*******************************************************!*\
  !*** ./src/views/userSettings/components/invoices.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_1_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_user__ = __webpack_require__(
        /*! ../../../api/user */ './src/api/user.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_listItems__ = __webpack_require__(
        /*! ../../../components/listItems */ './src/components/listItems/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__helpers_utils__ = __webpack_require__(
        /*! ../../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/userSettings/components/invoices.js';

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

      var InvoicesPure = (function(_Component) {
        _inherits(InvoicesPure, _Component);

        function InvoicesPure() {
          _classCallCheck(this, InvoicesPure);

          return _possibleConstructorReturn(
            this,
            (
              InvoicesPure.__proto__ || Object.getPrototypeOf(InvoicesPure)
            ).apply(this, arguments)
          );
        }

        _createClass(InvoicesPure, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props$data = this.props.data,
                error = _props$data.error,
                user = _props$data.user;

              if (!user || user.invoices.length === 0 || error !== undefined) {
                return null;
              }

              var invoices = user.invoices;

              var sortedInvoices = Object(
                __WEBPACK_IMPORTED_MODULE_6__helpers_utils__[
                  'f' /* sortByDate */
                ]
              )(invoices.slice(), 'paidAt', 'desc');

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__[
                  'p' /* StyledCard */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 28,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__[
                    'g' /* LargeListHeading */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 29,
                    },
                    __self: this,
                  },
                  'Payment History'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__[
                    'h' /* ListContainer */
                  ],
                  {
                    style: { marginTop: '16px' },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 31,
                    },
                    __self: this,
                  },
                  sortedInvoices &&
                    sortedInvoices.map(function(invoice) {
                      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_5__components_listItems__[
                          'e' /* InvoiceListItem */
                        ],
                        {
                          invoice: invoice,
                          key: invoice.id,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 34,
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

        return InvoicesPure;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var Invoices = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_3__api_user__['g' /* getUserInvoices */],
        __WEBPACK_IMPORTED_MODULE_4__components_loading__[
          'p' /* displayLoadingCard */
        ],
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])()
      )(InvoicesPure);

      /* harmony default export */ __webpack_exports__['a'] = Invoices;

      /***/
    },

  /***/ './src/views/userSettings/components/notificationSettings.js':
    /*!*******************************************************************!*\
  !*** ./src/views/userSettings/components/notificationSettings.js ***!
  \*******************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_2_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_formElements__ = __webpack_require__(
        /*! ../../../components/formElements */ './src/components/formElements/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_web_push_manager__ = __webpack_require__(
        /*! ../../../helpers/web-push-manager */ './src/helpers/web-push-manager.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helpers_localStorage__ = __webpack_require__(
        /*! ../../../helpers/localStorage */ './src/helpers/localStorage.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__helpers_events__ = __webpack_require__(
        /*! ../../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__actions_toasts__ = __webpack_require__(
        /*! ../../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__api_web_push_subscriptions__ = __webpack_require__(
        /*! ../../../api/web-push-subscriptions */ './src/api/web-push-subscriptions.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__style__ = __webpack_require__(
        /*! ../style */ './src/views/userSettings/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/userSettings/components/notificationSettings.js';

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

      var NotificationSettings = (function(_Component) {
        _inherits(NotificationSettings, _Component);

        function NotificationSettings() {
          var _ref;

          var _temp, _this, _ret;

          _classCallCheck(this, NotificationSettings);

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
                NotificationSettings.__proto__ ||
                Object.getPrototypeOf(NotificationSettings)).call.apply(
                _ref,
                [this].concat(args)
              )
            )),
            _this)),
            (_this.state = {
              webPushBlocked: false,
              subscription: null,
            }),
            (_this.subscribeToWebPush = function() {
              Object(
                __WEBPACK_IMPORTED_MODULE_6__helpers_events__['b' /* track */]
              )('browser push notifications', 'prompt triggered');
              __WEBPACK_IMPORTED_MODULE_4__helpers_web_push_manager__[
                'a' /* default */
              ]
                .subscribe()
                .then(function(subscription) {
                  Object(
                    __WEBPACK_IMPORTED_MODULE_6__helpers_events__[
                      'b' /* track */
                    ]
                  )('browser push notifications', 'subscribed');
                  Object(
                    __WEBPACK_IMPORTED_MODULE_5__helpers_localStorage__[
                      'b' /* removeItemFromStorage */
                    ]
                  )('webPushPromptDismissed');
                  _this.setState({
                    subscription: subscription,
                    webPushBlocked: false,
                  });
                  return _this.props.subscribeToWebPush(subscription);
                })
                .catch(function(err) {
                  Object(
                    __WEBPACK_IMPORTED_MODULE_6__helpers_events__[
                      'b' /* track */
                    ]
                  )('browser push notifications', 'blocked');
                  console.log(
                    'error subscribing to browser notifications',
                    err
                  );
                  return _this.props.dispatch(
                    Object(
                      __WEBPACK_IMPORTED_MODULE_7__actions_toasts__[
                        'a' /* addToastWithTimeout */
                      ]
                    )(
                      'error',
                      "Oops, we couldn't enable browser notifications for you. Please try again!"
                    )
                  );
                });
            }),
            (_this.unsubscribeFromWebPush = function() {
              Object(
                __WEBPACK_IMPORTED_MODULE_6__helpers_events__['b' /* track */]
              )('browser push notifications', 'unsubscription triggered');
              __WEBPACK_IMPORTED_MODULE_4__helpers_web_push_manager__[
                'a' /* default */
              ]
                .unsubscribe()
                .then(function(result) {
                  if (result) {
                    Object(
                      __WEBPACK_IMPORTED_MODULE_6__helpers_events__[
                        'b' /* track */
                      ]
                    )('browser push notifications', 'unsubscribe');
                    _this.setState({
                      subscription: false,
                    });
                  } else {
                    return _this.props.dispatch(
                      Object(
                        __WEBPACK_IMPORTED_MODULE_7__actions_toasts__[
                          'a' /* addToastWithTimeout */
                        ]
                      )(
                        'error',
                        "Oops, we couldn't disable browser notifications for you. Please try again!"
                      )
                    );
                  }
                })
                .catch(function(err) {
                  console.log(
                    'error unsubscribing from browser notifications',
                    err
                  );
                  return _this.props.dispatch(
                    Object(
                      __WEBPACK_IMPORTED_MODULE_7__actions_toasts__[
                        'a' /* addToastWithTimeout */
                      ]
                    )(
                      'error',
                      "Oops, we couldn't disable browser notifications for you. Please try again!"
                    )
                  );
                });
            }),
            _temp)),
            _possibleConstructorReturn(_this, _ret)
          );
        }

        _createClass(NotificationSettings, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              var _this2 = this;

              __WEBPACK_IMPORTED_MODULE_4__helpers_web_push_manager__[
                'a' /* default */
              ]
                .getPermissionState()
                .then(function(result) {
                  if (result === 'denied') {
                    _this2.setState({
                      webPushBlocked: true,
                    });
                  }
                });
              __WEBPACK_IMPORTED_MODULE_4__helpers_web_push_manager__[
                'a' /* default */
              ]
                .getSubscription()
                .then(function(subscription) {
                  _this2.setState({
                    subscription: subscription || false,
                  });
                });
            },
          },
          {
            key: 'render',
            value: function render() {
              var _state = this.state,
                webPushBlocked = _state.webPushBlocked,
                subscription = _state.subscription;

              var onChange = !subscription
                ? this.subscribeToWebPush
                : this.unsubscribeFromWebPush;

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                  'p' /* StyledCard */
                ],
                {
                  smallOnly: this.props.smallOnly,
                  largeOnly: this.props.largeOnly,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 101,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                    'j' /* ListHeader */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 105,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                      'g' /* LargeListHeading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 106,
                      },
                      __self: this,
                    },
                    'Notification Preferences'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                    'h' /* ListContainer */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 108,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__style__[
                      'c' /* EmailListItem */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 109,
                      },
                      __self: this,
                    },
                    subscription !== null &&
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_3__components_formElements__[
                          'a' /* Checkbox */
                        ],
                        {
                          checked: !!subscription,
                          disabled: webPushBlocked,
                          onChange: onChange,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 111,
                          },
                          __self: this,
                        },
                        'Enable browser push notifications'
                      ),
                    webPushBlocked &&
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                          'n' /* Notice */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 120,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'strong',
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 121,
                            },
                            __self: this,
                          },
                          'You have blocked browser push notifications on this device!'
                        ),
                        ' ',
                        'Unblock them by following',
                        ' ',
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'a',
                          {
                            href:
                              'https://support.sendpulse.com/456261-How-to-Unblock-Web-Push-Notifications',
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 125,
                            },
                            __self: this,
                          },
                          'these steps'
                        ),
                        '.'
                      )
                  )
                )
              );
            },
          },
        ]);

        return NotificationSettings;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_8__api_web_push_subscriptions__[
          'a' /* subscribeToWebPush */
        ],
        Object(__WEBPACK_IMPORTED_MODULE_1_react_redux__['a' /* connect */])()
      )(NotificationSettings);

      /***/
    },

  /***/ './src/views/userSettings/components/recurringPaymentsList.js':
    /*!********************************************************************!*\
  !*** ./src/views/userSettings/components/recurringPaymentsList.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_2_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_listItems__ = __webpack_require__(
        /*! ../../../components/listItems */ './src/components/listItems/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_upsell__ = __webpack_require__(
        /*! ../../../components/upsell */ './src/components/upsell/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__actions_modals__ = __webpack_require__(
        /*! ../../../actions/modals */ './src/actions/modals.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__helpers_utils__ = __webpack_require__(
        /*! ../../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__api_user__ = __webpack_require__(
        /*! ../../../api/user */ './src/api/user.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/userSettings/components/recurringPaymentsList.js',
        _this = this;

      //$FlowFixMe

      //$FlowFixMe

      var RecurringPaymentsList = function RecurringPaymentsList(_ref) {
        var user = _ref.data.user,
          currentUser = _ref.currentUser,
          dispatch = _ref.dispatch;

        var openProModal = function openProModal() {
          dispatch(
            Object(
              __WEBPACK_IMPORTED_MODULE_6__actions_modals__['b' /* openModal */]
            )('UPGRADE_MODAL', { user: currentUser })
          );
        };

        if (!user || user === undefined) return null;

        // make sure to only display active subs for now
        var filteredRecurringPayments =
          user.recurringPayments && user.recurringPayments.length > 0
            ? user.recurringPayments.filter(function(sub) {
                return sub.status === 'active';
              })
            : [];

        if (filteredRecurringPayments.length > 0) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_10__components_listItems_style__[
              'p' /* StyledCard */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 35,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_10__components_listItems_style__[
                'j' /* ListHeader */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 36,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_10__components_listItems_style__[
                  'g' /* LargeListHeading */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 37,
                  },
                  __self: _this,
                },
                'Pro'
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_10__components_listItems_style__[
                'h' /* ListContainer */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 39,
                },
                __self: _this,
              },
              filteredRecurringPayments.map(function(payment) {
                var amount = payment.amount / 100;
                var timestamp = new Date(payment.createdAt * 1000).getTime();
                var created = Object(
                  __WEBPACK_IMPORTED_MODULE_7__helpers_utils__[
                    'b' /* convertTimestampToDate */
                  ]
                )(timestamp);
                var meta = '$' + amount + '/month \xB7 Upgraded on ' + created;
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__components_listItems__[
                    'a' /* BillingListItem */
                  ],
                  {
                    key: payment.createdAt,
                    contents: { name: payment.plan },
                    withDescription: false,
                    meta: meta,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 46,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_4__components_buttons__[
                      'd' /* IconButton */
                    ],
                    {
                      glyph: 'settings',
                      onClick: openProModal,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 52,
                      },
                      __self: _this,
                    }
                  )
                );
              })
            )
          );
        } else {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_5__components_upsell__[
              'i' /* UpsellUpgradeToPro */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 60,
              },
              __self: _this,
            }
          );
        }
      };

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_8__api_user__[
          'f' /* getCurrentUserRecurringPayments */
        ],
        __WEBPACK_IMPORTED_MODULE_9__components_loading__[
          'p' /* displayLoadingCard */
        ],
        Object(__WEBPACK_IMPORTED_MODULE_1_react_redux__['a' /* connect */])()
      )(RecurringPaymentsList);

      /***/
    },

  /***/ './src/views/userSettings/index.js':
    /*!*****************************************!*\
  !*** ./src/views/userSettings/index.js ***!
  \*****************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_events__ = __webpack_require__(
        /*! ../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_appViewWrapper__ = __webpack_require__(
        /*! ../../components/appViewWrapper */ './src/components/appViewWrapper/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_column__ = __webpack_require__(
        /*! ../../components/column */ './src/components/column/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_loading__ = __webpack_require__(
        /*! ../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_editForm__ = __webpack_require__(
        /*! ../../components/editForm */ './src/components/editForm/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_recurringPaymentsList__ = __webpack_require__(
        /*! ./components/recurringPaymentsList */ './src/views/userSettings/components/recurringPaymentsList.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_emailSettings__ = __webpack_require__(
        /*! ./components/emailSettings */ './src/views/userSettings/components/emailSettings.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_notificationSettings__ = __webpack_require__(
        /*! ./components/notificationSettings */ './src/views/userSettings/components/notificationSettings.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_invoices__ = __webpack_require__(
        /*! ./components/invoices */ './src/views/userSettings/components/invoices.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__queries__ = __webpack_require__(
        /*! ./queries */ './src/views/userSettings/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_globals__ = __webpack_require__(
        /*! ../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_viewError__ = __webpack_require__(
        /*! ../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__titlebar__ = __webpack_require__(
        /*! ../titlebar */ './src/views/titlebar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/userSettings/index.js';

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

      var UserSettings = (function(_React$Component) {
        _inherits(UserSettings, _React$Component);

        function UserSettings() {
          _classCallCheck(this, UserSettings);

          return _possibleConstructorReturn(
            this,
            (
              UserSettings.__proto__ || Object.getPrototypeOf(UserSettings)
            ).apply(this, arguments)
          );
        }

        _createClass(UserSettings, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              Object(
                __WEBPACK_IMPORTED_MODULE_3__helpers_events__['b' /* track */]
              )('user', 'settings viewed', null);
            },
          },
          {
            key: 'render',
            value: function render() {
              var _props = this.props,
                user = _props.data.user,
                data = _props.data,
                isLoading = _props.isLoading,
                currentUser = _props.currentUser;

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_6__components_loading__[
                    'a' /* Loading */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 39,
                    },
                    __self: this,
                  }
                );
              }

              // if the user has data in the store, but no user was returned from the query, we likely have a mismatch in their localstorage data and session cookie. In this case, when they hit the error view we'll automatically clear the user's localstorage so that on refresh they will be prompted to log in again
              if (currentUser && !user) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_13__components_globals__[
                    'a' /* FlexCol */
                  ],
                  {
                    style: { flex: 'auto' },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 45,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_15__titlebar__['a' /* default */],
                    {
                      title: 'No User Found',
                      provideBack: true,
                      backRoute: '/',
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 46,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__components_appViewWrapper__[
                      'a' /* default */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 52,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_14__components_viewError__[
                        'a' /* default */
                      ],
                      {
                        heading:
                          'We ran into an error finding this user’s settings.',
                        subheading:
                          'If you are trying to view your own settings, refresh the page below to log in again.',
                        clearStorage: true,
                        refresh: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 53,
                        },
                        __self: this,
                      }
                    )
                  )
                );
              }

              // if no data was found but the user is logged in, it means the person was trying to view a user settings page for a user that doesn't exist in the db
              if (currentUser && !user) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_13__components_globals__[
                    'a' /* FlexCol */
                  ],
                  {
                    style: { flex: 'auto' },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 69,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_15__titlebar__['a' /* default */],
                    {
                      title: 'User not found',
                      provideBack: true,
                      backRoute: '/',
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 70,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__components_appViewWrapper__[
                      'a' /* default */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 76,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_14__components_viewError__[
                        'a' /* default */
                      ],
                      {
                        heading: 'We couldn’t find a user with this username.',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 77,
                        },
                        __self: this,
                      }
                    )
                  )
                );
              }

              // if the user isn't logged in, or for some reason the user settings that were returned don't match the user id in the store, we show a warning error state
              if (!currentUser || user.id !== currentUser.id) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_13__components_globals__[
                    'a' /* FlexCol */
                  ],
                  {
                    style: { flex: 'auto' },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 88,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_15__titlebar__['a' /* default */],
                    {
                      title: 'No Permission',
                      provideBack: true,
                      backRoute: '/',
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 89,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__components_appViewWrapper__[
                      'a' /* default */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 95,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_14__components_viewError__[
                        'a' /* default */
                      ],
                      {
                        heading:
                          'These aren\u2019t the settings you\u2019re looking for.',
                        subheading:
                          'You can only view your own user settings. Head on back.',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 96,
                        },
                        __self: this,
                      }
                    )
                  )
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_13__components_globals__[
                  'a' /* FlexCol */
                ],
                {
                  style: { flex: 'auto' },
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 106,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_15__titlebar__['a' /* default */],
                  {
                    title: user.name,
                    subtitle: 'Settings',
                    provideBack: true,
                    backRoute: '/' + user.username,
                    noComposer: true,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 107,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_4__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 114,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_5__components_column__[
                      'b' /* default */
                    ],
                    {
                      type: 'secondary',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 115,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_7__components_editForm__[
                        'a' /* UserEditForm */
                      ],
                      {
                        user: data,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 116,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_9__components_emailSettings__[
                        'a' /* default */
                      ],
                      {
                        smallOnly: true,
                        currentUser: user,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 117,
                        },
                        __self: this,
                      }
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_5__components_column__[
                      'b' /* default */
                    ],
                    {
                      type: 'primary',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 120,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_8__components_recurringPaymentsList__[
                        'a' /* default */
                      ],
                      {
                        data: data,
                        currentUser: user,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 121,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_9__components_emailSettings__[
                        'a' /* default */
                      ],
                      {
                        largeOnly: true,
                        currentUser: user,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 122,
                        },
                        __self: this,
                      }
                    ),
                    'serviceWorker' in navigator &&
                      'PushManager' in window &&
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_10__components_notificationSettings__[
                          'a' /* default */
                        ],
                        {
                          largeOnly: true,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 124,
                          },
                          __self: this,
                        }
                      ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_11__components_invoices__[
                        'a' /* default */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 125,
                        },
                        __self: this,
                      }
                    )
                  )
                )
              );
            },
          },
        ]);

        return UserSettings;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var map = function map(state) {
        return {
          currentUser: state.users.currentUser,
        };
      };

      /* harmony default export */ __webpack_exports__[
        'default'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(
          map
        ),
        __WEBPACK_IMPORTED_MODULE_12__queries__['a' /* GetUserProfile */],
        __WEBPACK_IMPORTED_MODULE_16__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(UserSettings);

      /***/
    },

  /***/ './src/views/userSettings/queries.js':
    /*!*******************************************!*\
  !*** ./src/views/userSettings/queries.js ***!
  \*******************************************/
    /*! exports provided: GET_USER_PROFILE_QUERY, GET_USER_PROFILE_OPTIONS, GetUserProfile */
    /*! exports used: GetUserProfile */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* unused harmony export GET_USER_PROFILE_QUERY */
      /* unused harmony export GET_USER_PROFILE_OPTIONS */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return GetUserProfile;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo__ = __webpack_require__(
        /*! react-apollo */ './node_modules/react-apollo/react-apollo.browser.umd.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_fragments_user_userInfo__ = __webpack_require__(
        /*! ../../api/fragments/user/userInfo */ './src/api/fragments/user/userInfo.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_fragments_user_userSettings__ = __webpack_require__(
        /*! ../../api/fragments/user/userSettings */ './src/api/fragments/user/userSettings.js'
      );
      var _templateObject = _taggedTemplateLiteral(
        [
          '\n  query getUserSettings($username: String) {\n    user(username: $username) {\n      ...userInfo\n      isPro\n      email\n      pendingEmail\n      ...userSettings\n    }\n  }\n  ',
          '\n  ',
          '\n',
        ],
        [
          '\n  query getUserSettings($username: String) {\n    user(username: $username) {\n      ...userInfo\n      isPro\n      email\n      pendingEmail\n      ...userSettings\n    }\n  }\n  ',
          '\n  ',
          '\n',
        ]
      );

      function _taggedTemplateLiteral(strings, raw) {
        return Object.freeze(
          Object.defineProperties(strings, {
            raw: { value: Object.freeze(raw) },
          })
        );
      }

      // $FlowFixMe

      var GET_USER_PROFILE_QUERY = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql']
      )(
        _templateObject,
        __WEBPACK_IMPORTED_MODULE_1__api_fragments_user_userInfo__[
          'a' /* userInfoFragment */
        ],
        __WEBPACK_IMPORTED_MODULE_2__api_fragments_user_userSettings__[
          'a' /* userSettingsFragment */
        ]
      );

      var GET_USER_PROFILE_OPTIONS = {
        options: function options(_ref) {
          var username = _ref.match.params.username;
          return {
            variables: {
              username: username,
            },
            fetchPolicy: 'network-only',
          };
        },
      };

      var GetUserProfile = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(GET_USER_PROFILE_QUERY, GET_USER_PROFILE_OPTIONS);

      /***/
    },

  /***/ './src/views/userSettings/style.js':
    /*!*****************************************!*\
  !*** ./src/views/userSettings/style.js ***!
  \*****************************************/
    /*! exports provided: EmailListItem, CheckboxContent, EmailForm */
    /*! exports used: CheckboxContent, EmailForm, EmailListItem */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return EmailListItem;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return CheckboxContent;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return EmailForm;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );

      var EmailListItem = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__EmailListItem',
        componentId: 's1lm2558-0',
      })(
        [
          'padding:8px 0 16px;border-bottom:2px solid ',
          ';&:last-of-type{border-bottom:none;}input{margin-right:8px;}',
        ],
        function(props) {
          return props.theme.bg.wash;
        }
      );

      var CheckboxContent = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__CheckboxContent',
        componentId: 's1lm2558-1',
      })(['display:flex;flex-direction:column;']);

      var EmailForm = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].form.withConfig({
        displayName: 'style__EmailForm',
        componentId: 's1lm2558-2',
      })([
        'display:flex;align-items:flex-end;button{align-self:flex-end;margin-left:16px;}',
      ]);

      /***/
    },
});
//# sourceMappingURL=UserSettings.chunk.js.map
