// @flow
import React from 'react';
import { WebView } from 'react-native';

type Props = {
  src: string,
};

const IFrame = (props: Props) => {
  return (
    <WebView
      source={{ uri: props.src }}
      style={{ height: 100, width: 400, backgroundColor: 'red' }}
    />
  );
};

export default IFrame;
