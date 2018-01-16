webpackJsonp([3], {
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

  /***/ './src/views/communityAnalytics/components/conversationGrowth.js':
    /*!***********************************************************************!*\
  !*** ./src/views/communityAnalytics/components/conversationGrowth.js ***!
  \***********************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__queries__ = __webpack_require__(
        /*! ../queries */ './src/views/communityAnalytics/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils__ = __webpack_require__(
        /*! ../utils */ './src/views/communityAnalytics/utils.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communityAnalytics/components/conversationGrowth.js';

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

      var ConversationGrowth = (function(_React$Component) {
        _inherits(ConversationGrowth, _React$Component);

        function ConversationGrowth() {
          _classCallCheck(this, ConversationGrowth);

          return _possibleConstructorReturn(
            this,
            (
              ConversationGrowth.__proto__ ||
              Object.getPrototypeOf(ConversationGrowth)
            ).apply(this, arguments)
          );
        }

        _createClass(ConversationGrowth, [
          {
            key: 'render',
            value: function render() {
              var _props = this.props,
                community = _props.data.community,
                isLoading = _props.isLoading;

              if (community) {
                var _community$conversati = community.conversationGrowth,
                  _count = _community$conversati.count,
                  _weeklyGrowth = _community$conversati.weeklyGrowth,
                  _monthlyGrowth = _community$conversati.monthlyGrowth,
                  _quarterlyGrowth = _community$conversati.quarterlyGrowth;

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_4__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 46,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__components_settingsViews_style__[
                      'h' /* SectionSubtitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 47,
                      },
                      __self: this,
                    },
                    'Your community\u2018s conversations'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__components_settingsViews_style__[
                      'i' /* SectionTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 48,
                      },
                      __self: this,
                    },
                    _count.toLocaleString(),
                    ' total conversations'
                  ),
                  Object(
                    __WEBPACK_IMPORTED_MODULE_6__utils__['a' /* parseGrowth */]
                  )(_weeklyGrowth, 'this week'),
                  Object(
                    __WEBPACK_IMPORTED_MODULE_6__utils__['a' /* parseGrowth */]
                  )(_monthlyGrowth, 'this month'),
                  Object(
                    __WEBPACK_IMPORTED_MODULE_6__utils__['a' /* parseGrowth */]
                  )(_quarterlyGrowth, 'this quarter')
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_4__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 60,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_3__components_loading__[
                      'a' /* Loading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 61,
                      },
                      __self: this,
                    }
                  )
                );
              }

              return null;
            },
          },
        ]);

        return ConversationGrowth;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_5__queries__[
          'a' /* getCommunityConversationGrowth */
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(ConversationGrowth);

      /***/
    },

  /***/ './src/views/communityAnalytics/components/memberGrowth.js':
    /*!*****************************************************************!*\
  !*** ./src/views/communityAnalytics/components/memberGrowth.js ***!
  \*****************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__queries__ = __webpack_require__(
        /*! ../queries */ './src/views/communityAnalytics/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils__ = __webpack_require__(
        /*! ../utils */ './src/views/communityAnalytics/utils.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communityAnalytics/components/memberGrowth.js';

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

      var MemberGrowth = (function(_React$Component) {
        _inherits(MemberGrowth, _React$Component);

        function MemberGrowth() {
          _classCallCheck(this, MemberGrowth);

          return _possibleConstructorReturn(
            this,
            (
              MemberGrowth.__proto__ || Object.getPrototypeOf(MemberGrowth)
            ).apply(this, arguments)
          );
        }

        _createClass(MemberGrowth, [
          {
            key: 'render',
            value: function render() {
              var _props = this.props,
                community = _props.data.community,
                isLoading = _props.isLoading;

              if (community) {
                var _community$memberGrow = community.memberGrowth,
                  _count = _community$memberGrow.count,
                  _weeklyGrowth = _community$memberGrow.weeklyGrowth,
                  _monthlyGrowth = _community$memberGrow.monthlyGrowth,
                  _quarterlyGrowth = _community$memberGrow.quarterlyGrowth;

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_4__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 46,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__components_settingsViews_style__[
                      'h' /* SectionSubtitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 47,
                      },
                      __self: this,
                    },
                    'Your community'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__components_settingsViews_style__[
                      'i' /* SectionTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 48,
                      },
                      __self: this,
                    },
                    _count.toLocaleString(),
                    ' members'
                  ),
                  Object(
                    __WEBPACK_IMPORTED_MODULE_6__utils__['a' /* parseGrowth */]
                  )(_weeklyGrowth, 'this week'),
                  Object(
                    __WEBPACK_IMPORTED_MODULE_6__utils__['a' /* parseGrowth */]
                  )(_monthlyGrowth, 'this month'),
                  Object(
                    __WEBPACK_IMPORTED_MODULE_6__utils__['a' /* parseGrowth */]
                  )(_quarterlyGrowth, 'this quarter')
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_4__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 58,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_3__components_loading__[
                      'a' /* Loading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 59,
                      },
                      __self: this,
                    }
                  )
                );
              }

              return null;
            },
          },
        ]);

        return MemberGrowth;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_5__queries__[
          'b' /* getCommunityMemberGrowth */
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(MemberGrowth);

      /***/
    },

  /***/ './src/views/communityAnalytics/components/threadListItem.js':
    /*!*******************************************************************!*\
  !*** ./src/views/communityAnalytics/components/threadListItem.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style__ = __webpack_require__(
        /*! ../style */ './src/views/communityAnalytics/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communityAnalytics/components/threadListItem.js';

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

      var ThreadListItem = (function(_React$Component) {
        _inherits(ThreadListItem, _React$Component);

        function ThreadListItem() {
          _classCallCheck(this, ThreadListItem);

          return _possibleConstructorReturn(
            this,
            (
              ThreadListItem.__proto__ || Object.getPrototypeOf(ThreadListItem)
            ).apply(this, arguments)
          );
        }

        _createClass(ThreadListItem, [
          {
            key: 'render',
            value: function render() {
              var _props$thread = this.props.thread,
                id = _props$thread.id,
                _props$thread$creator = _props$thread.creator,
                name = _props$thread$creator.name,
                username = _props$thread$creator.username,
                title = _props$thread.content.title,
                messageCount = _props$thread.messageCount;

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_2__style__[
                  'a' /* StyledThreadListItem */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 38,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                    'a' /* default */
                  ],
                  {
                    to: {
                      pathname: window.location.pathname,
                      search: '?thread=' + id,
                    },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 39,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_2__style__[
                      'c' /* ThreadListItemTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 45,
                      },
                      __self: this,
                    },
                    title
                  )
                ),
                messageCount > 0 &&
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_2__style__[
                      'b' /* ThreadListItemSubtitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 48,
                      },
                      __self: this,
                    },
                    messageCount > 1 ? messageCount + ' messages' : '1 message'
                  ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_2__style__[
                    'b' /* ThreadListItemSubtitle */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 52,
                    },
                    __self: this,
                  },
                  'By ',
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                      'a' /* default */
                    ],
                    {
                      to: '/users/' + username,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 53,
                      },
                      __self: this,
                    },
                    name
                  )
                )
              );
            },
          },
        ]);

        return ThreadListItem;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__['a'] = ThreadListItem;

      /***/
    },

  /***/ './src/views/communityAnalytics/components/topAndNewThreads.js':
    /*!*********************************************************************!*\
  !*** ./src/views/communityAnalytics/components/topAndNewThreads.js ***!
  \*********************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_viewError__ = __webpack_require__(
        /*! ../../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__threadListItem__ = __webpack_require__(
        /*! ./threadListItem */ './src/views/communityAnalytics/components/threadListItem.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__queries__ = __webpack_require__(
        /*! ../queries */ './src/views/communityAnalytics/queries.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communityAnalytics/components/topAndNewThreads.js';

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

      var TopAndNewThreads = (function(_React$Component) {
        _inherits(TopAndNewThreads, _React$Component);

        function TopAndNewThreads() {
          _classCallCheck(this, TopAndNewThreads);

          return _possibleConstructorReturn(
            this,
            (
              TopAndNewThreads.__proto__ ||
              Object.getPrototypeOf(TopAndNewThreads)
            ).apply(this, arguments)
          );
        }

        _createClass(TopAndNewThreads, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                community = _props.data.community,
                isLoading = _props.isLoading;

              if (community) {
                var _community$topAndNewT = community.topAndNewThreads,
                  _topThreads = _community$topAndNewT.topThreads,
                  _newThreads = _community$topAndNewT.newThreads;
                // resort on the client because while the server *did* technically return the top threads, they get unsorted during the 'getThreads' model query

                var sortedTopThreads = _topThreads.slice().sort(function(a, b) {
                  var bc = parseInt(b.messageCount, 10);
                  var ac = parseInt(a.messageCount, 10);
                  return bc <= ac ? -1 : 1;
                });

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  'span',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 54,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_6__components_settingsViews_style__[
                      'f' /* SectionCard */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 55,
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
                          lineNumber: 56,
                        },
                        __self: this,
                      },
                      'Top conversations this week'
                    ),
                    sortedTopThreads.length > 0
                      ? sortedTopThreads.map(function(thread) {
                          return __WEBPACK_IMPORTED_MODULE_0_react__[
                            'createElement'
                          ](
                            __WEBPACK_IMPORTED_MODULE_5__threadListItem__[
                              'a' /* default */
                            ],
                            {
                              key: thread.id,
                              thread: thread,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 59,
                              },
                              __self: _this2,
                            }
                          );
                        })
                      : __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_4__components_viewError__[
                            'a' /* default */
                          ],
                          {
                            small: true,
                            emoji: '😴',
                            heading: 'It\u2019s been a bit quiet this week.',
                            subheading:
                              'Top conversations will show up here when people start chatting.',
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 62,
                            },
                            __self: this,
                          }
                        )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_6__components_settingsViews_style__[
                      'f' /* SectionCard */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 70,
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
                          lineNumber: 71,
                        },
                        __self: this,
                      },
                      'Unanswered conversations this week'
                    ),
                    _newThreads.length > 0
                      ? _newThreads.map(function(thread) {
                          return __WEBPACK_IMPORTED_MODULE_0_react__[
                            'createElement'
                          ](
                            __WEBPACK_IMPORTED_MODULE_5__threadListItem__[
                              'a' /* default */
                            ],
                            {
                              key: thread.id,
                              thread: thread,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 74,
                              },
                              __self: _this2,
                            }
                          );
                        })
                      : __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_4__components_viewError__[
                            'a' /* default */
                          ],
                          {
                            small: true,
                            emoji: '✌️',
                            heading: 'All caught up!.',
                            subheading:
                              'It looks like everyone is getting responses in their conversations - nice work!',
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

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_6__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 91,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_3__components_loading__[
                      'a' /* Loading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 92,
                      },
                      __self: this,
                    }
                  )
                );
              }

              return null;
            },
          },
        ]);

        return TopAndNewThreads;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_7__queries__[
          'c' /* getCommunityTopAndNewThreads */
        ],
        __WEBPACK_IMPORTED_MODULE_2__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(TopAndNewThreads);

      /***/
    },

  /***/ './src/views/communityAnalytics/components/topMembers.js':
    /*!***************************************************************!*\
  !*** ./src/views/communityAnalytics/components/topMembers.js ***!
  \***************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__(
        /*! react-router */ './node_modules/react-router/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_icons__ = __webpack_require__(
        /*! ../../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_directMessageThreads__ = __webpack_require__(
        /*! ../../../actions/directMessageThreads */ './src/actions/directMessageThreads.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_5_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_viewError__ = __webpack_require__(
        /*! ../../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_listItems__ = __webpack_require__(
        /*! ../../../components/listItems */ './src/components/listItems/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__queries__ = __webpack_require__(
        /*! ../queries */ './src/views/communityAnalytics/queries.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communityAnalytics/components/topMembers.js';

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

      var ConversationGrowth = (function(_React$Component) {
        _inherits(ConversationGrowth, _React$Component);

        function ConversationGrowth() {
          var _ref;

          var _temp, _this, _ret;

          _classCallCheck(this, ConversationGrowth);

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
                ConversationGrowth.__proto__ ||
                Object.getPrototypeOf(ConversationGrowth)).call.apply(
                _ref,
                [this].concat(args)
              )
            )),
            _this)),
            (_this.initMessage = function(user) {
              _this.props.dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_4__actions_directMessageThreads__[
                    'b' /* initNewThreadWithUser */
                  ]
                )(user)
              );
              _this.props.history.push('/messages/new');
            }),
            _temp)),
            _possibleConstructorReturn(_this, _ret)
          );
        }

        _createClass(ConversationGrowth, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                community = _props.data.community,
                isLoading = _props.isLoading;

              if (community && community.topMembers.length > 0) {
                var sortedTopMembers = community.topMembers
                  .slice()
                  .sort(function(a, b) {
                    var bc = parseInt(b.contextPermissions.reputation, 10);
                    var ac = parseInt(a.contextPermissions.reputation, 10);
                    return bc <= ac ? -1 : 1;
                  });
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_10__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 59,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_10__components_settingsViews_style__[
                      'i' /* SectionTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 60,
                      },
                      __self: this,
                    },
                    'Top members this week'
                  ),
                  sortedTopMembers.map(function(user) {
                    return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_9__components_listItems__[
                        'g' /* UserListItem */
                      ],
                      {
                        key: user.id,
                        user: user,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 63,
                        },
                        __self: _this2,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_10__components_settingsViews_style__[
                          'e' /* MessageIcon */
                        ],
                        {
                          tipText: 'Message ' + user.name,
                          tipLocation: 'top-left',
                          onClick: function onClick() {
                            return _this2.initMessage(user);
                          },
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 64,
                          },
                          __self: _this2,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_3__components_icons__[
                            'a' /* default */
                          ],
                          {
                            glyph: 'message-new',
                            size: 32,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 69,
                            },
                            __self: _this2,
                          }
                        )
                      )
                    );
                  })
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_10__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 80,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_7__components_loading__[
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

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_10__components_settingsViews_style__[
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
                  __WEBPACK_IMPORTED_MODULE_10__components_settingsViews_style__[
                    'i' /* SectionTitle */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 88,
                    },
                    __self: this,
                  },
                  'Top members this week'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_viewError__[
                    'a' /* default */
                  ],
                  {
                    small: true,
                    emoji: '😭',
                    heading: 'Your community has been quiet this week',
                    subheading:
                      'When people are posting new threads and joining conversations, the most active people will appear here.',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 89,
                    },
                    __self: this,
                  }
                )
              );
            },
          },
        ]);

        return ConversationGrowth;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_5_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_1_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_2_react_router__['e' /* withRouter */],
        __WEBPACK_IMPORTED_MODULE_11__queries__[
          'd' /* getCommunityTopMembers */
        ],
        __WEBPACK_IMPORTED_MODULE_6__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(ConversationGrowth);

      /***/
    },

  /***/ './src/views/communityAnalytics/index.js':
    /*!***********************************************!*\
  !*** ./src/views/communityAnalytics/index.js ***!
  \***********************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__queries__ = __webpack_require__(
        /*! ./queries */ './src/views/communityAnalytics/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions_modals__ = __webpack_require__(
        /*! ../../actions/modals */ './src/actions/modals.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_viewError__ = __webpack_require__(
        /*! ../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_buttons__ = __webpack_require__(
        /*! ../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_memberGrowth__ = __webpack_require__(
        /*! ./components/memberGrowth */ './src/views/communityAnalytics/components/memberGrowth.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_conversationGrowth__ = __webpack_require__(
        /*! ./components/conversationGrowth */ './src/views/communityAnalytics/components/conversationGrowth.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_topMembers__ = __webpack_require__(
        /*! ./components/topMembers */ './src/views/communityAnalytics/components/topMembers.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_topAndNewThreads__ = __webpack_require__(
        /*! ./components/topAndNewThreads */ './src/views/communityAnalytics/components/topAndNewThreads.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_settingsViews_style__ = __webpack_require__(
        /*! ../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_loading__ = __webpack_require__(
        /*! ../../components/loading */ './src/components/loading/index.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communityAnalytics/index.js';

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

      var CommunityAnalytics = (function(_React$Component) {
        _inherits(CommunityAnalytics, _React$Component);

        function CommunityAnalytics() {
          var _ref;

          var _temp, _this, _ret;

          _classCallCheck(this, CommunityAnalytics);

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
                CommunityAnalytics.__proto__ ||
                Object.getPrototypeOf(CommunityAnalytics)).call.apply(
                _ref,
                [this].concat(args)
              )
            )),
            _this)),
            (_this.upgrade = function() {
              var _this$props = _this.props,
                dispatch = _this$props.dispatch,
                currentUser = _this$props.currentUser,
                community = _this$props.data.community;

              dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_5__actions_modals__[
                    'b' /* openModal */
                  ]
                )('COMMUNITY_UPGRADE_MODAL', {
                  user: currentUser,
                  community: community,
                })
              );
            }),
            _temp)),
            _possibleConstructorReturn(_this, _ret)
          );
        }

        _createClass(CommunityAnalytics, [
          {
            key: 'render',
            value: function render() {
              var _props = this.props,
                community = _props.data.community,
                isLoading = _props.isLoading;

              if (community) {
                if (!community.isPro) {
                  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_6__components_viewError__[
                      'a' /* default */
                    ],
                    {
                      emoji: '💪',
                      heading:
                        'Supercharge your community with Spectrum Analytics.',
                      subheading:
                        'To explore analytics for your community, unlock private channels, add multiple moderators, and more, please upgrade to the standard plan.',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 51,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                        'b' /* ButtonRow */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 56,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                          'a' /* Button */
                        ],
                        {
                          onClick: this.upgrade,
                          large: true,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 57,
                          },
                          __self: this,
                        },
                        'Upgrade to Standard'
                      )
                    )
                  );
                }

                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_13__components_settingsViews_style__[
                    'j' /* SectionsContainer */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 66,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__components_settingsViews_style__[
                      'a' /* Column */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 67,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_9__components_memberGrowth__[
                        'a' /* default */
                      ],
                      {
                        communitySlug: community.slug,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 68,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_11__components_topMembers__[
                        'a' /* default */
                      ],
                      {
                        communitySlug: community.slug,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 69,
                        },
                        __self: this,
                      }
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_13__components_settingsViews_style__[
                      'a' /* Column */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 71,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_10__components_conversationGrowth__[
                        'a' /* default */
                      ],
                      {
                        communitySlug: community.slug,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 72,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_12__components_topAndNewThreads__[
                        'a' /* default */
                      ],
                      {
                        communitySlug: community.slug,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 73,
                        },
                        __self: this,
                      }
                    )
                  )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_14__components_loading__[
                    'a' /* Loading */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 80,
                    },
                    __self: this,
                  }
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_6__components_viewError__[
                  'a' /* default */
                ],
                {
                  heading:
                    'You don\u2019t have permission to manage this community.',
                  subheading:
                    'If you want to create your own community, you can get started below.',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 84,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                    'b' /* ButtonRow */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 88,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3_src_components_link__[
                      'a' /* default */
                    ],
                    {
                      to: '/',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 89,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                        'e' /* OutlineButton */
                      ],
                      {
                        large: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 90,
                        },
                        __self: this,
                      },
                      'Take me back'
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3_src_components_link__[
                      'a' /* default */
                    ],
                    {
                      to: '/new/community',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 93,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                        'a' /* Button */
                      ],
                      {
                        large: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 94,
                        },
                        __self: this,
                      },
                      'Create a community'
                    )
                  )
                )
              );
            },
          },
        ]);

        return CommunityAnalytics;
      })(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

      var map = function map(state) {
        return { currentUser: state.users.currentUser };
      };
      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(
          map
        ),
        __WEBPACK_IMPORTED_MODULE_4__queries__['e' /* getThisCommunity */],
        __WEBPACK_IMPORTED_MODULE_7__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(CommunityAnalytics);

      /***/
    },

  /***/ './src/views/communityAnalytics/queries.js':
    /*!*************************************************!*\
  !*** ./src/views/communityAnalytics/queries.js ***!
  \*************************************************/
    /*! exports provided: getThisCommunity, getCommunityMemberGrowth, getCommunityConversationGrowth, getCommunityTopMembers, getCommunityTopAndNewThreads */
    /*! exports used: getCommunityConversationGrowth, getCommunityMemberGrowth, getCommunityTopAndNewThreads, getCommunityTopMembers, getThisCommunity */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return getThisCommunity;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return getCommunityMemberGrowth;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return getCommunityConversationGrowth;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return getCommunityTopMembers;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return getCommunityTopAndNewThreads;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo__ = __webpack_require__(
        /*! react-apollo */ './node_modules/react-apollo/react-apollo.browser.umd.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_fragments_community_communityInfo__ = __webpack_require__(
        /*! ../../api/fragments/community/communityInfo */ './src/api/fragments/community/communityInfo.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_fragments_user_userInfo__ = __webpack_require__(
        /*! ../../api/fragments/user/userInfo */ './src/api/fragments/user/userInfo.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_fragments_thread_threadInfo__ = __webpack_require__(
        /*! ../../api/fragments/thread/threadInfo */ './src/api/fragments/thread/threadInfo.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__api_fragments_community_communityMetaData__ = __webpack_require__(
        /*! ../../api/fragments/community/communityMetaData */ './src/api/fragments/community/communityMetaData.js'
      );
      var _templateObject = _taggedTemplateLiteral(
          [
            '\n    query community($slug: String) {\n      community(slug: $slug) {\n        ...communityInfo\n        ...communityMetaData\n      }\n    }\n    ',
            '\n    ',
            '\n  ',
          ],
          [
            '\n    query community($slug: String) {\n      community(slug: $slug) {\n        ...communityInfo\n        ...communityMetaData\n      }\n    }\n    ',
            '\n    ',
            '\n  ',
          ]
        ),
        _templateObject2 = _taggedTemplateLiteral(
          [
            '\n  query getCommunityMemberGrowth($slug: String) {\n    community(slug: $slug) {\n      ...communityInfo\n      memberGrowth {\n        count\n        weeklyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n        monthlyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n        quarterlyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n      }\n    }\n  }\n  ',
            '\n',
          ],
          [
            '\n  query getCommunityMemberGrowth($slug: String) {\n    community(slug: $slug) {\n      ...communityInfo\n      memberGrowth {\n        count\n        weeklyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n        monthlyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n        quarterlyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n      }\n    }\n  }\n  ',
            '\n',
          ]
        ),
        _templateObject3 = _taggedTemplateLiteral(
          [
            '\n  query getCommunityConversationGrowth($slug: String) {\n    community(slug: $slug) {\n      ...communityInfo\n      conversationGrowth {\n        count\n        weeklyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n        monthlyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n        quarterlyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n      }\n    }\n  }\n  ',
            '\n',
          ],
          [
            '\n  query getCommunityConversationGrowth($slug: String) {\n    community(slug: $slug) {\n      ...communityInfo\n      conversationGrowth {\n        count\n        weeklyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n        monthlyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n        quarterlyGrowth {\n          growth\n          currentPeriodCount\n          prevPeriodCount\n        }\n      }\n    }\n  }\n  ',
            '\n',
          ]
        ),
        _templateObject4 = _taggedTemplateLiteral(
          [
            '\n  query getCommunityTopMembers($slug: String) {\n    community(slug: $slug) {\n      ...communityInfo\n      topMembers {\n        ...userInfo\n        isPro\n        contextPermissions {\n          reputation\n          isOwner\n          isModerator\n        }\n      }\n    }\n  }\n  ',
            '\n  ',
            '\n',
          ],
          [
            '\n  query getCommunityTopMembers($slug: String) {\n    community(slug: $slug) {\n      ...communityInfo\n      topMembers {\n        ...userInfo\n        isPro\n        contextPermissions {\n          reputation\n          isOwner\n          isModerator\n        }\n      }\n    }\n  }\n  ',
            '\n  ',
            '\n',
          ]
        ),
        _templateObject5 = _taggedTemplateLiteral(
          [
            '\n  query getCommunityTopAndNewThreads($slug: String) {\n    community(slug: $slug) {\n      ...communityInfo\n      topAndNewThreads {\n        topThreads {\n          ...threadInfo\n        }\n        newThreads {\n          ...threadInfo\n        }\n      }\n    }\n  }\n  ',
            '\n  ',
            '\n',
          ],
          [
            '\n  query getCommunityTopAndNewThreads($slug: String) {\n    community(slug: $slug) {\n      ...communityInfo\n      topAndNewThreads {\n        topThreads {\n          ...threadInfo\n        }\n        newThreads {\n          ...threadInfo\n        }\n      }\n    }\n  }\n  ',
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

      var getThisCommunity = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(
        Object(__WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql'])(
          _templateObject,
          __WEBPACK_IMPORTED_MODULE_1__api_fragments_community_communityInfo__[
            'a' /* communityInfoFragment */
          ],
          __WEBPACK_IMPORTED_MODULE_4__api_fragments_community_communityMetaData__[
            'a' /* communityMetaDataFragment */
          ]
        ),
        {
          options: function options(props) {
            return {
              variables: {
                slug: props.communitySlug.toLowerCase(),
              },
              fetchPolicy: 'network-only',
            };
          },
        }
      );

      var COMMUNITY_GROWTH_QUERY = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql']
      )(
        _templateObject2,
        __WEBPACK_IMPORTED_MODULE_1__api_fragments_community_communityInfo__[
          'a' /* communityInfoFragment */
        ]
      );

      var COMMUNITY_GROWTH_OPTIONS = {
        options: function options(_ref) {
          var communitySlug = _ref.communitySlug;
          return {
            variables: {
              slug: communitySlug.toLowerCase(),
            },
            fetchPolicy: 'cache-and-network',
          };
        },
      };

      var getCommunityMemberGrowth = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(COMMUNITY_GROWTH_QUERY, COMMUNITY_GROWTH_OPTIONS);

      var COMMUNITY_CONVERSATION_GROWTH_QUERY = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql']
      )(
        _templateObject3,
        __WEBPACK_IMPORTED_MODULE_1__api_fragments_community_communityInfo__[
          'a' /* communityInfoFragment */
        ]
      );

      var COMMUNITY_CONVERSATION_GROWTH_OPTIONS = {
        options: function options(_ref2) {
          var communitySlug = _ref2.communitySlug;
          return {
            variables: {
              slug: communitySlug.toLowerCase(),
            },
            fetchPolicy: 'cache-and-network',
          };
        },
      };

      var getCommunityConversationGrowth = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(
        COMMUNITY_CONVERSATION_GROWTH_QUERY,
        COMMUNITY_CONVERSATION_GROWTH_OPTIONS
      );

      var COMMUNITY_TOP_MEMBERS_QUERY = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql']
      )(
        _templateObject4,
        __WEBPACK_IMPORTED_MODULE_1__api_fragments_community_communityInfo__[
          'a' /* communityInfoFragment */
        ],
        __WEBPACK_IMPORTED_MODULE_2__api_fragments_user_userInfo__[
          'a' /* userInfoFragment */
        ]
      );

      var COMMUNITY_TOP_MEMBERS_OPTIONS = {
        options: function options(_ref3) {
          var communitySlug = _ref3.communitySlug;
          return {
            variables: {
              slug: communitySlug.toLowerCase(),
            },
            fetchPolicy: 'cache-and-network',
          };
        },
      };

      var getCommunityTopMembers = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(COMMUNITY_TOP_MEMBERS_QUERY, COMMUNITY_TOP_MEMBERS_OPTIONS);

      var COMMUNITY_TOP_NEW_THREADS_QUERY = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql']
      )(
        _templateObject5,
        __WEBPACK_IMPORTED_MODULE_1__api_fragments_community_communityInfo__[
          'a' /* communityInfoFragment */
        ],
        __WEBPACK_IMPORTED_MODULE_3__api_fragments_thread_threadInfo__[
          'a' /* threadInfoFragment */
        ]
      );

      var COMMUNITY_TOP_NEW_THREADS_OPTIONS = {
        options: function options(_ref4) {
          var communitySlug = _ref4.communitySlug;
          return {
            variables: {
              slug: communitySlug.toLowerCase(),
            },
            fetchPolicy: 'cache-and-network',
          };
        },
      };

      var getCommunityTopAndNewThreads = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(COMMUNITY_TOP_NEW_THREADS_QUERY, COMMUNITY_TOP_NEW_THREADS_OPTIONS);

      /***/
    },

  /***/ './src/views/communityAnalytics/style.js':
    /*!***********************************************!*\
  !*** ./src/views/communityAnalytics/style.js ***!
  \***********************************************/
    /*! exports provided: Heading, Subheading, StyledHeader, HeaderText, StyledThreadListItem, ThreadListItemTitle, ThreadListItemSubtitle */
    /*! exports used: StyledThreadListItem, ThreadListItemSubtitle, ThreadListItemTitle */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* unused harmony export Heading */
      /* unused harmony export Subheading */
      /* unused harmony export StyledHeader */
      /* unused harmony export HeaderText */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return StyledThreadListItem;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return ThreadListItemTitle;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return ThreadListItemSubtitle;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );

      // $FlowFixMe

      var Heading = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h1.withConfig({
        displayName: 'style__Heading',
        componentId: 'gqpgtj-0',
      })(
        ['margin-left:16px;font-size:32px;color:', ';font-weight:800;'],
        function(props) {
          return props.theme.text.default;
        }
      );

      var Subheading = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h3.withConfig({
        displayName: 'style__Subheading',
        componentId: 'gqpgtj-1',
      })(
        [
          'margin-left:16px;font-size:16px;color:',
          ';font-weight:500;line-height:1;margin-bottom:8px;',
        ],
        function(props) {
          return props.theme.text.alt;
        }
      );

      var StyledHeader = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__StyledHeader',
        componentId: 'gqpgtj-2',
      })(
        [
          'display:flex;padding:32px;border-bottom:1px solid ',
          ';background:',
          ';width:100%;align-items:center;',
        ],
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.theme.bg.default;
        }
      );

      var HeaderText = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__HeaderText',
        componentId: 'gqpgtj-3',
      })(['display:flex;flex-direction:column;justify-content:space-around;']);

      var StyledThreadListItem = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__StyledThreadListItem',
        componentId: 'gqpgtj-4',
      })(
        [
          'display:flex;border-bottom:1px solid ',
          ';padding:16px 0;flex-direction:column;&:last-of-type{border-bottom:0;padding-bottom:0;}',
        ],
        function(props) {
          return props.theme.bg.border;
        }
      );
      var ThreadListItemTitle = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h4.withConfig({
        displayName: 'style__ThreadListItemTitle',
        componentId: 'gqpgtj-5',
      })(
        [
          'font-size:16px;color:',
          ';line-height:1.28;font-weight:500;&:hover{color:',
          ';}',
        ],
        function(props) {
          return props.theme.text.default;
        },
        function(props) {
          return props.theme.brand.alt;
        }
      );

      var ThreadListItemSubtitle = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].h5.withConfig({
        displayName: 'style__ThreadListItemSubtitle',
        componentId: 'gqpgtj-6',
      })(
        [
          'font-size:14px;color:',
          ';line-height:1.28;margin-top:4px;a:hover{color:',
          ';}',
        ],
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.text.default;
        }
      );

      /***/
    },

  /***/ './src/views/communityAnalytics/utils.js':
    /*!***********************************************!*\
  !*** ./src/views/communityAnalytics/utils.js ***!
  \***********************************************/
    /*! exports provided: parseGrowth */
    /*! exports used: parseGrowth */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return parseGrowth;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(
        /*! react */ './node_modules/react/react.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_settingsViews_style__ = __webpack_require__(
        /*! ../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/communityAnalytics/utils.js',
        _this = this;

      var parseGrowth = function parseGrowth(_ref, range) {
        var growth = _ref.growth,
          currentPeriodCount = _ref.currentPeriodCount,
          prevPeriodCount = _ref.prevPeriodCount;

        if (!growth) {
          return null;
        } else if (growth > 0) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 20,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1__components_settingsViews_style__[
                'h' /* SectionSubtitle */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 21,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_1__components_settingsViews_style__[
                  'b' /* GrowthText */
                ],
                {
                  positive: true,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 22,
                  },
                  __self: _this,
                },
                '+',
                growth,
                '%'
              ),
              range
            )
          );
        } else if (growth < 0) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 29,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1__components_settingsViews_style__[
                'h' /* SectionSubtitle */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 30,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_1__components_settingsViews_style__[
                  'b' /* GrowthText */
                ],
                {
                  negative: true,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 31,
                  },
                  __self: _this,
                },
                growth,
                '%'
              ),
              range
            )
          );
        } else {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 38,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1__components_settingsViews_style__[
                'h' /* SectionSubtitle */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 39,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_1__components_settingsViews_style__[
                  'b' /* GrowthText */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 40,
                  },
                  __self: _this,
                },
                '+0%'
              ),
              range
            )
          );
        }
      };

      /***/
    },

  /***/ './src/views/communitySettings/components/channelList.js':
    /*!***************************************************************!*\
  !*** ./src/views/communitySettings/components/channelList.js ***!
  \***************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_modals__ = __webpack_require__(
        /*! ../../../actions/modals */ './src/actions/modals.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_listItems__ = __webpack_require__(
        /*! ../../../components/listItems */ './src/components/listItems/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_viewError__ = __webpack_require__(
        /*! ../../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__queries__ = __webpack_require__(
        /*! ../queries */ './src/views/communitySettings/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__style__ = __webpack_require__(
        /*! ../style */ './src/views/communitySettings/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communitySettings/components/channelList.js';

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

      //$FlowFixMe

      var ChannelList = (function(_React$Component) {
        _inherits(ChannelList, _React$Component);

        function ChannelList() {
          _classCallCheck(this, ChannelList);

          return _possibleConstructorReturn(
            this,
            (ChannelList.__proto__ || Object.getPrototypeOf(ChannelList)).apply(
              this,
              arguments
            )
          );
        }

        _createClass(ChannelList, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                community = _props.data.community,
                isLoading = _props.isLoading,
                dispatch = _props.dispatch,
                communitySlug = _props.communitySlug;

              if (community) {
                var channels = community.channelConnection.edges.map(function(
                  c
                ) {
                  return c.node;
                });

                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 45,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_style__[
                      'i' /* SectionTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 46,
                      },
                      __self: this,
                    },
                    'Channels'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__style__[
                      'f' /* ListContainer */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 48,
                      },
                      __self: this,
                    },
                    channels.length > 0 &&
                      channels.map(function(item) {
                        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                            'a' /* default */
                          ],
                          {
                            key: item.id,
                            to:
                              '/' +
                              communitySlug +
                              '/' +
                              item.slug +
                              '/settings',
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 52,
                            },
                            __self: _this2,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_6__components_listItems__[
                              'b' /* ChannelListItem */
                            ],
                            {
                              contents: item,
                              withDescription: false,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 56,
                              },
                              __self: _this2,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_7__components_buttons__[
                                'd' /* IconButton */
                              ],
                              {
                                glyph: 'settings',
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 57,
                                },
                                __self: _this2,
                              }
                            )
                          )
                        );
                      })
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_style__[
                      'g' /* SectionCardFooter */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 64,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_7__components_buttons__[
                        'a' /* Button */
                      ],
                      {
                        style: { alignSelf: 'flex-start' },
                        icon: 'plus',
                        onClick: function onClick() {
                          return dispatch(
                            Object(
                              __WEBPACK_IMPORTED_MODULE_4__actions_modals__[
                                'b' /* openModal */
                              ]
                            )('CREATE_CHANNEL_MODAL', community)
                          );
                        },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 65,
                        },
                        __self: this,
                      },
                      'Create Channel'
                    )
                  )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 81,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_loading__[
                      'a' /* Loading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 82,
                      },
                      __self: this,
                    }
                  )
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_style__[
                  'f' /* SectionCard */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 88,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__components_viewError__[
                    'a' /* default */
                  ],
                  {
                    refresh: true,
                    small: true,
                    heading:
                      'We couldn\u2019t load the channels for this community.',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 89,
                    },
                    __self: this,
                  }
                )
              );
            },
          },
        ]);

        return ChannelList;
      })(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_3_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_10__queries__['a' /* getCommunityChannels */],
        __WEBPACK_IMPORTED_MODULE_8__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(ChannelList);

      /***/
    },

  /***/ './src/views/communitySettings/components/communityMembers.js':
    /*!********************************************************************!*\
  !*** ./src/views/communitySettings/components/communityMembers.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_viewError__ = __webpack_require__(
        /*! ../../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__api_community__ = __webpack_require__(
        /*! ../../../api/community */ './src/api/community.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_threadFeed_style__ = __webpack_require__(
        /*! ../../../components/threadFeed/style */ './src/components/threadFeed/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communitySettings/components/communityMembers.js';

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

      var CommunityMembers = (function(_React$Component) {
        _inherits(CommunityMembers, _React$Component);

        function CommunityMembers() {
          _classCallCheck(this, CommunityMembers);

          return _possibleConstructorReturn(
            this,
            (
              CommunityMembers.__proto__ ||
              Object.getPrototypeOf(CommunityMembers)
            ).apply(this, arguments)
          );
        }

        _createClass(CommunityMembers, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props$data = this.props.data,
                error = _props$data.error,
                community = _props$data.community,
                networkStatus = _props$data.networkStatus,
                fetchMore = _props$data.fetchMore;

              var members =
                community &&
                community.memberConnection &&
                community.memberConnection.edges.map(function(member) {
                  return member.node;
                });
              var totalCount =
                community && community.metaData && community.metaData.members;

              if (networkStatus === 1) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 28,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_3__components_loading__[
                      'a' /* Loading */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 29,
                      },
                      __self: this,
                    }
                  )
                );
              } else if (error) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 34,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__components_viewError__[
                      'a' /* default */
                    ],
                    {
                      small: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 35,
                      },
                      __self: this,
                    }
                  )
                );
              } else {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 40,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                      'i' /* SectionTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 41,
                      },
                      __self: this,
                    },
                    totalCount.toLocaleString(),
                    ' Members'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__[
                      'h' /* ListContainer */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 43,
                      },
                      __self: this,
                    },
                    members &&
                      members.map(function(user) {
                        return __WEBPACK_IMPORTED_MODULE_0_react__[
                          'createElement'
                        ](
                          'section',
                          {
                            key: user.id,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 47,
                            },
                            __self: _this2,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_1__components_listItems__[
                              'g' /* UserListItem */
                            ],
                            {
                              user: user,
                              reputationTipText: 'Rep in this community',
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 48,
                              },
                              __self: _this2,
                            }
                          )
                        );
                      })
                  ),
                  community.memberConnection.pageInfo.hasNextPage &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                        'g' /* SectionCardFooter */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 58,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_6__components_threadFeed_style__[
                          'b' /* FetchMoreButton */
                        ],
                        {
                          color: 'brand.default',
                          loading: networkStatus === 3,
                          onClick: function onClick() {
                            return fetchMore();
                          },
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 59,
                          },
                          __self: this,
                        },
                        'Load more'
                      )
                    )
                );
              }
            },
          },
        ]);

        return CommunityMembers;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_5__api_community__[
          'k' /* getCommunityMembersQuery */
        ]
      )(CommunityMembers);

      /***/
    },

  /***/ './src/views/communitySettings/components/editForm.js':
    /*!************************************************************!*\
  !*** ./src/views/communitySettings/components/editForm.js ***!
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
        /*! ../../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__api_community__ = __webpack_require__(
        /*! ../../../api/community */ './src/api/community.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__actions_modals__ = __webpack_require__(
        /*! ../../../actions/modals */ './src/actions/modals.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__actions_toasts__ = __webpack_require__(
        /*! ../../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_formElements__ = __webpack_require__(
        /*! ../../../components/formElements */ './src/components/formElements/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_editForm_style__ = __webpack_require__(
        /*! ../../../components/editForm/style */ './src/components/editForm/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communitySettings/components/editForm.js';

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

      var EditForm = (function(_React$Component) {
        _inherits(EditForm, _React$Component);

        function EditForm(props) {
          _classCallCheck(this, EditForm);

          var _this = _possibleConstructorReturn(
            this,
            (EditForm.__proto__ || Object.getPrototypeOf(EditForm)).call(
              this,
              props
            )
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
            nameError: false,
            communityData: community,
            photoSizeError: false,
            isLoading: false,
          };
          return _this;
        }

        _createClass(EditForm, [
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
                photoSizeError = _state.photoSizeError,
                nameError = _state.nameError,
                isLoading = _state.isLoading;
              var community = this.props.community;

              if (!community) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 282,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_11__components_editForm_style__[
                      'd' /* FormTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 283,
                      },
                      __self: this,
                    },
                    'This community doesn\u2019t exist yet.'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_11__components_editForm_style__[
                      'b' /* Description */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 284,
                      },
                      __self: this,
                    },
                    'Want to make it?'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_11__components_editForm_style__[
                      'a' /* Actions */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 285,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                        'a' /* Button */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 286,
                        },
                        __self: this,
                      },
                      'Create'
                    )
                  )
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_style__[
                  'f' /* SectionCard */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 293,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_style__[
                    'i' /* SectionTitle */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 294,
                    },
                    __self: this,
                  },
                  'Community Settings'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_11__components_editForm_style__[
                    'c' /* Form */
                  ],
                  {
                    onSubmit: this.save,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 295,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_11__components_editForm_style__[
                      'f' /* ImageInputWrapper */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 296,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_10__components_formElements__[
                        'b' /* CoverInput */
                      ],
                      {
                        onChange: this.setCommunityCover,
                        defaultValue: coverPhoto,
                        preview: true,
                        allowGif: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 297,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_10__components_formElements__[
                        'e' /* PhotoInput */
                      ],
                      {
                        onChange: this.setCommunityPhoto,
                        defaultValue: image,
                        community: true,
                        user: null,
                        allowGif: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 304,
                        },
                        __self: this,
                      }
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_10__components_formElements__[
                      'd' /* Input */
                    ],
                    {
                      defaultValue: name,
                      onChange: this.changeName,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 313,
                      },
                      __self: this,
                    },
                    'Name'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_10__components_formElements__[
                      'h' /* UnderlineInput */
                    ],
                    {
                      defaultValue: slug,
                      disabled: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 316,
                      },
                      __self: this,
                    },
                    'spectrum.chat/'
                  ),
                  nameError &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_10__components_formElements__[
                        'c' /* Error */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 321,
                        },
                        __self: this,
                      },
                      'Community names can be up to 20 characters long.'
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_10__components_formElements__[
                      'g' /* TextArea */
                    ],
                    {
                      defaultValue: description,
                      onChange: this.changeDescription,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 324,
                      },
                      __self: this,
                    },
                    'Description'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_10__components_formElements__[
                      'd' /* Input */
                    ],
                    {
                      defaultValue: website,
                      onChange: this.changeWebsite,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 331,
                      },
                      __self: this,
                    },
                    'Optional: Add your community\u2019s website'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_11__components_editForm_style__[
                      'a' /* Actions */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 335,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                        'a' /* Button */
                      ],
                      {
                        loading: isLoading,
                        onClick: this.save,
                        disabled: photoSizeError,
                        type: 'submit',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 336,
                        },
                        __self: this,
                      },
                      'Save'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_11__components_editForm_style__[
                        'j' /* TertiaryActionContainer */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 344,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_8__components_buttons__[
                          'd' /* IconButton */
                        ],
                        {
                          glyph: 'delete',
                          tipText: 'Delete ' + name,
                          tipLocation: 'top-right',
                          color: 'text.placeholder',
                          hoverColor: 'warn.alt',
                          onClick: function onClick(e) {
                            return _this2.triggerDeleteCommunity(
                              e,
                              community.id
                            );
                          },
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 345,
                          },
                          __self: this,
                        }
                      )
                    )
                  ),
                  photoSizeError &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                        'n' /* Notice */
                      ],
                      {
                        style: { marginTop: '16px' },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 357,
                        },
                        __self: this,
                      },
                      'Photo uploads should be less than 3mb'
                    )
                )
              );
            },
          },
        ]);

        return EditForm;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var _initialiseProps = function _initialiseProps() {
        var _this3 = this;

        this.changeName = function(e) {
          var name = e.target.value;

          if (name.length >= 20) {
            _this3.setState({
              name: name,
              nameError: true,
            });

            return;
          }

          _this3.setState({
            name: name,
            nameError: false,
          });
        };

        this.changeDescription = function(e) {
          var description = e.target.value;
          _this3.setState({
            description: description,
          });
        };

        this.changeSlug = function(e) {
          var slug = e.target.value;
          _this3.setState({
            slug: slug,
          });
        };

        this.changeWebsite = function(e) {
          var website = e.target.value;
          _this3.setState({
            website: website,
          });
        };

        this.setCommunityPhoto = function(e) {
          var reader = new FileReader();
          var file = e.target.files[0];

          _this3.setState({
            isLoading: true,
          });

          if (file && file.size > 3000000) {
            return _this3.setState({
              photoSizeError: true,
              isLoading: false,
            });
          }

          reader.onloadend = function() {
            Object(
              __WEBPACK_IMPORTED_MODULE_4__helpers_events__['b' /* track */]
            )('community', 'profile photo uploaded', null);

            _this3.setState({
              file: file,
              image: reader.result,
              photoSizeError: false,
              isLoading: false,
            });
          };

          if (file) {
            reader.readAsDataURL(file);
          }
        };

        this.setCommunityCover = function(e) {
          var reader = new FileReader();
          var file = e.target.files[0];

          _this3.setState({
            isLoading: true,
          });

          if (file && file.size > 3000000) {
            return _this3.setState({
              photoSizeError: true,
              isLoading: false,
            });
          }

          reader.onloadend = function() {
            Object(
              __WEBPACK_IMPORTED_MODULE_4__helpers_events__['b' /* track */]
            )('community', 'cover photo uploaded', null);

            _this3.setState({
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
          var _state2 = _this3.state,
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

          _this3.setState({
            isLoading: true,
          });

          _this3.props
            .editCommunity(input)
            .then(function(_ref) {
              var editCommunity = _ref.data.editCommunity;

              var community = editCommunity;

              _this3.setState({
                isLoading: false,
              });

              // community was returned
              if (community !== undefined) {
                Object(
                  __WEBPACK_IMPORTED_MODULE_4__helpers_events__['b' /* track */]
                )('community', 'edited', null);

                _this3.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_7__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('success', 'Community saved!')
                );
                window.location.href = '/' + _this3.props.community.slug;
              }
            })
            .catch(function(err) {
              _this3.setState({
                isLoading: false,
              });

              _this3.props.dispatch(
                Object(
                  __WEBPACK_IMPORTED_MODULE_7__actions_toasts__[
                    'a' /* addToastWithTimeout */
                  ]
                )(
                  'error',
                  'Something went wrong and we weren\u2019t able to save these changes. ' +
                    err
                )
              );
            });
        };

        this.triggerDeleteCommunity = function(e, communityId) {
          e.preventDefault();
          Object(
            __WEBPACK_IMPORTED_MODULE_4__helpers_events__['b' /* track */]
          )('community', 'delete inited', null);
          var _state3 = _this3.state,
            name = _state3.name,
            communityData = _state3.communityData;

          var message = __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
            'div',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 239,
              },
              __self: _this3,
            },
            __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
              'p',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 240,
                },
                __self: _this3,
              },
              'Are you sure you want to delete your community, ',
              __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                'b',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 241,
                  },
                  __self: _this3,
                },
                name
              ),
              '?'
            ),
            ' ',
            __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
              'p',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 243,
                },
                __self: _this3,
              },
              __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                'b',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 244,
                  },
                  __self: _this3,
                },
                communityData.metaData.members,
                ' members'
              ),
              ' will be removed from the community and the',
              ' ',
              __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                'b',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 246,
                  },
                  __self: _this3,
                },
                communityData.metaData.channels,
                ' channels'
              ),
              ' you\u2019ve created will be deleted.'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
              'p',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 249,
                },
                __self: _this3,
              },
              'All threads, messages, reactions, and media shared in your community will be deleted.'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
              'p',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 253,
                },
                __self: _this3,
              },
              'This cannot be undone.'
            )
          );

          return _this3.props.dispatch(
            Object(
              __WEBPACK_IMPORTED_MODULE_6__actions_modals__['b' /* openModal */]
            )('DELETE_DOUBLE_CHECK_MODAL', {
              id: communityId,
              entity: 'community',
              message: message,
            })
          );
        };
      };

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_5__api_community__[
          'd' /* deleteCommunityMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_5__api_community__[
          'f' /* editCommunityMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_3_react_router__['e' /* withRouter */]
      )(EditForm);

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

  /***/ './src/views/communitySettings/components/invoices.js':
    /*!************************************************************!*\
  !*** ./src/views/communitySettings/components/invoices.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_1_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_community__ = __webpack_require__(
        /*! ../../../api/community */ './src/api/community.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_listItems__ = __webpack_require__(
        /*! ../../../components/listItems */ './src/components/listItems/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__helpers_utils__ = __webpack_require__(
        /*! ../../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communitySettings/components/invoices.js';

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

      var Invoices = (function(_React$Component) {
        _inherits(Invoices, _React$Component);

        function Invoices() {
          _classCallCheck(this, Invoices);

          return _possibleConstructorReturn(
            this,
            (Invoices.__proto__ || Object.getPrototypeOf(Invoices)).apply(
              this,
              arguments
            )
          );
        }

        _createClass(Invoices, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                community = _props.data.community,
                isLoading = _props.isLoading;

              if (community) {
                var _invoices = community.invoices;

                var sortedInvoices = Object(
                  __WEBPACK_IMPORTED_MODULE_7__helpers_utils__[
                    'f' /* sortByDate */
                  ]
                )(_invoices.slice(), 'paidAt', 'desc');
                if (!sortedInvoices || sortedInvoices.length === 0) {
                  return null;
                }

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 46,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                      'i' /* SectionTitle */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 47,
                      },
                      __self: this,
                    },
                    'Payment History'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                      'h' /* ListContainer */
                    ],
                    {
                      style: { marginTop: '16px' },
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 49,
                      },
                      __self: this,
                    },
                    sortedInvoices &&
                      sortedInvoices.map(function(invoice) {
                        return __WEBPACK_IMPORTED_MODULE_0_react__[
                          'createElement'
                        ](
                          __WEBPACK_IMPORTED_MODULE_6__components_listItems__[
                            'e' /* InvoiceListItem */
                          ],
                          {
                            invoice: invoice,
                            key: invoice.id,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 52,
                            },
                            __self: _this2,
                          }
                        );
                      })
                  )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                    'f' /* SectionCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 61,
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
                        lineNumber: 62,
                      },
                      __self: this,
                    }
                  )
                );
              }

              return null;
            },
          },
        ]);

        return Invoices;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_3__api_community__[
          'j' /* getCommunityInvoices */
        ],
        __WEBPACK_IMPORTED_MODULE_5__components_viewNetworkHandler__[
          'a' /* default */
        ],
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])()
      )(Invoices);

      /***/
    },

  /***/ './src/views/communitySettings/components/overview.js':
    /*!************************************************************!*\
  !*** ./src/views/communitySettings/components/overview.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__editForm__ = __webpack_require__(
        /*! ./editForm */ './src/views/communitySettings/components/editForm.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__recurringPaymentsList__ = __webpack_require__(
        /*! ./recurringPaymentsList */ './src/views/communitySettings/components/recurringPaymentsList.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__channelList__ = __webpack_require__(
        /*! ./channelList */ './src/views/communitySettings/components/channelList.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__importSlack__ = __webpack_require__(
        /*! ./importSlack */ './src/views/communitySettings/components/importSlack.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_emailInvitationForm__ = __webpack_require__(
        /*! ../../../components/emailInvitationForm */ './src/components/emailInvitationForm/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__invoices__ = __webpack_require__(
        /*! ./invoices */ './src/views/communitySettings/components/invoices.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__communityMembers__ = __webpack_require__(
        /*! ./communityMembers */ './src/views/communitySettings/components/communityMembers.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communitySettings/components/overview.js';

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
              var _props = this.props,
                community = _props.community,
                communitySlug = _props.communitySlug;

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                  'j' /* SectionsContainer */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 26,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                    'a' /* Column */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 27,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_1__editForm__['a' /* default */],
                    {
                      community: community,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 28,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_2__recurringPaymentsList__[
                      'a' /* default */
                    ],
                    {
                      community: community,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 29,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_6__invoices__['a' /* default */],
                    {
                      id: community.id,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 30,
                      },
                      __self: this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                    'a' /* Column */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 32,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__importSlack__[
                      'b' /* default */
                    ],
                    {
                      community: community,
                      id: community.id,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 33,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                      'f' /* SectionCard */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 35,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                        'i' /* SectionTitle */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 36,
                        },
                        __self: this,
                      },
                      'Invite by email'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_5__components_emailInvitationForm__[
                        'a' /* CommunityInvitationForm */
                      ],
                      {
                        id: community.id,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 37,
                        },
                        __self: this,
                      }
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_3__channelList__[
                      'a' /* default */
                    ],
                    {
                      communitySlug: communitySlug,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 40,
                      },
                      __self: this,
                    }
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                    'a' /* Column */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 42,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_7__communityMembers__[
                      'a' /* default */
                    ],
                    {
                      id: community.id,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 43,
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

  /***/ './src/views/communitySettings/components/recurringPaymentsList.js':
    /*!*************************************************************************!*\
  !*** ./src/views/communitySettings/components/recurringPaymentsList.js ***!
  \*************************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__upgradeCommunity__ = __webpack_require__(
        /*! ./upgradeCommunity */ './src/views/communitySettings/components/upgradeCommunity.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__actions_modals__ = __webpack_require__(
        /*! ../../../actions/modals */ './src/actions/modals.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__helpers_utils__ = __webpack_require__(
        /*! ../../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__ = __webpack_require__(
        /*! ../../../components/settingsViews/style */ './src/components/settingsViews/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/communitySettings/components/recurringPaymentsList.js',
        _this = this;

      //$FlowFixMe

      //$FlowFixMe

      var RecurringPaymentsList = function RecurringPaymentsList(_ref) {
        var community = _ref.community,
          currentUser = _ref.currentUser,
          dispatch = _ref.dispatch;

        var openCommunityProModal = function openCommunityProModal() {
          dispatch(
            Object(
              __WEBPACK_IMPORTED_MODULE_6__actions_modals__['b' /* openModal */]
            )('COMMUNITY_UPGRADE_MODAL', {
              user: currentUser,
              community: community,
            })
          );
        };

        if (!community || community === undefined) return null;

        // make sure to only display active subs for now
        var filteredRecurringPayments =
          community.recurringPayments && community.recurringPayments.length > 0
            ? community.recurringPayments.filter(function(subscription) {
                return subscription.status === 'active';
              })
            : [];

        if (filteredRecurringPayments.length > 0) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
              'f' /* SectionCard */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 36,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
                'i' /* SectionTitle */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 37,
                },
                __self: _this,
              },
              'Plan'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_9__components_listItems_style__[
                'h' /* ListContainer */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 38,
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
                      lineNumber: 45,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_4__components_buttons__[
                      'd' /* IconButton */
                    ],
                    {
                      glyph: 'settings',
                      onClick: openCommunityProModal,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 51,
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
            __WEBPACK_IMPORTED_MODULE_8__components_settingsViews_style__[
              'f' /* SectionCard */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 60,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_5__upgradeCommunity__[
                'a' /* UpsellUpgradeCommunity */
              ],
              {
                community: community,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 61,
                },
                __self: _this,
              }
            )
          );
        }
      };

      var map = function map(state) {
        return {
          currentUser: state.users.currentUser,
        };
      };
      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_1_react_redux__['a' /* connect */])(
          map
        )
      )(RecurringPaymentsList);

      /***/
    },

  /***/ './src/views/communitySettings/index.js':
    /*!**********************************************!*\
  !*** ./src/views/communitySettings/index.js ***!
  \**********************************************/
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
        /*! ./queries */ './src/views/communitySettings/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_loading__ = __webpack_require__(
        /*! ../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__ = __webpack_require__(
        /*! ../../components/appViewWrapper */ './src/components/appViewWrapper/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_upsell__ = __webpack_require__(
        /*! ../../components/upsell */ './src/components/upsell/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_viewError__ = __webpack_require__(
        /*! ../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__communityAnalytics__ = __webpack_require__(
        /*! ../communityAnalytics */ './src/views/communityAnalytics/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_overview__ = __webpack_require__(
        /*! ./components/overview */ './src/views/communitySettings/components/overview.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__titlebar__ = __webpack_require__(
        /*! ../titlebar */ './src/views/titlebar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_header__ = __webpack_require__(
        /*! ../../components/settingsViews/header */ './src/components/settingsViews/header.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_settingsViews_subnav__ = __webpack_require__(
        /*! ../../components/settingsViews/subnav */ './src/components/settingsViews/subnav.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__style__ = __webpack_require__(
        /*! ./style */ './src/views/communitySettings/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/communitySettings/index.js';

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

      var CommunitySettings = (function(_React$Component) {
        _inherits(CommunitySettings, _React$Component);

        function CommunitySettings() {
          _classCallCheck(this, CommunitySettings);

          return _possibleConstructorReturn(
            this,
            (
              CommunitySettings.__proto__ ||
              Object.getPrototypeOf(CommunitySettings)
            ).apply(this, arguments)
          );
        }

        _createClass(CommunitySettings, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                community = _props.data.community,
                location = _props.location,
                isLoading = _props.isLoading,
                hasError = _props.hasError;

              // this is hacky, but will tell us if we're viewing analytics or the root settings view

              var pathname = location.pathname;
              var lastIndex = pathname.lastIndexOf('/');
              var activeTab = pathname.substr(lastIndex + 1);
              var communitySlug = community && community.slug;

              if (community) {
                if (!community.communityPermissions.isOwner) {
                  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__[
                      'a' /* default */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 49,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_11__titlebar__[
                        'a' /* default */
                      ],
                      {
                        title: 'No Permission',
                        provideBack: true,
                        backRoute: '/' + communitySlug,
                        noComposer: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 50,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_8__components_viewError__[
                        'a' /* default */
                      ],
                      {
                        heading:
                          'You don\u2019t have permission to manage this community.',
                        subheading:
                          'If you want to create your own community, you can get started below.',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 57,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_6__components_upsell__[
                          'd' /* Upsell404Community */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 61,
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
                      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_10__components_overview__[
                          'a' /* default */
                        ],
                        {
                          community: community,
                          communitySlug: communitySlug,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 71,
                          },
                          __self: _this2,
                        }
                      );
                    case 'analytics':
                      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_9__communityAnalytics__[
                          'a' /* default */
                        ],
                        {
                          community: community,
                          communitySlug: communitySlug,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 75,
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
                    to: '/' + community.slug + '/settings',
                    label: 'Overview',
                    activeLabel: 'settings',
                  },
                  {
                    to: '/' + community.slug + '/settings/analytics',
                    label: 'Analytics',
                    activeLabel: 'analytics',
                  },
                ];

                var subheading = {
                  to: '/' + community.slug,
                  label: 'Return to ' + community.name,
                };

                var avatar = {
                  profilePhoto: community.profilePhoto,
                  community: community,
                };

                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 106,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__titlebar__['a' /* default */],
                    {
                      title: community.name,
                      subtitle: 'Settings',
                      provideBack: true,
                      backRoute: '/' + communitySlug,
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 107,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_14__style__['i' /* View */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 115,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_12__components_settingsViews_header__[
                        'a' /* default */
                      ],
                      {
                        avatar: avatar,
                        subheading: subheading,
                        heading: 'Settings',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 116,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__components_settingsViews_subnav__[
                        'a' /* default */
                      ],
                      {
                        items: subnavItems,
                        activeTab: activeTab,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 121,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      ActiveView,
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 123,
                        },
                        __self: this,
                      }
                    )
                  )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_4__components_loading__[
                    'a' /* Loading */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 130,
                    },
                    __self: this,
                  }
                );
              }

              if (hasError) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 135,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__titlebar__['a' /* default */],
                    {
                      title: 'Error fetching community',
                      provideBack: true,
                      backRoute: '/' + communitySlug,
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 136,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_8__components_viewError__[
                      'a' /* default */
                    ],
                    {
                      refresh: true,
                      error: hasError,
                      heading:
                        'There was an error fetching this community’s settings.',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 142,
                      },
                      __self: this,
                    }
                  )
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__[
                  'a' /* default */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 152,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_11__titlebar__['a' /* default */],
                  {
                    title: 'No Community Found',
                    provideBack: true,
                    backRoute: '/' + communitySlug,
                    noComposer: true,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 153,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_8__components_viewError__[
                    'a' /* default */
                  ],
                  {
                    heading: 'We weren\u2019t able to find this community.',
                    subheading:
                      'If you want to start the ' +
                      communitySlug +
                      ' community yourself, you can get started below.',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 159,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_6__components_upsell__[
                      'd' /* Upsell404Community */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 163,
                      },
                      __self: this,
                    }
                  )
                )
              );
            },
          },
        ]);

        return CommunitySettings;
      })(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

      /* harmony default export */ __webpack_exports__[
        'default'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_3__queries__['b' /* getThisCommunity */],
        __WEBPACK_IMPORTED_MODULE_7__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(CommunitySettings);

      /***/
    },

  /***/ './src/views/communitySettings/queries.js':
    /*!************************************************!*\
  !*** ./src/views/communitySettings/queries.js ***!
  \************************************************/
    /*! exports provided: getThisCommunity, GET_COMMUNITY_CHANNELS_QUERY, GET_COMMUNITY_CHANNELS_OPTIONS, getCommunityChannels */
    /*! exports used: getCommunityChannels, getThisCommunity */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return getThisCommunity;
        }
      );
      /* unused harmony export GET_COMMUNITY_CHANNELS_QUERY */
      /* unused harmony export GET_COMMUNITY_CHANNELS_OPTIONS */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return getCommunityChannels;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo__ = __webpack_require__(
        /*! react-apollo */ './node_modules/react-apollo/react-apollo.browser.umd.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_fragments_community_communityInfo__ = __webpack_require__(
        /*! ../../api/fragments/community/communityInfo */ './src/api/fragments/community/communityInfo.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_fragments_community_communityMetaData__ = __webpack_require__(
        /*! ../../api/fragments/community/communityMetaData */ './src/api/fragments/community/communityMetaData.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_fragments_channel_channelInfo__ = __webpack_require__(
        /*! ../../api/fragments/channel/channelInfo */ './src/api/fragments/channel/channelInfo.js'
      );
      var _templateObject = _taggedTemplateLiteral(
          [
            '\n    query thisCommunity($slug: String) {\n\t\t\tcommunity(slug: $slug) {\n        ...communityInfo\n        ...communityMetaData\n        recurringPayments {\n          plan\n          amount\n          createdAt\n          status\n        }\n      }\n\t\t}\n    ',
            '\n    ',
            '\n\t',
          ],
          [
            '\n    query thisCommunity($slug: String) {\n\t\t\tcommunity(slug: $slug) {\n        ...communityInfo\n        ...communityMetaData\n        recurringPayments {\n          plan\n          amount\n          createdAt\n          status\n        }\n      }\n\t\t}\n    ',
            '\n    ',
            '\n\t',
          ]
        ),
        _templateObject2 = _taggedTemplateLiteral(
          [
            '\n  query getCommunityChannels($slug: String) {\n    community(slug: $slug) {\n      ...communityInfo\n      channelConnection {\n        edges {\n          node {\n            ...channelInfo\n          }\n        }\n      }\n    }\n  }\n  ',
            '\n  ',
            '\n',
          ],
          [
            '\n  query getCommunityChannels($slug: String) {\n    community(slug: $slug) {\n      ...communityInfo\n      channelConnection {\n        edges {\n          node {\n            ...channelInfo\n          }\n        }\n      }\n    }\n  }\n  ',
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

      var getThisCommunity = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(
        Object(__WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql'])(
          _templateObject,
          __WEBPACK_IMPORTED_MODULE_1__api_fragments_community_communityInfo__[
            'a' /* communityInfoFragment */
          ],
          __WEBPACK_IMPORTED_MODULE_2__api_fragments_community_communityMetaData__[
            'a' /* communityMetaDataFragment */
          ]
        ),
        {
          options: function options(props) {
            return {
              variables: {
                slug: props.match.params.communitySlug.toLowerCase(),
              },
              fetchPolicy: 'network-only',
            };
          },
        }
      );

      var GET_COMMUNITY_CHANNELS_QUERY = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql']
      )(
        _templateObject2,
        __WEBPACK_IMPORTED_MODULE_3__api_fragments_channel_channelInfo__[
          'a' /* channelInfoFragment */
        ],
        __WEBPACK_IMPORTED_MODULE_1__api_fragments_community_communityInfo__[
          'a' /* communityInfoFragment */
        ]
      );

      var GET_COMMUNITY_CHANNELS_OPTIONS = {
        options: function options(_ref) {
          var communitySlug = _ref.communitySlug;
          return {
            variables: {
              slug: communitySlug.toLowerCase(),
            },
            fetchPolicy: 'cache-and-network',
          };
        },
      };

      var getCommunityChannels = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(GET_COMMUNITY_CHANNELS_QUERY, GET_COMMUNITY_CHANNELS_OPTIONS);

      /***/
    },
});
//# sourceMappingURL=communitySettings.chunk.js.map
