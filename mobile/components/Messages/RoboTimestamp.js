// @flow
import React from 'react';
import styled from 'styled-components/native';
import Text from '../Text';
import { convertTimestampToDate } from '../../../src/helpers/utils';

const TimestampWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Hr = styled.View`
  height: 1px;
  flex: 1;
  background-color: ${props => props.theme.bg.border};
`;

type Props = {
  timestamp: Date | number,
};

export default ({ timestamp }: Props) => {
  return (
    <TimestampWrapper key={timestamp}>
      <Hr />
      <Text
        style={{ marginRight: 8, marginLeft: 8 }}
        color={props => props.theme.text.alt}
        key={timestamp}
      >
        {convertTimestampToDate(timestamp)}
      </Text>
      <Hr />
    </TimestampWrapper>
  );
};
