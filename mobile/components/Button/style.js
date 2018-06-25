// @flow
import styled, { css } from 'styled-components/native';
import { Animated } from 'react-native';

export const ButtonView = styled(Animated.View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  padding: 8px;
  background-color: ${props =>
    props.color ? props.color(props) : props.theme.brand.alt};

  ${props =>
    props.disabled &&
    css`
      background-color: ${props.theme.bg.inactive};
    `};

  ${props =>
    props.size === 'large' &&
    css`
      padding: 16px 32px;
    `};
`;

export const ButtonText = styled.Text`
  font-weight: 700;
  font-size: 15px;
  line-height: 21;
  color: ${props => props.theme.text.reverse};

  ${props =>
    props.size === 'large' &&
    css`
      font-size: 18px;
      line-height: 18px;
    `};

  ${props =>
    props.icon &&
    css`
      margin-left: 12px;
    `};
`;

export const ButtonIcon = styled.View`
  display: flex;
  height: 21px;
  align-items: center;
  justify-content: center;
`;
