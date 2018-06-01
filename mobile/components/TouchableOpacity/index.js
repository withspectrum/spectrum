// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  children?: React$Node,
};

export default ({ children, ...props }: Props) => (
  <TouchableOpacity activeOpacity={0.6} {...props}>
    {children}
  </TouchableOpacity>
);
