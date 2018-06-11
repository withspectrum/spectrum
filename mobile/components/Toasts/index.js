// @flow
import * as React from 'react';
import { withTheme } from 'styled-components';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Animated, Dimensions } from 'react-native';
import { removeToast, type ToastType } from '../../actions/toasts';
import type { State as ReduxState } from '../../reducers';
import Toast from './Toast';
import { Container, ToastContainer } from './style';
import { getToastColorFromType } from './utils';

const width = Dimensions.get('window').width;

type Props = {|
  toasts: Array<?ToastType>,
  theme: Object,
  dispatch: Function,
|};

type State = {
  activeToast: ?ToastType,
};

class Toasts extends React.Component<Props, State> {
  leftBlockPosition = new Animated.Value(-width);
  opacityValue = new Animated.Value(0);
  containerTimeoutTiming = 3000;
  animationDuration = 250;
  removeToastTimeoutTiming = this.containerTimeoutTiming +
    this.animationDuration;
  hideContainerTimeout = undefined;

  state = {
    activeToast: null,
  };

  componentDidUpdate(prevProps) {
    const currProps = this.props;
    const { dispatch } = currProps;

    const receivedNewToast = currProps.toasts.length > prevProps.toasts.length;
    const receivedFirstToast =
      prevProps.toasts.length === 0 && currProps.toasts.length === 1;
    const lastToastRemoved =
      currProps.toasts.length === 0 && prevProps.toasts.length > 0;

    if (lastToastRemoved) {
      return this.setState({ activeToast: null });
    }

    if (currProps.toasts.length === 0) return;

    const getActiveToast = () => {
      const toast = currProps.toasts[currProps.toasts.length - 1];
      if (!toast) return null;
      return {
        ...toast,
      };
    };

    const setActiveToast = () => {
      const activeToast = getActiveToast();
      if (!activeToast) return;
      this.setState({ activeToast });
      setTimeout(
        () => dispatch(removeToast(activeToast.id)),
        this.removeToastTimeoutTiming
      );
    };

    if (receivedFirstToast) {
      setActiveToast();
      this.showContainer();
      this.hideContainerTimeout = setTimeout(
        () => this.hideContainer(),
        this.containerTimeoutTiming
      );
      return;
    }

    if (receivedNewToast) {
      clearTimeout(this.hideContainerTimeout);
      return setActiveToast();
    }
  }

  animateContainerPosition = (val: 'in' | 'out') => {
    return Animated.timing(this.leftBlockPosition, {
      toValue: val === 'in' ? 0 : width,
      duration: this.animationDuration,
      useNativeDriver: true,
    });
  };

  animateContainerOpacity = (val: 'in' | 'out') => {
    return Animated.timing(this.opacityValue, {
      toValue: val === 'in' ? 1 : 0,
      duration: this.animationDuration,
      useNativeDriver: true,
    });
  };

  showContainer = () => {
    return Animated.parallel([
      this.animateContainerPosition('in'),
      this.animateContainerOpacity('in'),
    ]).start();
  };

  hideContainer = () => {
    Animated.parallel([
      this.animateContainerPosition('out'),
      this.animateContainerOpacity('out'),
    ]).start();
  };

  render() {
    const { theme } = this.props;
    const { activeToast } = this.state;

    if (!activeToast) return null;

    return (
      <Container>
        <ToastContainer
          style={{
            backgroundColor: getToastColorFromType(activeToast.type, theme),
            opacity: this.opacityValue,
            transform: [{ translateX: this.leftBlockPosition }],
          }}
        >
          <Toast
            icon={activeToast.icon ? activeToast.icon : null}
            type={activeToast.type}
            message={activeToast.message}
            onPressHandler={activeToast.onPressHandler}
          />
        </ToastContainer>
      </Container>
    );
  }
}

const map = (state: ReduxState): * => ({ toasts: state.toasts });
export default compose(connect(map), withTheme)(Toasts);
