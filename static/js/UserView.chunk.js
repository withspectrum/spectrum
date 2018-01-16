webpackJsonp([4], {
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

  /***/ './src/api/fragments/user/userThreads.js':
    /*!***********************************************!*\
  !*** ./src/api/fragments/user/userThreads.js ***!
  \***********************************************/
    /*! exports provided: userThreadsFragment */
    /*! exports used: userThreadsFragment */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return userThreadsFragment;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo__ = __webpack_require__(
        /*! react-apollo */ './node_modules/react-apollo/react-apollo.browser.umd.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_apollo___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__thread_threadInfo__ = __webpack_require__(
        /*! ../thread/threadInfo */ './src/api/fragments/thread/threadInfo.js'
      );
      var _templateObject = _taggedTemplateLiteral(
        [
          '\n  fragment userThreads on User {\n    threadConnection(first: 10, after: $after, kind: $kind) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        cursor\n        node {\n          ...threadInfo\n        }\n      }\n    }\n  }\n  ',
          '\n',
        ],
        [
          '\n  fragment userThreads on User {\n    threadConnection(first: 10, after: $after, kind: $kind) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        cursor\n        node {\n          ...threadInfo\n        }\n      }\n    }\n  }\n  ',
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

      var userThreadsFragment = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql']
      )(
        _templateObject,
        __WEBPACK_IMPORTED_MODULE_1__thread_threadInfo__[
          'a' /* threadInfoFragment */
        ]
      );

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

  /***/ './src/views/user/components/communityList.js':
    /*!****************************************************!*\
  !*** ./src/views/user/components/communityList.js ***!
  \****************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_router__ = __webpack_require__(
        /*! react-router */ './node_modules/react-router/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_4_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_listItems__ = __webpack_require__(
        /*! ../../../components/listItems */ './src/components/listItems/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_icons__ = __webpack_require__(
        /*! ../../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__ = __webpack_require__(
        /*! ../../../components/listItems/style */ './src/components/listItems/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/user/components/communityList.js';

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

      var CommunityList = (function(_React$Component) {
        _inherits(CommunityList, _React$Component);

        function CommunityList() {
          _classCallCheck(this, CommunityList);

          return _possibleConstructorReturn(
            this,
            (
              CommunityList.__proto__ || Object.getPrototypeOf(CommunityList)
            ).apply(this, arguments)
          );
        }

        _createClass(CommunityList, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                communities = _props.communities,
                user = _props.user,
                currentUser = _props.currentUser;

              if (!communities || communities.length === 0) {
                return null;
              }

              var sortedCommunities = communities;
              if (sortedCommunities[0].contextPermissions) {
                sortedCommunities = communities.slice().sort(function(a, b) {
                  var bc = parseInt(b.contextPermissions.reputation, 10);
                  var ac = parseInt(a.contextPermissions.reputation, 10);
                  return bc <= ac ? -1 : 1;
                });
              }

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__[
                  'p' /* StyledCard */
                ],
                {
                  largeOnly: true,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 41,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__[
                    'j' /* ListHeader */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 42,
                    },
                    __self: this,
                  },
                  user === currentUser
                    ? __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__[
                          'k' /* ListHeading */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 44,
                          },
                          __self: this,
                        },
                        'My Communities'
                      )
                    : __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__[
                          'k' /* ListHeading */
                        ],
                        {
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 46,
                          },
                          __self: this,
                        },
                        'Member of'
                      )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_7__components_listItems_style__[
                    'h' /* ListContainer */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 49,
                    },
                    __self: this,
                  },
                  sortedCommunities.map(function(community) {
                    return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                        'a' /* default */
                      ],
                      {
                        key: community.id,
                        to: '/' + community.slug,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 52,
                        },
                        __self: _this2,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_5__components_listItems__[
                          'd' /* CommunityListItem */
                        ],
                        {
                          community: community,
                          reputation: community.contextPermissions
                            ? community.contextPermissions.reputation
                            : null,
                          showDescription: true,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 53,
                          },
                          __self: _this2,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_6__components_icons__[
                            'a' /* default */
                          ],
                          {
                            glyph: 'view-forward',
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 62,
                            },
                            __self: _this2,
                          }
                        )
                      )
                    );
                  })
                )
              );
            },
          },
        ]);

        return CommunityList;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_4_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_3_react_router__['e' /* withRouter */],
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])()
      )(CommunityList);

      /***/
    },

  /***/ './src/views/user/components/search.js':
    /*!*********************************************!*\
  !*** ./src/views/user/components/search.js ***!
  \*********************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_thread__ = __webpack_require__(
        /*! ../../../api/thread */ './src/api/thread.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_threadFeed__ = __webpack_require__(
        /*! ../../../components/threadFeed */ './src/components/threadFeed/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__style__ = __webpack_require__(
        /*! ../style */ './src/views/user/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/user/components/search.js';

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
        __WEBPACK_IMPORTED_MODULE_3__api_thread__['e' /* searchThreadsQuery */]
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
              var user = this.props.user;
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
                    'a' /* SearchContainer */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 60,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_5__style__['b' /* SearchInput */],
                    {
                      defaultValue: searchString,
                      autoFocus: true,
                      type: 'text',
                      placeholder:
                        'Search ' + user.name + "'s conversations...",
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
                      viewContext: 'profile',
                      userId: user.id,
                      queryString: sendStringToServer,
                      filter: { creatorId: user.id },
                      user: user,
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

  /***/ './src/views/user/index.js':
    /*!*********************************!*\
  !*** ./src/views/user/index.js ***!
  \*********************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_src_components_link__ = __webpack_require__(
        /*! src/components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__ = __webpack_require__(
        /*! ../../components/appViewWrapper */ './src/components/appViewWrapper/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_head__ = __webpack_require__(
        /*! ../../components/head */ './src/components/head/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_column__ = __webpack_require__(
        /*! ../../components/column */ './src/components/column/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_threadFeed__ = __webpack_require__(
        /*! ../../components/threadFeed */ './src/components/threadFeed/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__helpers_events__ = __webpack_require__(
        /*! ../../helpers/events */ './src/helpers/events.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_profile__ = __webpack_require__(
        /*! ../../components/profile */ './src/components/profile/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_loading__ = __webpack_require__(
        /*! ../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_upsell__ = __webpack_require__(
        /*! ../../components/upsell */ './src/components/upsell/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_buttons__ = __webpack_require__(
        /*! ../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_communityList__ = __webpack_require__(
        /*! ./components/communityList */ './src/views/user/components/communityList.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_search__ = __webpack_require__(
        /*! ./components/search */ './src/views/user/components/search.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__queries__ = __webpack_require__(
        /*! ./queries */ './src/views/user/queries.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_viewError__ = __webpack_require__(
        /*! ../../components/viewError */ './src/components/viewError/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__titlebar__ = __webpack_require__(
        /*! ../titlebar */ './src/views/titlebar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_segmentedControl__ = __webpack_require__(
        /*! ../../components/segmentedControl */ './src/components/segmentedControl/index.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/user/index.js';

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

      var ThreadFeedWithData = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_16__queries__['b' /* getUserThreads */]
      )(
        __WEBPACK_IMPORTED_MODULE_8__components_threadFeed__['a' /* default */]
      );
      var ThreadParticipantFeedWithData = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_16__queries__['b' /* getUserThreads */]
      )(
        __WEBPACK_IMPORTED_MODULE_8__components_threadFeed__['a' /* default */]
      );

      var UserView = (function(_React$Component) {
        _inherits(UserView, _React$Component);

        function UserView() {
          _classCallCheck(this, UserView);

          var _this = _possibleConstructorReturn(
            this,
            (UserView.__proto__ || Object.getPrototypeOf(UserView)).call(this)
          );

          _this.hasNoThreads = function() {
            return _this.setState({ hasThreads: false });
          };

          _this.hasThreads = function() {
            return _this.setState({ hasThreads: true });
          };

          _this.handleSegmentClick = function(label) {
            if (_this.state.selectedView === label) return;

            return _this.setState({
              selectedView: label,
              hasThreads: true,
            });
          };

          _this.state = { hasThreads: true, selectedView: 'participant' };
          return _this;
        }

        _createClass(UserView, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              Object(
                __WEBPACK_IMPORTED_MODULE_9__helpers_events__['b' /* track */]
              )('user', 'profile viewed', null);
            },
          },
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
              if (!prevProps.data.user) return;
              // track when a new profile is viewed without the component having been remounted
              if (prevProps.data.user.id !== this.props.data.user.id) {
                Object(
                  __WEBPACK_IMPORTED_MODULE_9__helpers_events__['b' /* track */]
                )('user', 'profile viewed', null);
              }
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                user = _props.data.user,
                isLoading = _props.isLoading,
                hasError = _props.hasError,
                queryVarIsChanging = _props.queryVarIsChanging,
                username = _props.match.params.username,
                currentUser = _props.currentUser;
              var _state = this.state,
                hasThreads = _state.hasThreads,
                selectedView = _state.selectedView;

              if (queryVarIsChanging) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_11__components_loading__[
                    'l' /* LoadingScreen */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 94,
                    },
                    __self: this,
                  }
                );
              }

              if (user) {
                var _generateMetaInfo = __WEBPACK_IMPORTED_MODULE_3_shared_generate_meta_info___default()(
                    {
                      type: 'user',
                      data: {
                        name: user.name,
                        username: user.username,
                        description: user.description,
                      },
                    }
                  ),
                  title = _generateMetaInfo.title,
                  description = _generateMetaInfo.description;

                var communities =
                  user.communityConnection.edges.length > 0
                    ? user.communityConnection.edges.map(function(c) {
                        return c.node;
                      })
                    : [];

                var nullHeading =
                  (user.firstName ? user.firstName : user.name) +
                  ' hasn\u2019t ' +
                  (selectedView === 'creator' ? 'created' : 'joined') +
                  ' any conversations yet.';

                var Feed =
                  selectedView === 'creator'
                    ? ThreadFeedWithData
                    : ThreadParticipantFeedWithData;

                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    'data-e2e-id': 'user-view',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 124,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_6__components_head__[
                      'a' /* default */
                    ],
                    {
                      title: title,
                      description: description,
                      image: user.profilePhoto,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 125,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_19__titlebar__['a' /* default */],
                    {
                      title: user.name,
                      subtitle: 'Posts By',
                      provideBack: true,
                      backRoute: '/',
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 130,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_7__components_column__[
                      'b' /* default */
                    ],
                    {
                      type: 'secondary',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 137,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_10__components_profile__[
                        'd' /* UserProfile */
                      ],
                      {
                        data: { user: user },
                        username: username,
                        profileSize: 'full',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 138,
                        },
                        __self: this,
                      }
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_14__components_communityList__[
                        'a' /* default */
                      ],
                      {
                        currentUser: currentUser,
                        user: user,
                        communities: communities,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 143,
                        },
                        __self: this,
                      }
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_7__components_column__[
                      'b' /* default */
                    ],
                    {
                      type: 'primary',
                      alignItems: 'center',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 150,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_20__components_segmentedControl__[
                        'd' /* SegmentedControl */
                      ],
                      {
                        style: { margin: '-16px 0 16px' },
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 151,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_20__components_segmentedControl__[
                          'a' /* DesktopSegment */
                        ],
                        {
                          segmentLabel: 'search',
                          onClick: function onClick() {
                            return _this2.handleSegmentClick('search');
                          },
                          selected: selectedView === 'search',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 152,
                          },
                          __self: this,
                        },
                        'Search'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_20__components_segmentedControl__[
                          'a' /* DesktopSegment */
                        ],
                        {
                          segmentLabel: 'participant',
                          onClick: function onClick() {
                            return _this2.handleSegmentClick('participant');
                          },
                          selected: selectedView === 'participant',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 160,
                          },
                          __self: this,
                        },
                        'Replies'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_20__components_segmentedControl__[
                          'a' /* DesktopSegment */
                        ],
                        {
                          segmentLabel: 'creator',
                          onClick: function onClick() {
                            return _this2.handleSegmentClick('creator');
                          },
                          selected: selectedView === 'creator',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 168,
                          },
                          __self: this,
                        },
                        'Threads'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_20__components_segmentedControl__[
                          'b' /* MobileSegment */
                        ],
                        {
                          segmentLabel: 'search',
                          onClick: function onClick() {
                            return _this2.handleSegmentClick('search');
                          },
                          selected: selectedView === 'search',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 175,
                          },
                          __self: this,
                        },
                        'Search'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_20__components_segmentedControl__[
                          'b' /* MobileSegment */
                        ],
                        {
                          segmentLabel: 'participant',
                          onClick: function onClick() {
                            return _this2.handleSegmentClick('participant');
                          },
                          selected: selectedView === 'participant',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 182,
                          },
                          __self: this,
                        },
                        'Replies'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_20__components_segmentedControl__[
                          'b' /* MobileSegment */
                        ],
                        {
                          segmentLabel: 'creator',
                          onClick: function onClick() {
                            return _this2.handleSegmentClick('creator');
                          },
                          selected: selectedView === 'creator',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 189,
                          },
                          __self: this,
                        },
                        'Threads'
                      )
                    ),
                    hasThreads &&
                      (selectedView === 'creator' ||
                        selectedView === 'participant') &&
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        Feed,
                        {
                          userId: user.id,
                          username: username,
                          viewContext: 'profile',
                          hasNoThreads: this.hasNoThreads,
                          hasThreads: this.hasThreads,
                          kind: selectedView,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 201,
                          },
                          __self: this,
                        }
                      ),
                    selectedView === 'search' &&
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_15__components_search__[
                          'a' /* default */
                        ],
                        {
                          user: user,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 211,
                          },
                          __self: this,
                        }
                      ),
                    !hasThreads &&
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_12__components_upsell__[
                          'b' /* NullState */
                        ],
                        {
                          bg: 'null',
                          heading: nullHeading,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 213,
                          },
                          __self: this,
                        }
                      )
                  )
                );
              }

              if (isLoading) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_11__components_loading__[
                    'l' /* LoadingScreen */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 220,
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
                      lineNumber: 225,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_19__titlebar__['a' /* default */],
                    {
                      title: 'User not found',
                      provideBack: true,
                      backRoute: '/',
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 226,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_17__components_viewError__[
                      'a' /* default */
                    ],
                    {
                      heading: 'We ran into an error loading this user.',
                      refresh: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 232,
                      },
                      __self: this,
                    }
                  )
                );
              }

              if (!user) {
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_5__components_appViewWrapper__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 242,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_19__titlebar__['a' /* default */],
                    {
                      title: 'User not found',
                      provideBack: true,
                      backRoute: '/',
                      noComposer: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 243,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_17__components_viewError__[
                      'a' /* default */
                    ],
                    {
                      heading:
                        'We couldn\u2019t find anyone with this username.',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 249,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      __WEBPACK_IMPORTED_MODULE_13__components_buttons__[
                        'b' /* ButtonRow */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 250,
                        },
                        __self: this,
                      },
                      __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                        __WEBPACK_IMPORTED_MODULE_4_src_components_link__[
                          'a' /* default */
                        ],
                        {
                          to: '/',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 251,
                          },
                          __self: this,
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                          __WEBPACK_IMPORTED_MODULE_13__components_buttons__[
                            'a' /* Button */
                          ],
                          {
                            large: true,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 252,
                            },
                            __self: this,
                          },
                          'Take me home'
                        )
                      )
                    )
                  )
                );
              }
            },
          },
        ]);

        return UserView;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var map = function map(state) {
        return { currentUser: state.users.currentUser };
      };
      /* harmony default export */ __webpack_exports__[
        'default'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(
          map
        ),
        __WEBPACK_IMPORTED_MODULE_16__queries__['a' /* getUser */],
        __WEBPACK_IMPORTED_MODULE_18__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(UserView);

      /***/
    },

  /***/ './src/views/user/queries.js':
    /*!***********************************!*\
  !*** ./src/views/user/queries.js ***!
  \***********************************/
    /*! exports provided: getUserThreads, getUser */
    /*! exports used: getUser, getUserThreads */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return getUserThreads;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return getUser;
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_fragments_user_userThreads__ = __webpack_require__(
        /*! ../../api/fragments/user/userThreads */ './src/api/fragments/user/userThreads.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_fragments_user_userCommunities__ = __webpack_require__(
        /*! ../../api/fragments/user/userCommunities */ './src/api/fragments/user/userCommunities.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__api_subscriptions__ = __webpack_require__(
        /*! ../../api/subscriptions */ './src/api/subscriptions.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helpers_realtimeThreads__ = __webpack_require__(
        /*! ../../helpers/realtimeThreads */ './src/helpers/realtimeThreads.js'
      );
      var _templateObject = _taggedTemplateLiteral(
          [
            '\n  query loadMoreUserThreads($username: String, $after: String, $kind: ThreadConnectionType) {\n    user(username: $username) {\n      ...userInfo\n      ...userThreads\n    }\n  }\n  ',
            '\n  ',
            '\n',
          ],
          [
            '\n  query loadMoreUserThreads($username: String, $after: String, $kind: ThreadConnectionType) {\n    user(username: $username) {\n      ...userInfo\n      ...userThreads\n    }\n  }\n  ',
            '\n  ',
            '\n',
          ]
        ),
        _templateObject2 = _taggedTemplateLiteral(
          [
            '\n\t\tquery getUserThreads($username: String, $after: String, $kind: ThreadConnectionType) {\n\t\t\tuser(username: $username) {\n        ...userInfo\n        ...userThreads\n      }\n\t\t}\n    ',
            '\n    ',
            '\n\t',
          ],
          [
            '\n\t\tquery getUserThreads($username: String, $after: String, $kind: ThreadConnectionType) {\n\t\t\tuser(username: $username) {\n        ...userInfo\n        ...userThreads\n      }\n\t\t}\n    ',
            '\n    ',
            '\n\t',
          ]
        ),
        _templateObject3 = _taggedTemplateLiteral(
          [
            '\n\t\tquery getUser($username: String) {\n\t\t\tuser(username: $username) {\n        ...userInfo\n        isPro\n        totalReputation\n        ...userCommunities\n      }\n\t\t}\n    ',
            '\n    ',
            '\n\t',
          ],
          [
            '\n\t\tquery getUser($username: String) {\n\t\t\tuser(username: $username) {\n        ...userInfo\n        isPro\n        totalReputation\n        ...userCommunities\n      }\n\t\t}\n    ',
            '\n    ',
            '\n\t',
          ]
        );

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

      function _taggedTemplateLiteral(strings, raw) {
        return Object.freeze(
          Object.defineProperties(strings, {
            raw: { value: Object.freeze(raw) },
          })
        );
      }

      // $FlowFixMe

      var LoadMoreThreads = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql']
      )(
        _templateObject,
        __WEBPACK_IMPORTED_MODULE_1__api_fragments_user_userInfo__[
          'a' /* userInfoFragment */
        ],
        __WEBPACK_IMPORTED_MODULE_2__api_fragments_user_userThreads__[
          'a' /* userThreadsFragment */
        ]
      );

      var threadsQueryOptions = {
        props: function props(_ref) {
          var ownProps = _ref.ownProps,
            _ref$data = _ref.data,
            _fetchMore = _ref$data.fetchMore,
            error = _ref$data.error,
            loading = _ref$data.loading,
            networkStatus = _ref$data.networkStatus,
            user = _ref$data.user,
            subscribeToMore = _ref$data.subscribeToMore;
          return {
            data: {
              error: error,
              loading: loading,
              user: user,
              networkStatus: networkStatus,
              threads: user ? user.threadConnection.edges : '',
              hasNextPage: user
                ? user.threadConnection.pageInfo.hasNextPage
                : false,
              subscribeToUpdatedThreads: function subscribeToUpdatedThreads() {
                return subscribeToMore({
                  document:
                    __WEBPACK_IMPORTED_MODULE_4__api_subscriptions__[
                      'e' /* subscribeToUpdatedThreads */
                    ],
                  updateQuery: function updateQuery(prev, _ref2) {
                    var subscriptionData = _ref2.subscriptionData;

                    var updatedThread = subscriptionData.data.threadUpdated;
                    if (!updatedThread) return prev;

                    var thisUserId = ownProps.userId;
                    var updatedThreadShouldAppearInContext =
                      thisUserId === updatedThread.creator.id;

                    var newThreads = updatedThreadShouldAppearInContext
                      ? Object(
                          __WEBPACK_IMPORTED_MODULE_5__helpers_realtimeThreads__[
                            'a' /* default */
                          ]
                        )(
                          prev.user.threadConnection.edges,
                          updatedThread,
                          ownProps.dispatch
                        ).filter(function(thread) {
                          return thread.node.creator.id === thisUserId;
                        })
                      : [].concat(
                          _toConsumableArray(prev.user.threadConnection.edges)
                        );

                    return Object.assign({}, prev, {
                      user: Object.assign({}, prev.user, {
                        threadConnection: Object.assign(
                          {},
                          prev.user.threadConnection,
                          {
                            pageInfo: Object.assign(
                              {},
                              prev.user.threadConnection.pageInfo
                            ),
                            edges: newThreads,
                          }
                        ),
                      }),
                    });
                  },
                });
              },
              fetchMore: function fetchMore() {
                return _fetchMore({
                  query: LoadMoreThreads,
                  variables: {
                    after:
                      user.threadConnection.edges[
                        user.threadConnection.edges.length - 1
                      ].cursor,
                    username: user.username,
                    kind: ownProps.kind,
                  },
                  updateQuery: function updateQuery(prev, _ref3) {
                    var fetchMoreResult = _ref3.fetchMoreResult;

                    if (!fetchMoreResult.user) {
                      return prev;
                    }
                    return Object.assign({}, prev, {
                      user: Object.assign({}, prev.user, {
                        threadConnection: Object.assign(
                          {},
                          prev.user.threadConnection,
                          {
                            pageInfo: Object.assign(
                              {},
                              prev.user.threadConnection.pageInfo,
                              fetchMoreResult.user.threadConnection.pageInfo
                            ),
                            edges: [].concat(
                              _toConsumableArray(
                                prev.user.threadConnection.edges
                              ),
                              _toConsumableArray(
                                fetchMoreResult.user.threadConnection.edges
                              )
                            ),
                          }
                        ),
                      }),
                    });
                  },
                });
              },
            },
          };
        },
        options: function options(_ref4) {
          var username = _ref4.username,
            kind = _ref4.kind;
          return {
            variables: {
              username: username,
              kind: kind,
            },
            fetchPolicy: 'cache-first',
          };
        },
      };

      var getUserThreads = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(
        Object(__WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql'])(
          _templateObject2,
          __WEBPACK_IMPORTED_MODULE_1__api_fragments_user_userInfo__[
            'a' /* userInfoFragment */
          ],
          __WEBPACK_IMPORTED_MODULE_2__api_fragments_user_userThreads__[
            'a' /* userThreadsFragment */
          ]
        ),
        threadsQueryOptions
      );

      /*
  Loads the sidebar profile component widget independent of the thread feed.
  In the future we can compose these queries together since they are fetching
  such similar data, but for now we're making a decision to keep the data
  queries specific to each component.
*/
      var profileQueryOptions = {
        options: function options(_ref5) {
          var username = _ref5.match.params.username;
          return {
            variables: {
              username: username,
            },
            fetchPolicy: 'cache-first',
          };
        },
      };

      var getUser = Object(
        __WEBPACK_IMPORTED_MODULE_0_react_apollo__['graphql']
      )(
        Object(__WEBPACK_IMPORTED_MODULE_0_react_apollo__['gql'])(
          _templateObject3,
          __WEBPACK_IMPORTED_MODULE_1__api_fragments_user_userInfo__[
            'a' /* userInfoFragment */
          ],
          __WEBPACK_IMPORTED_MODULE_3__api_fragments_user_userCommunities__[
            'a' /* userCommunitiesFragment */
          ]
        ),
        profileQueryOptions
      );

      /***/
    },

  /***/ './src/views/user/style.js':
    /*!*********************************!*\
  !*** ./src/views/user/style.js ***!
  \*********************************/
    /*! exports provided: Row, Col, RowLabel, SearchContainer, SearchInput */
    /*! exports used: SearchContainer, SearchInput */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* unused harmony export Row */
      /* unused harmony export Col */
      /* unused harmony export RowLabel */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return SearchContainer;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return SearchInput;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_globals__ = __webpack_require__(
        /*! ../../components/globals */ './src/components/globals/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_card__ = __webpack_require__(
        /*! ../../components/card */ './src/components/card/index.js'
      );

      var Row = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['b' /* FlexRow */]
      ).withConfig({
        displayName: 'style__Row',
        componentId: 's1evw37o-0',
      })(
        [
          'padding:8px 16px;align-items:center;width:100%;color:',
          ';div{margin-top:2px;margin-right:8px;color:inherit;}span{line-height:1;color:inherit;}&:hover{background-color:',
          ';color:',
          ';}',
        ],
        function(_ref) {
          var theme = _ref.theme;
          return theme.text.alt;
        },
        function(_ref2) {
          var theme = _ref2.theme;
          return theme.brand.alt;
        },
        function(_ref3) {
          var theme = _ref3.theme;
          return theme.text.reverse;
        }
      );

      var Col = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['a' /* FlexCol */]
      ).withConfig({
        displayName: 'style__Col',
        componentId: 's1evw37o-1',
      })(['width:100%;a + a > div{border-top:2px solid ', ';}'], function(
        _ref4
      ) {
        var theme = _ref4.theme;
        return theme.bg.wash;
      });

      var RowLabel = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__RowLabel',
        componentId: 's1evw37o-2',
      })(['font-weight:600;']);

      var SearchContainer = Object(
        __WEBPACK_IMPORTED_MODULE_0_styled_components__['c' /* default */]
      )(
        __WEBPACK_IMPORTED_MODULE_2__components_card__['b' /* default */]
      ).withConfig({
        displayName: 'style__SearchContainer',
        componentId: 's1evw37o-3',
      })(
        [
          'margin-bottom:16px;position:relative;z-index:',
          ';width:100%;display:block;min-height:64px;border-radius:12px;transition:',
          ';&:hover{transition:none;box-shadow:',
          ' ',
          ';}@media (max-width:768px){border-radius:0;pointer-events:all;margin-bottom:0;}',
        ],
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['r' /* zIndex */]
          .search,
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['n' /* Transition */]
          .hover.off,
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['j' /* Shadow */]
          .high,
        function(_ref5) {
          var theme = _ref5.theme;
          return Object(
            __WEBPACK_IMPORTED_MODULE_1__components_globals__['p' /* hexa */]
          )(theme.text.placeholder, 0.5);
        }
      );

      var SearchInput = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].input.withConfig({
        displayName: 'style__SearchInput',
        componentId: 's1evw37o-4',
      })(
        [
          'justify-content:flex-start;align-items:center;cursor:pointer;padding:20px;color:',
          ';transition:',
          ';font-size:20px;font-weight:800;margin-left:8px;width:97%;border-radius:12px;',
        ],
        function(props) {
          return props.theme.text.default;
        },
        __WEBPACK_IMPORTED_MODULE_1__components_globals__['n' /* Transition */]
          .hover.off
      );

      /***/
    },
});
//# sourceMappingURL=UserView.chunk.js.map
