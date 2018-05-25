// @flow
import * as React from 'react';
import { TouchableHighlight } from 'react-native';
import theme from '../../../shared/theme';

type Props = {
  children?: React.ChildrenArray<any>,
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
