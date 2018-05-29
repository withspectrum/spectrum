// @flow
import React, { Fragment } from 'react';
import Text from '../Text';
import Icon from '../Icon';
import Row from '../Flex/Row';

type Props = {
  count: number,
  hasReacted?: boolean,
  onPress?: Function,
  style?: Object,
};

const Reactions = ({ count, hasReacted, onPress, style }: Props) => {
  if (count === 0) return null;

  const textColor = ({ theme }) =>
    hasReacted ? theme.warn.default : theme.text.alt;
  const iconColor = theme => (hasReacted ? theme.warn.default : theme.text.alt);
  return (
    <Row alignItems="center" style={style}>
      <Icon onPress={onPress} glyph="like-fill" size={16} color={iconColor} />
      <Text type="caption1" color={textColor} style={{ marginLeft: 4 }}>
        {count}
      </Text>
    </Row>
  );
};

export default Reactions;
