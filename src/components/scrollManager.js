//@flow
import React from 'react';
// $FlowFixMe
import { func, node, object, shape, string } from 'prop-types';
// $FlowFixMe
import { withRouter } from 'react-router';

const listenWaitTime = 50;
const syncAttemptWaitTime = 100;
const syncMaxWaitTime = 1000;

class ScrollManager extends React.Component {
  static propTypes = {
    children: node.isRequired,
    history: shape({
      action: string.isRequired,
      push: func.isRequired,
      replace: func.isRequired,
    }).isRequired,
  };

  scrollListenInterval = null;
  scrollSyncInterval = null;
  resetScroll = false;
  hasScrolledA = false;
  hasScrolledB = false;

  componentWillMount() {
    const { history } = this.props;
    window.addEventListener('scroll', this.setScrollHappened, {
      passive: true,
    });
    this.scrollListenInterval = setInterval(this.onScroll, listenWaitTime);
  }

  componentDidMount() {
    this.onPop(this.props);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.setScrollHappened, {
      passive: true,
    });
    clearInterval(this.scrollListenInterval);
  }

  componentWillReceiveProps(nextProps) {
    switch (nextProps.history.action) {
      case 'PUSH':
        this.onPush();
        break;
      case 'POP':
        this.onPop(nextProps);
        break;
      case 'REPLACE':
        return;
      default:
        console.warn(
          `Unrecognized location change action! "${nextProps.history.action}"`
        );
    }
  }

  setScrollHappened = () => {
    this.hasScrolledA = true;
    this.hasScrolledB = true;
  };

  onScroll = () => {
    if (this.resetScroll) {
      this.resetScroll = false;
      window.scrollTo(0, 0);
      return;
    }
    if (!this.hasScrolledB) return;
    if (this.hasScrolledA) {
      this.hasScrolledA = false;
      return;
    }
    this.hasScrolledB = false;

    // record and store location
    const { pageXOffset: x, pageYOffset: y } = window;
    const { location, history } = this.props;
    const { pathname, state = {} } = location;
    if (
      !state.scroll ||
      state.scroll.x !== pageXOffset ||
      state.scroll.y !== pageYOffset
    ) {
      history.replace(pathname, { ...state, scroll: { x, y } });
    }
  };

  onPush() {
    // reset scroll
    this.resetScroll = true;
  }

  onPop({ location: { state = {} } }) {
    // attempt location restore
    const { x, y } = state.scroll || {};

    if (this.scrollSyncInterval != null) clearInterval(this.scrollSyncInterval);

    this.scrollSyncInterval = setInterval(() => {
      const { pageXOffset, pageYOffset } = window;
      if (x !== pageXOffset || y !== pageYOffset) {
        window.scrollTo(x, y);
      } else {
        clearInterval(this.scrollSyncInterval);
        this.scrollSyncInterval = null;
      }
    }, syncAttemptWaitTime);

    setTimeout(() => {
      if (this.scrollSyncInterval != null) {
        clearInterval(this.scrollSyncInterval);
        this.scrollSyncInterval = null;
      }
    }, syncMaxWaitTime);
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollManager);
