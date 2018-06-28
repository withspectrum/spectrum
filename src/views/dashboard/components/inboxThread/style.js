// @flow
import styled from 'styled-components';
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
  align-self: stretch;
  position: relative;
  z-index: ${zIndex.card + 1};
  align-items: flex-start;
  pointer-events: none;
  padding: 16px;
  width: 100%;
`;

export const ThreadTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.default};
  margin-bottom: 8px;
  max-width: 100%;
  line-height: 1.4;
`;

export const ThreadActivityWrapper = styled.div`
  display: flex;
  margin-top: 16px;
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
  margin-top: 2px;
  color: ${props =>
    props.new
      ? props.active ? props.theme.text.reverse : props.theme.warn.alt
      : props.active ? props.theme.text.reverse : props.theme.text.alt};
  font-weight: 600;
  align-items: center;

  > span {
    margin-left: 4px;
  }

  a {
    font-weight: 600;
  }

  a:hover {
    color: ${props => props.theme.text.default};
  }

  ${Tooltip};
`;

export const AvatarLink = styled(Link)`
  display: flex;
  flex: 1 0 auto;
  align-self: stretch;
  height: 32px;
  width: 32px;
  margin-right: 16px;
  pointer-events: auto;
  border-radius: 4px;
  overflow: hidden;
`;
