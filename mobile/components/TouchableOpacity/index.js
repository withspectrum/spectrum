// @flow
import React, { type ChildrenArray } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  children?: ChildrenArray<any>,
};

export default ({ children, ...props }: Props) => (
  <TouchableOpacity activeOpacity={0.6} {...props}>
    {children}
  </TouchableOpacity>
);
