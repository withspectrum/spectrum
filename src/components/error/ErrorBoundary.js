// @flow
import * as React from 'react';
import BlueScreen from '.';

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
    window.Raven && window.Raven.captureException(error, { extra: errorInfo });
  };

  render() {
    const { error } = this.state;
    const { fallbackComponent: FallbackComponent, children } = this.props;

    if (error) {
      if (this.props.fallbackComponent) {
        // $FlowFixMe
        return <FallbackComponent />;
      }

      if (this.props.fallbackComponent === null) {
        return null;
      }

      return <BlueScreen />;
    }

    return children;
  }
}

export default ErrorBoundary;
