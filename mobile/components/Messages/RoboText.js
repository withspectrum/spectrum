// @flow
import React from 'react';
import styled from 'styled-components/native';
import Text from '../Text';

const RoboWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Hr = styled.View`
  height: 1px;
  flex: 1;
  background-color: ${props => props.color || props.theme.bg.border};
`;

type Props = {
  children: string,
  color?: string | Function,
  style?: Object | number,
};

export default ({ children, color, style }: Props) => {
  return (
    <RoboWrapper style={style}>
      <Hr color={color} />
      <Text
        style={{ marginRight: 8, marginLeft: 8 }}
        color={color || (props => props.theme.text.alt)}
      >
        {children}
      </Text>
      <Hr color={color} />
    </RoboWrapper>
  );
};
