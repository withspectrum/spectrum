// @flow
import React from 'react';
import { WebView, Dimensions } from 'react-native';

const width = Dimensions.get('window').width - 32;

type Props = {
  src: string,
};

const IFrame = (props: Props) => {
  return (
    <WebView
      source={{ uri: props.src }}
      style={{
        height: 200,
        width,
        backgroundColor: '#fff',
        marginTop: 24,
        marginBottom: 24,
      }}
    />
  );
};

export default IFrame;
