// @flow
import styled from 'styled-components/native';
import TouchableOpacity from '../../components/TouchableOpacity';

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

export const CommunityHeaderContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.bg.border};
`;

export const CommunityName = styled.Text`
  font-size: 16px;
  margin-left: 12px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
`;

export const ThreadChannelPill = styled(TouchableOpacity)`
  padding: 2px 8px;
  background: ${props => props.theme.bg.wash};
  border: 1px solid ${props => props.theme.bg.border};
  border-radius: 4px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ThreadChannelName = styled.Text`
  color: ${props => props.theme.text.alt};
  font-size: 13px;
`;
