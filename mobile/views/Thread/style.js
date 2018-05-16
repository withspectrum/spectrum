// @flow
import styled from 'styled-components/native';
import { TouchableHighlight } from 'react-native';

export const Wrapper = styled.View`
  background-color: ${props => props.theme.bg.default};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ThreadMargin = styled.View`
  padding: 16px;
  flex: 1;
`;

export const CommunityHeaderTouchableWrapper = styled(TouchableHighlight)`
  flex: 1;
  flex-direction: row;
  padding: 14px 14px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.bg.border};
`;

export const CommunityHeaderContainer = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

export const CommunityName = styled.Text`
  font-size: 16px;
  margin-left: 16px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
`;
