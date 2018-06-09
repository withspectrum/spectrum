// @flow
import * as React from 'react';
import { withTheme } from 'styled-components';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Animated } from 'react-native';
import { removeToast, type AddToastType } from '../../actions/toasts';
import type { State as ReduxState } from '../../reducers';
import Toast from './Toast';
import { Container } from './style';
import { getToastColorFromType } from './utils';

type Props = {|
  toasts: Array<?AddToastType>,
  theme: Object,
  dispatch: Function,
|};

type State = {
  activeToastColor: string,
};

class Toasts extends React.Component<Props, State> {
  animatedValue = new Animated.Value(0);
  opacityValue = new Animated.Value(0);
  containerTimeoutTiming = 4000;
  animationDuration = 200;
  removeToastTimeoutTiming = this.containerTimeoutTiming +
    this.animationDuration;

  state = {
    activeToastColor: 'transparent',
  };

  componentDidUpdate(prevProps) {
    const currProps = this.props;
    const { theme, dispatch } = currProps;

    const receivedNewToast = currProps.toasts.length > prevProps.toasts.length;
    const receivedFirstToast =
      prevProps.toasts.length === 0 && currProps.toasts.length === 1;

    const getActiveToast = () => {
      const toast = currProps.toasts[currProps.toasts.length - 1];

      return {
        ...toast,
        color: getToastColorFromType(toast.type, theme),
      };
    };

    // received a new toast
    if (receivedFirstToast) {
      console.log('FIRST');
      const activeToast = getActiveToast();
      this.setState({ activeToastColor: activeToast.color });
      this.showContainer();
      setTimeout(() => this.hideContainer(), this.containerTimeoutTiming);
      setTimeout(
        () => dispatch(removeToast(activeToast.id)),
        this.removeToastTimeoutTiming
      );
      return;
    }

    if (receivedNewToast) {
      console.log('NEW');
      const activeToast = getActiveToast();
      this.setState({ activeToastColor: activeToast.color });
      setTimeout(() => this.hideContainer(), this.containerTimeoutTiming);
      setTimeout(
        () => dispatch(removeToast(activeToast.id)),
        this.removeToastTimeoutTiming
      );
      return;
    }
  }

  animateContainer = (val: 'in' | 'out') => {
    return Animated.timing(this.animatedValue, {
      toValue: val === 'in' ? 1 : 0,
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
    console.log('showing container');
    return Animated.parallel([
      this.animateContainer('in'),
      this.animateContainerOpacity('in'),
    ]).start();
  };

  hideContainer = () => {
    console.log('hiding container');
    Animated.parallel([
      this.animateContainer('out'),
      this.animateContainerOpacity('out'),
    ]).start();
  };

  render() {
    const { toasts } = this.props;
    if (!toasts || toasts.length === 0) return null;

    return (
      <Container>
        <Animated.View
          style={{
            backgroundColor: this.state.activeToastColor,
            opacity: this.opacityValue,
            transform: [{ scaleX: this.animatedValue }],
          }}
        >
          {toasts.map(toast => {
            if (!toast) return null;
            return (
              <Toast
                key={toast.id}
                z={toast.id}
                icon={toast.icon ? toast.icon : null}
                type={toast.type}
                message={toast.message}
                onPressHandler={toast.onPressHandler}
              />
            );
          })}
        </Animated.View>
      </Container>
    );
  }
}

const map = (state: ReduxState): * => ({ toasts: state.toasts });
export default compose(connect(map), withTheme)(Toasts);
