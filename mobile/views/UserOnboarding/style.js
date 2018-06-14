// @flow
import styled, { css } from 'styled-components/native';

export const UserOnboardingWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
`;

export const Spacer = styled.View`
  ${props =>
    props.vertical &&
    css`
      margin-top: ${props.vertical * 8}px;
      margin-bottom: ${props.vertical * 8}px;
    `};
`;

export const UsernameInput = styled.TextInput.attrs({
  autoCapitalize: 'none',
  autoCorrect: false,
})`
  background: ${props => props.theme.bg.default};
  width: 100%;
  padding: 12px 24px;
  border-width: 2px;
  border-color: ${props => props.theme.bg.border};
  border-radius: 8px;
`;
