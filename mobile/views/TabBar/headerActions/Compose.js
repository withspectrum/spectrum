// @flow
import * as React from 'react';
import type { NavigationProps } from 'react-navigation';
import Icon from '../../../components/Icon';

type Props = {
  onPress: Function,
};

const Compose = ({ onPress }: Props) => {
  return (
    <Icon
      style={{ marginRight: 16, marginLeft: 16 }}
      glyph="post"
      size={32}
      onPress={onPress}
      color={theme => theme.text.default}
    />
  );
};

export default Compose;
