// @flow
import React, { type ChildrenArray } from 'react';
import { TouchableHighlight } from 'react-native';
import theme from '../../../shared/theme';

type Props = {
  children?: ChildrenArray<any>,
};

export default ({ children, ...props }: Props) => (
  <TouchableHighlight
    underlayColor={theme.bg.wash}
    style={{ borderRadius: 4 }}
    {...props}
  >
    {children}
  </TouchableHighlight>
);
