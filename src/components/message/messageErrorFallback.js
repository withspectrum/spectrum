// @flow
import * as React from 'react';
import { Text } from './style';

class MessageErrorFallback extends React.Component<{}> {
  render() {
    return (
      <Text error>
        We encountered an error loading this message - the Spectrum team has
        been alerted.
      </Text>
    );
  }
}

export default MessageErrorFallback;
