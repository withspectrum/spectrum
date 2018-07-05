// @flow
import styled, { css } from 'styled-components';
import Link from 'src/components/link';
import { zIndex, Tooltip } from 'src/components/globals';

export const InboxThreadItem = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  min-width: 0;
  overflow-x: hidden;
  border-bottom: 1px solid
    ${props => (props.active ? props.theme.brand.alt : props.theme.bg.border)};
  background: ${props =>
    props.active ? props.theme.brand.alt : props.theme.bg.default};
  position: relative;
  padding: 12px 20px 12px 12px;

  &:hover {
    background: ${props =>
      props.active ? props.theme.brand.alt : props.theme.bg.wash};
  }

  &:last-of-type {
    border-bottom: 1px solid
      ${props => (props.active ? props.theme.brand.alt : props.theme.bg.border)};
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
  font-size: 16px;
  font-weight: ${props => (props.new ? '600' : '400')};
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.default};
  max-width: 100%;
  line-height: 1.4;
`;

export const ThreadActivityWrapper = styled.div`
  display: flex;
  margin-top: 12px;
  align-items: center;

  .icon {
    pointer-events: auto;

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
  color: ${props =>
    props.new
      ? props.active ? props.theme.text.reverse : props.theme.warn.alt
      : props.active ? props.theme.text.reverse : props.theme.text.alt};
  font-weight: 600;
  align-items: center;

  .icon {
    margin-right: 4px;
  }

  a {
    font-weight: 600;
  }

  a:hover {
    color: ${props => props.theme.text.default};
  }

  ${Tooltip};
`;

export const NewCount = styled.span`
  margin-left: 6px;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.warn.alt};
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
