// @flow
import * as React from 'react';
import BlueScreen from './BlueScreen';

type State = {
  error: ?any,
};

type Props = {
  children: any,
  fallbackComponent?: ?any,
};

class ErrorBoundary extends React.Component<Props, State> {
  state = { error: null };

  componentDidCatch = (error: any, errorInfo: any) => {
    this.setState({ error });
    console.error({ error });
    window.Raven && window.Raven.captureException(error, { extra: errorInfo });
  };

  render() {
    const { error } = this.state;
    const {
      fallbackComponent: FallbackComponent = null,
      children,
    } = this.props;

    if (error) {
      if (this.props.fallbackComponent) {
        // $FlowFixMe
        return <FallbackComponent />;
      }

      if (!this.props.fallbackComponent) {
        return null;
      }

      return <BlueScreen />;
    }

    return children;
  }
}

export default ErrorBoundary;
