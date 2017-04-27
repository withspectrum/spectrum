// @flow
import React from 'react';
// $FlowFixMe
import { func, node, number, object, shape, string } from 'prop-types';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import debounceFn from 'lodash/debounce';

class ScrollManager extends React.Component {
  static propTypes = {
    children: node.isRequired,
    history: shape({
      action: string.isRequired,
      push: func.isRequired,
      replace: func.isRequired,
    }).isRequired,
    location: object,
    onLocationChange: func,
    scrollCaptureDebounce: number,
    scrollSyncDebounce: number,
    scrollSyncAttemptLimit: number,
  };

  static defaultProps = {
    scrollCaptureDebounce: 50,
    scrollSyncDebounce: 100,
    scrollSyncAttemptLimit: 5,
  };

  constructor(props) {
    super(props);

    this.scrollSyncData = {
      x: 0,
      y: 0,
      attemptsRemaining: props.scrollSyncAttemptLimit,
    };

    const scrollCapture = () => {
      requestAnimationFrame(() => {
        const { pageXOffset: x, pageYOffset: y } = window;
        const { pathname } = this.props.location;

        // use browser history instead of router history
        // to avoid infinite history.replace loop
        const historyState = window.history.state || {};
        const { state = {} } = historyState;
        if (
          !state.scroll ||
          state.scroll.x !== pageXOffset ||
          state.scroll.y !== pageYOffset
        ) {
          window.history.replaceState(
            {
              ...historyState,
              state: { ...state, scroll: { x, y } },
            },
            null,
            pathname
          );
        }
      });
    };

    const _scrollSync = () => {
      requestAnimationFrame(() => {
        const { x, y, attemptsRemaining } = this.scrollSyncData;

        if (attemptsRemaining < 1) {
          return;
        }

        const { pageXOffset, pageYOffset } = window;
        if (
          y < window.document.body.scrollHeight &&
          (x !== pageXOffset || y !== pageYOffset)
        ) {
          window.scrollTo(x, y);
          this.scrollSyncData.attemptsRemaining = attemptsRemaining - 1;
          _scrollSync();
        }
      });
    };

    const scrollSync = (x = 0, y = 0) => {
      this.scrollSyncData = {
        x,
        y,
        attemptsRemaining: this.props.scrollSyncAttemptLimit,
      };
      _scrollSync();
    };

    this.debouncedScroll = debounceFn(
      scrollCapture,
      props.scrollCaptureDebounce
    );
    this.debouncedScrollSync = debounceFn(scrollSync, props.scrollSyncDebounce);
  }

  componentWillMount() {
    const { location, onLocationChange } = this.props;
    if (onLocationChange) {
      onLocationChange(location);
    }
  }

  componentDidMount() {
    this.onPop(this.props);
    window.addEventListener('scroll', this.debouncedScroll, { passive: true });
  }

  componentWillUnmount() {
    this.scrollSyncPending = false;
    window.removeEventListener('scroll', this.debouncedScroll, {
      passive: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    switch (nextProps.history.action) {
      case 'PUSH':
      case 'REPLACE':
        this.onPush();
        break;
      case 'POP':
        this.onPop(nextProps);
        break;
      default:
        console.warn(
          `Unrecognized location change action! "${nextProps.history.action}"`
        );
    }
    if (nextProps.onLocationChange) {
      nextProps.onLocationChange(nextProps.location);
    }
  }

  onPush() {
    this.debouncedScrollSync(0, 0);
  }

  onPop({ location: { state = {} } }) {
    // attempt location restore
    const { x = 0, y = 0 } = state.scroll || {};
    this.debouncedScrollSync(x, y);
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollManager);
