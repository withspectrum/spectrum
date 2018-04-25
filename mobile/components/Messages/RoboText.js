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
  background-color: ${props => props.theme.bg.border};
`;

type Props = {
  children: string,
};

export default ({ children }: Props) => {
  return (
    <RoboWrapper>
      <Hr />
      <Text
        style={{ marginRight: 8, marginLeft: 8 }}
        color={props => props.theme.text.alt}
      >
        {children}
      </Text>
      <Hr />
    </RoboWrapper>
  );
};
