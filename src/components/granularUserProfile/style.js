// @flow
import styled from 'styled-components';
import { Tooltip, Truncate } from '../globals';

export const Content = styled.div`
  border-bottom: 1px solid ${props => props.theme.bg.wash};
  padding: 12px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: ${props =>
      props.avatarSize ? `${props.avatarSize}px` : '32px'} minmax(0px, 1fr) 32px;
  grid-template-rows: 1fr auto;
  grid-template-areas: 'avatar name action' '. description .';
  grid-column-gap: 16px;
  grid-row-gap: 8px;
  padding: 12px 16px;
  background: ${props => props.theme.bg.default};
  border-bottom: 1px solid ${props => props.theme.bg.wash};

  &:last-of-type {
    > ${Content} {
      border-bottom: 0;
    }
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
  }
`;

export const Name = styled.span`
  color: ${props => props.theme.text.default};
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  vertical-align: middle;
  ${Truncate};

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const Username = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  font-weight: 400;
  margin: 0px 4px;
  line-height: 1;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const Description = styled.p`
  grid-area: description;
  font-size: 14px;
  color: ${props => props.theme.text.alt};
`;

export const MessageIcon = styled.div`
  color: ${props => props.theme.brand.alt};
  cursor: pointer;
  ${Tooltip};
`;

export const Actions = styled.div`
  grid-area: action;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
`;
