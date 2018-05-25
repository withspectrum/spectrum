// @flow
import styled, { css } from 'styled-components/native';
import Avatar from '../Avatar';

const stackingStyles = css`
  margin-right: -10px;
  border-width: 2px;
  border-color: #ffffff;
`;

export const StackedAvatar = styled(Avatar)`
  ${stackingStyles};
`;

export const FacepileContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
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

export const StackedEmptyParticipantHead = styled(EmptyParticipantHead)`
  ${stackingStyles};
`;
