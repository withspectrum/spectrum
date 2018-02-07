// @flow
import styled from 'styled-components/native';
import { Stylesheet } from 'react-native';

export const InboxThreadItem = styled.View`
  display: flex;
  flex-direction: column;
  border-bottom-color: ${props => props.theme.bg.border};
  border-bottom-width: 1px;
  background: ${props => props.theme.bg.default};
  position: relative;
`;

export const InboxThreadContent = styled.View`
  align-self: flex-start;
  position: relative;
  align-items: flex-start;
  width: 100%;
`;

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
  margin: 10px 16px 16px;
  justify-content: space-between;
`;

export const MetaText = styled.Text`
  font-size: 14px;
  color: ${props => (props.new ? props.theme.warn.alt : props.theme.text.alt)};
  font-weight: ${props => (props.new ? 600 : 400)};
  position: relative;
  top: 4px;
`;

export const MetaTextPill = styled(MetaText)`
  color: ${props => props.theme.text.reverse};
  background: ${props => props.theme.warn.alt};
  border-radius: 20px;
  padding: 0 12px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

export const FacepileContainer = styled.View`
  display: flex;
  margin-right: 8px;
  margin-left: 8px;
`;

export const ParticipantHead = styled.View`
  position: relative;
  margin-left: -8px;
  border-radius: 24px;
  max-width: 24px;
  max-height: 24px;
  shadowColor:  ${props => props.theme.bg.default};
  shadowOffset: { width: 0, height: 0 };
  shadowOpacity: 1;
  shadowRadius: 2;
  transform: translateY(0);
`;

export const EmptyParticipantHead = styled.View`
  background: ${props => props.theme.bg.wash};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  shadowColor:  ${props => props.theme.bg.default};
  shadowOffset: { width: 0, height: 0 };
  shadowOpacity: 1;
  shadowRadius: 2;
  width: 24px;
  height: 24px;
  max-width: 24px;
  max-height: 24px;
  position: relative;
  margin-left: -8px;
  border-radius: 24px;
  transform: translateY(0);
`;
