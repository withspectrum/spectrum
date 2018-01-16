webpackJsonp([5], {
  /***/ './node_modules/react-flip-move/lib/FlipMove.js':
    /*!******************************************************!*\
  !*** ./node_modules/react-flip-move/lib/FlipMove.js ***!
  \******************************************************/
    /*! dynamic exports provided */
    /*! all exports used */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _slicedToArray = (function() {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;
          try {
            for (
              var _i = arr[Symbol.iterator](), _s;
              !(_n = (_s = _i.next()).done);
              _n = true
            ) {
              _arr.push(_s.value);
              if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i['return']) _i['return']();
            } finally {
              if (_d) throw _e;
            }
          }
          return _arr;
        }
        return function(arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError(
              'Invalid attempt to destructure non-iterable instance'
            );
          }
        };
      })();

      var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };

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

      var _react = __webpack_require__(
        /*! react */ './node_modules/react/react.js'
      );

      var _reactDom = __webpack_require__(
        /*! react-dom */ './node_modules/react-dom/index.js'
      );

      var _reactDom2 = _interopRequireDefault(_reactDom);

      var _errorMessages = __webpack_require__(
        /*! ./error-messages */ './node_modules/react-flip-move/lib/error-messages.js'
      );

      __webpack_require__(
        /*! ./polyfills */ './node_modules/react-flip-move/lib/polyfills.js'
      );

      var _propConverter = __webpack_require__(
        /*! ./prop-converter */ './node_modules/react-flip-move/lib/prop-converter.js'
      );

      var _propConverter2 = _interopRequireDefault(_propConverter);

      var _domManipulation = __webpack_require__(
        /*! ./dom-manipulation */ './node_modules/react-flip-move/lib/dom-manipulation.js'
      );

      var _helpers = __webpack_require__(
        /*! ./helpers */ './node_modules/react-flip-move/lib/helpers.js'
      );

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
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
      /**
       * React Flip Move
       * (c) 2016-present Joshua Comeau
       *
       * For information on how this code is laid out, check out CODE_TOUR.md
       */

      /* eslint-disable react/prop-types */

      // eslint-disable-next-line no-duplicate-imports

      var transitionEnd = (0, _domManipulation.whichTransitionEvent)();
      var noBrowserSupport = !transitionEnd;

      function getKey(childData) {
        return childData.key || '';
      }

      function getElementChildren(children) {
        // Fix incomplete typing of Children.toArray
        // eslint-disable-next-line flowtype/no-weak-types
        return _react.Children.toArray(children);
      }

      var FlipMove = (function(_Component) {
        _inherits(FlipMove, _Component);

        function FlipMove() {
          var _ref;

          var _temp, _this, _ret;

          _classCallCheck(this, FlipMove);

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
                FlipMove.__proto__ ||
                Object.getPrototypeOf(FlipMove)).call.apply(
                _ref,
                [this].concat(args)
              )
            )),
            _this)),
            (_this.state = {
              children: getElementChildren(
                // `this.props` ought to always be defined at this point, but a report
                // was made about it not being defined in IE10.
                // TODO: Test in IE10, to see if there's an underlying cause that can
                // be addressed.
                _this.props ? _this.props.children : []
              ).map(function(element) {
                return _extends({}, element, {
                  element: element,
                  appearing: true,
                });
              }),
            }),
            (_this.childrenData = {}),
            (_this.parentData = {
              domNode: null,
              boundingBox: null,
            }),
            (_this.heightPlaceholderData = {
              domNode: null,
            }),
            (_this.remainingAnimations = 0),
            (_this.childrenToAnimate = []),
            (_this.findDOMContainer = function() {
              // eslint-disable-next-line react/no-find-dom-node
              var domNode = _reactDom2.default.findDOMNode(_this);
              var parentNode = domNode && domNode.parentNode;

              // This ought to be impossible, but handling it for Flow's sake.
              if (!parentNode || !(parentNode instanceof HTMLElement)) {
                return;
              }

              // If the parent node has static positioning, leave animations might look
              // really funky. Let's automatically apply `position: relative` in this
              // case, to prevent any quirkiness.
              if (window.getComputedStyle(parentNode).position === 'static') {
                parentNode.style.position = 'relative';
                (0, _errorMessages.parentNodePositionStatic)();
              }

              _this.parentData.domNode = parentNode;
            }),
            (_this.runAnimation = function() {
              var dynamicChildren = _this.state.children.filter(
                _this.doesChildNeedToBeAnimated
              );

              // Splitting DOM reads and writes to be peformed in batches
              var childrenInitialStyles = dynamicChildren.map(function(child) {
                return _this.computeInitialStyles(child);
              });
              dynamicChildren.forEach(function(child, index) {
                _this.remainingAnimations += 1;
                _this.childrenToAnimate.push(getKey(child));
                _this.animateChild(child, index, childrenInitialStyles[index]);
              });

              if (typeof _this.props.onStartAll === 'function') {
                _this.callChildrenHook(_this.props.onStartAll);
              }
            }),
            (_this.doesChildNeedToBeAnimated = function(child) {
              // If the child doesn't have a key, it's an immovable child (one that we
              // do not want to do FLIP stuff to.)
              if (!getKey(child)) {
                return false;
              }

              var childData = _this.getChildData(getKey(child));
              var childDomNode = childData.domNode;
              var childBoundingBox = childData.boundingBox;
              var parentBoundingBox = _this.parentData.boundingBox;

              if (!childDomNode) {
                return false;
              }

              var _this$props = _this.props,
                appearAnimation = _this$props.appearAnimation,
                enterAnimation = _this$props.enterAnimation,
                leaveAnimation = _this$props.leaveAnimation,
                getPosition = _this$props.getPosition;

              var isAppearingWithAnimation = child.appearing && appearAnimation;
              var isEnteringWithAnimation = child.entering && enterAnimation;
              var isLeavingWithAnimation = child.leaving && leaveAnimation;

              if (
                isAppearingWithAnimation ||
                isEnteringWithAnimation ||
                isLeavingWithAnimation
              ) {
                return true;
              }

              // If it isn't entering/leaving, we want to animate it if it's
              // on-screen position has changed.

              var _getPositionDelta = (0, _domManipulation.getPositionDelta)({
                  childDomNode: childDomNode,
                  childBoundingBox: childBoundingBox,
                  parentBoundingBox: parentBoundingBox,
                  getPosition: getPosition,
                }),
                _getPositionDelta2 = _slicedToArray(_getPositionDelta, 2),
                dX = _getPositionDelta2[0],
                dY = _getPositionDelta2[1];

              return dX !== 0 || dY !== 0;
            }),
            _temp)),
            _possibleConstructorReturn(_this, _ret)
          );
        }
        // Copy props.children into state.
        // To understand why this is important (and not an anti-pattern), consider
        // how "leave" animations work. An item has "left" when the component
        // receives a new set of props that do NOT contain the item.
        // If we just render the props as-is, the item would instantly disappear.
        // We want to keep the item rendered for a little while, until its animation
        // can complete. Because we cannot mutate props, we make `state` the source
        // of truth.

        // FlipMove needs to know quite a bit about its children in order to do
        // its job. We store these as a property on the instance. We're not using
        // state, because we don't want changes to trigger re-renders, we just
        // need a place to keep the data for reference, when changes happen.
        // This field should not be accessed directly. Instead, use getChildData,
        // putChildData, etc...

        // Similarly, track the dom node and box of our parent element.

        // If `maintainContainerHeight` prop is set to true, we'll create a
        // placeholder element which occupies space so that the parent height
        // doesn't change when items are removed from the document flow (which
        // happens during leave animations)

        // Keep track of remaining animations so we know when to fire the
        // all-finished callback, and clean up after ourselves.
        // NOTE: we can't simply use childrenToAnimate.length to track remaining
        // animations, because we need to maintain the list of animating children,
        // to pass to the `onFinishAll` handler.

        _createClass(FlipMove, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              // Because React 16 no longer requires wrapping elements, Flip Move can opt
              // to not wrap the children in an element. In that case, find the parent
              // element using `findDOMNode`.
              if (this.props.typeName === null) {
                this.findDOMContainer();
              }

              // Run our `appearAnimation` if it was requested, right after the
              // component mounts.
              var shouldTriggerFLIP =
                this.props.appearAnimation &&
                !this.isAnimationDisabled(this.props);

              if (shouldTriggerFLIP) {
                this.prepForAnimation();
                this.runAnimation();
              }
            },
          },
          {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
              // When the component is handed new props, we need to figure out the
              // "resting" position of all currently-rendered DOM nodes.
              // We store that data in this.parent and this.children,
              // so it can be used later to work out the animation.
              this.updateBoundingBoxCaches();

              // Convert opaque children object to array.
              var nextChildren = getElementChildren(nextProps.children);

              // Next, we need to update our state, so that it contains our new set of
              // children. If animation is disabled or unsupported, this is easy;
              // we just copy our props into state.
              // Assuming that we can animate, though, we have to do some work.
              // Essentially, we want to keep just-deleted nodes in the DOM for a bit
              // longer, so that we can animate them away.
              this.setState({
                children: this.isAnimationDisabled(nextProps)
                  ? nextChildren.map(function(element) {
                      return _extends({}, element, { element: element });
                    })
                  : this.calculateNextSetOfChildren(nextChildren),
              });
            },
          },
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(previousProps) {
              if (this.props.typeName === null) {
                this.findDOMContainer();
              }
              // If the children have been re-arranged, moved, or added/removed,
              // trigger the main FLIP animation.
              //
              // IMPORTANT: We need to make sure that the children have actually changed.
              // At the end of the transition, we clean up nodes that need to be removed.
              // We DON'T want this cleanup to trigger another update.

              var oldChildrenKeys = getElementChildren(this.props.children).map(
                function(d) {
                  return d.key;
                }
              );
              var nextChildrenKeys = getElementChildren(
                previousProps.children
              ).map(function(d) {
                return d.key;
              });

              var shouldTriggerFLIP =
                !(0, _helpers.arraysEqual)(oldChildrenKeys, nextChildrenKeys) &&
                !this.isAnimationDisabled(this.props);

              if (shouldTriggerFLIP) {
                this.prepForAnimation();
                this.runAnimation();
              }
            },
          },
          {
            key: 'calculateNextSetOfChildren',
            value: function calculateNextSetOfChildren(nextChildren) {
              var _this2 = this;

              // We want to:
              //   - Mark all new children as `entering`
              //   - Pull in previous children that aren't in nextChildren, and mark them
              //     as `leaving`
              //   - Preserve the nextChildren list order, with leaving children in their
              //     appropriate places.
              //

              var updatedChildren = nextChildren.map(function(nextChild) {
                var child = _this2.findChildByKey(nextChild.key);

                // If the current child did exist, but it was in the midst of leaving,
                // we want to treat it as though it's entering
                var isEntering = !child || child.leaving;

                return _extends({}, nextChild, {
                  element: nextChild,
                  entering: isEntering,
                });
              });

              // This is tricky. We want to keep the nextChildren's ordering, but with
              // any just-removed items maintaining their original position.
              // eg.
              //   this.state.children  = [ 1, 2, 3, 4 ]
              //   nextChildren         = [ 3, 1 ]
              //
              // In this example, we've removed the '2' & '4'
              // We want to end up with:  [ 2, 3, 1, 4 ]
              //
              // To accomplish that, we'll iterate through this.state.children. whenever
              // we find a match, we'll append our `leaving` flag to it, and insert it
              // into the nextChildren in its ORIGINAL position. Note that, as we keep
              // inserting old items into the new list, the "original" position will
              // keep incrementing.
              var numOfChildrenLeaving = 0;
              this.state.children.forEach(function(child, index) {
                var isLeaving = !nextChildren.find(function(_ref2) {
                  var key = _ref2.key;
                  return key === getKey(child);
                });

                // If the child isn't leaving (or, if there is no leave animation),
                // we don't need to add it into the state children.
                if (!isLeaving || !_this2.props.leaveAnimation) return;

                var nextChild = _extends({}, child, { leaving: true });
                var nextChildIndex = index + numOfChildrenLeaving;

                updatedChildren.splice(nextChildIndex, 0, nextChild);
                numOfChildrenLeaving += 1;
              });

              return updatedChildren;
            },
          },
          {
            key: 'prepForAnimation',
            value: function prepForAnimation() {
              var _this3 = this;

              // Our animation prep consists of:
              // - remove children that are leaving from the DOM flow, so that the new
              //   layout can be accurately calculated,
              // - update the placeholder container height, if needed, to ensure that
              //   the parent's height doesn't collapse.

              var _props = this.props,
                leaveAnimation = _props.leaveAnimation,
                maintainContainerHeight = _props.maintainContainerHeight,
                getPosition = _props.getPosition;

              // we need to make all leaving nodes "invisible" to the layout calculations
              // that will take place in the next step (this.runAnimation).

              if (leaveAnimation) {
                var leavingChildren = this.state.children.filter(function(
                  child
                ) {
                  return child.leaving;
                });

                leavingChildren.forEach(function(leavingChild) {
                  var childData = _this3.getChildData(getKey(leavingChild));

                  // Warn if child is disabled
                  if (
                    !_this3.isAnimationDisabled(_this3.props) &&
                    childData.domNode &&
                    childData.domNode.disabled
                  ) {
                    (0, _errorMessages.childIsDisabled)();
                  }

                  // We need to take the items out of the "flow" of the document, so that
                  // its siblings can move to take its place.
                  if (childData.boundingBox) {
                    (0, _domManipulation.removeNodeFromDOMFlow)(
                      childData,
                      _this3.props.verticalAlignment
                    );
                  }
                });

                if (
                  maintainContainerHeight &&
                  this.heightPlaceholderData.domNode
                ) {
                  (0, _domManipulation.updateHeightPlaceholder)({
                    domNode: this.heightPlaceholderData.domNode,
                    parentData: this.parentData,
                    getPosition: getPosition,
                  });
                }
              }

              // For all children not in the middle of entering or leaving,
              // we need to reset the transition, so that the NEW shuffle starts from
              // the right place.
              this.state.children.forEach(function(child) {
                var _getChildData = _this3.getChildData(getKey(child)),
                  domNode = _getChildData.domNode;

                // Ignore children that don't render DOM nodes (eg. by returning null)

                if (!domNode) {
                  return;
                }

                if (!child.entering && !child.leaving) {
                  (0, _domManipulation.applyStylesToDOMNode)({
                    domNode: domNode,
                    styles: {
                      transition: '',
                    },
                  });
                }
              });
            },
          },
          {
            key: 'animateChild',
            value: function animateChild(child, index, childInitialStyles) {
              var _this4 = this;

              var _getChildData2 = this.getChildData(getKey(child)),
                domNode = _getChildData2.domNode;

              if (!domNode) {
                return;
              }

              // Apply the relevant style for this DOM node
              // This is the offset from its actual DOM position.
              // eg. if an item has been re-rendered 20px lower, we want to apply a
              // style of 'transform: translate(-20px)', so that it appears to be where
              // it started.
              // In FLIP terminology, this is the 'Invert' stage.
              (0, _domManipulation.applyStylesToDOMNode)({
                domNode: domNode,
                styles: childInitialStyles,
              });

              // Start by invoking the onStart callback for this child.
              if (this.props.onStart) this.props.onStart(child, domNode);

              // Next, animate the item from it's artificially-offset position to its
              // new, natural position.
              requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                  // NOTE, RE: the double-requestAnimationFrame:
                  // Sadly, this is the most browser-compatible way to do this I've found.
                  // Essentially we need to set the initial styles outside of any request
                  // callbacks to avoid batching them. Then, a frame needs to pass with
                  // the styles above rendered. Then, on the second frame, we can apply
                  // our final styles to perform the animation.

                  // Our first order of business is to "undo" the styles applied in the
                  // previous frames, while also adding a `transition` property.
                  // This way, the item will smoothly transition from its old position
                  // to its new position.

                  // eslint-disable-next-line flowtype/require-variable-type
                  var styles = {
                    transition: (0, _domManipulation.createTransitionString)(
                      index,
                      _this4.props
                    ),
                    transform: '',
                    opacity: '',
                  };

                  if (child.appearing && _this4.props.appearAnimation) {
                    styles = _extends(
                      {},
                      styles,
                      _this4.props.appearAnimation.to
                    );
                  } else if (child.entering && _this4.props.enterAnimation) {
                    styles = _extends(
                      {},
                      styles,
                      _this4.props.enterAnimation.to
                    );
                  } else if (child.leaving && _this4.props.leaveAnimation) {
                    styles = _extends(
                      {},
                      styles,
                      _this4.props.leaveAnimation.to
                    );
                  }

                  // In FLIP terminology, this is the 'Play' stage.
                  (0,
                  _domManipulation.applyStylesToDOMNode)({ domNode: domNode, styles: styles });
                });
              });

              this.bindTransitionEndHandler(child);
            },
          },
          {
            key: 'bindTransitionEndHandler',
            value: function bindTransitionEndHandler(child) {
              var _this5 = this;

              var _getChildData3 = this.getChildData(getKey(child)),
                domNode = _getChildData3.domNode;

              if (!domNode) {
                return;
              }

              // The onFinish callback needs to be bound to the transitionEnd event.
              // We also need to unbind it when the transition completes, so this ugly
              // inline function is required (we need it here so it closes over
              // dependent variables `child` and `domNode`)
              var transitionEndHandler = function transitionEndHandler(ev) {
                // It's possible that this handler is fired not on our primary transition,
                // but on a nested transition (eg. a hover effect). Ignore these cases.
                if (ev.target !== domNode) return;

                // Remove the 'transition' inline style we added. This is cleanup.
                domNode.style.transition = '';

                // Trigger any applicable onFinish/onFinishAll hooks
                _this5.triggerFinishHooks(child, domNode);

                domNode.removeEventListener(
                  transitionEnd,
                  transitionEndHandler
                );

                if (child.leaving) {
                  _this5.removeChildData(getKey(child));
                }
              };

              domNode.addEventListener(transitionEnd, transitionEndHandler);
            },
          },
          {
            key: 'triggerFinishHooks',
            value: function triggerFinishHooks(child, domNode) {
              var _this6 = this;

              if (this.props.onFinish) this.props.onFinish(child, domNode);

              // Reduce the number of children we need to animate by 1,
              // so that we can tell when all children have finished.
              this.remainingAnimations -= 1;

              if (this.remainingAnimations === 0) {
                // Remove any items from the DOM that have left, and reset `entering`.
                var nextChildren = this.state.children
                  .filter(function(_ref3) {
                    var leaving = _ref3.leaving;
                    return !leaving;
                  })
                  .map(function(item) {
                    return _extends({}, item, {
                      // fix for Flow
                      element: item.element,
                      appearing: false,
                      entering: false,
                    });
                  });

                this.setState({ children: nextChildren }, function() {
                  if (typeof _this6.props.onFinishAll === 'function') {
                    _this6.callChildrenHook(_this6.props.onFinishAll);
                  }

                  // Reset our variables for the next iteration
                  _this6.childrenToAnimate = [];
                });

                // If the placeholder was holding the container open while elements were
                // leaving, we we can now set its height to zero.
                if (this.heightPlaceholderData.domNode) {
                  this.heightPlaceholderData.domNode.style.height = '0';
                }
              }
            },
          },
          {
            key: 'callChildrenHook',
            value: function callChildrenHook(hook) {
              var _this7 = this;

              var elements = [];
              var domNodes = [];

              this.childrenToAnimate.forEach(function(childKey) {
                // If this was an exit animation, the child may no longer exist.
                // If so, skip it.
                var child = _this7.findChildByKey(childKey);

                if (!child) {
                  return;
                }

                elements.push(child);

                if (_this7.hasChildData(childKey)) {
                  domNodes.push(_this7.getChildData(childKey).domNode);
                }
              });

              hook(elements, domNodes);
            },
          },
          {
            key: 'updateBoundingBoxCaches',
            value: function updateBoundingBoxCaches() {
              var _this8 = this;

              // This is the ONLY place that parentData and childrenData's
              // bounding boxes are updated. They will be calculated at other times
              // to be compared to this value, but it's important that the cache is
              // updated once per update.
              var parentDomNode = this.parentData.domNode;

              if (!parentDomNode) {
                return;
              }

              this.parentData.boundingBox = this.props.getPosition(
                parentDomNode
              );

              // Splitting DOM reads and writes to be peformed in batches
              var childrenBoundingBoxes = [];

              this.state.children.forEach(function(child) {
                var childKey = getKey(child);

                // It is possible that a child does not have a `key` property;
                // Ignore these children, they don't need to be moved.
                if (!childKey) {
                  childrenBoundingBoxes.push(null);
                  return;
                }

                // In very rare circumstances, for reasons unknown, the ref is never
                // populated for certain children. In this case, avoid doing this update.
                // see: https://github.com/joshwcomeau/react-flip-move/pull/91
                if (!_this8.hasChildData(childKey)) {
                  childrenBoundingBoxes.push(null);
                  return;
                }

                var childData = _this8.getChildData(childKey);

                // If the child element returns null, we need to avoid trying to
                // account for it
                if (!childData.domNode || !child) {
                  childrenBoundingBoxes.push(null);
                  return;
                }

                childrenBoundingBoxes.push(
                  (0, _domManipulation.getRelativeBoundingBox)({
                    childDomNode: childData.domNode,
                    parentDomNode: parentDomNode,
                    getPosition: _this8.props.getPosition,
                  })
                );
              });

              this.state.children.forEach(function(child, index) {
                var childKey = getKey(child);

                var childBoundingBox = childrenBoundingBoxes[index];

                if (!childKey) {
                  return;
                }

                _this8.setChildData(childKey, {
                  boundingBox: childBoundingBox,
                });
              });
            },
          },
          {
            key: 'computeInitialStyles',
            value: function computeInitialStyles(child) {
              if (child.appearing) {
                return this.props.appearAnimation
                  ? this.props.appearAnimation.from
                  : {};
              } else if (child.entering) {
                if (!this.props.enterAnimation) {
                  return {};
                }
                // If this child was in the middle of leaving, it still has its
                // absolute positioning styles applied. We need to undo those.
                return _extends(
                  {
                    position: '',
                    top: '',
                    left: '',
                    right: '',
                    bottom: '',
                  },
                  this.props.enterAnimation.from
                );
              } else if (child.leaving) {
                return this.props.leaveAnimation
                  ? this.props.leaveAnimation.from
                  : {};
              }

              var childData = this.getChildData(getKey(child));
              var childDomNode = childData.domNode;
              var childBoundingBox = childData.boundingBox;
              var parentBoundingBox = this.parentData.boundingBox;

              if (!childDomNode) {
                return {};
              }

              var _getPositionDelta3 = (0, _domManipulation.getPositionDelta)({
                  childDomNode: childDomNode,
                  childBoundingBox: childBoundingBox,
                  parentBoundingBox: parentBoundingBox,
                  getPosition: this.props.getPosition,
                }),
                _getPositionDelta4 = _slicedToArray(_getPositionDelta3, 2),
                dX = _getPositionDelta4[0],
                dY = _getPositionDelta4[1];

              return {
                transform: 'translate(' + dX + 'px, ' + dY + 'px)',
              };
            },

            // eslint-disable-next-line class-methods-use-this
          },
          {
            key: 'isAnimationDisabled',
            value: function isAnimationDisabled(props) {
              // If the component is explicitly passed a `disableAllAnimations` flag,
              // we can skip this whole process. Similarly, if all of the numbers have
              // been set to 0, there is no point in trying to animate; doing so would
              // only cause a flicker (and the intent is probably to disable animations)
              // We can also skip this rigamarole if there's no browser support for it.
              return (
                noBrowserSupport ||
                props.disableAllAnimations ||
                (props.duration === 0 &&
                  props.delay === 0 &&
                  props.staggerDurationBy === 0 &&
                  props.staggerDelayBy === 0)
              );
            },
          },
          {
            key: 'findChildByKey',
            value: function findChildByKey(key) {
              return this.state.children.find(function(child) {
                return getKey(child) === key;
              });
            },
          },
          {
            key: 'hasChildData',
            value: function hasChildData(key) {
              // Object has some built-in properties on its prototype, such as toString.  hasOwnProperty makes
              // sure that key is present on childrenData itself, not on its prototype.
              return Object.prototype.hasOwnProperty.call(
                this.childrenData,
                key
              );
            },
          },
          {
            key: 'getChildData',
            value: function getChildData(key) {
              return this.hasChildData(key) ? this.childrenData[key] : {};
            },
          },
          {
            key: 'setChildData',
            value: function setChildData(key, data) {
              this.childrenData[key] = _extends(
                {},
                this.getChildData(key),
                data
              );
            },
          },
          {
            key: 'removeChildData',
            value: function removeChildData(key) {
              delete this.childrenData[key];
              this.setState(function(prevState) {
                return _extends({}, prevState, {
                  children: prevState.children.filter(function(child) {
                    return child.element.key !== key;
                  }),
                });
              });
            },
          },
          {
            key: 'createHeightPlaceholder',
            value: function createHeightPlaceholder() {
              var _this9 = this;

              var typeName = this.props.typeName;

              // If requested, create an invisible element at the end of the list.
              // Its height will be modified to prevent the container from collapsing
              // prematurely.

              var isContainerAList = typeName === 'ul' || typeName === 'ol';
              var placeholderType = isContainerAList ? 'li' : 'div';

              return (0, _react.createElement)(placeholderType, {
                key: 'height-placeholder',
                ref: function ref(domNode) {
                  _this9.heightPlaceholderData.domNode = domNode;
                },
                style: { visibility: 'hidden', height: 0 },
              });
            },
          },
          {
            key: 'childrenWithRefs',
            value: function childrenWithRefs() {
              var _this10 = this;

              // We need to clone the provided children, capturing a reference to the
              // underlying DOM node. Flip Move needs to use the React escape hatches to
              // be able to do its calculations.
              return this.state.children.map(function(child) {
                return (0, _react.cloneElement)(child.element, {
                  ref: function ref(element) {
                    // Stateless Functional Components are not supported by FlipMove,
                    // because they don't have instances.
                    if (!element) {
                      return;
                    }

                    var domNode = (0, _domManipulation.getNativeNode)(element);
                    _this10.setChildData(getKey(child), { domNode: domNode });
                  },
                });
              });
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this11 = this;

              var _props2 = this.props,
                typeName = _props2.typeName,
                delegated = _props2.delegated,
                leaveAnimation = _props2.leaveAnimation,
                maintainContainerHeight = _props2.maintainContainerHeight;

              var children = this.childrenWithRefs();
              if (leaveAnimation && maintainContainerHeight) {
                children.push(this.createHeightPlaceholder());
              }

              if (!typeName) return children;

              var props = _extends({}, delegated, {
                children: children,
                ref: function ref(node) {
                  _this11.parentData.domNode = node;
                },
              });

              return (0, _react.createElement)(typeName, props);
            },
          },
        ]);

        return FlipMove;
      })(_react.Component);

      exports.default = (0, _propConverter2.default)(FlipMove);
      module.exports = exports['default'];

      /***/
    },

  /***/ './node_modules/react-flip-move/lib/dom-manipulation.js':
    /*!**************************************************************!*\
  !*** ./node_modules/react-flip-move/lib/dom-manipulation.js ***!
  \**************************************************************/
    /*! dynamic exports provided */
    /*! all exports used */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.createTransitionString = exports.getNativeNode = exports.updateHeightPlaceholder = exports.removeNodeFromDOMFlow = exports.getPositionDelta = exports.getRelativeBoundingBox = undefined;

      var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };
      /**
       * React Flip Move
       * (c) 2016-present Joshua Comeau
       *
       * These methods read from and write to the DOM.
       * They almost always have side effects, and will hopefully become the
       * only spot in the codebase with impure functions.
       */

      exports.applyStylesToDOMNode = applyStylesToDOMNode;
      exports.whichTransitionEvent = whichTransitionEvent;

      var _reactDom = __webpack_require__(
        /*! react-dom */ './node_modules/react-dom/index.js'
      );

      var _helpers = __webpack_require__(
        /*! ./helpers */ './node_modules/react-flip-move/lib/helpers.js'
      );

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }

      function applyStylesToDOMNode(_ref) {
        var domNode = _ref.domNode,
          styles = _ref.styles;

        // Can't just do an object merge because domNode.styles is no regular object.
        // Need to do it this way for the engine to fire its `set` listeners.
        Object.keys(styles).forEach(function(key) {
          domNode.style.setProperty((0, _helpers.hyphenate)(key), styles[key]);
        });
      }

      // Modified from Modernizr
      function whichTransitionEvent() {
        var transitions = {
          transition: 'transitionend',
          '-o-transition': 'oTransitionEnd',
          '-moz-transition': 'transitionend',
          '-webkit-transition': 'webkitTransitionEnd',
        };

        // If we're running in a browserless environment (eg. SSR), it doesn't apply.
        // Return a placeholder string, for consistent type return.
        if (typeof document === 'undefined') return '';

        var el = document.createElement('fakeelement');

        var match = Object.keys(transitions).find(function(t) {
          return el.style.getPropertyValue(t) !== undefined;
        });

        // If no `transition` is found, we must be running in a browser so ancient,
        // React itself won't run. Return an empty string, for consistent type return
        return match ? transitions[match] : '';
      }

      var getRelativeBoundingBox = (exports.getRelativeBoundingBox = function getRelativeBoundingBox(
        _ref2
      ) {
        var childDomNode = _ref2.childDomNode,
          parentDomNode = _ref2.parentDomNode,
          getPosition = _ref2.getPosition;

        var parentBox = getPosition(parentDomNode);

        var _getPosition = getPosition(childDomNode),
          top = _getPosition.top,
          left = _getPosition.left,
          right = _getPosition.right,
          bottom = _getPosition.bottom,
          width = _getPosition.width,
          height = _getPosition.height;

        return {
          top: top - parentBox.top,
          left: left - parentBox.left,
          right: parentBox.right - right,
          bottom: parentBox.bottom - bottom,
          width: width,
          height: height,
        };
      });

      /** getPositionDelta
       * This method returns the delta between two bounding boxes, to figure out
       * how many pixels on each axis the element has moved.
       *
       */
      var getPositionDelta = (exports.getPositionDelta = function getPositionDelta(
        _ref3
      ) {
        var childDomNode = _ref3.childDomNode,
          childBoundingBox = _ref3.childBoundingBox,
          parentBoundingBox = _ref3.parentBoundingBox,
          getPosition = _ref3.getPosition;

        // TEMP: A mystery bug is sometimes causing unnecessary boundingBoxes to
        var defaultBox = {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: 0,
          width: 0,
        };

        // Our old box is its last calculated position, derived on mount or at the
        // start of the previous animation.
        var oldRelativeBox = childBoundingBox || defaultBox;
        var parentBox = parentBoundingBox || defaultBox;

        // Our new box is the new final resting place: Where we expect it to wind up
        // after the animation. First we get the box in absolute terms (AKA relative
        // to the viewport), and then we calculate its relative box (relative to the
        // parent container)
        var newAbsoluteBox = getPosition(childDomNode);
        var newRelativeBox = {
          top: newAbsoluteBox.top - parentBox.top,
          left: newAbsoluteBox.left - parentBox.left,
        };

        return [
          oldRelativeBox.left - newRelativeBox.left,
          oldRelativeBox.top - newRelativeBox.top,
        ];
      });

      /** removeNodeFromDOMFlow
       * This method does something very sneaky: it removes a DOM node from the
       * document flow, but without actually changing its on-screen position.
       *
       * It works by calculating where the node is, and then applying styles
       * so that it winds up being positioned absolutely, but in exactly the
       * same place.
       *
       * This is a vital part of the FLIP technique.
       */
      var removeNodeFromDOMFlow = (exports.removeNodeFromDOMFlow = function removeNodeFromDOMFlow(
        childData,
        verticalAlignment
      ) {
        var domNode = childData.domNode,
          boundingBox = childData.boundingBox;

        if (!domNode || !boundingBox) {
          return;
        }

        // For this to work, we have to offset any given `margin`.
        var computed = window.getComputedStyle(domNode);

        // We need to clean up margins, by converting and removing suffix:
        // eg. '21px' -> 21
        var marginAttrs = ['margin-top', 'margin-left', 'margin-right'];
        var margins = marginAttrs.reduce(function(acc, margin) {
          var propertyVal = computed.getPropertyValue(margin);

          return _extends(
            {},
            acc,
            _defineProperty({}, margin, Number(propertyVal.replace('px', '')))
          );
        }, {});

        // If we're bottom-aligned, we need to add the height of the child to its
        // top offset. This is because, when the container is bottom-aligned, its
        // height shrinks from the top, not the bottom. We're removing this node
        // from the flow, so the top is going to drop by its height.
        var topOffset =
          verticalAlignment === 'bottom'
            ? boundingBox.top - boundingBox.height
            : boundingBox.top;

        var styles = {
          position: 'absolute',
          top: topOffset - margins['margin-top'] + 'px',
          left: boundingBox.left - margins['margin-left'] + 'px',
          right: boundingBox.right - margins['margin-right'] + 'px',
        };

        applyStylesToDOMNode({ domNode: domNode, styles: styles });
      });

      /** updateHeightPlaceholder
       * An optional property to FlipMove is a `maintainContainerHeight` boolean.
       * This property creates a node that fills space, so that the parent
       * container doesn't collapse when its children are removed from the
       * document flow.
       */
      var updateHeightPlaceholder = (exports.updateHeightPlaceholder = function updateHeightPlaceholder(
        _ref4
      ) {
        var domNode = _ref4.domNode,
          parentData = _ref4.parentData,
          getPosition = _ref4.getPosition;

        var parentDomNode = parentData.domNode;
        var parentBoundingBox = parentData.boundingBox;

        if (!parentDomNode || !parentBoundingBox) {
          return;
        }

        // We need to find the height of the container *without* the placeholder.
        // Since it's possible that the placeholder might already be present,
        // we first set its height to 0.
        // This allows the container to collapse down to the size of just its
        // content (plus container padding or borders if any).
        applyStylesToDOMNode({ domNode: domNode, styles: { height: '0' } });

        // Find the distance by which the container would be collapsed by elements
        // leaving. We compare the freshly-available parent height with the original,
        // cached container height.
        var originalParentHeight = parentBoundingBox.height;
        var collapsedParentHeight = getPosition(parentDomNode).height;
        var reductionInHeight = originalParentHeight - collapsedParentHeight;

        // If the container has become shorter, update the padding element's
        // height to take up the difference. Otherwise set its height to zero,
        // so that it has no effect.
        var styles = {
          height: reductionInHeight > 0 ? reductionInHeight + 'px' : '0',
        };

        applyStylesToDOMNode({ domNode: domNode, styles: styles });
      });

      var getNativeNode = (exports.getNativeNode = function getNativeNode(
        element
      ) {
        // When running in a windowless environment, abort!
        if (typeof HTMLElement === 'undefined') {
          return null;
        }

        // `element` may already be a native node.
        if (element instanceof HTMLElement) {
          return element;
        }

        // While ReactDOM's `findDOMNode` is discouraged, it's the only
        // publicly-exposed way to find the underlying DOM node for
        // composite components.
        var foundNode = (0, _reactDom.findDOMNode)(element);

        if (foundNode && foundNode.nodeType === Node.TEXT_NODE) {
          // Text nodes are not supported
          return null;
        }
        // eslint-disable-next-line flowtype/no-weak-types
        return foundNode;
      });

      var createTransitionString = (exports.createTransitionString = function createTransitionString(
        index,
        props
      ) {
        var delay = props.delay,
          duration = props.duration;
        var staggerDurationBy = props.staggerDurationBy,
          staggerDelayBy = props.staggerDelayBy,
          easing = props.easing;

        delay += index * staggerDelayBy;
        duration += index * staggerDurationBy;

        var cssProperties = ['transform', 'opacity'];

        return cssProperties
          .map(function(prop) {
            return prop + ' ' + duration + 'ms ' + easing + ' ' + delay + 'ms';
          })
          .join(', ');
      });

      /***/
    },

  /***/ './node_modules/react-flip-move/lib/enter-leave-presets.js':
    /*!*****************************************************************!*\
  !*** ./node_modules/react-flip-move/lib/enter-leave-presets.js ***!
  \*****************************************************************/
    /*! dynamic exports provided */
    /*! all exports used */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      var enterPresets = (exports.enterPresets = {
        elevator: {
          from: { transform: 'scale(0)', opacity: '0' },
          to: { transform: '', opacity: '' },
        },
        fade: {
          from: { opacity: '0' },
          to: { opacity: '' },
        },
        accordionVertical: {
          from: { transform: 'scaleY(0)', transformOrigin: 'center top' },
          to: { transform: '', transformOrigin: 'center top' },
        },
        accordionHorizontal: {
          from: { transform: 'scaleX(0)', transformOrigin: 'left center' },
          to: { transform: '', transformOrigin: 'left center' },
        },
        none: null,
      });
      /**
       * React Flip Move | enterLeavePresets
       * (c) 2016-present Joshua Comeau
       *
       * This contains the master list of presets available for enter/leave animations,
       * along with the mapping between preset and styles.
       */
      var leavePresets = (exports.leavePresets = {
        elevator: {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0)', opacity: '0' },
        },
        fade: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        accordionVertical: {
          from: { transform: 'scaleY(1)', transformOrigin: 'center top' },
          to: { transform: 'scaleY(0)', transformOrigin: 'center top' },
        },
        accordionHorizontal: {
          from: { transform: 'scaleX(1)', transformOrigin: 'left center' },
          to: { transform: 'scaleX(0)', transformOrigin: 'left center' },
        },
        none: null,
      });

      // For now, appearPresets will be identical to enterPresets.
      // Assigning a custom export in case we ever want to add appear-specific ones.
      var appearPresets = (exports.appearPresets = enterPresets);

      // Embarrassingly enough, v2.0 launched with typo'ed preset names.
      // To avoid penning a new major version over something so inconsequential,
      // we're supporting both spellings. In a future version, these alternatives
      // may be deprecated.
      // $FlowFixMe
      enterPresets.accordianVertical = enterPresets.accordionVertical;
      // $FlowFixMe
      enterPresets.accordianHorizontal = enterPresets.accordionHorizontal;
      // $FlowFixMe
      leavePresets.accordianVertical = leavePresets.accordionVertical;
      // $FlowFixMe
      leavePresets.accordianHorizontal = leavePresets.accordionHorizontal;

      var defaultPreset = (exports.defaultPreset = 'elevator');
      var disablePreset = (exports.disablePreset = 'none');

      /***/
    },

  /***/ './node_modules/react-flip-move/lib/error-messages.js':
    /*!************************************************************!*\
  !*** ./node_modules/react-flip-move/lib/error-messages.js ***!
  \************************************************************/
    /*! dynamic exports provided */
    /*! all exports used */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      function warnOnce(msg) {
        var hasWarned = false;
        return function() {
          if (!hasWarned) {
            console.warn(msg);
            hasWarned = true;
          }
        };
      }
      var statelessFunctionalComponentSupplied = (exports.statelessFunctionalComponentSupplied = warnOnce(
        "\n>> Error, via react-flip-move <<\n\nYou provided a stateless functional component as a child to <FlipMove>. Unfortunately, SFCs aren't supported, because Flip Move needs access to the backing instances via refs, and SFCs don't have a public instance that holds that info.\n\nPlease wrap your components in a native element (eg. <div>), or a non-functional component.\n"
      ));

      var primitiveNodeSupplied = (exports.primitiveNodeSupplied = warnOnce(
        '\n>> Error, via react-flip-move <<\n\nYou provided a primitive (text or number) node as a child to <FlipMove>. Flip Move needs containers with unique keys to move children around.\n\nPlease wrap your value in a native element (eg. <span>), or a component.\n'
      ));

      var invalidTypeForTimingProp = (exports.invalidTypeForTimingProp = function invalidTypeForTimingProp(
        args
        // prettier-ignore
      ) {
        return console.error(
          "\n>> Error, via react-flip-move <<\n\nThe prop you provided for '" +
            args.prop +
            "' is invalid. It needs to be a positive integer, or a string that can be resolved to a number. The value you provided is '" +
            args.value +
            "'.\n\nAs a result,  the default value for this parameter will be used, which is '" +
            args.defaultValue +
            "'.\n"
        );
      });

      var deprecatedDisableAnimations = (exports.deprecatedDisableAnimations = warnOnce(
        "\n>> Warning, via react-flip-move <<\n\nThe 'disableAnimations' prop you provided is deprecated. Please switch to use 'disableAllAnimations'.\n\nThis will become a silent error in future versions of react-flip-move.\n"
      ));

      var invalidEnterLeavePreset = (exports.invalidEnterLeavePreset = function invalidEnterLeavePreset(
        args
        // prettier-ignore
      ) {
        return console.error(
          "\n>> Error, via react-flip-move <<\n\nThe enter/leave preset you provided is invalid. We don't currently have a '" +
            args.value +
            " preset.'\n\nAcceptable values are " +
            args.acceptableValues +
            ". The default value of '" +
            args.defaultValue +
            "' will be used.\n"
        );
      });

      var parentNodePositionStatic = (exports.parentNodePositionStatic = warnOnce(
        "\n>> Warning, via react-flip-move <<\n\nWhen using \"wrapperless\" mode (by supplying 'typeName' of 'null'), strange things happen when the direct parent has the default \"static\" position.\n\nFlipMove has added 'position: relative' to this node, to ensure Flip Move animates correctly.\n\nTo avoid seeing this warning, simply apply a non-static position to that parent node.\n"
      ));

      var childIsDisabled = (exports.childIsDisabled = warnOnce(
        "\n>> Warning, via react-flip-move <<\n\nOne or more of Flip Move's child elements have the html attribute 'disabled' set to true.\n\nPlease note that this will cause animations to break in Internet Explorer 11 and below. Either remove the disabled attribute or set 'animation' to false.\n"
      ));

      /***/
    },

  /***/ './node_modules/react-flip-move/lib/helpers.js':
    /*!*****************************************************!*\
  !*** ./node_modules/react-flip-move/lib/helpers.js ***!
  \*****************************************************/
    /*! dynamic exports provided */
    /*! all exports used */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.omit = omit;
      exports.arraysEqual = arraysEqual;
      var isElementAnSFC = (exports.isElementAnSFC = function isElementAnSFC(
        element
      ) {
        var isNativeDOMElement = typeof element.type === 'string';

        if (isNativeDOMElement) {
          return false;
        }

        return !element.type.prototype.isReactComponent;
      });
      function omit(obj) {
        var attrs =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : [];

        var result = {};
        Object.keys(obj).forEach(function(key) {
          if (attrs.indexOf(key) === -1) {
            result[key] = obj[key];
          }
        });
        return result;
      }

      function arraysEqual(a, b) {
        var sameObject = a === b;
        if (sameObject) {
          return true;
        }

        var notBothArrays = !Array.isArray(a) || !Array.isArray(b);
        var differentLengths = a.length !== b.length;

        if (notBothArrays || differentLengths) {
          return false;
        }

        return a.every(function(element, index) {
          return element === b[index];
        });
      }

      function memoizeString(fn) {
        var cache = {};

        return function(str) {
          if (!cache[str]) {
            cache[str] = fn(str);
          }
          return cache[str];
        };
      }

      var hyphenate = (exports.hyphenate = memoizeString(function(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
      }));

      /***/
    },

  /***/ './node_modules/react-flip-move/lib/index.js':
    /*!***************************************************!*\
  !*** ./node_modules/react-flip-move/lib/index.js ***!
  \***************************************************/
    /*! dynamic exports provided */
    /*! exports used: default */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _FlipMove = __webpack_require__(
        /*! ./FlipMove */ './node_modules/react-flip-move/lib/FlipMove.js'
      );

      var _FlipMove2 = _interopRequireDefault(_FlipMove);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      exports.default = _FlipMove2.default;
      /**
       * React Flip Move
       * (c) 2016-present Joshua Comeau
       */

      module.exports = exports['default'];

      /***/
    },

  /***/ './node_modules/react-flip-move/lib/polyfills.js':
    /*!*******************************************************!*\
  !*** ./node_modules/react-flip-move/lib/polyfills.js ***!
  \*******************************************************/
    /*! dynamic exports provided */
    /*! all exports used */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      // @noflow
      /**
       * React Flip Move - Polyfills
       * (c) 2016-present Joshua Comeau
       */

      /* eslint-disable */

      if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
          if (this === null) {
            throw new TypeError(
              'Array.prototype.find called on null or undefined'
            );
          }
          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          }
          var list = Object(this);
          var length = list.length >>> 0;
          var thisArg = arguments[1];
          var value = void 0;

          for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
              return value;
            }
          }
          return undefined;
        };
      }

      if (!Array.prototype.every) {
        Array.prototype.every = function(callbackfn, thisArg) {
          'use strict';

          var T, k;

          if (this == null) {
            throw new TypeError('this is null or not defined');
          }

          var O = Object(this);
          var len = O.length >>> 0;

          if (typeof callbackfn !== 'function') {
            throw new TypeError();
          }

          if (arguments.length > 1) {
            T = thisArg;
          }

          k = 0;

          while (k < len) {
            var kValue;

            if (k in O) {
              kValue = O[k];

              var testResult = callbackfn.call(T, kValue, k, O);

              if (!testResult) {
                return false;
              }
            }
            k++;
          }
          return true;
        };
      }

      if (!Array.isArray) {
        Array.isArray = function(arg) {
          return Object.prototype.toString.call(arg) === '[object Array]';
        };
      }

      /***/
    },

  /***/ './node_modules/react-flip-move/lib/prop-converter.js':
    /*!************************************************************!*\
  !*** ./node_modules/react-flip-move/lib/prop-converter.js ***!
  \************************************************************/
    /*! dynamic exports provided */
    /*! all exports used */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };

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

      var _react = __webpack_require__(
        /*! react */ './node_modules/react/react.js'
      );

      var _react2 = _interopRequireDefault(_react);

      var _errorMessages = __webpack_require__(
        /*! ./error-messages */ './node_modules/react-flip-move/lib/error-messages.js'
      );

      var _enterLeavePresets = __webpack_require__(
        /*! ./enter-leave-presets */ './node_modules/react-flip-move/lib/enter-leave-presets.js'
      );

      var _helpers = __webpack_require__(
        /*! ./helpers */ './node_modules/react-flip-move/lib/helpers.js'
      );

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
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
      /**
       * React Flip Move | propConverter
       * (c) 2016-present Joshua Comeau
       *
       * Abstracted away a bunch of the messy business with props.
       *   - props flow types and defaultProps
       *   - Type conversion (We accept 'string' and 'number' values for duration,
       *     delay, and other fields, but we actually need them to be ints.)
       *   - Children conversion (we need the children to be an array. May not always
       *     be, if a single child is passed in.)
       *   - Resolving animation presets into their base CSS styles
       */
      /* eslint-disable block-scoped-var */

      // eslint-disable-next-line no-duplicate-imports

      function isProduction() {
        try {
          return 'development' === 'production';
        } catch (e) {
          return false;
        }
      }

      function propConverter(ComposedComponent) {
        var _class, _temp;

        return (
          (_temp = _class = (function(_Component) {
            _inherits(FlipMovePropConverter, _Component);

            function FlipMovePropConverter() {
              _classCallCheck(this, FlipMovePropConverter);

              return _possibleConstructorReturn(
                this,
                (
                  FlipMovePropConverter.__proto__ ||
                  Object.getPrototypeOf(FlipMovePropConverter)
                ).apply(this, arguments)
              );
            }

            _createClass(FlipMovePropConverter, [
              {
                key: 'checkChildren',

                // eslint-disable-next-line class-methods-use-this
                value: function checkChildren(children) {
                  // Skip all console warnings in production.
                  // Bail early, to avoid unnecessary work.
                  if (isProduction()) {
                    return;
                  }

                  // same as React.Node, but without fragments, see https://github.com/facebook/flow/issues/4781

                  // FlipMove does not support stateless functional components.
                  // Check to see if any supplied components won't work.
                  // If the child doesn't have a key, it means we aren't animating it.
                  // It's allowed to be an SFC, since we ignore it.
                  _react.Children.forEach(children, function(child) {
                    // null, undefined, and booleans will be filtered out by Children.toArray
                    if (child == null || typeof child === 'boolean') {
                      return;
                    }

                    if (
                      (typeof child === 'undefined'
                        ? 'undefined'
                        : _typeof(child)) !== 'object'
                    ) {
                      (0, _errorMessages.primitiveNodeSupplied)();
                      return;
                    }

                    if (
                      (0, _helpers.isElementAnSFC)(child) &&
                      child.key != null
                    ) {
                      (0,
                      _errorMessages.statelessFunctionalComponentSupplied)();
                    }
                  });
                },
              },
              {
                key: 'convertProps',
                value: function convertProps(props) {
                  var workingProps = {
                    // explicitly bypass the props that don't need conversion
                    children: props.children,
                    easing: props.easing,
                    onStart: props.onStart,
                    onFinish: props.onFinish,
                    onStartAll: props.onStartAll,
                    onFinishAll: props.onFinishAll,
                    typeName: props.typeName,
                    disableAllAnimations: props.disableAllAnimations,
                    getPosition: props.getPosition,
                    maintainContainerHeight: props.maintainContainerHeight,
                    verticalAlignment: props.verticalAlignment,

                    // Do string-to-int conversion for all timing-related props
                    duration: this.convertTimingProp('duration'),
                    delay: this.convertTimingProp('delay'),
                    staggerDurationBy: this.convertTimingProp(
                      'staggerDurationBy'
                    ),
                    staggerDelayBy: this.convertTimingProp('staggerDelayBy'),

                    // Our enter/leave animations can be specified as boolean (default or
                    // disabled), string (preset name), or object (actual animation values).
                    // Let's standardize this so that they're always objects
                    appearAnimation: this.convertAnimationProp(
                      props.appearAnimation,
                      _enterLeavePresets.appearPresets
                    ),
                    enterAnimation: this.convertAnimationProp(
                      props.enterAnimation,
                      _enterLeavePresets.enterPresets
                    ),
                    leaveAnimation: this.convertAnimationProp(
                      props.leaveAnimation,
                      _enterLeavePresets.leavePresets
                    ),

                    delegated: {},
                  };

                  this.checkChildren(workingProps.children);

                  // Accept `disableAnimations`, but add a deprecation warning
                  if (typeof props.disableAnimations !== 'undefined') {
                    workingProps.disableAllAnimations = props.disableAnimations;

                    if (!isProduction()) {
                      (0, _errorMessages.deprecatedDisableAnimations)();
                    }
                  }

                  // Gather any additional props;
                  // they will be delegated to the ReactElement created.
                  var primaryPropKeys = Object.keys(workingProps);
                  var delegatedProps = (0, _helpers.omit)(
                    this.props,
                    primaryPropKeys
                  );

                  // The FlipMove container element needs to have a non-static position.
                  // We use `relative` by default, but it can be overridden by the user.
                  // Now that we're delegating props, we need to merge this in.
                  delegatedProps.style = _extends(
                    {
                      position: 'relative',
                    },
                    delegatedProps.style
                  );

                  workingProps.delegated = delegatedProps;

                  return workingProps;
                },
              },
              {
                key: 'convertTimingProp',
                value: function convertTimingProp(prop) {
                  var rawValue = this.props[prop];

                  var value =
                    typeof rawValue === 'number'
                      ? rawValue
                      : parseInt(rawValue, 10);

                  if (isNaN(value)) {
                    var defaultValue = FlipMovePropConverter.defaultProps[prop];

                    if (!isProduction()) {
                      (0, _errorMessages.invalidTypeForTimingProp)({
                        prop: prop,
                        value: rawValue,
                        defaultValue: defaultValue,
                      });
                    }

                    return defaultValue;
                  }

                  return value;
                },

                // eslint-disable-next-line class-methods-use-this
              },
              {
                key: 'convertAnimationProp',
                value: function convertAnimationProp(animation, presets) {
                  switch (typeof animation === 'undefined'
                    ? 'undefined'
                    : _typeof(animation)) {
                    case 'boolean': {
                      // If it's true, we want to use the default preset.
                      // If it's false, we want to use the 'none' preset.
                      return presets[
                        animation
                          ? _enterLeavePresets.defaultPreset
                          : _enterLeavePresets.disablePreset
                      ];
                    }

                    case 'string': {
                      var presetKeys = Object.keys(presets);

                      if (presetKeys.indexOf(animation) === -1) {
                        if (!isProduction()) {
                          (0, _errorMessages.invalidEnterLeavePreset)({
                            value: animation,
                            acceptableValues: presetKeys
                              .filter(function(key) {
                                return key.indexOf('accordian') === -1;
                              })
                              .join(', '),
                            defaultValue: _enterLeavePresets.defaultPreset,
                          });
                        }

                        return presets[_enterLeavePresets.defaultPreset];
                      }

                      return presets[animation];
                    }

                    default: {
                      return animation;
                    }
                  }
                },
              },
              {
                key: 'render',
                value: function render() {
                  return _react2.default.createElement(
                    ComposedComponent,
                    this.convertProps(this.props)
                  );
                },
              },
            ]);

            return FlipMovePropConverter;
          })(_react.Component)),
          (_class.defaultProps = {
            easing: 'ease-in-out',
            duration: 350,
            delay: 0,
            staggerDurationBy: 0,
            staggerDelayBy: 0,
            typeName: 'div',
            enterAnimation: _enterLeavePresets.defaultPreset,
            leaveAnimation: _enterLeavePresets.defaultPreset,
            disableAllAnimations: false,
            getPosition: function getPosition(node) {
              return node.getBoundingClientRect();
            },
            maintainContainerHeight: false,
            verticalAlignment: 'top',
          }),
          _temp
        );
      }

      exports.default = propConverter;
      module.exports = exports['default'];

      /***/
    },

  /***/ './src/views/dashboard/components/emptySearchFeed.js':
    /*!***********************************************************!*\
  !*** ./src/views/dashboard/components/emptySearchFeed.js ***!
  \***********************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_dashboardFeed__ = __webpack_require__(
        /*! ../../../actions/dashboardFeed */ './src/actions/dashboardFeed.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__style__ = __webpack_require__(
        /*! ../style */ './src/views/dashboard/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/dashboard/components/emptySearchFeed.js',
        _this = this;

      // $FlowFixMe

      var EmptySearchFeed = function EmptySearchFeed(_ref) {
        var dispatch = _ref.dispatch,
          queryString = _ref.queryString;
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_4__style__['G' /* NullThreadFeed */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 10,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_4__style__['F' /* NullHeading */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 11,
              },
              __self: _this,
            },
            'We couldn\'t find any results for "',
            queryString,
            '"'
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3__components_buttons__['a' /* Button */],
            {
              icon: 'post',
              onClick: function onClick() {
                return dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_2__actions_dashboardFeed__[
                      'c' /* changeActiveThread */
                    ]
                  )('new')
                );
              },
              __source: {
                fileName: _jsxFileName,
                lineNumber: 12,
              },
              __self: _this,
            },
            'Be the first to post about it'
          )
        );
      };

      /* harmony default export */ __webpack_exports__['a'] = Object(
        __WEBPACK_IMPORTED_MODULE_1_react_redux__['a' /* connect */]
      )()(EmptySearchFeed);

      /***/
    },

  /***/ './src/views/dashboard/components/emptyThreadFeed.js':
    /*!***********************************************************!*\
  !*** ./src/views/dashboard/components/emptyThreadFeed.js ***!
  \***********************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_link__ = __webpack_require__(
        /*! ../../../components/link */ './src/components/link/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_dashboardFeed__ = __webpack_require__(
        /*! ../../../actions/dashboardFeed */ './src/actions/dashboardFeed.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_icons__ = __webpack_require__(
        /*! ../../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__style__ = __webpack_require__(
        /*! ../style */ './src/views/dashboard/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/dashboard/components/emptyThreadFeed.js',
        _this = this;

      // $FlowFixMe

      var EmptyThreadFeed = function EmptyThreadFeed(_ref) {
        var dispatch = _ref.dispatch;
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_6__style__['G' /* NullThreadFeed */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 12,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_6__style__['F' /* NullHeading */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 13,
              },
              __self: _this,
            },
            "Your feed's a little quiet right now, but don't worry..."
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_6__style__['F' /* NullHeading */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 16,
              },
              __self: _this,
            },
            "We've got recommendations!"
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_6__style__['r' /* Hint */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 17,
              },
              __self: _this,
            },
            'Kick your community off right!'
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_5__components_buttons__['a' /* Button */],
            {
              icon: 'post',
              onClick: function onClick() {
                return dispatch(
                  Object(
                    __WEBPACK_IMPORTED_MODULE_3__actions_dashboardFeed__[
                      'c' /* changeActiveThread */
                    ]
                  )('new')
                );
              },
              __source: {
                fileName: _jsxFileName,
                lineNumber: 18,
              },
              __self: _this,
            },
            'Post your first thread'
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_6__style__['r' /* Hint */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 21,
              },
              __self: _this,
            },
            'Find new friends and great conversations!'
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__components_link__['a' /* default */],
            {
              to: '/explore',
              __source: {
                fileName: _jsxFileName,
                lineNumber: 22,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_6__style__['H' /* OutlineButton */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 23,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_4__components_icons__[
                  'a' /* default */
                ],
                {
                  glyph: 'explore',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 24,
                  },
                  __self: _this,
                }
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 25,
                  },
                  __self: _this,
                },
                'Join more communities'
              )
            )
          )
        );
      };

      /* harmony default export */ __webpack_exports__['a'] = Object(
        __WEBPACK_IMPORTED_MODULE_1_react_redux__['a' /* connect */]
      )()(EmptyThreadFeed);

      /***/
    },

  /***/ './src/views/dashboard/components/errorThreadFeed.js':
    /*!***********************************************************!*\
  !*** ./src/views/dashboard/components/errorThreadFeed.js ***!
  \***********************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_buttons__ = __webpack_require__(
        /*! ../../../components/buttons */ './src/components/buttons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style__ = __webpack_require__(
        /*! ../style */ './src/views/dashboard/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/dashboard/components/errorThreadFeed.js',
        _this = this;

      // $FlowFixMe

      /* harmony default export */ __webpack_exports__['a'] = function(props) {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_3__style__['G' /* NullThreadFeed */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 8,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3__style__['F' /* NullHeading */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 9,
              },
              __self: _this,
            },
            'There was a problem loading this feed. Please try refreshing the page.'
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__components_buttons__['a' /* Button */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 13,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1_src_components_link__[
                'a' /* default */
              ],
              {
                to: '/',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 14,
                },
                __self: _this,
              },
              'Refresh'
            )
          )
        );
      };

      /***/
    },

  /***/ './src/views/dashboard/components/facepile.js':
    /*!****************************************************!*\
  !*** ./src/views/dashboard/components/facepile.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_avatar__ = __webpack_require__(
        /*! ../../../components/avatar */ './src/components/avatar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style__ = __webpack_require__(
        /*! ../style */ './src/views/dashboard/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/dashboard/components/facepile.js',
        _this = this;

      var NUM_TO_DISPLAY = 5;

      var messageAvatars = function messageAvatars(list, active) {
        var avatarList = list.slice(0, NUM_TO_DISPLAY);

        return avatarList.map(function(participant, i) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__style__['I' /* ParticipantHead */],
            {
              offset: i + 1,
              active: active,
              key: participant.id,
              tipText: participant.name,
              tipLocation: 'top-right',
              __source: {
                fileName: _jsxFileName,
                lineNumber: 14,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1__components_avatar__[
                'a' /* default */
              ],
              {
                user: participant,
                size: 24,
                isOnline: false,
                link: participant.username
                  ? '/users/' + participant.username
                  : null,
                src: '' + participant.profilePhoto,
                role: 'presentation',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 21,
                },
                __self: _this,
              }
            )
          );
        });
      };

      var Facepile = function Facepile(_ref) {
        var participants = _ref.participants,
          creator = _ref.creator,
          active = _ref.active;

        if (!participants || participants.length === 0) {
          return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__style__['n' /* FacepileContainer */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 36,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2__style__['I' /* ParticipantHead */],
              {
                active: active,
                offset: 0,
                role: 'presentation',
                key: creator.id,
                tipText: 'Posted by ' + creator.name,
                tipLocation: 'top-right',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 37,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_1__components_avatar__[
                  'a' /* default */
                ],
                {
                  user: creator,
                  size: 24,
                  isOnline: false,
                  link: creator.username ? '/users/' + creator.username : null,
                  src: creator.profilePhoto,
                  role: 'presentation',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 45,
                  },
                  __self: _this,
                }
              )
            )
          );
        }

        var participantList = participants.filter(function(participant) {
          return participant.id !== creator.id;
        });
        var participantCount = participants.length;

        var hasOverflow = participantCount > NUM_TO_DISPLAY;
        var overflowAmount =
          participantCount - NUM_TO_DISPLAY > 9
            ? '···'
            : '+' + (participantCount - NUM_TO_DISPLAY);

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_2__style__['n' /* FacepileContainer */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 70,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__style__['I' /* ParticipantHead */],
            {
              active: active,
              offset: 0,
              role: 'presentation',
              key: creator.id,
              tipText: 'Posted by ' + creator.name,
              tipLocation: 'top-right',
              __source: {
                fileName: _jsxFileName,
                lineNumber: 71,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1__components_avatar__[
                'a' /* default */
              ],
              {
                user: creator,
                size: 24,
                isOnline: false,
                link: creator.username ? '/users/' + creator.username : null,
                src: creator.profilePhoto,
                role: 'presentation',
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 79,
                },
                __self: _this,
              }
            )
          ),
          messageAvatars(participantList, active),
          hasOverflow &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2__style__[
                'm' /* EmptyParticipantHead */
              ],
              {
                active: active,
                offset: NUM_TO_DISPLAY + 1,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 90,
                },
                __self: _this,
              },
              overflowAmount
            )
        );
      };

      /* harmony default export */ __webpack_exports__['a'] = Facepile;

      /***/
    },

  /***/ './src/views/dashboard/components/inboxThread.js':
    /*!*******************************************************!*\
  !*** ./src/views/dashboard/components/inboxThread.js ***!
  \*******************************************************/
    /*! exports provided: default, WatercoolerThread */
    /*! exports used: WatercoolerThread, default */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return WatercoolerThread;
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_router__ = __webpack_require__(
        /*! react-router */ './node_modules/react-router/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_icons__ = __webpack_require__(
        /*! ../../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__facepile__ = __webpack_require__(
        /*! ./facepile */ './src/views/dashboard/components/facepile.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_shared_truncate__ = __webpack_require__(
        /*! shared/truncate */ './shared/truncate.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_shared_truncate___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_6_shared_truncate__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__threadCommunityInfo__ = __webpack_require__(
        /*! ./threadCommunityInfo */ './src/views/dashboard/components/threadCommunityInfo.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__actions_dashboardFeed__ = __webpack_require__(
        /*! ../../../actions/dashboardFeed */ './src/actions/dashboardFeed.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__style__ = __webpack_require__(
        /*! ../style */ './src/views/dashboard/style.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/dashboard/components/inboxThread.js';

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

      var InboxThread = (function(_Component) {
        _inherits(InboxThread, _Component);

        function InboxThread() {
          _classCallCheck(this, InboxThread);

          return _possibleConstructorReturn(
            this,
            (InboxThread.__proto__ || Object.getPrototypeOf(InboxThread)).apply(
              this,
              arguments
            )
          );
        }

        _createClass(InboxThread, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _props = this.props,
                _props$data = _props.data,
                attachments = _props$data.attachments,
                participants = _props$data.participants,
                creator = _props$data.creator,
                data = _props.data,
                active = _props.active,
                hasActiveCommunity = _props.hasActiveCommunity,
                hasActiveChannel = _props.hasActiveChannel;

              var attachmentsExist = attachments && attachments.length > 0;
              var participantsExist = participants && participants.length > 0;
              var isPinned = data.id === this.props.pinnedThreadId;

              if (data.watercooler) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  WatercoolerThread,
                  {
                    data: data,
                    active: active,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 38,
                    },
                    __self: this,
                  }
                );
              }

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_9__style__['v' /* InboxThreadItem */],
                {
                  active: active,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 42,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__style__[
                    's' /* InboxLinkWrapper */
                  ],
                  {
                    to: {
                      pathname: window.location.pathname,
                      search:
                        window.innerWidth < 768
                          ? '?thread=' + data.id
                          : '?t=' + data.id,
                    },
                    onClick: function onClick(e) {
                      return (
                        window.innerWidth > 768 &&
                        !e.metaKey &&
                        _this2.props.dispatch(
                          Object(
                            __WEBPACK_IMPORTED_MODULE_8__actions_dashboardFeed__[
                              'c' /* changeActiveThread */
                            ]
                          )(data.id)
                        )
                      );
                    },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 43,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__style__[
                    'u' /* InboxThreadContent */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 54,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_7__threadCommunityInfo__[
                      'b' /* default */
                    ],
                    {
                      thread: data,
                      active: active,
                      activeCommunity: hasActiveCommunity,
                      activeChannel: hasActiveChannel,
                      isPinned: isPinned,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 55,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__style__['U' /* ThreadTitle */],
                    {
                      active: active,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 63,
                      },
                      __self: this,
                    },
                    __WEBPACK_IMPORTED_MODULE_6_shared_truncate___default()(
                      data.content.title,
                      80
                    )
                  ),
                  attachmentsExist &&
                    attachments
                      .filter(function(att) {
                        return att.attachmentType === 'linkPreview';
                      })
                      .map(function(att) {
                        var attData = JSON.parse(att.data);
                        var url = attData.trueUrl || attData.url;
                        if (!url) return null;

                        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_9__style__[
                            'a' /* AttachmentsContainer */
                          ],
                          {
                            active: active,
                            key: url,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 76,
                            },
                            __self: _this2,
                          },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_9__style__[
                              'D' /* MiniLinkPreview */
                            ],
                            {
                              href: url,
                              target: '_blank',
                              __source: {
                                fileName: _jsxFileName,
                                lineNumber: 77,
                              },
                              __self: _this2,
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                              __WEBPACK_IMPORTED_MODULE_4__components_icons__[
                                'a' /* default */
                              ],
                              {
                                glyph: 'link',
                                size: 18,
                                __source: {
                                  fileName: _jsxFileName,
                                  lineNumber: 78,
                                },
                                __self: _this2,
                              }
                            ),
                            url
                          )
                        );
                      }),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__style__['S' /* ThreadMeta */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 85,
                      },
                      __self: this,
                    },
                    (participantsExist || creator) &&
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_5__facepile__[
                          'a' /* default */
                        ],
                        {
                          active: active,
                          participants: participants,
                          creator: data.creator,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 87,
                          },
                          __self: this,
                        }
                      ),
                    data.messageCount > 0
                      ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_9__style__[
                            'B' /* MetaText */
                          ],
                          {
                            offset: participants.length,
                            active: active,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 95,
                            },
                            __self: this,
                          },
                          data.messageCount > 1
                            ? data.messageCount + ' messages'
                            : data.messageCount + ' message'
                        )
                      : __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          __WEBPACK_IMPORTED_MODULE_9__style__[
                            'C' /* MetaTextPill */
                          ],
                          {
                            offset: participants.length,
                            active: active,
                            new: true,
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 101,
                            },
                            __self: this,
                          },
                          'New thread!'
                        )
                  )
                )
              );
            },
          },
        ]);

        return InboxThread;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'b'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_3_react_router__['e' /* withRouter */]
      )(InboxThread);

      var WatercoolerThreadPure = (function(_React$Component) {
        _inherits(WatercoolerThreadPure, _React$Component);

        function WatercoolerThreadPure() {
          _classCallCheck(this, WatercoolerThreadPure);

          return _possibleConstructorReturn(
            this,
            (
              WatercoolerThreadPure.__proto__ ||
              Object.getPrototypeOf(WatercoolerThreadPure)
            ).apply(this, arguments)
          );
        }

        _createClass(WatercoolerThreadPure, [
          {
            key: 'render',
            value: function render() {
              var _this4 = this;

              var _props2 = this.props,
                _props2$data = _props2.data,
                participants = _props2$data.participants,
                creator = _props2$data.creator,
                community = _props2$data.community,
                messageCount = _props2$data.messageCount,
                id = _props2$data.id,
                active = _props2.active;

              var participantsExist = participants && participants.length > 0;

              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_9__style__['v' /* InboxThreadItem */],
                {
                  active: active,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 123,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__style__[
                    's' /* InboxLinkWrapper */
                  ],
                  {
                    to: {
                      pathname: window.location.pathname,
                      search:
                        window.innerWidth < 768 ? '?thread=' + id : '?t=' + id,
                    },
                    onClick: function onClick() {
                      return (
                        window.innerWidth > 768 &&
                        _this4.props.dispatch(
                          Object(
                            __WEBPACK_IMPORTED_MODULE_8__actions_dashboardFeed__[
                              'c' /* changeActiveThread */
                            ]
                          )(id)
                        )
                      );
                    },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 124,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_9__style__[
                    'u' /* InboxThreadContent */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 133,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_7__threadCommunityInfo__[
                      'a' /* WaterCoolerPill */
                    ],
                    {
                      active: active,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 134,
                      },
                      __self: this,
                    }
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__style__['U' /* ThreadTitle */],
                    {
                      active: active,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 135,
                      },
                      __self: this,
                    },
                    community.name,
                    ' Watercooler'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_9__style__['S' /* ThreadMeta */],
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 139,
                      },
                      __self: this,
                    },
                    (participantsExist || creator) &&
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_5__facepile__[
                          'a' /* default */
                        ],
                        {
                          active: active,
                          participants: participants,
                          creator: creator,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 141,
                          },
                          __self: this,
                        }
                      ),
                    messageCount > 0 &&
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_9__style__[
                          'B' /* MetaText */
                        ],
                        {
                          offset: participants.length,
                          active: active,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 149,
                          },
                          __self: this,
                        },
                        messageCount > 1
                          ? messageCount + ' messages'
                          : messageCount + ' message'
                      )
                  )
                )
              );
            },
          },
        ]);

        return WatercoolerThreadPure;
      })(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

      var WatercoolerThread = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_3_react_router__['e' /* withRouter */]
      )(WatercoolerThreadPure);

      /***/
    },

  /***/ './src/views/dashboard/components/loadingThreadFeed.js':
    /*!*************************************************************!*\
  !*** ./src/views/dashboard/components/loadingThreadFeed.js ***!
  \*************************************************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/dashboard/components/loadingThreadFeed.js',
        _this = this;

      /* harmony default export */ __webpack_exports__['a'] = function(props) {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 5,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__components_loading__[
              'f' /* LoadingInboxThread */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 6,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__components_loading__[
              'f' /* LoadingInboxThread */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 7,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__components_loading__[
              'f' /* LoadingInboxThread */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 8,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__components_loading__[
              'f' /* LoadingInboxThread */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 9,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__components_loading__[
              'f' /* LoadingInboxThread */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 10,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__components_loading__[
              'f' /* LoadingInboxThread */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 11,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__components_loading__[
              'f' /* LoadingInboxThread */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 12,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__components_loading__[
              'f' /* LoadingInboxThread */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 13,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__components_loading__[
              'f' /* LoadingInboxThread */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 14,
              },
              __self: _this,
            }
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1__components_loading__[
              'f' /* LoadingInboxThread */
            ],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 15,
              },
              __self: _this,
            }
          )
        );
      };

      /***/
    },

  /***/ './src/views/dashboard/components/threadCommunityInfo.js':
    /*!***************************************************************!*\
  !*** ./src/views/dashboard/components/threadCommunityInfo.js ***!
  \***************************************************************/
    /*! exports provided: default, WaterCoolerPill */
    /*! exports used: WaterCoolerPill, default */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return WaterCoolerPill;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(
        /*! react */ './node_modules/react/react.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_0_react__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_icons__ = __webpack_require__(
        /*! ../../../components/icons */ './src/components/icons/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style__ = __webpack_require__(
        /*! ../style */ './src/views/dashboard/style.js'
      );
      var _jsxFileName =
          '/Users/brianlovin/Sites/spectrum/src/views/dashboard/components/threadCommunityInfo.js',
        _this = this;

      /* harmony default export */ __webpack_exports__['b'] = function(_ref) {
        var thread = _ref.thread,
          active = _ref.active,
          activeCommunity = _ref.activeCommunity,
          activeChannel = _ref.activeChannel,
          isPinned = _ref.isPinned;
        var channel = thread.channel,
          community = thread.community;

        var isGeneral = channel.slug === 'general';
        if (activeCommunity && isGeneral && !isPinned) return null;
        if (activeChannel === channel.id) return null;

        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_2__style__[
            'f' /* CommunityInfoContainer */
          ],
          {
            active: active,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 28,
            },
            __self: _this,
          },
          !activeCommunity &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2__style__['b' /* AvatarLink */],
              {
                to: '/' + community.slug,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 30,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_2__style__['e' /* CommunityAvatar */],
                {
                  community: community,
                  src: community.profilePhoto + '?w=20&dpr=2',
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 31,
                  },
                  __self: _this,
                }
              )
            ),
          !activeCommunity &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2__style__['A' /* MetaCommunityName */],
              {
                to: '/' + community.slug,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 39,
                },
                __self: _this,
              },
              community.name
            ),
          !isGeneral &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2__style__['K' /* PillLink */],
              {
                className: 'pill',
                to: '/' + community.slug + '/' + channel.slug,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 45,
                },
                __self: _this,
              },
              channel.isPrivate &&
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_2__style__['z' /* Lock */],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 47,
                    },
                    __self: _this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_1__components_icons__[
                      'a' /* default */
                    ],
                    {
                      glyph: 'private',
                      size: 12,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 48,
                      },
                      __self: _this,
                    }
                  )
                ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_2__style__['J' /* PillLabel */],
                {
                  isPrivate: channel.isPrivate,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 51,
                  },
                  __self: _this,
                },
                channel.name
              )
            ),
          isPinned &&
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2__style__['L' /* PillLinkPinned */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 56,
                },
                __self: _this,
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_2__style__['M' /* PinIcon */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 57,
                  },
                  __self: _this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_1__components_icons__[
                    'a' /* default */
                  ],
                  {
                    glyph: 'pin-fill',
                    size: 12,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 58,
                    },
                    __self: _this,
                  }
                )
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_2__style__['J' /* PillLabel */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 60,
                  },
                  __self: _this,
                },
                'Pinned'
              )
            )
        );
      };

      var WaterCoolerPill = function WaterCoolerPill(_ref2) {
        var active = _ref2.active;
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_2__style__[
            'f' /* CommunityInfoContainer */
          ],
          {
            active: active,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 68,
            },
            __self: _this,
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__style__['L' /* PillLinkPinned */],
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 69,
              },
              __self: _this,
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_2__style__['J' /* PillLabel */],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 70,
                },
                __self: _this,
              },
              'Open chat'
            )
          )
        );
      };

      /***/
    },

  /***/ './src/views/dashboard/components/threadFeed.js':
    /*!******************************************************!*\
  !*** ./src/views/dashboard/components/threadFeed.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__(
        /*! react-router */ './node_modules/react-router/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_redux__ = __webpack_require__(
        /*! react-redux */ './node_modules/react-redux/es/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_infinite_scroller_with_scroll_element__ = __webpack_require__(
        /*! react-infinite-scroller-with-scroll-element */ './node_modules/react-infinite-scroller-with-scroll-element/dist/InfiniteScroll.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_infinite_scroller_with_scroll_element___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_4_react_infinite_scroller_with_scroll_element__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_flip_move__ = __webpack_require__(
        /*! react-flip-move */ './node_modules/react-flip-move/lib/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_flip_move___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_5_react_flip_move__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__helpers_utils__ = __webpack_require__(
        /*! ../../../helpers/utils */ './src/helpers/utils.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_loading__ = __webpack_require__(
        /*! ../../../components/loading */ './src/components/loading/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__actions_dashboardFeed__ = __webpack_require__(
        /*! ../../../actions/dashboardFeed */ './src/actions/dashboardFeed.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__loadingThreadFeed__ = __webpack_require__(
        /*! ./loadingThreadFeed */ './src/views/dashboard/components/loadingThreadFeed.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__errorThreadFeed__ = __webpack_require__(
        /*! ./errorThreadFeed */ './src/views/dashboard/components/errorThreadFeed.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__emptyThreadFeed__ = __webpack_require__(
        /*! ./emptyThreadFeed */ './src/views/dashboard/components/emptyThreadFeed.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__emptySearchFeed__ = __webpack_require__(
        /*! ./emptySearchFeed */ './src/views/dashboard/components/emptySearchFeed.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__inboxThread__ = __webpack_require__(
        /*! ./inboxThread */ './src/views/dashboard/components/inboxThread.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_viewNetworkHandler__ = __webpack_require__(
        /*! ../../../components/viewNetworkHandler */ './src/components/viewNetworkHandler/index.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/dashboard/components/threadFeed.js';

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

      // NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
      // I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside

      var ThreadFeed = (function(_React$Component) {
        _inherits(ThreadFeed, _React$Component);

        function ThreadFeed() {
          _classCallCheck(this, ThreadFeed);

          var _this = _possibleConstructorReturn(
            this,
            (ThreadFeed.__proto__ || Object.getPrototypeOf(ThreadFeed)).call(
              this
            )
          );

          _this.subscribe = function() {
            _this.setState({
              subscription:
                _this.props.data.subscribeToUpdatedThreads &&
                _this.props.data.subscribeToUpdatedThreads(),
            });
          };

          _this.unsubscribe = function() {
            var subscription = _this.state.subscription;

            if (subscription) {
              // This unsubscribes the subscription
              return Promise.resolve(subscription());
            }
          };

          _this.innerScrollElement = null;

          _this.state = {
            scrollElement: null,
            subscription: null,
          };
          return _this;
        }

        _createClass(ThreadFeed, [
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
              var _this2 = this;

              var isDesktop = window.innerWidth > 768;
              var scrollElement = this.state.scrollElement;
              var _props = this.props,
                mountedWithActiveThread = _props.mountedWithActiveThread,
                isFetchingMore = _props.isFetchingMore,
                queryString = _props.queryString;

              // user is searching, don't select anything

              if (queryString) {
                return;
              }

              // if the app loaded with a ?t query param, it means the user was linked to a thread from the inbox view and is already logged in. In this case we want to load the thread identified in the url and ignore the fact that a feed is loading in which auto-selects a different thread. If the user is on mobile, we should push them to the thread detail view
              if (this.props.data.threads && mountedWithActiveThread) {
                if (!isDesktop) {
                  this.props.history.replace(
                    '/?thread=' + mountedWithActiveThread
                  );
                }
                this.props.dispatch({ type: 'REMOVE_MOUNTED_THREAD_ID' });
                return;
              }

              if (
                // a thread has been selected
                ((!prevProps.selectedId && this.props.selectedId) ||
                  prevProps.selectedId !== this.props.selectedId ||
                  prevProps.activeCommunity !== this.props.activeCommunity) &&
                // elems exist
                this.innerScrollElement &&
                scrollElement &&
                // the threads height is less than the container scroll area
                this.innerScrollElement.offsetHeight <
                  scrollElement.offsetHeight &&
                // the component isn't currently fetching more
                !isFetchingMore
              ) {
                this.props.data.hasNextPage && this.props.data.fetchMore();
                return;
              }

              // don't select a thread if the composer is open
              if (prevProps.selectedId === 'new') return;

              var hasThreadsButNoneSelected =
                this.props.data.threads && !this.props.selectedId;
              var justLoadedThreads =
                (!prevProps.data.threads && this.props.data.threads) ||
                (prevProps.data.loading && !this.props.data.loading);

              if (
                isDesktop &&
                (hasThreadsButNoneSelected || justLoadedThreads) &&
                this.props.data.threads.length > 0 &&
                !prevProps.isFetchingMore
              ) {
                if (
                  (this.props.data.community &&
                    this.props.data.community.watercooler &&
                    this.props.data.community.watercooler.id) ||
                  (this.props.data.community &&
                    this.props.data.community.pinnedThread &&
                    this.props.data.community.pinnedThread.id)
                ) {
                  var selectId = this.props.data.community.watercooler
                    ? this.props.data.community.watercooler.id
                    : this.props.data.community.pinnedThread.id;

                  this.props.history.replace('/?t=' + selectId);
                  this.props.dispatch(
                    Object(
                      __WEBPACK_IMPORTED_MODULE_8__actions_dashboardFeed__[
                        'c' /* changeActiveThread */
                      ]
                    )(selectId)
                  );
                  return;
                }

                var threadNodes = this.props.data.threads
                  .slice()
                  .map(function(thread) {
                    return thread.node;
                  });
                var sortedThreadNodes = Object(
                  __WEBPACK_IMPORTED_MODULE_6__helpers_utils__[
                    'f' /* sortByDate */
                  ]
                )(threadNodes, 'lastActive', 'desc');
                var hasFirstThread = sortedThreadNodes.length > 0;
                var firstThreadId = hasFirstThread
                  ? sortedThreadNodes[0].id
                  : '';
                if (hasFirstThread) {
                  this.props.history.replace('/?t=' + firstThreadId);
                  this.props.dispatch(
                    Object(
                      __WEBPACK_IMPORTED_MODULE_8__actions_dashboardFeed__[
                        'c' /* changeActiveThread */
                      ]
                    )(firstThreadId)
                  );
                }
              }

              // if the user changes the feed from all to a specific community, we need to reset the active thread in the inbox and reset our subscription for updates
              if (
                (!prevProps.data.feed && this.props.data.feed) ||
                (prevProps.data.feed &&
                  prevProps.data.feed !== this.props.data.feed)
              ) {
                var _threadNodes = this.props.data.threads
                  .slice()
                  .map(function(thread) {
                    return thread.node;
                  });
                var _sortedThreadNodes = Object(
                  __WEBPACK_IMPORTED_MODULE_6__helpers_utils__[
                    'f' /* sortByDate */
                  ]
                )(_threadNodes, 'lastActive', 'desc');
                var _hasFirstThread = _sortedThreadNodes.length > 0;
                var _firstThreadId = _hasFirstThread
                  ? _sortedThreadNodes[0].id
                  : '';
                if (_hasFirstThread) {
                  this.props.history.replace('/?t=' + _firstThreadId);
                  this.props.dispatch(
                    Object(
                      __WEBPACK_IMPORTED_MODULE_8__actions_dashboardFeed__[
                        'c' /* changeActiveThread */
                      ]
                    )(_firstThreadId)
                  );
                }

                if (scrollElement) {
                  scrollElement.scrollTop = 0;
                }

                this.unsubscribe().then(function() {
                  return _this2.subscribe();
                });
              }
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
                scrollElement: document.getElementById('scroller-for-inbox'),
              });
              this.subscribe();
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this3 = this;

              var _props2 = this.props,
                _props2$data = _props2.data,
                threads = _props2$data.threads,
                networkStatus = _props2$data.networkStatus,
                selectedId = _props2.selectedId,
                activeCommunity = _props2.activeCommunity,
                queryString = _props2.queryString;
              var scrollElement = this.state.scrollElement;

              // loading state

              if (networkStatus !== 7 && networkStatus !== 3)
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_9__loadingThreadFeed__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 185,
                    },
                    __self: this,
                  }
                );

              // error
              if (networkStatus === 8)
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_10__errorThreadFeed__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 188,
                    },
                    __self: this,
                  }
                );

              // no threads yet
              if (threads.length === 0 && !queryString)
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_11__emptyThreadFeed__[
                    'a' /* default */
                  ],
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 191,
                    },
                    __self: this,
                  }
                );

              if (threads.length === 0 && queryString)
                return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_12__emptySearchFeed__[
                    'a' /* default */
                  ],
                  {
                    queryString: queryString,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 194,
                    },
                    __self: this,
                  }
                );

              var threadNodes = threads.slice().map(function(thread) {
                return thread.node;
              });

              var sortedThreadNodes = Object(
                __WEBPACK_IMPORTED_MODULE_6__helpers_utils__[
                  'f' /* sortByDate */
                ]
              )(threadNodes, 'lastActive', 'desc');
              if (activeCommunity) {
                sortedThreadNodes = sortedThreadNodes.filter(function(t) {
                  return !t.watercooler;
                });
              }

              var filteredThreads = sortedThreadNodes;
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

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                'div',
                {
                  'data-e2e-id': 'inbox-thread-feed',
                  ref: function ref(el) {
                    return (_this3.innerScrollElement = el);
                  },
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 225,
                  },
                  __self: this,
                },
                this.props.data.community &&
                  this.props.data.community.watercooler &&
                  this.props.data.community.watercooler.id &&
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_13__inboxThread__[
                      'a' /* WatercoolerThread */
                    ],
                    {
                      data: this.props.data.community.watercooler,
                      active:
                        selectedId === this.props.data.community.watercooler.id,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 232,
                      },
                      __self: this,
                    }
                  ),
                this.props.data.community &&
                  this.props.data.community.pinnedThread &&
                  this.props.data.community.pinnedThread.id &&
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_13__inboxThread__[
                      'b' /* default */
                    ],
                    {
                      data: this.props.data.community.pinnedThread,
                      active:
                        selectedId ===
                        this.props.data.community.pinnedThread.id,
                      hasActiveCommunity: this.props.hasActiveCommunity,
                      hasActiveChannel: this.props.hasActiveChannel,
                      pinnedThreadId: this.props.data.community.pinnedThread.id,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 241,
                      },
                      __self: this,
                    }
                  ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_4_react_infinite_scroller_with_scroll_element___default.a,
                  {
                    pageStart: 0,
                    loadMore: this.props.data.fetchMore,
                    hasMore: this.props.data.hasNextPage,
                    loader: __WEBPACK_IMPORTED_MODULE_0_react__[
                      'createElement'
                    ](
                      __WEBPACK_IMPORTED_MODULE_7__components_loading__[
                        'f' /* LoadingInboxThread */
                      ],
                      {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 253,
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
                      lineNumber: 249,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_5_react_flip_move___default.a,
                    {
                      duration: 350,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 259,
                      },
                      __self: this,
                    },
                    filteredThreads.map(function(thread) {
                      return __WEBPACK_IMPORTED_MODULE_0_react__[
                        'createElement'
                      ](
                        __WEBPACK_IMPORTED_MODULE_13__inboxThread__[
                          'b' /* default */
                        ],
                        {
                          key: thread.id,
                          data: thread,
                          active: selectedId === thread.id,
                          hasActiveCommunity: _this3.props.hasActiveCommunity,
                          hasActiveChannel: _this3.props.hasActiveChannel,
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 262,
                          },
                          __self: _this3,
                        }
                      );
                    })
                  )
                )
              );
            },
          },
        ]);

        return ThreadFeed;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      var map = function map(state) {
        return {
          mountedWithActiveThread: state.dashboardFeed.mountedWithActiveThread,
          activeCommunity: state.dashboardFeed.activeCommunity,
        };
      };
      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        __WEBPACK_IMPORTED_MODULE_2_react_router__['e' /* withRouter */],
        Object(__WEBPACK_IMPORTED_MODULE_3_react_redux__['a' /* connect */])(
          map
        ),
        __WEBPACK_IMPORTED_MODULE_14__components_viewNetworkHandler__[
          'a' /* default */
        ]
      )(ThreadFeed);

      /***/
    },

  /***/ './src/views/search/index.js':
    /*!***********************************!*\
  !*** ./src/views/search/index.js ***!
  \***********************************/
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__titlebar__ = __webpack_require__(
        /*! ../titlebar */ './src/views/titlebar/index.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__style__ = __webpack_require__(
        /*! ./style */ './src/views/search/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__api_thread__ = __webpack_require__(
        /*! ../../api/thread */ './src/api/thread.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dashboard_components_threadFeed__ = __webpack_require__(
        /*! ../dashboard/components/threadFeed */ './src/views/dashboard/components/threadFeed.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__dashboard_style__ = __webpack_require__(
        /*! ../dashboard/style */ './src/views/dashboard/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__searchInput__ = __webpack_require__(
        /*! ./searchInput */ './src/views/search/searchInput.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/search/index.js';

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

      var SearchThreadFeed = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])(),
        __WEBPACK_IMPORTED_MODULE_5__api_thread__['e' /* searchThreadsQuery */]
      )(
        __WEBPACK_IMPORTED_MODULE_6__dashboard_components_threadFeed__[
          'a' /* default */
        ]
      );

      var Search = (function(_React$Component) {
        _inherits(Search, _React$Component);

        function Search() {
          var _ref;

          var _temp, _this, _ret;

          _classCallCheck(this, Search);

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
                Search.__proto__ || Object.getPrototypeOf(Search)).call.apply(
                _ref,
                [this].concat(args)
              )
            )),
            _this)),
            (_this.state = { searchQueryString: '' }),
            (_this.handleSubmit = function(searchQueryString) {
              if (searchQueryString.length > 0) {
                _this.setState({ searchQueryString: searchQueryString });
              }
            }),
            _temp)),
            _possibleConstructorReturn(_this, _ret)
          );
        }

        _createClass(Search, [
          {
            key: 'render',
            value: function render() {
              var searchQueryString = this.state.searchQueryString;

              var searchFilter = { everythingFeed: true };

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_4__style__['e' /* View */],
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 33,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_3__titlebar__['a' /* default */],
                  {
                    provideBack: true,
                    noComposer: true,
                    title: 'Search',
                    style: { gridArea: 'header' },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 34,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_8__searchInput__['a' /* default */],
                  {
                    handleSubmit: this.handleSubmit,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 41,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_7__dashboard_style__[
                    't' /* InboxScroller */
                  ],
                  {
                    id: 'scroller-for-inbox',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 43,
                    },
                    __self: this,
                  },
                  searchQueryString &&
                    searchQueryString.length > 0 &&
                    searchFilter &&
                    __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                      SearchThreadFeed,
                      {
                        queryString: searchQueryString,
                        filter: searchFilter,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 47,
                        },
                        __self: this,
                      }
                    )
                )
              );
            },
          },
        ]);

        return Search;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'default'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()(
        Object(__WEBPACK_IMPORTED_MODULE_2_react_redux__['a' /* connect */])()
      )(Search);

      /***/
    },

  /***/ './src/views/search/searchInput.js':
    /*!*****************************************!*\
  !*** ./src/views/search/searchInput.js ***!
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
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose__ = __webpack_require__(
        /*! recompose/compose */ './node_modules/recompose/compose.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default = __webpack_require__.n(
        __WEBPACK_IMPORTED_MODULE_1_recompose_compose__
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style__ = __webpack_require__(
        /*! ./style */ './src/views/search/style.js'
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_icons__ = __webpack_require__(
        /*! ../../components/icons */ './src/components/icons/index.js'
      );
      var _jsxFileName =
        '/Users/brianlovin/Sites/spectrum/src/views/search/searchInput.js';

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

      var SearchViewInput = (function(_React$Component) {
        _inherits(SearchViewInput, _React$Component);

        function SearchViewInput() {
          var _ref;

          var _temp, _this, _ret;

          _classCallCheck(this, SearchViewInput);

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
                SearchViewInput.__proto__ ||
                Object.getPrototypeOf(SearchViewInput)).call.apply(
                _ref,
                [this].concat(args)
              )
            )),
            _this)),
            (_this.state = { isOpen: false, value: '', searchQueryString: '' }),
            (_this.open = function() {
              _this.setState({ isOpen: true });
              _this.searchInput.focus();
            }),
            (_this.close = function() {
              if (_this.state.value.length === 0) {
                _this.setState({ isOpen: false, searchQueryString: '' });
                _this.setState({ searchQueryString: '' });
              }
              _this.searchInput.blur();
            }),
            (_this.clearClose = function() {
              _this.setState({ value: '', searchQueryString: '' });
              _this.searchInput.focus();
            }),
            (_this.onChange = function(e) {
              _this.setState({ value: e.target.value });
            }),
            (_this.handleSubmit = function(e) {
              e.preventDefault();
              var searchString = _this.state.value.toLowerCase().trim();
              _this.props.handleSubmit(searchString);
            }),
            _temp)),
            _possibleConstructorReturn(_this, _ret)
          );
        }

        _createClass(SearchViewInput, [
          {
            key: 'render',
            value: function render() {
              var _this2 = this;

              var _state = this.state,
                value = _state.value,
                isOpen = _state.isOpen;

              var placeholder = 'Search for conversations...';

              return __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                __WEBPACK_IMPORTED_MODULE_2__style__['d' /* SearchWrapper */],
                {
                  isOpen: isOpen,
                  onClick: this.open,
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 48,
                  },
                  __self: this,
                },
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_3__components_icons__[
                    'a' /* default */
                  ],
                  {
                    glyph: 'search',
                    size: 32,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 49,
                    },
                    __self: this,
                  }
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_2__style__['a' /* ClearSearch */],
                  {
                    onClick: this.clearClose,
                    isVisible: isOpen && value.length > 0,
                    isOpen: isOpen,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 50,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    'span',
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 55,
                      },
                      __self: this,
                    },
                    '\xD7'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                  __WEBPACK_IMPORTED_MODULE_2__style__['b' /* SearchForm */],
                  {
                    onSubmit: this.handleSubmit,
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 57,
                    },
                    __self: this,
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react__['createElement'](
                    __WEBPACK_IMPORTED_MODULE_2__style__['c' /* SearchInput */],
                    {
                      isOpen: isOpen,
                      onBlur: this.close,
                      onChange: this.onChange,
                      value: value,
                      placeholder: placeholder,
                      innerRef: function innerRef(input) {
                        _this2.searchInput = input;
                      },
                      autoFocus: true,
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 58,
                      },
                      __self: this,
                    }
                  )
                )
              );
            },
          },
        ]);

        return SearchViewInput;
      })(__WEBPACK_IMPORTED_MODULE_0_react__['Component']);

      /* harmony default export */ __webpack_exports__[
        'a'
      ] = __WEBPACK_IMPORTED_MODULE_1_recompose_compose___default()()(
        SearchViewInput
      );

      /***/
    },

  /***/ './src/views/search/style.js':
    /*!***********************************!*\
  !*** ./src/views/search/style.js ***!
  \***********************************/
    /*! exports provided: View, SearchWrapper, SearchInput, ClearSearch, SearchStringHeader, SearchForm */
    /*! exports used: ClearSearch, SearchForm, SearchInput, SearchWrapper, View */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'e',
        function() {
          return View;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'd',
        function() {
          return SearchWrapper;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'c',
        function() {
          return SearchInput;
        }
      );
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'a',
        function() {
          return ClearSearch;
        }
      );
      /* unused harmony export SearchStringHeader */
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        'b',
        function() {
          return SearchForm;
        }
      );
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_styled_components__ = __webpack_require__(
        /*! styled-components */ './node_modules/styled-components/dist/styled-components.es.js'
      );

      var View = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__View',
        componentId: 's1c3h4t2-0',
      })([
        'display:flex;flex-direction:column;align-self:stretch;flex:auto;max-height:100vh;overflow:hidden;',
      ]);

      var SearchWrapper = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__SearchWrapper',
        componentId: 's1c3h4t2-1',
      })(
        [
          'color:',
          ';display:flex;align-items:center;flex:none;transition:all 0.2s;border-bottom:1px solid ',
          ';position:relative;.icon{position:absolute;top:50%;left:8px;transform:translate(-4px,-50%);cursor:pointer;border-radius:40px;}',
        ],
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.bg.border;
        }
      );

      var SearchInput = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].input.withConfig({
        displayName: 'style__SearchInput',
        componentId: 's1c3h4t2-2',
      })(
        [
          'padding:20px;padding-left:40px;font-size:16px;display:flex;flex:1;transition:all 0.2s;color:',
          ';padding-right:40px;&:focus{color:',
          ';}',
        ],
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.text.default;
        }
      );

      var ClearSearch = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].span.withConfig({
        displayName: 'style__ClearSearch',
        componentId: 's1c3h4t2-3',
      })(
        [
          'width:24px;height:24px;opacity:',
          ';display:flex;justify-content:center;align-items:center;background:',
          ';border-radius:50%;font-size:20px;position:absolute;right:4px;top:50%;color:',
          ';transform:translate(-4px,-50%);font-weight:500;pointer-events:',
          ';cursor:pointer;transition:all 0.2s;&:hover{background:',
          ';color:',
          ';}span{position:relative;top:-2px;}',
        ],
        function(props) {
          return props.isVisible ? '1' : '0';
        },
        function(props) {
          return props.theme.bg.border;
        },
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.isOpen ? 'auto' : 'none';
        },
        function(props) {
          return props.theme.text.alt;
        },
        function(props) {
          return props.theme.text.reverse;
        }
      );

      var SearchStringHeader = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].div.withConfig({
        displayName: 'style__SearchStringHeader',
        componentId: 's1c3h4t2-4',
      })(
        [
          'background:#fff;padding:16px;font-weight:600;border-bottom:1px solid ',
          ';',
        ],
        function(props) {
          return props.theme.bg.border;
        }
      );

      var SearchForm = __WEBPACK_IMPORTED_MODULE_0_styled_components__[
        'c' /* default */
      ].form.withConfig({
        displayName: 'style__SearchForm',
        componentId: 's1c3h4t2-5',
      })(['display:flex;flex:1;']);

      /***/
    },
});
//# sourceMappingURL=Search.chunk.js.map
