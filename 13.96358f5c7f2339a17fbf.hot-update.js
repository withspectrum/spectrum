webpackHotUpdate(13, {
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
});
//# sourceMappingURL=13.96358f5c7f2339a17fbf.hot-update.js.map
