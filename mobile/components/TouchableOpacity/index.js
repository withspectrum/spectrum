// @flow
import * as React from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  children?: React.ChildrenArray<any>,
};

export default ({ children, ...props }: Props) => (
  <TouchableOpacity activeOpacity={0.6} {...props}>
    {children}
  </TouchableOpacity>
);
