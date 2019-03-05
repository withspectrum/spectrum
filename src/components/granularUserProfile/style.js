// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { Tooltip, Truncate } from '../globals';

export const Row = styled.div`
  display: grid;
  grid-template-columns: ${props =>
      props.avatarSize ? `${props.avatarSize}px` : '32px'} minmax(0px, 1fr) 32px;
  grid-template-rows: ${props =>
    props.multiAction ? '1fr auto auto' : '1fr auto'};
  grid-template-areas: ${props =>
    props.multiAction
      ? `'avatar name message' 'action action action' '. description .'`
      : `'avatar name action' '. description .'`};
  grid-column-gap: 12px;
  padding: 12px;
  align-items: center;
  width: 100%;
  background: ${theme.bg.default};
  border-bottom: 1px solid ${theme.bg.divider};

  &:last-of-type {
    border-bottom: 0;
  }

  > div {
    align-self: center;
  }

  > a {
    grid-area: name;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: center;

    > span {
      ${Truncate};
      max-width: 100%;
    }
  }

  &:hover {
    background: ${theme.bg.wash};
    cursor: pointer;
  }
`;

export const Name = styled.div`
  color: ${theme.text.default};
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  display: flex;
  ${Truncate};
`;

export const Username = styled.span`
  font-size: 15px;
  color: ${theme.text.alt};
  font-weight: 400;
  margin-top: 2px;
  line-height: 1.2;

  &:hover {
    color: ${theme.text.default};
  }
`;

export const Description = styled.p`
  grid-area: description;
  font-size: 15px;
  line-height: 1.3;
  color: ${theme.text.default};
  margin-top: 6px;
`;

export const MessageIcon = styled.div`
  grid-area: message;
  color: ${theme.text.secondary};
  cursor: pointer;
  ${Tooltip};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${theme.text.default};
  }
`;

export const Actions = styled.div`
  grid-area: action;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  position: relative;
  z-index: 10;
`;
