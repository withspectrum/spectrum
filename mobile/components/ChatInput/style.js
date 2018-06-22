// @flow
import styled from 'styled-components/native';
import { TextInput } from 'react-native';

export const ChatInputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 0px;
  padding: 8px 4px;
  background-color: ${props => props.theme.bg.default};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.bg.border};
`;

export const ChatInputTextInputWrapper = styled.View`
  flex: 1;
  flex-direction: column;
  min-height: 40px;
  padding: ${props => (props.hasAttachment ? '16px' : '0 16px')};
  border-radius: 24px;
  border-width: 1px;
  border-color: ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
  justify-content: center;
`;

export const ChatTextInput = styled(TextInput).attrs({
  underlineColorAndroid: 'transparent',
})`
  display: flex;
  justify-content: center;
  font-size: 16px;
  padding-top: 0;
`;
