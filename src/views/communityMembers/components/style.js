// @flow
import styled from 'styled-components';
import { Tooltip } from '../../../components/globals';

export const Row = styled.div`
  background: ${props => props.theme.bg.default};
  width: 100%;
`;

export const Content = styled.div`
  border-bottom: 1px solid ${props => props.theme.bg.wash};
  padding: 12px 0;
  display: flex;
  align-items: center;
`;

export const AvatarContent = styled.div`
  display: flex;
  align-self: flex-start;
  justify-content: center;
  margin-right: 16px;
  padding-top: 4px;
`;

export const MetaContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex: auto;
  padding-right: 16px;
`;

export const NameContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Name = styled.h3`
  color: ${props => props.theme.text.default};
  font-size: 15px;
  font-weight: 600;
  margin-right: 6px;
  line-height: 1.2;

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

export const Edit = styled.p`
  display: inline-block;
  color: ${props => props.theme.text.alt};
  font-size: 14px;

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
  font-size: 14px;
  margin-bottom: 2px;
  color: ${props => props.theme.text.alt};
`;

export const Website = styled.p`
  display: block;
  color: ${props => props.theme.text.alt};
  font-size: 14px;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const MessageIcon = styled.div`
  color: ${props => props.theme.brand.alt};
  cursor: pointer;
  ${Tooltip} top: 2px;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
`;
