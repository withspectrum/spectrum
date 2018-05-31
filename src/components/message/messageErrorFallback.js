// @flow
import * as React from 'react';
import { Text } from './style';

type Props = {
  me: boolean,
};

class MessageErrorFallback extends React.Component<Props> {
  render() {
    const { me } = this.props;

    return (
      <Text me={me} error>
        We encountered an error loading this message - the Spectrum team has
        been alerted.
      </Text>
    );
  }
}

export default MessageErrorFallback;
