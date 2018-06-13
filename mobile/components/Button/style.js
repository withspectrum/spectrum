// @flow
import styled, { css, withTheme } from 'styled-components/native';

export const ButtonView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 12px 16px;
  background-color: ${props =>
    props.color ? props.color(props) : props.theme.brand.alt};

  ${props =>
    props.state === 'disabled' &&
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
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  color: ${props => props.theme.text.reverse};

  ${props =>
    props.size === 'large' &&
    css`
      font-size: 18px;
      line-height: 18px;
    `};
`;
