// @flow
import * as React from 'react';
import Sentry from 'sentry-expo';
import { Alert } from 'react-native';

type State = {
  error: ?any,
};

type Props = {
  children: any,
  fallbackComponent?: ?any,
  alert?: boolean,
};

class ErrorBoundary extends React.Component<Props, State> {
  state = { error: null };

  componentDidCatch = (error: any, errorInfo: any) => {
    this.setState({ error });
    Sentry.captureException(error, { extra: errorInfo });
  };

  render() {
    const { error } = this.state;
    const {
      fallbackComponent: FallbackComponent,
      alert = false,
      children,
    } = this.props;

    if (error) {
      if (alert) {
        Alert.alert(
          'Something went wrong',
          'An error occured and our team has been notified - please restart the Spectrum app'
        );
        return null;
      }

      if (this.props.fallbackComponent) {
        // $FlowFixMe
        return <FallbackComponent />;
      }

      return null;
    }

    return children;
  }
}

export default ErrorBoundary;
