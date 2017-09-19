// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { zIndex, Truncate } from '../../components/globals';

export const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  flex: auto;
`;

export const DashboardWrapper = props => (
  <Wrapper id="scroller-for-inbox">{props.children}</Wrapper>
);

export const InboxWrapper = styled.div`
  display: flex;
  flex: 0 0 33%;
  max-width: 420px;
  min-width: 240px;
  overflow-y: hidden;
  position: relative;
  align-self: stretch;
  background: ${props => props.theme.bg.wash};
  box-shadow: 1px 0 0 0 ${props => props.theme.border.default};
`;

export const InboxScroller = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  position: relative;
`;

export const ThreadWrapper = styled.div`
  display: flex;
  flex: auto;
  overflow-y: hidden;
  position: relative;
  align-self: stretch;
`;

export const ThreadScroller = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  position: relative;
`;

export const InboxThreadItem = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${props => props.theme.border.default};
  background: ${props => props.theme.bg.default};
  position: relative;
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
`;

export const InboxThreadContent = styled.div`
  align-self: flex-start;
  position: relative;
  z-index: ${zIndex.card + 1};
  align-items: flex-start;
  pointer-events: none;
  width: 100%;
`;

export const ThreadTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  margin: 8px 16px 0;
  max-width: 100%;
  ${Truncate};
`;

export const AttachmentsContainer = styled.div`margin: 8px 16px 0;`;

export const ThreadMeta = styled.div`
  display: flex;
  margin: 8px 16px 16px;
`;

export const FacepileContainer = styled.div`
  display: flex;
  margin-right: 8px;
`;

export const ParticipantHead = styled.span`
  position: relative;
  left: -${props => props.offset * 8}px;
  border-radius: 24px;
  box-shadow: 0 0 0 2px ${props => props.theme.bg.default};
`;

export const EmptyParticipantHead = styled(ParticipantHead)`
  background: ${props => props.theme.bg.wash};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
`;

export const MetaText = styled.span`
  font-size: 14px;
  color: ${props => (props.new ? props.theme.warn.alt : props.theme.text.alt)};
  font-weight: ${props => (props.new ? 600 : 400)};

  a {
    font-weight: 600;
  }

  a:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const CommunityInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 16px 0;
`;

export const AvatarLink = styled(Link)`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 4px;
  overflow: hidden;
`;

export const CommunityAvatar = styled.img`
  width: 100%;
  height: 100%;
`;

export const CommunityLink = styled(Link)`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  line-height: 1.28;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const PillLink = styled(Link)`
  display: inline-block;
  height: 20px;
  box-shadow: 0 0 0 1px ${props => props.theme.border.default};
  border-radius: 4px;
  overflow: hidden;
  padding: 4px 8px;
  background: ${props => props.theme.bg.wash};
  font-size: 12px;
  font-weight: 400;
  max-height: 24px;
  line-height: 1;
  color: ${props => props.theme.text.alt};

  &:hover {
    color: ${props => props.theme.text.default};
    background: ${props => props.theme.bg.reverse};
  }
`;
