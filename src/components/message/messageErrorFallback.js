// @flow
import * as React from 'react';
import {
  Text,
  OuterMessageContainer,
  GutterContainer,
  InnerMessageContainer,
} from './style';

class MessageErrorFallback extends React.Component<{}> {
  render() {
    return (
      <OuterMessageContainer error data-cy="message">
        <GutterContainer />

        <InnerMessageContainer>
          <Text error>
            Something went wrong loading this message. The Spectrum team has
            been alerted and will investigate soon.
          </Text>
        </InnerMessageContainer>
      </OuterMessageContainer>
    );
  }
}

export default MessageErrorFallback;
