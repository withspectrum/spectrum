// @flow
// This component is shown as a full replacement for the entire app in production whenever an error happens that would otherwise crash the app
import React from 'react';
import { FullScreen, Title, Text } from './style';
import { Button } from '../buttons';

type Props = {
  error: Error,
  componentStack: string,
};

const BlueScreen = (props: Props) => {
  return (
    <FullScreen>
      <Title>Something went wrong 😢</Title>
      <Text>
        Sorry about the technical issues. Brian, Bryn and Max have been notified
        of the problem and should resolve it soon.
      </Text>
      <Button onClick={() => window.location.reload()} icon="view-reload">
        Refresh the page
      </Button>
    </FullScreen>
  );
};

export default BlueScreen;
