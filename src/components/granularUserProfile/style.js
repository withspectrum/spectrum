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
  grid-template-columns: 32px minmax(0px, 1fr) 32px;
  grid-template-rows: 1fr auto;
  grid-template-areas: 'avatar name action' '. description .';
  grid-column-gap: 16px;
  padding: 12px 16px;
  background: ${props => props.theme.bg.default};
  border-bottom: 1px solid ${props => props.theme.bg.wash};

  &:last-of-type {
    > ${Content} {
      border-bottom: 0;
    }
  }

  > a {
    grid-area: name;
    display: flex;
    align-items: center;
  }
`;

export const Name = styled.h3`
  color: ${props => props.theme.text.default};
  font-size: 15px;
  font-weight: 600;
  margin-right: 6px;
  line-height: 1.2;
  ${Truncate};

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const Username = styled.h4`
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  font-weight: 400;
  margin-right: 8px;
  line-height: 1.1;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const BadgeContent = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 4px;
`;

export const Description = styled.p`
  grid-area: description;
  font-size: 14px;
  margin-bottom: 2px;
  color: ${props => props.theme.text.alt};
`;

export const MessageIcon = styled.div`
  color: ${props => props.theme.brand.alt};
  cursor: pointer;
  ${Tooltip} top: 2px;
`;

export const Actions = styled.div`
  grid-area: action;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
`;
