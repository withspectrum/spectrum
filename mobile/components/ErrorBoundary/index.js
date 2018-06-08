// @flow
import * as React from 'react';
import Sentry from 'sentry-expo';
import DefaultErrorScreen from './Default';

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
    console.log('should capture an exception');
    this.setState({ error });
    Sentry.captureException(error, { extra: errorInfo });
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

      return <DefaultErrorScreen />;
    }

    return children;
  }
}

export default ErrorBoundary;
