// @flow
import styled from 'styled-components/native';
import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

export const Container = styled.View`
  padding: 8px 4px;
  width: 100%;
`;

export const MessageGroupContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  max-width: ${props => (props.me ? width : width - 32)};
`;

export const BubbleGroupContainer = styled.View`
  display: flex;
  flex: 1;
`;

export const AuthorAvatarContainer = styled.View`
  align-self: flex-end;
`;

export const NameContainer = styled.View`
  display: flex;
  flex-direction: row;
  margin-bottom: 4px;
`;

export const Name = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
`;

export const Username = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
`;

export const RoboWrapper = styled.View`
  flex-direction: row;
  flex: 1;
  flex-shrink: 0;
  justify-content: center;
  width: 100%;
  align-items: center;
  margin: 24px 0 16px;
  width: 100%;
`;

export const Hr = styled.View`
  height: 1px;
  border-bottom-color: ${props => props.color(props.theme)};
  border-bottom-width: ${props => StyleSheet.hairlineWidth};
  flex: 1;
`;

export const TextWrapper = styled.View`
  display: flex;
`;

export const RoboText = styled.Text`
  margin: 0 8px;
  color: ${props => props.color(props.theme)};
`;
