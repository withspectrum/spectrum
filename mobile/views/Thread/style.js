// @flow
import styled from 'styled-components/native';

export const Wrapper = styled.View`
  background-color: ${props => props.theme.bg.default};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ThreadTitle = styled.Text`
  font-size: 28px;
  font-weight: 900;
  color: ${props => props.theme.text.default};
`;

export const ThreadContentContainer = styled.View`
  margin: 24px 16px 32px;
  display: flex;
  flex: 1;
`;

export const ThreadTimestamp = styled.Text`
  margin: 16px 0 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text.placeholder};
`;
