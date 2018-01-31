// @flow
import React from 'react';
import Text from '../Text';

type Props = {
  children: string,
};

export default (props: Props) => {
  return (
    <Text fontFamily="monospace" type="body">
      {props.children}
    </Text>
  );
};
