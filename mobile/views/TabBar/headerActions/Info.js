// @flow
import * as React from 'react';
import type { NavigationProps } from 'react-navigation';
import Icon from '../../../components/Icon';

type Props = {
  onPress: Function,
};

const Info = ({ onPress }: Props) => {
  return (
    <Icon
      style={{ marginRight: 16 }}
      glyph="info"
      size={32}
      onPress={onPress}
      color={theme => theme.text.default}
    />
  );
};

export default Info;
