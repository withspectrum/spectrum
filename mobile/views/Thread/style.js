// @flow
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';

export const Wrapper = styled.View`
  background-color: ${props => props.theme.bg.default};
  align-items: center;
  flex: 1;
  justify-content: center;
`;

export const ThreadTitle = styled.Text`
  font-size: 28px;
  font-weight: 900;
  color: ${props => props.theme.text.default};
`;

export const ThreadContentContainer = styled.View`
  margin: 24px 16px 32px;
`;

export const ThreadTimestamp = styled.Text`
  margin: 16px 0 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text.placeholder};
`;

export const ThreadScrollView = styled(ScrollView)`
  width: 100%;
`;
