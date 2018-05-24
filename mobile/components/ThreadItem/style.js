// @flow
import styled, { css } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import Avatar from '../Avatar';

export const InboxThreadContent = styled.View``;

export const ThreadTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text.default};
  margin: 0 0 8px;
  max-width: 100%;
`;

export const ThreadMeta = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

export const MetaText = styled.Text`
  font-size: 14px;
  color: ${props => (props.new ? props.theme.warn.alt : props.theme.text.alt)};
  font-weight: ${props => (props.new ? 600 : 400)};
`;

export const MessageCount = styled.Text`
  color: ${props => props.theme.text.alt};
`;

export const MetaTextPill = styled(MetaText)`
  color: ${props => props.theme.text.reverse};
  background: ${props => props.theme.success.alt};
  border-radius: 11px;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 12px;
  overflow: hidden;
`;

export const FacepileContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const EmptyParticipantHead = styled.Text`
  color: ${props => props.theme.text.alt};
  background: ${props => props.theme.bg.wash};
  border-radius: ${props => (props.radius ? `${props.radius}px` : '15px')};
  text-align: center;
  text-align-vertical: center;
  font-size: 12px;
  font-weight: 600;
  height: ${props => (props.size ? `${props.size}px` : '30px')};
  width: ${props => (props.size ? `${props.size}px` : '30px')};
  overflow: hidden;
`;

export const ThreadCommunityInfoWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 12px;
`;

export const ThreadCommunityName = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  margin-right: 8px;
`;

export const ThreadChannelPill = styled(TouchableOpacity)`
  padding: 2px 8px;
  background: ${props => props.theme.bg.wash};
  border: 1px solid ${props => props.theme.bg.border};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ThreadChannelName = styled.Text`
  color: ${props => props.theme.text.alt};
  font-size: 12px;
`;

const stackingStyles = css`
  margin-right: -10px;
  border-width: 2px;
  border-color: #ffffff;
`;

export const StackedEmptyParticipantHead = styled(EmptyParticipantHead)`
  ${stackingStyles};
`;

export const StackedAvatar = styled(Avatar)`
  ${stackingStyles};
`;
