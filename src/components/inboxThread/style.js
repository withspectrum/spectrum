// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { zIndex, hexa } from 'src/components/globals';

export const InboxThreadItem = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  min-width: 0;
  overflow-x: hidden;
  border-bottom: 1px solid
    ${props => (props.active ? props.theme.brand.alt : props.theme.bg.divider)};
  background: ${props =>
    props.active
      ? props.theme.brand.alt
      : props.new
      ? hexa(theme.brand.default, 0.04)
      : props.theme.bg.default};
  position: relative;
  padding: 12px 20px 12px 12px;

  ${props =>
    props.new &&
    css`
      box-shadow: inset 2px 0 0 ${theme.brand.default};
    `}

  &:hover {
    background: ${props =>
      props.active
        ? props.theme.brand.alt
        : props.new
        ? hexa(theme.brand.default, 0.06)
        : props.theme.bg.wash};
  }

  &:last-of-type {
    border-bottom: 1px solid
      ${props =>
        props.active ? props.theme.brand.alt : props.theme.bg.divider};
  }
`;

export const InboxLinkWrapper = styled(Link)`
  position: absolute;
  display: inline-block;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.card};

  &:hover {
    cursor: pointer;
  }
`;

export const InboxThreadContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-self: stretch;
  position: relative;
  z-index: ${zIndex.card + 1};
  align-items: flex-start;
  pointer-events: none;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-items: flex-start;
`;

export const ThreadTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.default};
  max-width: 100%;
  line-height: 1.4;
`;

export const ThreadSnippet = styled.h4`
  font-size: 15px;
  font-weight: 400;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.default};
  max-width: 100%;
  line-height: 1.4;
  margin-top: 4px;
  word-break: break-word;
  white-space: pre-line;
`;

export const ThreadActivityWrapper = styled.div`
  display: flex;
  margin-top: 8px;
  align-items: center;
  pointer-events: none;

  .icon {
    &:hover {
      cursor: pointer;
    }
  }
`;

export const ThreadStatusWrapper = styled(ThreadActivityWrapper)`
  flex: auto;
  justify-content: flex-start;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};

  .icon {
    pointer-events: auto;

    &:hover {
      cursor: pointer;
    }
  }
`;

export const CountWrapper = styled.div`
  display: flex;
  flex: none;
  font-size: 13px;
  pointer-events: none;
  color: ${props =>
    props.new
      ? props.active
        ? props.theme.text.reverse
        : props.theme.warn.alt
      : props.active
      ? props.theme.text.reverse
      : props.theme.text.alt};
  font-weight: 500;
  align-items: center;

  .icon {
    margin-right: 4px;
  }

  a {
    font-weight: 600;
  }

  a:hover {
    color: ${theme.text.default};
  }
`;

const avatarLinkStyles = css`
  display: flex;
  flex: 1 0 auto;
  margin-right: 12px;
  margin-top: 4px;
  pointer-events: auto;
  max-width: 40px;
`;

export const AvatarLink = styled.div`
  ${avatarLinkStyles} border-radius: 32px;
`;

export const CommunityAvatarLink = styled.div`
  ${avatarLinkStyles} border-radius: 4px;
`;
