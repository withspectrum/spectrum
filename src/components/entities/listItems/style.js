// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import { Truncate } from 'src/components/globals';
import { Link } from 'react-router-dom';
import { hexa } from 'src/components/globals';

export const CardLink = styled(Link)`
  display: block;
  position: relative;
`;

export const Row = styled.div`
  padding: 12px 16px;
  align-items: center;
  display: grid;
  grid-template-rows: auto;
  grid-template-areas: 'content actions';
  grid-template-columns: 1fr auto;
  background: ${props =>
    props.isActive ? hexa(theme.text.default, 0.04) : theme.bg.default};
  border-bottom: 1px solid ${theme.bg.divider};
  grid-gap: 16px;

  &:hover {
    background: ${theme.bg.wash};
    cursor: pointer;
  }

  ${props =>
    props.isActive &&
    css`
      box-shadow: inset 3px 0 0 ${theme.text.default};
    `}
`;

export const RowWithAvatar = styled.div`
  padding: 12px 16px;
  align-items: center;
  display: grid;
  grid-template-areas: 'avatar content actions';
  grid-template-columns: min-content 1fr auto;
  grid-template-rows: auto;
  background: ${theme.bg.default};
  border-bottom: 1px solid ${theme.bg.divider};
  grid-gap: 16px;
  flex: 1;

  &:hover {
    background: ${theme.bg.wash};
    cursor: pointer;
  }
`;

export const UserAvatarContainer = styled.div`
  height: 40px;
  grid-area: avatar;
  align-self: flex-start;
`;

export const CommunityAvatarContainer = styled.div`
  height: 32px;
  grid-area: avatar;
  align-self: flex-start;
`;

export const Content = styled.div`
  grid-area: content;
  display: grid;
`;

export const Label = styled.div`
  color: ${theme.text.default};
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  display: inline-block;
  align-items: center;
  min-width: 0;
  ${Truncate};

  .icon {
    color: ${theme.text.secondary};
    margin-right: 6px;
    position: relative;
    top: 1px;
  }
`;

export const Sublabel = styled.span`
  font-size: 15px;
  color: ${theme.text.alt};
  font-weight: 400;
  line-height: 1.2;
  display: inline-block;
  ${Truncate};
`;

export const Description = styled.p`
  font-size: 15px;
  line-height: 1.3;
  color: ${theme.text.default};
  margin-top: 6px;
  padding-right: 24px;
  word-break: break-word;
`;

export const Actions = styled.div`
  grid-area: actions;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  justify-content: flex-start;
  position: relative;
  z-index: 10;
  color: ${theme.text.alt};
  flex: 1;
  padding-top: 4px;
`;

export const ChannelActions = styled(Actions)`
  flex-direction: row;
  padding: 12px 16px 12px 12px;
`;

export const ChannelRow = styled(Row)`
  padding: 0;
`;

export const ChannelContent = styled(Content)`
  padding: 12px 16px;
`;
