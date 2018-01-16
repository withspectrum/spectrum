webpackJsonp([6], {
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

  /***/ './src/api/slackImport.js':
    /*!********************************!*\
  !*** ./src/api/slackImport.js ***!
  \********************************/
    /*! exports provided: getSlackImport, sendSlackInvitationsMutation */
    /*! exports used: getSlackImport, sendSlackInvitationsMutation */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return getSlackImport;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return sendSlackInvitationsMutation;
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
            '\n    query getSlackImport($id: ID!) {\n      community(id: $id) {\n        id\n        slackImport {\n          members\n          teamName\n          sent\n        }\n      }\n    }\n  ',
          ],
          [
            '\n    query getSlackImport($id: ID!) {\n      community(id: $id) {\n        id\n        slackImport {\n          members\n          teamName\n          sent\n        }\n      }\n    }\n  ',
          ]
        ),
        _templateObject2 = _taggedTemplateLiteral(
          [
            '\n  mutation sendSlackInvites($input: SendSlackInvitesInput!) {\n    sendSlackInvites(input: $input) {\n      id\n      slackImport {\n        members\n        teamName\n        sent\n      }\n    }\n  }\n',
          ],
          [
            '\n  mutation sendSlackInvites($input: SendSlackInvitesInput!) {\n    sendSlackInvites(input: $input) {\n      id\n      slackImport {\n        members\n        teamName\n        sent\n      }\n    }\n  }\n',
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

      var getSlackImportOptions = {
        options: function options(_ref) {
          var id = _ref.id;
          return {
            variables: {
              id: id,
            },
          };
        },
      };

      var getSlackImport = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(
        Object(__WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql'])(
          _templateObject
        ),
        getSlackImportOptions
      );

      var SEND_SLACK_INVITATIONS_MUTATION = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql']
      )(_templateObject2);
      var SEND_SLACK_INVITATIONS_OPTIONS = {
        props: function props(_ref2) {
          var input = _ref2.input,
            mutate = _ref2.mutate;
          return {
            sendSlackInvites: function sendSlackInvites(input) {
              return mutate({
                variables: {
                  input: input,
                },
              });
            },
          };
        },
      };

      var sendSlackInvitationsMutation = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(SEND_SLACK_INVITATIONS_MUTATION, SEND_SLACK_INVITATIONS_OPTIONS);

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

  /***/ './src/components/emailInvitationForm/index.js':
    /*!*****************************************************!*\
  !*** ./src/components/emailInvitationForm/index.js ***!
  \*****************************************************/
    /*! exports provided: CommunityInvitationForm, ChannelInvitationForm */
    /*! exports used: CommunityInvitationForm */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return CommunityInvitationForm;
        }
      );
      /* unused harmony export ChannelInvitationForm */
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
        /*! ../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__icons__ = __webpack_require__(
        /*! ../icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_validator_lib_isEmail__ = __webpack_require__(
        /*! validator/lib/isEmail */ './node_modules/validator/lib/isEmail.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_validator_lib_isEmail___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_6_validator_lib_isEmail__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__api_community__ = __webpack_require__(
        /*! ../../api/community */ './src/api/community.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__api_channel__ = __webpack_require__(
        /*! ../../api/channel */ './src/api/channel.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__buttons__ = __webpack_require__(
        /*! ../buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__formElements__ = __webpack_require__(
        /*! ../formElements */ './src/components/formElements/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__settingsViews_style__ = __webpack_require__(
        /*! ../settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__style__ = __webpack_require__(
        /*! ./style */ './src/components/emailInvitationForm/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/components/emailInvitationForm/index.js';

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

      function _objectWithoutProperties(obj, keys) {
        var target = {};
        for (var i in obj) {
          if (keys.indexOf(i) >= 0) continue;
          if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
          target[i] = obj[i];
        }
        return target;
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

      var EmailInvitationForm = (function(_React$Component) {
        _inherits(EmailInvitationForm, _React$Component);

        function EmailInvitationForm() {
          _classCallCheck(this, EmailInvitationForm);

          var _this = _possibleConstructorReturn(
            this,
            (
              EmailInvitationForm.__proto__ ||
              Object.getPrototypeOf(EmailInvitationForm)
            ).call(this)
          );

          _this.getUniqueEmails = function(array) {
            return array.filter(function(x, i, a) {
              return a.indexOf(x) === i;
            });
          };

          _this.sendInvitations = function() {
            var _this$state = _this.state,
              contacts = _this$state.contacts,
              hasCustomMessage = _this$state.hasCustomMessage,
              customMessageError = _this$state.customMessageError,
              customMessageString = _this$state.customMessageString;
            var _this$props = _this.props,
              dispatch = _this$props.dispatch,
              currentUser = _this$props.currentUser,
              sendEmailInvites = _this$props.sendEmailInvites;

            _this.setState({ isLoading: true });

            var validContacts = contacts
              .filter(function(contact) {
                return contact.error === false;
              })
              .filter(function(contact) {
                return contact.email !== currentUser.email;
              })
              .filter(function(contact) {
                return contact.email.length > 0;
              })
              .filter(function(contact) {
                return __WEBPACK_IMPORTED_MODULE_6_validator_lib_isEmail___default()(
                  contact.email
                );
              })
              .map(function(_ref) {
                var error = _ref.error,
                  contact = _objectWithoutProperties(_ref, ['error']);

                return Object.assign({}, contact);
              });

            var customMessage =
              hasCustomMessage && !customMessageError
                ? customMessageString
                : null;

            // make sure to uniqify the emails so you can't enter on email multiple times
            validContacts = _this.getUniqueEmails(validContacts);

            if (validContacts.length === 0) {
              _this.setState({
                isLoading: false,
              });

              return dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_4__actions_toasts__[
                    'a' /* addToastWithTimeout */
                  ]
                )('error', 'No emails entered - try again!')
              );
            }

            sendEmailInvites({
              id: _this.props.id,
              contacts: validContacts,
              customMessage: customMessage,
            })
              .then(function(_ref2) {
                var sendEmailInvites = _ref2.data.sendEmailInvites;

                _this.setState({
                  isLoading: false,
                  contacts: [
                    {
                      email: '',
                      firstName: '',
                      lastName: '',
                      error: false,
                    },
                    {
                      email: '',
                      firstName: '',
                      lastName: '',
                      error: false,
                    },
                    {
                      email: '',
                      firstName: '',
                      lastName: '',
                      error: false,
                    },
                  ],
                  hasCustomMessage: false,
                  customMessageString: '',
                  customMessageError: false,
                });

                dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_4__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )(
                    'success',
                    'Invitations sent to ' +
                      (validContacts.length > 1
                        ? validContacts.length + ' people'
                        : validContacts.length + ' person') +
                      '!'
                  )
                );
              })
              .catch(function(err) {
                _this.setState({
                  isLoading: false,
                });
                dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_4__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('error', err.message)
                );
              });
          };

          _this.handleChange = function(e, i, key) {
            var contacts = _this.state.contacts;

            contacts[i][key] = e.target.value;

            _this.setState(
              Object.assign({}, _this.state, {
                contacts: contacts,
              })
            );
          };

          _this.addRow = function() {
            var contacts = _this.state.contacts;

            contacts.push({
              email: '',
              firstName: '',
              lastName: '',
              error: false,
            });

            _this.setState(
              Object.assign({}, _this.state, {
                contacts: contacts,
              })
            );
          };

          _this.removeRow = function(index) {
            var contacts = _this.state.contacts;

            contacts.splice(index, 1);
            _this.setState(
              Object.assign({}, _this.state, {
                contacts: contacts,
              })
            );
          };

          _this.validate = function(e, i) {
            var contacts = _this.state.contacts;

            if (
              !__WEBPACK_IMPORTED_MODULE_6_validator_lib_isEmail___default()(
                e.target.value
              )
            ) {
              contacts[i].error = true;
            } else {
              contacts[i].error = false;
            }

            _this.setState(
              Object.assign({}, _this.state, {
                contacts: contacts,
              })
            );
          };

          _this.handleCustomMessageChange = function(e) {
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
            isLoading: false,
            contacts: [
              {
                email: '',
                firstName: '',
                lastName: '',
                error: false,
              },
              {
                email: '',
                firstName: '',
                lastName: '',
                error: false,
              },
              {
                email: '',
                firstName: '',
                lastName: '',
                error: false,
              },
            ],
            hasCustomMessage: false,
            customMessageString: '',
            customMessageError: false,
          };
          return _this;
        }

        _createClass(EmailInvitationForm, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _state = this.state,
                contacts = _state.contacts,
                isLoading = _state.isLoading,
                hasCustomMessage = _state.hasCustomMessage,
                customMessageString = _state.customMessageString,
                customMessageError = _state.customMessageError;

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 246,
                  },
                  __self: this,
                },
                contacts.map(function(contact, i) {
                  return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_12__style__[
                      'd' /* EmailInviteForm */
                    ],
                    {
                      key: i,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 249,
                      },
                      __self: _this2,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__style__[
                        'e' /* EmailInviteInput */
                      ],
                      {
                        error: contact.error,
                        type: 'email',
                        onBlur: function onBlur(e) {
                          return _this2.validate(e, i);
                        },
                        placeholder: 'Email address',
                        value: contact.email,
                        onChange: function onChange(e) {
                          return _this2.handleChange(e, i, 'email');
                        },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 250,
                        },
                        __self: _this2,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__style__[
                        'e' /* EmailInviteInput */
                      ],
                      {
                        type: 'text',
                        placeholder: 'First name (optional)',
                        value: contact.firstName,
                        onChange: function onChange(e) {
                          return _this2.handleChange(e, i, 'firstName');
                        },
                        hideOnMobile: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 258,
                        },
                        __self: _this2,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__style__[
                        'f' /* RemoveRow */
                      ],
                      {
                        onClick: function onClick() {
                          return _this2.removeRow(i);
                        },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 265,
                        },
                        __self: _this2,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_5__icons__['a' /* default */],
                        {
                          glyph: 'view-close',
                          size: '16',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 266,
                          },
                          __self: _this2,
                        }
                      )
                    )
                  );
                }),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_12__style__['a' /* AddRow */],
                  {
                    onClick: this.addRow,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 272,
                    },
                    __self: this,
                  },
                  '+ Add another'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_12__style__[
                    'c' /* CustomMessageToggle */
                  ],
                  {
                    onClick: this.toggleCustomMessage,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 274,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_5__icons__['a' /* default */],
                    {
                      glyph: hasCustomMessage ? 'view-close' : 'post',
                      size: 20,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 275,
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
                        __WEBPACK_IMPORTED_MODULE_12__style__[
                          'b' /* CustomMessageTextAreaStyles */
                        ],
                        {
                          border: customMessageError
                            ? '2px solid #E3353C'
                            : '2px solid #DFE7EF',
                        }
                      ),
                      onChange: this.handleCustomMessageChange,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 282,
                      },
                      __self: this,
                    }
                  ),
                hasCustomMessage &&
                  customMessageError &&
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_10__formElements__[
                      'c' /* Error */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 298,
                      },
                      __self: this,
                    },
                    'Your custom invitation message can be up to 500 characters.'
                  ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_11__settingsViews_style__[
                    'g' /* SectionCardFooter */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 303,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_9__buttons__['a' /* Button */],
                    {
                      loading: isLoading,
                      onClick: this.sendInvitations,
                      disabled: hasCustomMessage && customMessageError,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 304,
                      },
                      __self: this,
                    },
                    'Send Invitations'
                  )
                )
              );
            },
          },
        ]);

        return EmailInvitationForm;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var map = function map(state) {
        return { currentUser: state.users.currentUser };
      };

      var CommunityInvitationForm = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        // $FlowIssue
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(
          map
        ),
        __WEBPACK_IMPORTED_MODULE_7__api_community__[
          'o' /* sendCommunityEmailInvitationsMutation */
        ]
      )(EmailInvitationForm);

      var ChannelInvitationForm = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        // $FlowIssue
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(
          map
        ),
        __WEBPACK_IMPORTED_MODULE_8__api_channel__[
          'i' /* sendChannelEmailInvitationMutation */
        ]
      )(EmailInvitationForm);

      /***/
    },

  /***/ './src/components/emailInvitationForm/style.js':
    /*!*****************************************************!*\
  !*** ./src/components/emailInvitationForm/style.js ***!
  \*****************************************************/
    /*! exports provided: EmailInviteForm, EmailInviteInput, AddRow, RemoveRow, CustomMessageToggle, CustomMessageTextAreaStyles */
    /*! exports used: AddRow, CustomMessageTextAreaStyles, CustomMessageToggle, EmailInviteForm, EmailInviteInput, RemoveRow */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return EmailInviteForm;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return EmailInviteInput;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return AddRow;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'f',
        function() {
          return RemoveRow;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return CustomMessageToggle;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return CustomMessageTextAreaStyles;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );

      var EmailInviteForm = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__EmailInviteForm',
        componentId: 's1vvoo0f-0',
      })(['display:flex;align-items:center;&:first-of-type{margin-top:16px;}']);

      var EmailInviteInput = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].input.withConfig({
        displayName: 'style__EmailInviteInput',
        componentId: 's1vvoo0f-1',
      })(
        [
          'display:flex;flex:1 1 50%;padding:8px 12px;font-size:14px;border-radius:4px;border:2px solid ',
          ';margin-bottom:8px;margin-top:8px;margin-left:4px;margin-right:4px;&:first-of-type{margin-left:0;}&:last-of-type{margin-right:0;}&:focus{border:2px solid ',
          ';}@media screen and (max-width:768px){display:',
          ';}',
        ],
        function(props) {
          return props.error ? props.theme.warn.default : props.theme.bg.border;
        },
        function(props) {
          return props.theme.brand.default;
        },
        function(props) {
          return props.hideOnMobile ? 'none' : 'auto';
        }
      );

      var AddRow = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__AddRow',
        componentId: 's1vvoo0f-2',
      })(
        [
          'display:flex;width:100%;justify-content:center;padding:8px;background:',
          ';margin-top:8px;margin-bottom:16px;font-size:14px;color:',
          ';font-weight:500;border-radius:4px;&:hover{color:',
          ';cursor:pointer;}',
        ],
        function(props) {
          return props.theme.bg.wash;
        },
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.text.default;
        }
      );

      var RemoveRow = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__RemoveRow',
        componentId: 's1vvoo0f-3',
      })(
        ['margin-left:4px;color:', ';&:hover{cursor:pointer;color:', ';}'],
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.text.default;
        }
      );

      var CustomMessageToggle = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h4.withConfig({
        displayName: 'style__CustomMessageToggle',
        componentId: 's1vvoo0f-4',
      })(
        [
          'font-size:14px;color:',
          ';margin-top:16px;&:hover{color:',
          ';cursor:pointer;}div{position:relative;top:5px;margin-right:4px;}',
        ],
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.brand.default;
        }
      );

      var CustomMessageTextAreaStyles = {
        width: '100%',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '8px',
        fontSize: '14px',
      };

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
                        lineNumber: 159,
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
                          lineNumber: 160,
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
                          lineNumber: 161,
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
                          lineNumber: 165,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        'strong',
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 166,
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
                          lineNumber: 170,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        'a',
                        {
                          href: url,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 171,
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
                              lineNumber: 172,
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
                        lineNumber: 180,
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
                          lineNumber: 181,
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
                          lineNumber: 182,
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
                            lineNumber: 183,
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
                          lineNumber: 195,
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
                            lineNumber: 196,
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
                            lineNumber: 197,
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
                              lineNumber: 199,
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
                            lineNumber: 203,
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
                              lineNumber: 204,
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
                          lineNumber: 210,
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
                            lineNumber: 211,
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
                            lineNumber: 212,
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
                              lineNumber: 214,
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
                            lineNumber: 219,
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
                              lineNumber: 220,
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
                              lineNumber: 230,
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
                              lineNumber: 246,
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
                            lineNumber: 251,
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
                              lineNumber: 252,
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
                      lineNumber: 268,
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
              lineNumber: 276,
            },
            __self: _this2,
          },
          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
            ImportSlack,
            Object.assign({}, props, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 277,
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
              lineNumber: 281,
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

  /***/ './src/views/newCommunity/components/createCommunityForm/index.js':
    /*!************************************************************************!*\
  !*** ./src/views/newCommunity/components/createCommunityForm/index.js ***!
  \************************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_3_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_router__ = __webpack_require__(
        /*! react-router */ './node_modules/react-router/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_slugg__ = __webpack_require__(
        /*! slugg */ './node_modules/slugg/slugg.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_slugg___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_5_slugg__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_apollo__ = __webpack_require__(
        /*! react-apollo */ './node_modules/react-apollo/react-apollo.browser.umd.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_apollo___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_6_react_apollo__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__helpers_events__ = __webpack_require__(
        /*! ../../../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_listItems_style__ = __webpack_require__(
        /*! ../../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_avatar__ = __webpack_require__(
        /*! ../../../../components/avatar */ './src/components/avatar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__helpers_utils__ = __webpack_require__(
        /*! ../../../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__actions_toasts__ = __webpack_require__(
        /*! ../../../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_shared_slug_blacklists__ = __webpack_require__(
        /*! shared/slug-blacklists */ './shared/slug-blacklists.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_shared_slug_blacklists___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_12_shared_slug_blacklists__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__api_community__ = __webpack_require__(
        /*! ../../../../api/community */ './src/api/community.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_buttons__ = __webpack_require__(
        /*! ../../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_formElements__ = __webpack_require__(
        /*! ../../../../components/formElements */ './src/components/formElements/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__style__ = __webpack_require__(
        /*! ./style */ './src/views/newCommunity/components/createCommunityForm/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__style__ = __webpack_require__(
        /*! ../../style */ './src/views/newCommunity/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/newCommunity/components/createCommunityForm/index.js';

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

      var CreateCommunityForm = (function(_Component) {
        _inherits(CreateCommunityForm, _Component);

        function CreateCommunityForm(props) {
          _classCallCheck(this, CreateCommunityForm);

          var _this = _possibleConstructorReturn(
            this,
            (
              CreateCommunityForm.__proto__ ||
              Object.getPrototypeOf(CreateCommunityForm)
            ).call(this, props)
          );

          _this.changeName = function(e) {
            var communitySuggestions = _this.state.communitySuggestions;

            if (communitySuggestions) {
              _this.setState({
                communitySuggestions: null,
              });
            }

            var name = e.target.value;
            // replace any non alpha-num characters to prevent bad community slugs
            // (/[\W_]/g, "-") => replace non-alphanum with hyphens
            // (/-{2,}/g, '-') => replace multiple hyphens in a row with one hyphen
            var lowercaseName = name
              .toLowerCase()
              .trim()
              .replace(/[\W_]/g, '-')
              .replace(/-{2,}/g, '-');
            var slug = __WEBPACK_IMPORTED_MODULE_5_slugg___default()(
              lowercaseName
            );

            if (name.length >= 20) {
              _this.setState({
                nameError: true,
              });

              return;
            }

            if (
              __WEBPACK_IMPORTED_MODULE_12_shared_slug_blacklists__[
                'COMMUNITY_SLUG_BLACKLIST'
              ].indexOf(slug) > -1
            ) {
              _this.setState({
                name: name,
                slug: slug,
                slugTaken: true,
              });
            } else {
              _this.setState({
                name: name,
                slug: slug,
                nameError: false,
                slugTaken: false,
              });

              _this.checkSlug(slug);
            }
          };

          _this.changeSlug = function(e) {
            var slug = e.target.value;
            // replace any non alpha-num characters to prevent bad community slugs
            // (/[\W_]/g, "-") => replace non-alphanum with hyphens
            // (/-{2,}/g, '-') => replace multiple hyphens in a row with one hyphen
            var lowercaseSlug = slug
              .toLowerCase()
              .trim()
              .replace(/[\W_]/g, '-')
              .replace(/-{2,}/g, '-');
            slug = __WEBPACK_IMPORTED_MODULE_5_slugg___default()(lowercaseSlug);

            if (slug.length >= 24) {
              _this.setState({
                slug: slug,
                slugError: true,
              });

              return;
            }

            if (
              __WEBPACK_IMPORTED_MODULE_12_shared_slug_blacklists__[
                'COMMUNITY_SLUG_BLACKLIST'
              ].indexOf(slug) > -1
            ) {
              _this.setState({
                slug: slug,
                slugTaken: true,
              });
            } else {
              _this.setState({
                slug: slug,
                slugError: false,
                slugTaken: false,
              });

              _this.checkSlug(slug);
            }
          };

          _this.checkSlug = function(slug) {
            // check the db to see if this channel slug exists
            _this.props.client
              .query({
                query:
                  __WEBPACK_IMPORTED_MODULE_13__api_community__[
                    'a' /* CHECK_UNIQUE_COMMUNITY_SLUG_QUERY */
                  ],
                variables: {
                  slug: slug,
                },
              })
              .then(function(_ref) {
                var data = _ref.data;

                if (
                  __WEBPACK_IMPORTED_MODULE_12_shared_slug_blacklists__[
                    'COMMUNITY_SLUG_BLACKLIST'
                  ].indexOf(_this.state.slug) > -1
                ) {
                  return _this.setState({
                    slugTaken: true,
                  });
                }
                // if the community exists
                if (
                  !data.loading &&
                  data &&
                  data.community &&
                  data.community.id
                ) {
                  return _this.setState({
                    slugTaken: true,
                  });
                } else {
                  _this.setState({
                    slugTaken: false,
                  });
                }
              });
          };

          _this.checkSuggestedCommunities = function() {
            var _this$state = _this.state,
              name = _this$state.name,
              slug = _this$state.slug,
              slugError = _this$state.slugError;

            if (
              name &&
              name.length > 1 &&
              slug &&
              slug.length > 1 &&
              !slugError
            ) {
              // if the user has found a valid url, do a community search to see if they might be creating a duplicate community
              _this.props.client
                .query({
                  query:
                    __WEBPACK_IMPORTED_MODULE_13__api_community__[
                      'b' /* SEARCH_COMMUNITIES_QUERY */
                    ],
                  variables: {
                    string: slug,
                    amount: 10,
                  },
                })
                .then(function(_ref2) {
                  var communitySuggestions = _ref2.data.searchCommunities;

                  var filtered =
                    communitySuggestions &&
                    communitySuggestions
                      .slice()
                      .sort(function(a, b) {
                        return b.metaData.members - a.metaData.members;
                      })
                      .slice(0, 5);

                  if (filtered && filtered.length > 0) {
                    _this.setState({
                      communitySuggestions: filtered,
                    });
                  } else {
                    _this.setState({
                      communitySuggestions: null,
                    });
                  }
                });
            }
          };

          _this.changeDescription = function(e) {
            var description = e.target.value;
            if (description.length >= 140) {
              _this.setState({
                descriptionError: true,
              });
              return;
            }

            _this.setState({
              description: description,
              descriptionError: false,
            });
          };

          _this.changeWebsite = function(e) {
            var website = e.target.value;
            _this.setState({
              website: website,
            });
          };

          _this.changeCoC = function() {
            var value = _this.state.agreeCoC;
            _this.setState({
              agreeCoC: !value,
            });
          };

          _this.setCommunityPhoto = function(e) {
            var reader = new FileReader();
            var file = e.target.files[0];

            if (file.size > 3000000) {
              return _this.setState({
                photoSizeError: true,
              });
            }

            reader.onloadend = function() {
              Object(
                __WEBPACK_IMPORTED_MODULE_7__helpers_events__['b' /* track */]
              )('community', 'profile photo uploaded', null);
              _this.setState({
                file: file,
                image: reader.result,
                photoSizeError: false,
              });
            };

            reader.readAsDataURL(file);
          };

          _this.setCommunityCover = function(e) {
            var reader = new FileReader();
            var file = e.target.files[0];

            if (file.size > 3000000) {
              return _this.setState({
                photoSizeError: true,
              });
            }

            reader.onloadend = function() {
              Object(
                __WEBPACK_IMPORTED_MODULE_7__helpers_events__['b' /* track */]
              )('community', 'cover photo uploaded', null);
              _this.setState({
                coverFile: file,
                coverPhoto: reader.result,
                photoSizeError: false,
              });
            };

            reader.readAsDataURL(file);
          };

          _this.create = function(e) {
            e.preventDefault();
            var _this$state2 = _this.state,
              name = _this$state2.name,
              slug = _this$state2.slug,
              description = _this$state2.description,
              website = _this$state2.website,
              file = _this$state2.file,
              coverFile = _this$state2.coverFile,
              slugTaken = _this$state2.slugTaken,
              slugError = _this$state2.slugError,
              nameError = _this$state2.nameError,
              descriptionError = _this$state2.descriptionError,
              photoSizeError = _this$state2.photoSizeError,
              agreeCoC = _this$state2.agreeCoC;

            // if an error is present, ensure the client cant submit the form

            if (
              slugTaken ||
              nameError ||
              descriptionError ||
              slugError ||
              photoSizeError ||
              !name ||
              !slug ||
              !description ||
              !agreeCoC
            ) {
              _this.setState({
                createError: true,
              });

              return;
            }

            // clientside checks have passed
            _this.setState({
              createError: false,
              isLoading: true,
            });

            // create the mutation input
            var input = {
              name: name,
              slug: slug,
              description: description,
              website: website,
              file: file,
              coverFile: coverFile,
            };

            // create the community
            _this.props
              .createCommunity(input)
              .then(function(_ref3) {
                var createCommunity = _ref3.data.createCommunity;

                Object(
                  __WEBPACK_IMPORTED_MODULE_7__helpers_events__['b' /* track */]
                )('community', 'created', null);
                _this.props.communityCreated(createCommunity);
                _this.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_11__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('success', 'Community created!')
                );
              })
              .catch(function(err) {
                _this.setState({
                  isLoading: false,
                });
                _this.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_11__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('error', err.message)
                );
              });
          };

          _this.state = {
            name: props.name || '',
            slug: '',
            description: '',
            website: '',
            image: '',
            coverPhoto: '',
            file: null,
            coverFile: null,
            slugTaken: false,
            slugError: false,
            descriptionError: false,
            nameError: false,
            createError: false,
            isLoading: false,
            agreeCoC: false,
            photoSizeError: false,
            communitySuggestions: null,
          };

          _this.checkSlug = Object(
            __WEBPACK_IMPORTED_MODULE_10__helpers_utils__['h' /* throttle */]
          )(_this.checkSlug, 500);
          return _this;
        }

        _createClass(CreateCommunityForm, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              Object(
                __WEBPACK_IMPORTED_MODULE_7__helpers_events__['b' /* track */]
              )('community', 'create inited', null);
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _state = this.state,
                name = _state.name,
                slug = _state.slug,
                description = _state.description,
                image = _state.image,
                coverPhoto = _state.coverPhoto,
                website = _state.website,
                slugTaken = _state.slugTaken,
                slugError = _state.slugError,
                nameError = _state.nameError,
                descriptionError = _state.descriptionError,
                createError = _state.createError,
                isLoading = _state.isLoading,
                agreeCoC = _state.agreeCoC,
                photoSizeError = _state.photoSizeError,
                communitySuggestions = _state.communitySuggestions;

              var suggestionString = slugTaken
                ? communitySuggestions && communitySuggestions.length > 0
                  ? 'Were you looking for one of these communities?'
                  : null
                : "This community name and url are available! We also found communities that might be similar to what you're trying to create, just in case you would rather join an existing community instead!";

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_17__style__['g' /* FormContainer */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 401,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_17__style__['f' /* Form */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 402,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_16__style__[
                      'd' /* ImageInputWrapper */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 403,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                        'b' /* CoverInput */
                      ],
                      {
                        onChange: this.setCommunityCover,
                        defaultValue: coverPhoto,
                        preview: true,
                        allowGif: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 404,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                        'e' /* PhotoInput */
                      ],
                      {
                        onChange: this.setCommunityPhoto,
                        defaultValue: image,
                        user: null,
                        community: true,
                        allowGif: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 411,
                        },
                        __self: this,
                      }
                    )
                  ),
                  photoSizeError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_8__components_listItems_style__[
                        'n' /* Notice */
                      ],
                      {
                        style: { marginTop: '32px' },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 421,
                        },
                        __self: this,
                      },
                      'Photo uploads should be less than 3mb'
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_16__style__['e' /* Spacer */],
                    {
                      height: 8,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 426,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                      'd' /* Input */
                    ],
                    {
                      defaultValue: name,
                      onChange: this.changeName,
                      autoFocus: !window.innerWidth < 768,
                      onBlur: this.checkSuggestedCommunities,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 428,
                      },
                      __self: this,
                    },
                    'What is your community called?'
                  ),
                  nameError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                        'c' /* Error */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 438,
                        },
                        __self: this,
                      },
                      'Community names can be up to 20 characters long.'
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                      'h' /* UnderlineInput */
                    ],
                    {
                      defaultValue: slug,
                      onChange: this.changeSlug,
                      onBlur: this.checkSuggestedCommunities,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 441,
                      },
                      __self: this,
                    },
                    'spectrum.chat/'
                  ),
                  slugTaken &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                        'c' /* Error */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 450,
                        },
                        __self: this,
                      },
                      "This url is already taken - feel free to change it if you're set on the name ",
                      name,
                      '!'
                    ),
                  slugError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                        'c' /* Error */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 456,
                        },
                        __self: this,
                      },
                      'Slugs can be up to 24 characters long.'
                    ),
                  suggestionString &&
                    !nameError &&
                    !slugError &&
                    communitySuggestions &&
                    communitySuggestions.length > 0 &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_16__style__[
                        'b' /* CommunitySuggestionsText */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 463,
                        },
                        __self: this,
                      },
                      suggestionString
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_16__style__[
                      'c' /* CommunitySuggestionsWrapper */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 468,
                      },
                      __self: this,
                    },
                    !nameError &&
                      !slugError &&
                      communitySuggestions &&
                      communitySuggestions.length > 0 &&
                      communitySuggestions.map(function(suggestion) {
                        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                            'a' /* default */
                          ],
                          {
                            to: '/' + suggestion.slug,
                            key: suggestion.id,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 475,
                            },
                            __self: _this2,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_16__style__[
                              'a' /* CommunitySuggestion */
                            ],
                            {
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 476,
                              },
                              __self: _this2,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_9__components_avatar__[
                                'a' /* default */
                              ],
                              {
                                size: 20,
                                radius: 4,
                                community: suggestion,
                                src: suggestion.profilePhoto,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 477,
                                },
                                __self: _this2,
                              }
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              'strong',
                              {
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 483,
                                },
                                __self: _this2,
                              },
                              suggestion.name
                            ),
                            ' ',
                            suggestion.metaData.members.toLocaleString(),
                            ' members'
                          )
                        );
                      })
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                      'g' /* TextArea */
                    ],
                    {
                      defaultValue: description,
                      onChange: this.changeDescription,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 491,
                      },
                      __self: this,
                    },
                    'Describe it in 140 characters or less'
                  ),
                  descriptionError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                        'c' /* Error */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 499,
                        },
                        __self: this,
                      },
                      "Oop, that's more than 140 characters - try trimming that up."
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                      'd' /* Input */
                    ],
                    {
                      defaultValue: website,
                      onChange: this.changeWebsite,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 504,
                      },
                      __self: this,
                    },
                    "Optional: Add your community's website"
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                      'a' /* Checkbox */
                    ],
                    {
                      id: 'isPrivate',
                      checked: agreeCoC,
                      onChange: this.changeCoC,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 508,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'span',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 509,
                        },
                        __self: this,
                      },
                      'I have read the',
                      ' ',
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        {
                          href:
                            'https://github.com/withspectrum/code-of-conduct',
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 511,
                          },
                          __self: this,
                        },
                        'Spectrum Code of Conduct'
                      ),
                      ' ',
                      'and agree to enforce it in my community.'
                    )
                  ),
                  createError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_15__components_formElements__[
                        'c' /* Error */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 523,
                        },
                        __self: this,
                      },
                      'Please fix any errors above before creating this community.'
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_17__style__['a' /* Actions */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 529,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 530,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_14__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      onClick: this.create,
                      disabled:
                        slugTaken ||
                        slugError ||
                        nameError ||
                        createError ||
                        descriptionError ||
                        !name ||
                        !description ||
                        !agreeCoC,
                      loading: isLoading,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 531,
                      },
                      __self: this,
                    },
                    'Create Community & Continue'
                  )
                )
              );
            },
          },
        ]);

        return CreateCommunityForm;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_3_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_13__api_community__[
          'c' /* createCommunityMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_4_react_router__['e' /* withRouter */],
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_6_react_apollo__['withApollo']
      )(CreateCommunityForm);

      /***/
    },

  /***/ './src/views/newCommunity/components/createCommunityForm/style.js':
    /*!************************************************************************!*\
  !*** ./src/views/newCommunity/components/createCommunityForm/style.js ***!
  \************************************************************************/
    /*! exports provided: ImageInputWrapper, Spacer, CommunitySuggestionsText, CommunitySuggestionsWrapper, CommunitySuggestion */
    /*! exports used: CommunitySuggestion, CommunitySuggestionsText, CommunitySuggestionsWrapper, ImageInputWrapper, Spacer */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return ImageInputWrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return Spacer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return CommunitySuggestionsText;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return CommunitySuggestionsWrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return CommunitySuggestion;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_globals__ = __webpack_require__(
        /*! ../../../../components/globals */ './src/components/globals/index.js'
      );

      // $FlowFixMe

      var ImageInputWrapper = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__ImageInputWrapper',
        componentId: 's1jtr3wz-0',
      })([
        'position:relative;flex:0 0 auto;margin-top:8px;margin-bottom:24px;> label:nth-of-type(2){position:absolute;bottom:-24px;left:24px;}',
      ]);

      var Spacer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Spacer',
        componentId: 's1jtr3wz-1',
      })(
        ['height:', ';width:', ';display:block;'],
        function(props) {
          return props.height ? props.height + 'px' : 'auto';
        },
        function(props) {
          return props.width ? props.width + 'px' : 'auto';
        }
      );

      var CommunitySuggestionsText = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].p.withConfig({
        displayName: 'style__CommunitySuggestionsText',
        componentId: 's1jtr3wz-2',
      })(['margin:16px 0px 8px;font-size:14px;color:', ';'], function(props) {
        return props.theme.text.default;
      });

      var CommunitySuggestionsWrapper = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].ul.withConfig({
        displayName: 'style__CommunitySuggestionsWrapper',
        componentId: 's1jtr3wz-3',
      })(['list-style-type:none;padding:0;margin:0 0 24px;']);

      var CommunitySuggestion = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].li.withConfig({
        displayName: 'style__CommunitySuggestion',
        componentId: 's1jtr3wz-4',
      })(
        [
          'padding:8px 12px;font-size:14px;background:',
          ';color:',
          ';border-left:1px solid ',
          ';border-right:1px solid ',
          ';display:flex;align-items:center;strong{margin-left:8px;margin-right:8px;font-weight:500;}&:hover{color:',
          ';}&:first-of-type{padding-top:8px;border-top:1px solid ',
          ';}&:last-of-type{padding-bottom:8px;border-bottom:1px solid ',
          ';}',
        ],
        function(props) {
          return props.theme.bg.wash;
        },
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.theme.text.default;
        },
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.theme.bg.border;
        }
      );

      /***/
    },

  /***/ './src/views/newCommunity/components/editCommunityForm/index.js':
    /*!**********************************************************************!*\
  !*** ./src/views/newCommunity/components/editCommunityForm/index.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_events__ = __webpack_require__(
        /*! ../../../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__api_community__ = __webpack_require__(
        /*! ../../../../api/community */ './src/api/community.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__actions_toasts__ = __webpack_require__(
        /*! ../../../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_buttons__ = __webpack_require__(
        /*! ../../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_listItems_style__ = __webpack_require__(
        /*! ../../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_formElements__ = __webpack_require__(
        /*! ../../../../components/formElements */ './src/components/formElements/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_editForm_style__ = __webpack_require__(
        /*! ../../../../components/editForm/style */ './src/components/editForm/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__style__ = __webpack_require__(
        /*! ../../style */ './src/views/newCommunity/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/newCommunity/components/editCommunityForm/index.js';

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

      // $FlowFixMe

      var CommunityWithData = (function(_Component) {
        _inherits(CommunityWithData, _Component);

        function CommunityWithData(props) {
          _classCallCheck(this, CommunityWithData);

          var _this = _possibleConstructorReturn(
            this,
            (
              CommunityWithData.__proto__ ||
              Object.getPrototypeOf(CommunityWithData)
            ).call(this, props)
          );

          _initialiseProps.call(_this);

          var community = _this.props.community;

          _this.state = {
            name: community.name,
            slug: community.slug,
            description: community.description,
            communityId: community.id,
            website: community.website,
            image: community.profilePhoto,
            coverPhoto: community.coverPhoto,
            file: null,
            coverFile: null,
            communityData: community,
            photoSizeError: false,
            nameError: false,
            isLoading: false,
          };
          return _this;
        }

        _createClass(CommunityWithData, [
          {
            key: 'render',
            value: function render() {
              var _state = this.state,
                name = _state.name,
                slug = _state.slug,
                description = _state.description,
                image = _state.image,
                coverPhoto = _state.coverPhoto,
                website = _state.website,
                photoSizeError = _state.photoSizeError,
                nameError = _state.nameError,
                isLoading = _state.isLoading;

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_11__style__['g' /* FormContainer */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 236,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_11__style__['f' /* Form */],
                  {
                    onSubmit: this.save,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 237,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__components_editForm_style__[
                      'f' /* ImageInputWrapper */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 238,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_9__components_formElements__[
                        'b' /* CoverInput */
                      ],
                      {
                        onChange: this.setCommunityCover,
                        defaultValue: coverPhoto,
                        preview: true,
                        allowGif: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 239,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_9__components_formElements__[
                        'e' /* PhotoInput */
                      ],
                      {
                        onChange: this.setCommunityPhoto,
                        defaultValue: image,
                        allowGif: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 246,
                        },
                        __self: this,
                      }
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__components_formElements__[
                      'd' /* Input */
                    ],
                    {
                      defaultValue: name,
                      onChange: this.changeName,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 253,
                      },
                      __self: this,
                    },
                    'Name'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__components_formElements__[
                      'h' /* UnderlineInput */
                    ],
                    {
                      defaultValue: slug,
                      disabled: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 256,
                      },
                      __self: this,
                    },
                    'spectrum.chat/'
                  ),
                  nameError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_9__components_formElements__[
                        'c' /* Error */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 261,
                        },
                        __self: this,
                      },
                      'Community names can be up to 20 characters long.'
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__components_formElements__[
                      'g' /* TextArea */
                    ],
                    {
                      defaultValue: description,
                      onChange: this.changeDescription,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 264,
                      },
                      __self: this,
                    },
                    'Description'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__components_formElements__[
                      'd' /* Input */
                    ],
                    {
                      defaultValue: website,
                      onChange: this.changeWebsite,
                      autoFocus: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 271,
                      },
                      __self: this,
                    },
                    "Optional: Add your community's website"
                  ),
                  photoSizeError &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_8__components_listItems_style__[
                        'n' /* Notice */
                      ],
                      {
                        style: { marginTop: '16px' },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 280,
                        },
                        __self: this,
                      },
                      'Photo uploads should be less than 3mb'
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_11__style__['a' /* Actions */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 286,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 287,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_7__components_buttons__[
                      'a' /* Button */
                    ],
                    {
                      loading: isLoading,
                      onClick: this.save,
                      disabled: photoSizeError,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 288,
                      },
                      __self: this,
                    },
                    'Save & Continue'
                  )
                )
              );
            },
          },
        ]);

        return CommunityWithData;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var _initialiseProps = function _initialiseProps() {
        var _this2 = this;

        this.changeName = function(e) {
          var name = e.target.value;

          if (name.length >= 20) {
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
          _this2.setState({
            description: description,
          });
        };

        this.changeSlug = function(e) {
          var slug = e.target.value;
          _this2.setState({
            slug: slug,
          });
        };

        this.changeWebsite = function(e) {
          var website = e.target.value;
          _this2.setState({
            website: website,
          });
        };

        this.setCommunityPhoto = function(e) {
          var reader = new FileReader();
          var file = e.target.files[0];

          _this2.setState({
            isLoading: true,
          });

          if (file && file.size > 3000000) {
            return _this2.setState({
              photoSizeError: true,
              isLoading: false,
            });
          }

          reader.onloadend = function() {
            Object(
              __WEBPACK_IMPORTED_MODULE_4__helpers_events__['b' /* track */]
            )('community', 'profile photo uploaded', null);

            _this2.setState({
              file: file,
              image: reader.result,
              photoSizeError: false,
              isLoading: false,
            });
          };

          reader.readAsDataURL(file);
        };

        this.setCommunityCover = function(e) {
          var reader = new FileReader();
          var file = e.target.files[0];

          _this2.setState({
            isLoading: true,
          });

          if (file && file.size > 3000000) {
            return _this2.setState({
              photoSizeError: true,
              isLoading: false,
            });
          }

          reader.onloadend = function() {
            Object(
              __WEBPACK_IMPORTED_MODULE_4__helpers_events__['b' /* track */]
            )('community', 'cover photo uploaded', null);

            _this2.setState({
              coverFile: file,
              coverPhoto: reader.result,
              photoSizeError: false,
              isLoading: false,
            });
          };

          reader.readAsDataURL(file);
        };

        this.save = function(e) {
          e.preventDefault();
          var _state2 = _this2.state,
            name = _state2.name,
            description = _state2.description,
            website = _state2.website,
            file = _state2.file,
            coverFile = _state2.coverFile,
            communityId = _state2.communityId,
            photoSizeError = _state2.photoSizeError;

          var input = {
            name: name,
            description: description,
            website: website,
            file: file,
            coverFile: coverFile,
            communityId: communityId,
          };

          if (photoSizeError) {
            return;
          }

          _this2.setState({
            isLoading: true,
          });

          _this2.props
            .editCommunity(input)
            .then(function(_ref) {
              var editCommunity = _ref.data.editCommunity;

              var community = editCommunity;

              _this2.setState({
                isLoading: false,
              });

              // community was returned
              if (community !== undefined) {
                Object(
                  __WEBPACK_IMPORTED_MODULE_4__helpers_events__['b' /* track */]
                )('community', 'edited', null);

                _this2.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_6__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('success', 'Community saved!')
                );
                _this2.props.communityUpdated(community);
              }
            })
            .catch(function(err) {
              _this2.setState({
                isLoading: false,
              });

              _this2.props.dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_6__actions_toasts__[
                    'a' /* addToastWithTimeout */
                  ]
                )(
                  'error',
                  "Something went wrong and we weren't able to save these changes. " +
                    err
                )
              );
            });
        };
      };

      var Community = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_5__api_community__[
          'd' /* deleteCommunityMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_5__api_community__[
          'f' /* editCommunityMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_3_react_router__['e' /* withRouter */],
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])()
      )(CommunityWithData);
      /* harmony default export */ __webpack_exports__['a'] = Community;

      /***/
    },

  /***/ './src/views/newCommunity/components/share/index.js':
    /*!**********************************************************!*\
  !*** ./src/views/newCommunity/components/share/index.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router__ = __webpack_require__(
        /*! react-router */ './node_modules/react-router/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_2_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_buttons__ = __webpack_require__(
        /*! ../../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__style__ = __webpack_require__(
        /*! ./style */ './src/views/newCommunity/components/share/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__style__ = __webpack_require__(
        /*! ../../style */ './src/views/newCommunity/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_loading__ = __webpack_require__(
        /*! ../../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_clipboard_js__ = __webpack_require__(
        /*! react-clipboard.js */ './node_modules/react-clipboard.js/dist/react-clipboard.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_clipboard_js___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_7_react_clipboard_js__
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/newCommunity/components/share/index.js',
        _this = this;

      var Share = function Share(_ref) {
        var community = _ref.community,
          history = _ref.history,
          onboarding = _ref.onboarding;

        if (!community)
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_6__components_loading__[
              'a' /* Loading */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 12,
              },
              __self: _this,
            }
          );

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 15,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_4__style__['a' /* ButtonRow */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 16,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'a',
              {
                href:
                  'https://www.facebook.com/sharer/sharer.php?u=https://spectrum.chat/' +
                  community.slug +
                  '&t=Come hang out with me in the ' +
                  community.name +
                  ' community on Spectrum!',
                target: '_blank',
                rel: 'noopener noreferrer',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 17,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__components_buttons__[
                  'a' /* Button */
                ],
                {
                  icon: 'facebook',
                  gradientTheme: 'none',
                  hoverColor: 'social.facebook.default',
                  color: 'social.facebook.default',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 22,
                  },
                  __self: _this,
                },
                'Share on Facebook'
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'a',
              {
                href:
                  'https://twitter.com/share?text=Come hang out with me in the ' +
                  community.name +
                  ' community on @withspectrum!&url=https://spectrum.chat/' +
                  community.slug,
                target: '_blank',
                rel: 'noopener noreferrer',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 31,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__components_buttons__[
                  'a' /* Button */
                ],
                {
                  icon: 'twitter',
                  gradientTheme: 'none',
                  hoverColor: 'social.twitter.default',
                  color: 'social.twitter.default',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 36,
                  },
                  __self: _this,
                },
                'Share on Twitter'
              )
            )
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_7_react_clipboard_js___default.a,
            {
              component: 'div',
              'data-clipboard-text': 'https://spectrum.chat/' + community.slug,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 47,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_4__style__['c' /* InputRow */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 51,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_4__style__['b' /* Input */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 52,
                  },
                  __self: _this,
                },
                'https://spectrum.chat/' + community.slug
              )
            )
          ),
          onboarding &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_4__style__['a' /* ButtonRow */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 57,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_5__style__['d' /* Description */],
                {
                  centered: true,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 58,
                  },
                  __self: _this,
                },
                "You're ready to start building your community - you can view it now, or manage your settings at any time"
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'a',
                {
                  href: '/' + community.slug + '/settings',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 62,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__components_buttons__[
                    'e' /* OutlineButton */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 63,
                    },
                    __self: _this,
                  },
                  'View community settings'
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'a',
                {
                  href: '/' + community.slug,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 65,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_3__components_buttons__[
                    'a' /* Button */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 66,
                    },
                    __self: _this,
                  },
                  'Go to my community'
                )
              )
            )
        );
      };

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_1_react_router__['e' /* withRouter */]
      )(Share);

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

  /***/ './src/views/newCommunity/components/stepper/index.js':
    /*!************************************************************!*\
  !*** ./src/views/newCommunity/components/stepper/index.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style__ = __webpack_require__(
        /*! ./style */ './src/views/newCommunity/components/stepper/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/newCommunity/components/stepper/index.js',
        _this = this;

      var Stepper = function Stepper(_ref) {
        var activeStep = _ref.activeStep;

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_1__style__['a' /* Container */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 6,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__style__['b' /* Line */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 7,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__style__['c' /* Step */],
            {
              active: activeStep === 1,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 8,
              },
              __self: _this,
            },
            '1'
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__style__['c' /* Step */],
            {
              active: activeStep === 2,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 9,
              },
              __self: _this,
            },
            '2'
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__style__['c' /* Step */],
            {
              active: activeStep === 3,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 10,
              },
              __self: _this,
            },
            '3'
          )
        );
      };

      /* harmony default export */ __webpack_exports__['a'] = Stepper;

      /***/
    },

  /***/ './src/views/newCommunity/components/stepper/style.js':
    /*!************************************************************!*\
  !*** ./src/views/newCommunity/components/stepper/style.js ***!
  \************************************************************/
    /*! exports provided: Container, Line, Step */
    /*! exports used: Container, Line, Step */
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
          return Line;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return Step;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_globals__ = __webpack_require__(
        /*! ../../../../components/globals */ './src/components/globals/index.js'
      );

      // $FlowFixMe

      var Container = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Container',
        componentId: 's1j0lh5j-0',
      })([
        'display:flex;justify-content:space-between;position:relative;padding:24px;',
      ]);

      var Line = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__Line',
        componentId: 's1j0lh5j-1',
      })(
        [
          'position:absolute;height:2px;background:',
          ';top:50%;left:24px;right:24px;transform:translateY(-50%);z-index:',
          ';',
        ],
        function(props) {
          return props.theme.bg.border;
        },
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['r' /* zIndex */].base
      );

      var Step = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Step',
        componentId: 's1j0lh5j-2',
      })(
        [
          'width:32px;height:32px;font-size:16px;color:',
          ';background:#fff;display:flex;align-items:center;justify-content:center;border-radius:16px;border:2px solid ',
          ';box-shadow:0 0 0 4px #fff;font-weight:700;z-index:',
          ';position:relative;',
        ],
        function(props) {
          return props.active
            ? props.theme.brand.default
            : props.theme.text.alt;
        },
        function(props) {
          return props.active
            ? props.theme.brand.default
            : props.theme.bg.border;
        },
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['r' /* zIndex */]
          .base + 1
      );

      /***/
    },

  /***/ './src/views/newCommunity/index.js':
    /*!*****************************************!*\
  !*** ./src/views/newCommunity/index.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_apollo__ = __webpack_require__(
        /*! react-apollo */ './node_modules/react-apollo/react-apollo.browser.umd.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_apollo___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_3_react_apollo__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_events__ = __webpack_require__(
        /*! ../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_query_string__ = __webpack_require__(
        /*! query-string */ './node_modules/query-string/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_query_string___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_5_query_string__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_buttons__ = __webpack_require__(
        /*! ../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_appViewWrapper__ = __webpack_require__(
        /*! ../../components/appViewWrapper */ './src/components/appViewWrapper/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_column__ = __webpack_require__(
        /*! ../../components/column */ './src/components/column/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__communitySettings_components_importSlack__ = __webpack_require__(
        /*! ../communitySettings/components/importSlack */ './src/views/communitySettings/components/importSlack.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_emailInvitationForm__ = __webpack_require__(
        /*! ../../components/emailInvitationForm */ './src/components/emailInvitationForm/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_createCommunityForm__ = __webpack_require__(
        /*! ./components/createCommunityForm */ './src/views/newCommunity/components/createCommunityForm/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_editCommunityForm__ = __webpack_require__(
        /*! ./components/editCommunityForm */ './src/views/newCommunity/components/editCommunityForm/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__titlebar__ = __webpack_require__(
        /*! ../titlebar */ './src/views/titlebar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_stepper__ = __webpack_require__(
        /*! ./components/stepper */ './src/views/newCommunity/components/stepper/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_share__ = __webpack_require__(
        /*! ./components/share */ './src/views/newCommunity/components/share/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__views_login__ = __webpack_require__(
        /*! ../../views/login */ './src/views/login/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__api_community__ = __webpack_require__(
        /*! ../../api/community */ './src/api/community.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__style__ = __webpack_require__(
        /*! ./style */ './src/views/newCommunity/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/newCommunity/index.js';

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

      var NewCommunity = (function(_React$Component) {
        _inherits(NewCommunity, _React$Component);

        function NewCommunity() {
          _classCallCheck(this, NewCommunity);

          var _this = _possibleConstructorReturn(
            this,
            (
              NewCommunity.__proto__ || Object.getPrototypeOf(NewCommunity)
            ).call(this)
          );

          _this.step = function(direction) {
            var _this$state = _this.state,
              activeStep = _this$state.activeStep,
              community = _this$state.community;

            var newStep =
              direction === 'next' ? activeStep + 1 : activeStep - 1;
            _this.props.history.replace(
              '/new/community?s=' +
                newStep +
                (community && community.id && '&id=' + community.id)
            );
            _this.setState({
              activeStep: newStep,
            });
          };

          _this.title = function() {
            var _this$state2 = _this.state,
              activeStep = _this$state2.activeStep,
              community = _this$state2.community;

            switch (activeStep) {
              case 1: {
                return community
                  ? 'Update your community'
                  : 'Create a community';
              }
              case 2: {
                return (
                  'Invite people' +
                  (community
                    ? ' to the ' + community.name + ' community'
                    : ' to your community')
                );
              }
              case 3: {
                return 'Done!';
              }
              default: {
                return 'Create a community';
              }
            }
          };

          _this.description = function() {
            var _this$state3 = _this.state,
              activeStep = _this$state3.activeStep,
              community = _this$state3.community;

            switch (activeStep) {
              case 1: {
                return 'Creating a community on Spectrum is free, forever. To get started, tell us more about your community below.';
              }
              case 2: {
                return (
                  'Kickstart ' +
                  (community
                    ? 'the ' + community.name + ' community'
                    : 'your community') +
                  " by inviting an existing Slack team or by inviting a handful of folks directly by email. You'll be able to invite more people at any point in the future, too, if you're not quite ready."
                );
              }
              case 3: {
                return "You're all set! Your community is live - go check it out, start posting threads, and get the conversations started!";
              }
              default: {
                return 'Create a community';
              }
            }
          };

          _this.communityCreated = function(community) {
            _this.setState({
              community: Object.assign({}, community),
            });
            _this.props.history.replace('/new/community?id=' + community.id);
            return _this.step('next');
          };

          _this.hasInvitedPeople = function() {
            _this.setState({
              hasInvitedPeople: true,
            });
          };

          var parsed = __WEBPACK_IMPORTED_MODULE_5_query_string___default.a.parse(
            window.location.search
          );
          var step = parsed.s;
          var id = parsed.id;

          step = step ? parseInt(step, 10) : 1;

          _this.state = {
            activeStep: step,
            isLoading: false,
            community: null,
            existingId: id || null,
            hasInvitedPeople: false,
          };
          return _this;
        }

        _createClass(NewCommunity, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              var _this2 = this;

              Object(
                __WEBPACK_IMPORTED_MODULE_4__helpers_events__['b' /* track */]
              )('community', 'create inited', null);

              var existingId = this.state.existingId;

              if (!existingId) return;

              this.props.client
                .query({
                  query:
                    __WEBPACK_IMPORTED_MODULE_17__api_community__[
                      'i' /* getCommunityByIdQuery */
                    ],
                  variables: {
                    id: existingId,
                  },
                })
                .then(function(_ref) {
                  var community = _ref.data.community;

                  if (!community) return;
                  return _this2.setState({
                    community: community,
                  });
                })
                .catch(function(err) {
                  console.log('error creating community', err);
                });
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this3 = this;

              var currentUser = this.props.currentUser;
              var _state = this.state,
                activeStep = _state.activeStep,
                community = _state.community,
                existingId = _state.existingId,
                hasInvitedPeople = _state.hasInvitedPeople;

              var title = this.title();
              var description = this.description();

              if (!currentUser) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_16__views_login__['a' /* Login */],
                  {
                    redirectPath: '' + window.location.href,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 162,
                    },
                    __self: this,
                  }
                );
              } else {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_7__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 165,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_13__titlebar__['a' /* default */],
                    {
                      title: 'Create a Community',
                      provideBack: true,
                      backRoute: '/',
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 166,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_8__components_column__[
                      'b' /* default */
                    ],
                    {
                      type: 'primary',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 173,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_18__style__[
                        'b' /* Container */
                      ],
                      {
                        bg: activeStep === 3 ? 'onboarding' : null,
                        repeat: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 174,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_14__components_stepper__[
                          'a' /* default */
                        ],
                        {
                          activeStep: activeStep,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 175,
                          },
                          __self: this,
                        }
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_18__style__['h' /* Title */],
                        {
                          centered: activeStep === 3,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 176,
                          },
                          __self: this,
                        },
                        title
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_18__style__[
                          'd' /* Description */
                        ],
                        {
                          centered: activeStep === 3,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 177,
                          },
                          __self: this,
                        },
                        description
                      ),
                      // gather community meta info
                      activeStep === 1 &&
                        !community &&
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_11__components_createCommunityForm__[
                            'a' /* default */
                          ],
                          {
                            communityCreated: this.communityCreated,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 184,
                            },
                            __self: this,
                          }
                        ),
                      activeStep === 1 &&
                        community &&
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_12__components_editCommunityForm__[
                            'a' /* default */
                          ],
                          {
                            communityUpdated: this.communityCreated,
                            community: community,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 191,
                            },
                            __self: this,
                          }
                        ),
                      activeStep === 2 &&
                        community &&
                        community.id &&
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_18__style__[
                            'c' /* ContentContainer */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 200,
                            },
                            __self: this,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_18__style__[
                              'e' /* Divider */
                            ],
                            {
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 201,
                              },
                              __self: this,
                            }
                          ),
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_9__communitySettings_components_importSlack__[
                              'a' /* ImportSlackWithoutCard */
                            ],
                            {
                              community: community,
                              id: community.id || existingId,
                              isOnboarding: true,
                              hasInvitedPeople: this.hasInvitedPeople,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 202,
                              },
                              __self: this,
                            }
                          ),
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_18__style__[
                              'e' /* Divider */
                            ],
                            {
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 208,
                              },
                              __self: this,
                            }
                          ),
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_10__components_emailInvitationForm__[
                              'a' /* CommunityInvitationForm */
                            ],
                            {
                              id: community.id,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 209,
                              },
                              __self: this,
                            }
                          )
                        ),
                      // connect a slack team or invite via email
                      activeStep === 2 &&
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_18__style__[
                            'a' /* Actions */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 215,
                            },
                            __self: this,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_6__components_buttons__[
                              'f' /* TextButton */
                            ],
                            {
                              onClick: function onClick() {
                                return _this3.step('previous');
                              },
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 216,
                              },
                              __self: this,
                            },
                            'Back'
                          ),
                          hasInvitedPeople
                            ? __WEBPACK_IMPORTED_MODULE_0_react__[
                                'createElement'
                              ](
                                __WEBPACK_IMPORTED_MODULE_6__components_buttons__[
                                  'a' /* Button */
                                ],
                                {
                                  onClick: function onClick() {
                                    return _this3.step('next');
                                  },
                                  __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 220,
                                  },
                                  __self: this,
                                },
                                'Continue'
                              )
                            : __WEBPACK_IMPORTED_MODULE_0_react__[
                                'createElement'
                              ](
                                __WEBPACK_IMPORTED_MODULE_6__components_buttons__[
                                  'f' /* TextButton */
                                ],
                                {
                                  color: 'brand.default',
                                  onClick: function onClick() {
                                    return _this3.step('next');
                                  },
                                  __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 222,
                                  },
                                  __self: this,
                                },
                                'Skip this step'
                              )
                        ),
                      // share the community
                      activeStep === 3 &&
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_18__style__[
                            'c' /* ContentContainer */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 234,
                            },
                            __self: this,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_15__components_share__[
                              'a' /* default */
                            ],
                            {
                              community: community,
                              onboarding: true,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 235,
                              },
                              __self: this,
                            }
                          )
                        )
                    )
                  )
                );
              }
            },
          },
        ]);

        return NewCommunity;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var mapStateToProps = function mapStateToProps(state) {
        return { currentUser: state.users.currentUser };
      };
      /* harmony default export */ __webpack_exports__[
        'default'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_3_react_apollo__['withApollo'],
        // $FlowIssue
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(
          mapStateToProps
        )
      )(NewCommunity);

      /***/
    },

  /***/ './src/views/newCommunity/style.js':
    /*!*****************************************!*\
  !*** ./src/views/newCommunity/style.js ***!
  \*****************************************/
    /*! exports provided: Container, Actions, Title, Description, Divider, ContentContainer, FormContainer, Form */
    /*! exports used: Actions, Container, ContentContainer, Description, Divider, Form, FormContainer, Title */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return Container;
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
        'h',
        function() {
          return Title;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return Description;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return Divider;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return ContentContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'g',
        function() {
          return FormContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'f',
        function() {
          return Form;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_card__ = __webpack_require__(
        /*! ../../components/card */ './src/components/card/index.js'
      );

      // $FlowFixMe

      var Container = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__components_card__['b' /* default */]
      ).withConfig({
        displayName: 'style__Container',
        componentId: 's11j0m8b-0',
      })(
        [
          'background-image:',
          ';background-color:#fff;background-size:110% auto;background-repeat:',
          ';background-position:',
          ';width:100%;height:auto;min-height:160px;display:flex;',
        ],
        function(props) {
          return props.bg ? "url('/img/fills/" + props.bg + ".svg')" : 'none';
        },
        function(props) {
          return props.repeat ? 'repeat-y' : 'no-repeat';
        },
        function(props) {
          return props.repeat ? 'center top' : 'center center';
        }
      );

      var Actions = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Actions',
        componentId: 's11j0m8b-1',
      })(
        [
          'display:flex;justify-content:space-between;border-top:2px solid ',
          ';padding:24px;background:#fff;border-radius:0 0 12px 12px;',
        ],
        function(props) {
          return props.theme.bg.border;
        }
      );

      var Title = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h1.withConfig({
        displayName: 'style__Title',
        componentId: 's11j0m8b-2',
      })(
        [
          'font-weight:900;color:',
          ';font-size:24px;letter-spacing:-0.1px;padding:24px 24px 8px;text-align:',
          ';',
        ],
        function(props) {
          return props.theme.text.default;
        },
        function(props) {
          return props.centered ? 'center' : 'left';
        }
      );

      var Description = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h3.withConfig({
        displayName: 'style__Description',
        componentId: 's11j0m8b-3',
      })(
        [
          'font-size:16px;font-weight:500;color:',
          ';line-height:1.4;padding:8px 24px 16px;text-align:',
          ';',
        ],
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.centered ? 'center' : 'left';
        }
      );

      var Divider = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__Divider',
        componentId: 's11j0m8b-4',
      })(
        [
          'border-bottom:2px solid ',
          ';width:100%;display:block;padding-top:24px;margin-bottom:24px;',
        ],
        function(props) {
          return props.theme.bg.border;
        }
      );

      var ContentContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__ContentContainer',
        componentId: 's11j0m8b-5',
      })(['padding:0 24px 24px;']);

      var FormContainer = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__FormContainer',
        componentId: 's11j0m8b-6',
      })(['']);

      var Form = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].form.withConfig({
        displayName: 'style__Form',
        componentId: 's11j0m8b-7',
      })([
        'display:block;flex-direction:column;align-self:stretch;flex:1 0 100%;max-width:100%;margin:16px;',
      ]);

      /***/
    },
});
//# sourceMappingURL=NewCommunity.chunk.js.map
