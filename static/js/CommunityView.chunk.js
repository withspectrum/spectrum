webpackJsonp([2], {
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

  /***/ './src/components/threadComposer/components/placeholder.js':
    /*!*****************************************************************!*\
  !*** ./src/components/threadComposer/components/placeholder.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_composer__ = __webpack_require__(
        /*! ../../../actions/composer */ './src/actions/composer.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__icons__ = __webpack_require__(
        /*! ../../icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__style__ = __webpack_require__(
        /*! ../style */ './src/components/threadComposer/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__upsell__ = __webpack_require__(
        /*! ./upsell */ './src/components/threadComposer/components/upsell.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/components/threadComposer/components/placeholder.js';

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

      var ComposerPlaceholder = (function(_React$Component) {
        _inherits(ComposerPlaceholder, _React$Component);

        function ComposerPlaceholder() {
          _classCallCheck(this, ComposerPlaceholder);

          return _possibleConstructorReturn(
            this,
            (
              ComposerPlaceholder.__proto__ ||
              Object.getPrototypeOf(ComposerPlaceholder)
            ).apply(this, arguments)
          );
        }

        _createClass(ComposerPlaceholder, [
          {
            key: 'render',
            value: function render() {
              var _props = this.props,
                isOpen = _props.isOpen,
                showCommunityOwnerUpsell = _props.showCommunityOwnerUpsell,
                isInbox = _props.isInbox,
                dispatch = _props.dispatch;

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_4__style__['d' /* Container */],
                {
                  isOpen: isOpen,
                  isInbox: isInbox,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 20,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_4__style__['b' /* Composer */],
                  {
                    isOpen: isOpen,
                    onClick: function onClick() {
                      return dispatch(
                        Object(
                          __WEBPACK_IMPORTED_MODULE_2__actions_composer__[
                            'd' /* openComposer */
                          ]
                        )()
                      );
                    },
                    isInbox: isInbox,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 21,
                    },
                    __self: this,
                  },
                  !isOpen &&
                    showCommunityOwnerUpsell &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_5__upsell__['a' /* default */],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 26,
                        },
                        __self: this,
                      }
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_4__style__['h' /* Placeholder */],
                    {
                      isOpen: isOpen,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 27,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_3__icons__['a' /* default */],
                      {
                        glyph: 'post',
                        onboarding: 'foo',
                        tipLocation: 'top',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 28,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_4__style__[
                        'i' /* PlaceholderLabel */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 29,
                        },
                        __self: this,
                      },
                      'Start a new conversation...'
                    )
                  )
                )
              );
            },
          },
        ]);

        return ComposerPlaceholder;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__['a'] = Object(
        __WEBPACK_IMPORTED_MODULE_1_react_redux__['a' /* connect */]
      )()(ComposerPlaceholder);

      /***/
    },

  /***/ './src/components/threadComposer/components/upsell.js':
    /*!************************************************************!*\
  !*** ./src/components/threadComposer/components/upsell.js ***!
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
        /*! ../style */ './src/components/threadComposer/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/components/threadComposer/components/upsell.js';

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

      var Upsell = (function(_React$Component) {
        _inherits(Upsell, _React$Component);

        function Upsell() {
          _classCallCheck(this, Upsell);

          return _possibleConstructorReturn(
            this,
            (Upsell.__proto__ || Object.getPrototypeOf(Upsell)).apply(
              this,
              arguments
            )
          );
        }

        _createClass(Upsell, [
          {
            key: 'render',
            value: function render() {
              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_1__style__['c' /* ComposerUpsell */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 8,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_1__style__['l' /* UpsellDot */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 9,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_1__style__['m' /* UpsellPulse */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 10,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  'p',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 11,
                    },
                    __self: this,
                  },
                  'Create a thread to get a conversation started in your community.'
                )
              );
            },
          },
        ]);

        return Upsell;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__['a'] = Upsell;

      /***/
    },

  /***/ './src/components/threadComposer/index.js':
    /*!************************************************!*\
  !*** ./src/components/threadComposer/index.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_placeholder__ = __webpack_require__(
        /*! ./components/placeholder */ './src/components/threadComposer/components/placeholder.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_composer__ = __webpack_require__(
        /*! ./components/composer */ './src/components/threadComposer/components/composer.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/components/threadComposer/index.js';

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

      var ThreadComposerWithData = (function(_Component) {
        _inherits(ThreadComposerWithData, _Component);

        function ThreadComposerWithData() {
          _classCallCheck(this, ThreadComposerWithData);

          return _possibleConstructorReturn(
            this,
            (
              ThreadComposerWithData.__proto__ ||
              Object.getPrototypeOf(ThreadComposerWithData)
            ).apply(this, arguments)
          );
        }

        _createClass(ThreadComposerWithData, [
          {
            key: 'render',
            value: function render() {
              var _props = this.props,
                isOpen = _props.isOpen,
                isInbox = _props.isInbox,
                showComposerUpsell = _props.showComposerUpsell,
                activeCommunity = _props.activeCommunity,
                activeChannel = _props.activeChannel;

              var showCommunityOwnerUpsell = showComposerUpsell || false;

              return isOpen
                ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3__components_composer__[
                      'a' /* default */
                    ],
                    {
                      activeCommunity: activeCommunity,
                      activeChannel: activeChannel,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 18,
                      },
                      __self: this,
                    }
                  )
                : __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_2__components_placeholder__[
                      'a' /* default */
                    ],
                    {
                      isInbox: isInbox,
                      isOpen: isOpen,
                      showCommunityOwnerUpsell: showCommunityOwnerUpsell,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 23,
                      },
                      __self: this,
                    }
                  );
            },
          },
        ]);

        return ThreadComposerWithData;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var map = function map(state) {
        return { isOpen: state.composer.isOpen };
      };
      /* harmony default export */ __webpack_exports__['a'] = Object(
        __WEBPACK_IMPORTED_MODULE_1_react_redux__['a' /* connect */]
      )(map)(ThreadComposerWithData);

      /***/
    },

  /***/ './src/components/threadComposer/mutations.js':
    /*!****************************************************!*\
  !*** ./src/components/threadComposer/mutations.js ***!
  \****************************************************/
    /*! exports provided: publishThread */
    /*! exports used: publishThread */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return publishThread;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo__ = __webpack_require__(
        /*! react-apollo */ './node_modules/react-apollo/react-apollo.browser.umd.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_fragments_thread_threadInfo__ = __webpack_require__(
        /*! ../../api/fragments/thread/threadInfo */ './src/api/fragments/thread/threadInfo.js'
      );
      var _templateObject = _taggedTemplateLiteral(
        [
          "\n    mutation publishThread($thread: ThreadInput!) {\n      publishThread(thread: $thread) {\n        # When a thread is published, we want to return extra metadata about\n        # the new thread to handle a few downstream operations:\n        #\n        # First, when a thread is published, we notify the dashboard 'everything'\n        # query and insert the new thread into the threads list. That way if a\n        # user publishes a thread and navigates to the homepage, their thread will\n        # appear without needing to refetch\n        #\n        # Additionally, we want to get back the channelId and communityId\n        # so that the community and channel the thread is posted under can\n        # trigger their reducers and automatically add the new thread to the\n        # store. See 'views/community/queries.js' for an example of this\n        # reducer operation in use.\n        #\n        # The underlying goal here is to ensure that when a thread is published,\n        # it will appear in all the feeds a user would expect it to appear\n        # and play nicely with Apollo in th event that a feed was previously\n        # fetched and cached\n        ...threadInfo\n        channel {\n          id\n          slug\n          community {\n            id\n            slug\n          }\n        }\n      }\n    }\n    ",
          '\n  ',
        ],
        [
          "\n    mutation publishThread($thread: ThreadInput!) {\n      publishThread(thread: $thread) {\n        # When a thread is published, we want to return extra metadata about\n        # the new thread to handle a few downstream operations:\n        #\n        # First, when a thread is published, we notify the dashboard 'everything'\n        # query and insert the new thread into the threads list. That way if a\n        # user publishes a thread and navigates to the homepage, their thread will\n        # appear without needing to refetch\n        #\n        # Additionally, we want to get back the channelId and communityId\n        # so that the community and channel the thread is posted under can\n        # trigger their reducers and automatically add the new thread to the\n        # store. See 'views/community/queries.js' for an example of this\n        # reducer operation in use.\n        #\n        # The underlying goal here is to ensure that when a thread is published,\n        # it will appear in all the feeds a user would expect it to appear\n        # and play nicely with Apollo in th event that a feed was previously\n        # fetched and cached\n        ...threadInfo\n        channel {\n          id\n          slug\n          community {\n            id\n            slug\n          }\n        }\n      }\n    }\n    ",
          '\n  ',
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

      var publishThread = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(
        Object(__WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql'])(
          _templateObject,
          __WEBPACK_IMPORTED_MODULE_1__api_fragments_thread_threadInfo__[
            'a' /* threadInfoFragment */
          ]
        )
      );

      /***/
    },

  /***/ './src/components/threadComposer/queries.js':
    /*!**************************************************!*\
  !*** ./src/components/threadComposer/queries.js ***!
  \**************************************************/
    /*! exports provided: GET_COMPOSER_COMMUNITIES_AND_CHANNELS_QUERY, getComposerCommunitiesAndChannels */
    /*! exports used: getComposerCommunitiesAndChannels */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* unused harmony export GET_COMPOSER_COMMUNITIES_AND_CHANNELS_QUERY */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return getComposerCommunitiesAndChannels;
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
      var _templateObject = _taggedTemplateLiteral(
        [
          "\nquery getComposerCommunitiesAndChannels {\n  # Not using the communityConnection or channelConnection fragments here\n  # because for this particular scenario I'm only trying to return much\n  # deeper nested data in order to handle channel + community selection in\n  # the composer\n  #\n  # TODO: Eventually we should run one query at app initialization for all of\n  # a user's communities + channels, save that in the thread somewhere, and\n  # use it to hydrate the composer here, as well as use the data to handle\n  # join/leave, follow/unfollow buttons, etc. as the user browsers around\n  # to different threads, channels, and users.\n  user: currentUser {\n    ...userInfo\n    communityConnection {\n      edges {\n        node {\n          id\n          name\n          slug\n          communityPermissions {\n            isMember\n            isBlocked\n            isOwner\n            isModerator\n          }\n        }\n      }\n    }\n    channelConnection {\n      edges {\n        node {\n          id\n          name\n          slug\n          isDefault\n          isPrivate\n          community {\n            id\n            isPro\n          }\n          channelPermissions {\n            isMember\n            isPending\n            isBlocked\n            isOwner\n            isModerator\n          }\n        }\n      }\n    }\n  }\n}\n",
          '\n',
        ],
        [
          "\nquery getComposerCommunitiesAndChannels {\n  # Not using the communityConnection or channelConnection fragments here\n  # because for this particular scenario I'm only trying to return much\n  # deeper nested data in order to handle channel + community selection in\n  # the composer\n  #\n  # TODO: Eventually we should run one query at app initialization for all of\n  # a user's communities + channels, save that in the thread somewhere, and\n  # use it to hydrate the composer here, as well as use the data to handle\n  # join/leave, follow/unfollow buttons, etc. as the user browsers around\n  # to different threads, channels, and users.\n  user: currentUser {\n    ...userInfo\n    communityConnection {\n      edges {\n        node {\n          id\n          name\n          slug\n          communityPermissions {\n            isMember\n            isBlocked\n            isOwner\n            isModerator\n          }\n        }\n      }\n    }\n    channelConnection {\n      edges {\n        node {\n          id\n          name\n          slug\n          isDefault\n          isPrivate\n          community {\n            id\n            isPro\n          }\n          channelPermissions {\n            isMember\n            isPending\n            isBlocked\n            isOwner\n            isModerator\n          }\n        }\n      }\n    }\n  }\n}\n",
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

      var GET_COMPOSER_COMMUNITIES_AND_CHANNELS_QUERY = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql']
      )(
        _templateObject,
        __WEBPACK_IMPORTED_MODULE_1__api_fragments_user_userInfo__[
          'a' /* userInfoFragment */
        ]
      );

      var getComposerCommunitiesAndChannels = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(GET_COMPOSER_COMMUNITIES_AND_CHANNELS_QUERY, {
        options: { fetchPolicy: 'cache-first' },
      });

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

  /***/ './src/components/threadFeed/index.js':
    /*!********************************************!*\
  !*** ./src/components/threadFeed/index.js ***!
  \********************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_2_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_infinite_scroller_with_scroll_element__ = __webpack_require__(
        /*! react-infinite-scroller-with-scroll-element */ './node_modules/react-infinite-scroller-with-scroll-element/dist/InfiniteScroll.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_infinite_scroller_with_scroll_element___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_3_react_infinite_scroller_with_scroll_element__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__views_communitySettings_components_importSlack__ = __webpack_require__(
        /*! ../../views/communitySettings/components/importSlack */ './src/views/communitySettings/components/importSlack.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__emailInvitationForm__ = __webpack_require__(
        /*! ../emailInvitationForm */ './src/components/emailInvitationForm/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__views_newCommunity_components_share__ = __webpack_require__(
        /*! ../../views/newCommunity/components/share */ './src/views/newCommunity/components/share/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__threadFeedCard__ = __webpack_require__(
        /*! ../threadFeedCard */ './src/components/threadFeedCard/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__card__ = __webpack_require__(
        /*! ../card */ './src/components/card/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__upsell__ = __webpack_require__(
        /*! ../upsell */ './src/components/upsell/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__loading__ = __webpack_require__(
        /*! ../loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__style__ = __webpack_require__(
        /*! ./style */ './src/components/threadFeed/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_newActivityIndicator__ = __webpack_require__(
        /*! ../../components/newActivityIndicator */ './src/components/newActivityIndicator/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__viewError__ = __webpack_require__(
        /*! ../viewError */ './src/components/viewError/index.js'
      );
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

      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/components/threadFeed/index.js',
        _this = this;

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

      // NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
      // I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside

      var NullState = function NullState() {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_10__upsell__['a' /* NullCard */],
          {
            bg: 'post',
            heading: 'Sorry, no threads here yet...',
            copy: 'But you could start one!',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 22,
            },
            __self: _this,
          }
        );
      };

      var UpsellState = function UpsellState(_ref) {
        var community = _ref.community;

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_10__upsell__['a' /* NullCard */],
          {
            bg: 'onboarding',
            repeat: true,
            heading: 'Every community has to start somewhere...',
            copy:
              community.name +
              ' just needs more friends - invite people to your community to get a conversation started!',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 31,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_7__views_newCommunity_components_share__[
              'a' /* default */
            ],
            {
              community: community,
              onboarding: false,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 39,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_12__style__['a' /* Divider */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 40,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_6__emailInvitationForm__[
              'a' /* CommunityInvitationForm */
            ],
            {
              id: community.id,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 41,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_12__style__['a' /* Divider */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 42,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_5__views_communitySettings_components_importSlack__[
              'a' /* ImportSlackWithoutCard */
            ],
            {
              community: community,
              id: community.id,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 43,
              },
              __self: _this,
            }
          )
        );
      };

      var Threads = __WEBPACK_IMPORTED_MODULE_1_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'threadFeed__Threads',
        componentId: 's1xk2z0s-0',
      })([
        'min-width:100%;button{align-self:center;margin:auto;}@media (max-width:768px){}',
      ]);

      /*
  The thread feed always expects a prop of 'threads' - this means that in
  the Apollo query contructor, you will need to map a new prop called 'threads'
  to return whatever threads we're fetching (community -> threadsConnection)

  See 'views/community/queries.js' for an example of the prop mapping in action
*/

      var ThreadFeedPure = (function(_Component) {
        _inherits(ThreadFeedPure, _Component);

        function ThreadFeedPure() {
          _classCallCheck(this, ThreadFeedPure);

          var _this2 = _possibleConstructorReturn(
            this,
            (
              ThreadFeedPure.__proto__ || Object.getPrototypeOf(ThreadFeedPure)
            ).call(this)
          );

          _this2.subscribe = function() {
            _this2.setState({
              subscription:
                _this2.props.data.subscribeToUpdatedThreads &&
                _this2.props.data.subscribeToUpdatedThreads(),
            });
          };

          _this2.unsubscribe = function() {
            var subscription = _this2.state.subscription;

            if (subscription) {
              // This unsubscribes the subscription
              subscription();
            }
          };

          _this2.state = {
            scrollElement: null,
            subscription: null,
          };
          return _this2;
        }

        _createClass(ThreadFeedPure, [
          {
            key: 'shouldComponentUpdate',
            value: function shouldComponentUpdate(nextProps) {
              var curr = this.props;
              // fetching more
              if (
                curr.data.networkStatus === 7 &&
                nextProps.data.networkStatus === 3
              )
                return false;
              return true;
            },
          },
          {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
              this.unsubscribe();
            },
          },
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              this.setState({
                // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
                // the AppViewWrapper which is the scrolling part of the site.
                scrollElement: document.getElementById(
                  'scroller-for-thread-feed'
                ),
              });
              this.subscribe();
            },
          },
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
              if (
                !prevProps.data.thread &&
                this.props.data.threads &&
                this.props.data.threads.length === 0
              ) {
                // if there are no threads, tell the parent container so that we can render upsells to community owners in the parent container
                if (this.props.setThreadsStatus) {
                  this.props.setThreadsStatus();
                }

                if (this.props.hasThreads) {
                  this.props.hasThreads();
                }

                if (this.props.hasNoThreads) {
                  this.props.hasNoThreads();
                }
              }
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this3 = this;

              var _props = this.props,
                _props$data = _props.data,
                threads = _props$data.threads,
                networkStatus = _props$data.networkStatus,
                error = _props$data.error,
                viewContext = _props.viewContext,
                newActivityIndicator = _props.newActivityIndicator;
              var scrollElement = this.state.scrollElement;

              var dataExists = threads && threads.length > 0;
              var isCommunityMember =
                this.props.community &&
                (this.props.community.communityPermissions.isMember ||
                  this.props.community.communityPermissions.isOwner ||
                  this.props.community.communityPermissions.isModerator) &&
                !this.props.community.communityPermissions.isBlocked;

              var threadNodes = dataExists
                ? threads.slice().map(function(thread) {
                    return thread.node;
                  })
                : [];

              var filteredThreads = threadNodes;
              if (
                this.props.data.community &&
                this.props.data.community.watercooler &&
                this.props.data.community.watercooler.id
              ) {
                filteredThreads = filteredThreads.filter(function(t) {
                  return t.id !== _this3.props.data.community.watercooler.id;
                });
              }
              if (
                this.props.data.community &&
                this.props.data.community.pinnedThread &&
                this.props.data.community.pinnedThread.id
              ) {
                filteredThreads = filteredThreads.filter(function(t) {
                  return t.id !== _this3.props.data.community.pinnedThread.id;
                });
              }

              if (dataExists) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Threads,
                  {
                    'data-e2e-id': 'thread-feed',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 181,
                    },
                    __self: this,
                  },
                  newActivityIndicator &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_13__components_newActivityIndicator__[
                        'a' /* default */
                      ],
                      {
                        elem: 'scroller-for-thread-feed',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 183,
                        },
                        __self: this,
                      }
                    ),
                  this.props.data.community &&
                    this.props.data.community.pinnedThread &&
                    this.props.data.community.pinnedThread.id &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_8__threadFeedCard__[
                        'a' /* default */
                      ],
                      {
                        data: this.props.data.community.pinnedThread,
                        viewContext: viewContext,
                        isPinned: true,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 189,
                        },
                        __self: this,
                      }
                    ),
                  this.props.data.community &&
                    this.props.data.community.watercooler &&
                    this.props.data.community.watercooler.id &&
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_8__threadFeedCard__[
                        'a' /* default */
                      ],
                      {
                        data: this.props.data.community.watercooler,
                        viewContext: viewContext,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 199,
                        },
                        __self: this,
                      }
                    ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3_react_infinite_scroller_with_scroll_element___default.a,
                    {
                      pageStart: 0,
                      loadMore: this.props.data.fetchMore,
                      hasMore: this.props.data.hasNextPage,
                      loader: __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_11__loading__[
                          'n' /* LoadingThread */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 209,
                          },
                          __self: this,
                        }
                      ),
                      useWindow: false,
                      initialLoad: false,
                      scrollElement: scrollElement,
                      threshold: 750,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 205,
                      },
                      __self: this,
                    },
                    filteredThreads.map(function(thread) {
                      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_8__threadFeedCard__[
                          'a' /* default */
                        ],
                        {
                          key: thread.id,
                          data: thread,
                          viewContext: viewContext,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 217,
                          },
                          __self: _this3,
                        }
                      );
                    })
                  )
                );
              }

              if (networkStatus <= 2) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  Threads,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 231,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__loading__[
                      'n' /* LoadingThread */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 232,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__loading__[
                      'n' /* LoadingThread */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 233,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__loading__[
                      'n' /* LoadingThread */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 234,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__loading__[
                      'n' /* LoadingThread */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 235,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__loading__[
                      'n' /* LoadingThread */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 236,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__loading__[
                      'n' /* LoadingThread */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 237,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__loading__[
                      'n' /* LoadingThread */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 238,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__loading__[
                      'n' /* LoadingThread */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 239,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__loading__[
                      'n' /* LoadingThread */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 240,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_11__loading__[
                      'n' /* LoadingThread */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 241,
                      },
                      __self: this,
                    }
                  )
                );
              }

              if (networkStatus === 8 || error) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__card__['a' /* Card */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 248,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_14__viewError__[
                      'a' /* default */
                    ],
                    {
                      heading: 'We ran into an issue loading the feed',
                      subheading:
                        'Try refreshing the page below. If you’re still seeing this error, you can email us at hi@spectrum.chat.',
                      refresh: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 249,
                      },
                      __self: this,
                    }
                  )
                );
              }

              if (this.props.isNewAndOwned) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  UpsellState,
                  {
                    community: this.props.community,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 261,
                    },
                    __self: this,
                  }
                );
              } else if (
                isCommunityMember ||
                this.props.viewContext === 'channel'
              ) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  NullState,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 263,
                    },
                    __self: this,
                  }
                );
              } else {
                return null;
              }
            },
          },
        ]);

        return ThreadFeedPure;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var map = function map(state) {
        return {
          newActivityIndicator: state.newActivityIndicator.hasNew,
        };
      };
      var ThreadFeed = __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_4_react_redux__['a' /* connect */])(
          map
        )
      )(ThreadFeedPure);

      /* harmony default export */ __webpack_exports__['a'] = ThreadFeed;

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

  /***/ './src/components/threadFeedCard/facePile.js':
    /*!***************************************************!*\
  !*** ./src/components/threadFeedCard/facePile.js ***!
  \***************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_avatar__ = __webpack_require__(
        /*! ../../components/avatar */ './src/components/avatar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style__ = __webpack_require__(
        /*! ./style */ './src/components/threadFeedCard/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/components/threadFeedCard/facePile.js',
        _this = this;

      var messageAvatars = function messageAvatars(list) {
        var avatarList = list.slice(0, 5);

        return avatarList.map(function(participant) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__components_avatar__['a' /* default */],
            {
              size: 32,
              isOnline: participant.isOnline,
              link: participant.username
                ? '/users/' + participant.username
                : null,
              src: participant.profilePhoto,
              role: 'presentation',
              key: participant.id,
              user: participant,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 9,
              },
              __self: _this,
            }
          );
        });
      };

      var FacePile = function FacePile(props) {
        var _props$data = props.data,
          creator = _props$data.creator,
          participants = _props$data.participants;

        var participantList = participants.filter(function(participant) {
          return participant.id !== creator.id;
        });
        var participantCount = participants.length;

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_2__style__['k' /* ParticipantHeads */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 29,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__style__['e' /* Creator */],
            {
              role: 'presentation',
              __source: {
                fileName: _jsxFileName,
                lineNumber: 30,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1__components_avatar__[
                'a' /* default */
              ],
              {
                size: 32,
                user: creator,
                isOnline: creator.isOnline,
                link: creator.username ? '/users/' + creator.username : null,
                src: creator.profilePhoto,
                role: 'presentation',
                key: creator.id,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 31,
                },
                __self: _this,
              }
            )
          ),
          messageAvatars(participantList),
          participantCount > 6 &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2__style__['j' /* ParticipantCount */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 43,
                },
                __self: _this,
              },
              '+' + (participantCount - 6)
            )
        );
      };

      /* harmony default export */ __webpack_exports__['a'] = FacePile;

      /***/
    },

  /***/ './src/components/threadFeedCard/formattedThreadLocation.js':
    /*!******************************************************************!*\
  !*** ./src/components/threadFeedCard/formattedThreadLocation.js ***!
  \******************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_icons__ = __webpack_require__(
        /*! ../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_avatar__ = __webpack_require__(
        /*! ../../components/avatar */ './src/components/avatar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__style__ = __webpack_require__(
        /*! ./style */ './src/components/threadFeedCard/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/components/threadFeedCard/formattedThreadLocation.js',
        _this = this;

      // $FlowFixMe

      var FormattedThreadLocation = function FormattedThreadLocation(props) {
        var needsCommunityDetails =
          props.viewContext === 'dashboard' || props.viewContext === 'profile';

        var needsChannelDetails =
          props.viewContext === 'dashboard' ||
          props.viewContext === 'profile' ||
          props.viewContext === 'community';

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_4__style__['p' /* ThreadContext */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 24,
            },
            __self: _this,
          },
          needsCommunityDetails &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_4__style__[
                'q' /* ThreadContextAvatar */
              ],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 26,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_3__components_avatar__[
                  'a' /* default */
                ],
                {
                  community: props.data.community,
                  size: 20,
                  radius: 8,
                  src: props.data.community.profilePhoto,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 27,
                  },
                  __self: _this,
                }
              )
            ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_4__style__['r' /* ThreadContextMeta */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 35,
              },
              __self: _this,
            },
            (needsCommunityDetails || needsChannelDetails) &&
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_4__style__['f' /* Location */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 37,
                  },
                  __self: _this,
                },
                needsCommunityDetails &&
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                      'a' /* default */
                    ],
                    {
                      to: '/' + props.data.community.slug,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 39,
                      },
                      __self: _this,
                    },
                    props.data.community.name
                  ),
                needsCommunityDetails &&
                  needsChannelDetails &&
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'span',
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 44,
                      },
                      __self: _this,
                    },
                    ' / '
                  ),
                needsChannelDetails &&
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                      'a' /* default */
                    ],
                    {
                      to:
                        '/' +
                        props.data.community.slug +
                        '/' +
                        props.data.channel.slug,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 46,
                      },
                      __self: _this,
                    },
                    props.data.channel.isPrivate &&
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_4__style__['g' /* Lock */],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 51,
                          },
                          __self: _this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_2__components_icons__[
                            'a' /* default */
                          ],
                          {
                            glyph: 'private',
                            tipText: 'Private channel',
                            tipLocation: 'top-right',
                            size: 12,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 52,
                            },
                            __self: _this,
                          }
                        )
                      ),
                    props.data.channel.name
                  )
              )
          )
        );
      };

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = FormattedThreadLocation;

      /***/
    },

  /***/ './src/components/threadFeedCard/index.js':
    /*!************************************************!*\
  !*** ./src/components/threadFeedCard/index.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_shared_truncate__ = __webpack_require__(
        /*! shared/truncate */ './shared/truncate.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_shared_truncate___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_1_shared_truncate__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_2_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_router_dom__ = __webpack_require__(
        /*! react-router-dom */ './node_modules/react-router-dom/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_linkPreview__ = __webpack_require__(
        /*! ../../components/linkPreview */ './src/components/linkPreview/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_icons__ = __webpack_require__(
        /*! ../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__facePile__ = __webpack_require__(
        /*! ./facePile */ './src/components/threadFeedCard/facePile.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__formattedThreadLocation__ = __webpack_require__(
        /*! ./formattedThreadLocation */ './src/components/threadFeedCard/formattedThreadLocation.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__style__ = __webpack_require__(
        /*! ./style */ './src/components/threadFeedCard/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/components/threadFeedCard/index.js',
        _this = this;

      var ThreadFeedCardPure = function ThreadFeedCardPure(props) {
        var pathname = props.location.pathname,
          _props$data = props.data,
          attachments = _props$data.attachments,
          participants = _props$data.participants;

        var attachmentsExist = attachments && attachments.length > 0;
        var participantsExist = participants && participants.length > 0;

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_10__style__['o' /* StyledThreadFeedCard */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 32,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_10__style__['c' /* CardLink */],
            {
              to: {
                pathname: pathname,
                search: '?thread=' + props.data.id,
              },
              __source: {
                fileName: _jsxFileName,
                lineNumber: 33,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_10__style__['b' /* CardContent */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 39,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_9__formattedThreadLocation__[
                'a' /* default */
              ],
              Object.assign({}, props, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 40,
                },
                __self: _this,
              })
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_5_src_components_link__[
                'a' /* default */
              ],
              {
                to: {
                  pathname: pathname,
                  search: '?thread=' + props.data.id,
                },
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 41,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_10__style__['s' /* Title */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 47,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_1_shared_truncate___default()(
                  props.data.content.title,
                  80
                )
              ),
              props.isPinned &&
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_10__style__['l' /* Pinned */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 49,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__style__[
                      'm' /* PinnedBanner */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 50,
                      },
                      __self: _this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__style__[
                      'n' /* PinnedIconWrapper */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 51,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_7__components_icons__[
                        'a' /* default */
                      ],
                      {
                        glyph: 'pin-fill',
                        size: 24,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 52,
                        },
                        __self: _this,
                      }
                    )
                  )
                )
            ),
            attachmentsExist &&
              attachments.map(function(attachment, i) {
                if (attachment.attachmentType === 'linkPreview') {
                  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__style__[
                      'a' /* Attachments */
                    ],
                    {
                      key: i,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 61,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_6__components_linkPreview__[
                        'a' /* LinkPreview */
                      ],
                      {
                        trueUrl: attachment.data.trueUrl,
                        data: JSON.parse(attachment.data),
                        size: 'small',
                        editable: false,
                        margin: '8px 0 12px',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 62,
                        },
                        __self: _this,
                      }
                    )
                  );
                } else {
                  return null;
                }
              }),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_10__style__['d' /* ContentInfo */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 75,
                },
                __self: _this,
              },
              participantsExist &&
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_8__facePile__['a' /* default */],
                  Object.assign({}, props, {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 76,
                    },
                    __self: _this,
                  })
                ),
              props.data.messageCount > 0
                ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__style__[
                      'h' /* MessageCount */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 78,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_7__components_icons__[
                        'a' /* default */
                      ],
                      {
                        size: 20,
                        glyph: 'message-fill',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 79,
                        },
                        __self: _this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'span',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 80,
                        },
                        __self: _this,
                      },
                      props.data.messageCount
                    )
                  )
                : __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_10__style__['i' /* MetaNew */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 83,
                      },
                      __self: _this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_7__components_icons__[
                        'a' /* default */
                      ],
                      {
                        size: 20,
                        glyph: 'notification-fill',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 84,
                        },
                        __self: _this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'span',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 85,
                        },
                        __self: _this,
                      },
                      'Fresh thread!'
                    )
                  )
            )
          )
        );
      };

      var ThreadFeedCard = __WEBPACK_IMPORTED_MODULE_2_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_3_react_router_dom__['b' /* withRouter */]
      )(ThreadFeedCardPure);
      /* harmony default export */ __webpack_exports__['a'] = Object(
        __WEBPACK_IMPORTED_MODULE_4_react_redux__['a' /* connect */]
      )()(ThreadFeedCard);

      /***/
    },

  /***/ './src/views/community/components/channelList.js':
    /*!*******************************************************!*\
  !*** ./src/views/community/components/channelList.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_listItems__ = __webpack_require__(
        /*! ../../../components/listItems */ './src/components/listItems/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_profile__ = __webpack_require__(
        /*! ../../../components/profile */ './src/components/profile/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_icons__ = __webpack_require__(
        /*! ../../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__actions_modals__ = __webpack_require__(
        /*! ../../../actions/modals */ './src/actions/modals.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__queries__ = __webpack_require__(
        /*! ../queries */ './src/views/community/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/community/components/channelList.js';

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
                isLoading = _props.isLoading,
                dispatch = _props.dispatch,
                currentUser = _props.currentUser,
                communitySlug = _props.communitySlug,
                community = _props.data.community;

              if (community) {
                var _community$communityP = community.communityPermissions,
                  isMember = _community$communityP.isMember,
                  isOwner = _community$communityP.isOwner;

                var channels = community.channelConnection.edges
                  .map(function(channel) {
                    return channel.node;
                  })
                  .filter(function(channel) {
                    if (
                      channel.isPrivate &&
                      !channel.channelPermissions.isMember
                    )
                      return null;

                    return channel;
                  })
                  .filter(function(channel) {
                    return !channel.channelPermissions.isBlocked;
                  });

                var joinedChannels = channels.slice().filter(function(channel) {
                  return channel.channelPermissions.isMember;
                });
                var nonJoinedChannels = channels
                  .slice()
                  .filter(function(channel) {
                    return !channel.channelPermissions.isMember;
                  });

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                    'p' /* StyledCard */
                  ],
                  {
                    largeOnly: true,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 63,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                      'j' /* ListHeader */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 64,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                        'k' /* ListHeading */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 65,
                        },
                        __self: this,
                      },
                      'Channels'
                    ),
                    isOwner &&
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_6__components_buttons__[
                          'd' /* IconButton */
                        ],
                        {
                          glyph: 'plus',
                          color: 'text.placeholder',
                          onClick: function onClick() {
                            return dispatch(
                              Object(
                                __WEBPACK_IMPORTED_MODULE_8__actions_modals__[
                                  'b' /* openModal */
                                ]
                              )('CREATE_CHANNEL_MODAL', community)
                            );
                          },
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 67,
                          },
                          __self: this,
                        }
                      )
                  ),
                  (!currentUser || (currentUser && !isMember)) &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                        'h' /* ListContainer */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 82,
                        },
                        __self: this,
                      },
                      channels.map(function(channel) {
                        return __WEBPACK_IMPORTED_MODULE_0_react__[
                          'createElement'
                        ](
                          __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                            'a' /* default */
                          ],
                          {
                            key: channel.id,
                            to: '/' + communitySlug + '/' + channel.slug,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 85,
                            },
                            __self: _this2,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_4__components_listItems__[
                              'b' /* ChannelListItem */
                            ],
                            {
                              clickable: true,
                              contents: channel,
                              withDescription: false,
                              channelIcon: true,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 89,
                              },
                              __self: _this2,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_7__components_icons__[
                                'a' /* default */
                              ],
                              {
                                glyph: 'view-forward',
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 95,
                                },
                                __self: _this2,
                              }
                            )
                          )
                        );
                      })
                    ),
                  joinedChannels &&
                    isMember &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                        'h' /* ListContainer */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 106,
                        },
                        __self: this,
                      },
                      joinedChannels.map(function(channel) {
                        return __WEBPACK_IMPORTED_MODULE_0_react__[
                          'createElement'
                        ](
                          __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                            'a' /* default */
                          ],
                          {
                            key: channel.id,
                            to: '/' + communitySlug + '/' + channel.slug,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 109,
                            },
                            __self: _this2,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_4__components_listItems__[
                              'b' /* ChannelListItem */
                            ],
                            {
                              clickable: true,
                              contents: channel,
                              withDescription: false,
                              channelIcon: true,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 113,
                              },
                              __self: _this2,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_7__components_icons__[
                                'a' /* default */
                              ],
                              {
                                glyph: 'view-forward',
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 119,
                                },
                                __self: _this2,
                              }
                            )
                          )
                        );
                      })
                    ),
                  nonJoinedChannels.length > 0 &&
                    isMember &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      'span',
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 129,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                          'j' /* ListHeader */
                        ],
                        {
                          secondary: true,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 130,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                            'k' /* ListHeading */
                          ],
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 131,
                            },
                            __self: this,
                          },
                          'Additional Channels'
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_12__components_listItems_style__[
                          'h' /* ListContainer */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 134,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          'ul',
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 135,
                            },
                            __self: this,
                          },
                          nonJoinedChannels.map(function(channel) {
                            return __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_5__components_profile__[
                                'a' /* ChannelProfile */
                              ],
                              {
                                key: channel.id,
                                profileSize: 'listItemWithAction',
                                data: { channel: channel },
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 138,
                                },
                                __self: _this2,
                              }
                            );
                          })
                        )
                      )
                    )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_10__components_loading__[
                    'b' /* LoadingCard */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 154,
                    },
                    __self: this,
                  }
                );
              }

              return null;
            },
          },
        ]);

        return ChannelList;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var map = function map(state) {
        return { currentUser: state.users.currentUser };
      };
      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_3_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(
          map
        ),
        __WEBPACK_IMPORTED_MODULE_11__queries__['a' /* getCommunityChannels */],
        __WEBPACK_IMPORTED_MODULE_9__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(ChannelList);

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

  /***/ './src/views/community/components/search.js':
    /*!**************************************************!*\
  !*** ./src/views/community/components/search.js ***!
  \**************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_utils__ = __webpack_require__(
        /*! ../../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_community__ = __webpack_require__(
        /*! ../../../api/community */ './src/api/community.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_threadFeed__ = __webpack_require__(
        /*! ../../../components/threadFeed */ './src/components/threadFeed/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__style__ = __webpack_require__(
        /*! ../style */ './src/views/community/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/community/components/search.js';

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

      var SearchThreadFeed = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_3__api_community__[
          'n' /* searchCommunityThreadsQuery */
        ]
      )(
        __WEBPACK_IMPORTED_MODULE_4__components_threadFeed__['a' /* default */]
      );

      var Search = (function(_React$Component) {
        _inherits(Search, _React$Component);

        function Search() {
          _classCallCheck(this, Search);

          var _this = _possibleConstructorReturn(
            this,
            (Search.__proto__ || Object.getPrototypeOf(Search)).call(this)
          );

          _this.search = function(searchString) {
            // don't start searching until at least 3 characters are typed
            if (searchString.length < 3) return;

            // start the input loading spinner
            _this.setState({
              sendStringToServer: searchString,
            });
          };

          _this.handleChange = function(e) {
            var searchString = e.target.value.toLowerCase().trim();

            // set the searchstring to state
            _this.setState({
              searchString: searchString,
            });

            // trigger a new search based on the search input
            _this.search(searchString);
          };

          _this.state = {
            searchString: '',
            sendStringToServer: '',
          };

          _this.search = Object(
            __WEBPACK_IMPORTED_MODULE_2__helpers_utils__['h' /* throttle */]
          )(_this.search, 500);
          return _this;
        }

        _createClass(Search, [
          {
            key: 'render',
            value: function render() {
              var community = this.props.community;
              var _state = this.state,
                searchString = _state.searchString,
                sendStringToServer = _state.sendStringToServer;

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 59,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_5__style__[
                    'd' /* SearchContainer */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 60,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_5__style__['e' /* SearchInput */],
                    {
                      defaultValue: searchString,
                      autoFocus: true,
                      type: 'text',
                      placeholder: 'Search in ' + community.name + '...',
                      onChange: this.handleChange,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 61,
                      },
                      __self: this,
                    }
                  )
                ),
                searchString &&
                  sendStringToServer &&
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    SearchThreadFeed,
                    {
                      viewContext: 'community',
                      communityId: community.id,
                      searchString: sendStringToServer,
                      community: community,
                      pinnedThreadId: community.pinnedThreadId,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 71,
                      },
                      __self: this,
                    }
                  )
              );
            },
          },
        ]);

        return Search;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()()(Search);

      /***/
    },

  /***/ './src/views/community/index.js':
    /*!**************************************!*\
  !*** ./src/views/community/index.js ***!
  \**************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_shared_generate_meta_info__ = __webpack_require__(
        /*! shared/generate-meta-info */ './shared/generate-meta-info.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_shared_generate_meta_info___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_3_shared_generate_meta_info__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_events__ = __webpack_require__(
        /*! ../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_threadComposer__ = __webpack_require__(
        /*! ../../components/threadComposer */ './src/components/threadComposer/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_head__ = __webpack_require__(
        /*! ../../components/head */ './src/components/head/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_icons__ = __webpack_require__(
        /*! ../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_appViewWrapper__ = __webpack_require__(
        /*! ../../components/appViewWrapper */ './src/components/appViewWrapper/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_column__ = __webpack_require__(
        /*! ../../components/column */ './src/components/column/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_threadFeed__ = __webpack_require__(
        /*! ../../components/threadFeed */ './src/components/threadFeed/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_search__ = __webpack_require__(
        /*! ./components/search */ './src/views/community/components/search.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_memberGrid__ = __webpack_require__(
        /*! ./components/memberGrid */ './src/views/community/components/memberGrid.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__api_community__ = __webpack_require__(
        /*! ../../api/community */ './src/api/community.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__actions_toasts__ = __webpack_require__(
        /*! ../../actions/toasts */ './src/actions/toasts.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__actions_newUserOnboarding__ = __webpack_require__(
        /*! ../../actions/newUserOnboarding */ './src/actions/newUserOnboarding.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_profile_coverPhoto__ = __webpack_require__(
        /*! ../../components/profile/coverPhoto */ './src/components/profile/coverPhoto.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__titlebar__ = __webpack_require__(
        /*! ../titlebar */ './src/views/titlebar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_profile__ = __webpack_require__(
        /*! ../../components/profile */ './src/components/profile/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_viewError__ = __webpack_require__(
        /*! ../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_loading__ = __webpack_require__(
        /*! ../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components_upsell__ = __webpack_require__(
        /*! ../../components/upsell */ './src/components/upsell/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__components_segmentedControl__ = __webpack_require__(
        /*! ../../components/segmentedControl */ './src/components/segmentedControl/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__style__ = __webpack_require__(
        /*! ./style */ './src/views/community/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__queries__ = __webpack_require__(
        /*! ./queries */ './src/views/community/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__components_channelList__ = __webpack_require__(
        /*! ./components/channelList */ './src/views/community/components/channelList.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/community/index.js';

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

      var CommunityThreadFeed = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_25__queries__['b' /* getCommunityThreads */]
      )(
        __WEBPACK_IMPORTED_MODULE_10__components_threadFeed__['a' /* default */]
      );

      var CommunityView = (function(_React$Component) {
        _inherits(CommunityView, _React$Component);

        function CommunityView() {
          _classCallCheck(this, CommunityView);

          var _this = _possibleConstructorReturn(
            this,
            (
              CommunityView.__proto__ || Object.getPrototypeOf(CommunityView)
            ).call(this)
          );

          _this.toggleMembership = function(communityId) {
            var _this$props = _this.props,
              toggleCommunityMembership = _this$props.toggleCommunityMembership,
              dispatch = _this$props.dispatch;

            _this.setState({
              isLeavingCommunity: true,
            });

            toggleCommunityMembership({ communityId: communityId })
              .then(function(_ref) {
                var toggleCommunityMembership =
                  _ref.data.toggleCommunityMembership;

                var isMember =
                  toggleCommunityMembership.communityPermissions.isMember;

                Object(
                  __WEBPACK_IMPORTED_MODULE_4__helpers_events__['b' /* track */]
                )('community', isMember ? 'joined' : 'unjoined', null);

                var str = isMember
                  ? 'Joined ' + toggleCommunityMembership.name + '!'
                  : 'Left ' + toggleCommunityMembership.name + '.';

                var type = isMember ? 'success' : 'neutral';
                dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_14__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )(type, str)
                );

                _this.setState({
                  isLeavingCommunity: false,
                });
              })
              .catch(function(err) {
                _this.setState({
                  isLeavingCommunity: false,
                });

                dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_14__actions_toasts__[
                      'a' /* addToastWithTimeout */
                    ]
                  )('error', err.message)
                );
              });
          };

          _this.setComposerUpsell = function() {
            var community = _this.props.data.community;

            var communityExists = community && community.communityPermissions;
            if (!communityExists) return;

            var isNewAndOwned =
              community.communityPermissions.isOwner &&
              community.metaData.members < 5;
            return _this.setState({
              showComposerUpsell: isNewAndOwned ? true : false,
            });
          };

          _this.handleSegmentClick = function(label) {
            if (_this.state.selectedView === label) return;

            return _this.setState({
              selectedView: label,
            });
          };

          _this.state = {
            isLeavingCommunity: false,
            showComposerUpsell: false,
            selectedView: 'threads',
          };
          return _this;
        }

        _createClass(CommunityView, [
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
              // if the user is new and signed up through a community page, push
              // the community data into the store to hydrate the new user experience
              // with their first community they should join
              if (this.props.currentUser) return;
              if (
                (!prevProps.data.community && this.props.data.community) ||
                (prevProps.data.community &&
                  prevProps.data.community.id !== this.props.data.community.id)
              ) {
                this.props.dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_15__actions_newUserOnboarding__[
                      'a' /* addCommunityToOnboarding */
                    ]
                  )(this.props.data.community)
                );
              }
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                params = _props.match.params,
                community = _props.data.community,
                currentUser = _props.currentUser,
                isLoading = _props.isLoading,
                hasError = _props.hasError;
              var communitySlug = params.communitySlug;

              if (community) {
                // at this point the community exists and was fetched
                var _generateMetaInfo = __WEBPACK_IMPORTED_MODULE_3_shared_generate_meta_info___default()(
                    {
                      type: 'community',
                      data: {
                        name: community.name,
                        description: community.description,
                      },
                    }
                  ),
                  title = _generateMetaInfo.title,
                  description = _generateMetaInfo.description;

                var _state = this.state,
                  _showComposerUpsell = _state.showComposerUpsell,
                  _selectedView = _state.selectedView,
                  _isLeavingCommunity = _state.isLeavingCommunity;
                var _community$communityP = community.communityPermissions,
                  isMember = _community$communityP.isMember,
                  isOwner = _community$communityP.isOwner,
                  isModerator = _community$communityP.isModerator;

                var userHasPermissions = isMember || isOwner || isModerator;
                var isLoggedIn = currentUser;

                // if the person viewing the community recently created this community,
                // we'll mark it as "new and owned" - this tells the downstream
                // components to show nux upsells to create a thread or invite people
                // to the community
                var isNewAndOwned = isOwner && community.metaData.members < 5;

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    'data-e2e-id': 'community-view',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 177,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_17__titlebar__['a' /* default */],
                    {
                      title: community.name,
                      provideBack: true,
                      backRoute: '/',
                      noComposer: !community.communityPermissions.isMember,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 178,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_6__components_head__[
                      'a' /* default */
                    ],
                    {
                      title: title,
                      description: description,
                      image: community.profilePhoto,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 185,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_24__style__[
                      'a' /* CoverColumn */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 191,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_16__components_profile_coverPhoto__[
                        'a' /* CoverPhoto */
                      ],
                      {
                        src: community.coverPhoto,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 192,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_24__style__['b' /* CoverRow */],
                      {
                        className: 'flexy',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 193,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_9__components_column__[
                          'b' /* default */
                        ],
                        {
                          type: 'secondary',
                          className: 'inset',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 194,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_18__components_profile__[
                            'b' /* CommunityProfile */
                          ],
                          {
                            data: { community: community },
                            profileSize: 'full',
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 195,
                            },
                            __self: this,
                          }
                        ),
                        isLoggedIn &&
                          !community.communityPermissions.isOwner &&
                          community.communityPermissions.isMember &&
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_24__style__[
                              'c' /* LogoutButton */
                            ],
                            {
                              onClick: function onClick() {
                                return _this2.toggleMembership(community.id);
                              },
                              loading: _isLeavingCommunity,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 199,
                              },
                              __self: this,
                            },
                            'Leave ',
                            community.name
                          ),
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_26__components_channelList__[
                            'a' /* default */
                          ],
                          {
                            communitySlug: communitySlug.toLowerCase(),
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 206,
                            },
                            __self: this,
                          }
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_9__components_column__[
                          'b' /* default */
                        ],
                        {
                          type: 'primary',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 209,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_23__components_segmentedControl__[
                            'd' /* SegmentedControl */
                          ],
                          {
                            style: { margin: '-16px 0 16px' },
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 210,
                            },
                            __self: this,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_23__components_segmentedControl__[
                              'a' /* DesktopSegment */
                            ],
                            {
                              segmentLabel: 'search',
                              onClick: function onClick() {
                                return _this2.handleSegmentClick('search');
                              },
                              selected: _selectedView === 'search',
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 211,
                              },
                              __self: this,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_7__components_icons__[
                                'a' /* default */
                              ],
                              {
                                glyph: 'search',
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 216,
                                },
                                __self: this,
                              }
                            ),
                            'Search'
                          ),
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_23__components_segmentedControl__[
                              'c' /* Segment */
                            ],
                            {
                              segmentLabel: 'threads',
                              onClick: function onClick() {
                                return _this2.handleSegmentClick('threads');
                              },
                              selected: _selectedView === 'threads',
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 220,
                              },
                              __self: this,
                            },
                            'Threads'
                          ),
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_23__components_segmentedControl__[
                              'a' /* DesktopSegment */
                            ],
                            {
                              segmentLabel: 'members',
                              onClick: function onClick() {
                                return _this2.handleSegmentClick('members');
                              },
                              selected: _selectedView === 'members',
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 228,
                              },
                              __self: this,
                            },
                            'Members (',
                            community.metaData.members.toLocaleString(),
                            ')'
                          ),
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_23__components_segmentedControl__[
                              'b' /* MobileSegment */
                            ],
                            {
                              segmentLabel: 'members',
                              onClick: function onClick() {
                                return _this2.handleSegmentClick('members');
                              },
                              selected: _selectedView === 'members',
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 235,
                              },
                              __self: this,
                            },
                            'Members'
                          ),
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_23__components_segmentedControl__[
                              'b' /* MobileSegment */
                            ],
                            {
                              segmentLabel: 'search',
                              onClick: function onClick() {
                                return _this2.handleSegmentClick('search');
                              },
                              selected: _selectedView === 'search',
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 242,
                              },
                              __self: this,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react__[
                              'createElement'
                            ](
                              __WEBPACK_IMPORTED_MODULE_7__components_icons__[
                                'a' /* default */
                              ],
                              {
                                glyph: 'search',
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 247,
                                },
                                __self: this,
                              }
                            )
                          )
                        ),
                        // if the user is logged in, is viewing the threads,
                        // and is a member of the community, they should see a
                        // new thread composer
                        isLoggedIn &&
                          _selectedView === 'threads' &&
                          userHasPermissions &&
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_5__components_threadComposer__[
                              'a' /* default */
                            ],
                            {
                              activeCommunity: communitySlug,
                              showComposerUpsell: _showComposerUpsell,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 257,
                              },
                              __self: this,
                            }
                          ),
                        // if the user is logged in but doesn't own the community
                        // or isn't a member yet, prompt them to join the community
                        isLoggedIn &&
                          !userHasPermissions &&
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_22__components_upsell__[
                              'f' /* UpsellJoinCommunity */
                            ],
                            {
                              community: community,
                              loading: isLoading,
                              join: this.toggleMembership,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 267,
                              },
                              __self: this,
                            }
                          ),
                        // if the user hasn't signed up yet, show them a spectrum
                        // upsell signup prompt
                        !isLoggedIn &&
                          _selectedView === 'threads' &&
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_22__components_upsell__[
                              'h' /* UpsellSignIn */
                            ],
                            {
                              title:
                                'Join the ' + community.name + ' community',
                              view: { data: community, type: 'community' },
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 278,
                              },
                              __self: this,
                            }
                          ),
                        // thread list
                        _selectedView === 'threads' &&
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            CommunityThreadFeed,
                            {
                              viewContext: 'community',
                              slug: communitySlug,
                              currentUser: isLoggedIn,
                              setThreadsStatus:
                                !this.showComposerUpsell &&
                                this.setComposerUpsell,
                              isNewAndOwned: isNewAndOwned,
                              community: community,
                              pinnedThreadId: community.pinnedThreadId,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 286,
                              },
                              __self: this,
                            }
                          ),
                        // members grid
                        _selectedView === 'members' &&
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_12__components_memberGrid__[
                              'a' /* default */
                            ],
                            {
                              id: community.id,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 301,
                              },
                              __self: this,
                            }
                          ),
                        //search
                        _selectedView === 'search' &&
                          __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                            __WEBPACK_IMPORTED_MODULE_11__components_search__[
                              'a' /* default */
                            ],
                            {
                              community: community,
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 305,
                              },
                              __self: this,
                            }
                          )
                      )
                    )
                  )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_21__components_loading__[
                    'l' /* LoadingScreen */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 314,
                    },
                    __self: this,
                  }
                );
              }

              if (hasError) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 319,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_17__titlebar__['a' /* default */],
                    {
                      title: 'Community not found',
                      provideBack: true,
                      backRoute: '/',
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 320,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_20__components_viewError__[
                      'a' /* default */
                    ],
                    {
                      heading: 'We weren\u2019t able to load this community.',
                      refresh: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 326,
                      },
                      __self: this,
                    }
                  )
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_8__components_appViewWrapper__[
                  'a' /* default */
                ],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 335,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_17__titlebar__['a' /* default */],
                  {
                    title: 'Community not found',
                    provideBack: true,
                    backRoute: '/',
                    noComposer: true,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 336,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_20__components_viewError__[
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
                      lineNumber: 342,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_22__components_upsell__[
                      'd' /* Upsell404Community */
                    ],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 346,
                      },
                      __self: this,
                    }
                  )
                )
              );
            },
          },
        ]);

        return CommunityView;
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
        __WEBPACK_IMPORTED_MODULE_13__api_community__[
          'p' /* toggleCommunityMembershipMutation */
        ],
        __WEBPACK_IMPORTED_MODULE_13__api_community__['g' /* getCommunity */],
        __WEBPACK_IMPORTED_MODULE_19__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(CommunityView);

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
//# sourceMappingURL=CommunityView.chunk.js.map
