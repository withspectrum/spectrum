// @flow
import styled from 'styled-components/native';
import { Stylesheet } from 'react-native';
import Avatar from '../Avatar';

export const InboxThreadItem = styled.View`
  display: flex;
  flex-direction: column;
  border-bottom-color: ${props => props.theme.bg.border};
  border-bottom-width: 1px;
  background: ${props => props.theme.bg.default};
  position: relative;
  padding: 16px;
`;

export const InboxThreadContent = styled.View``;

export const ThreadTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  margin: 12px 16px;
  max-width: 100%;
  line-height: 1.4;
`;

export const ThreadMeta = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 15px;
`;

export const MetaText = styled.Text`
  font-size: 14px;
  color: ${props => (props.new ? props.theme.warn.alt : props.theme.text.alt)};
  font-weight: ${props => (props.new ? 600 : 400)};
`;

export const MetaTextPill = styled(MetaText)`
  color: ${props => props.theme.text.reverse};
  background: ${props => props.theme.success.alt};
  border-radius: 10px;
  font-size: 12px;
  padding: 3px 10px 3px 10px;
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

const stackizeHeads = (
  component,
  { marginRight = '-10px', borderWidth = '2px', borderColor = '#FFFFFF' } = {}
) => styled(component)`
  margin-right: ${marginRight};
  border-width: ${borderWidth};
  border-color: ${borderColor};
`;

export const StackedEmptyParticipantHead = stackizeHeads(EmptyParticipantHead);
export const StackedAvatar = stackizeHeads(Avatar);
