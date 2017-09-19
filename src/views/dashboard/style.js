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

export const InboxWrapper = styled.div`
  display: flex;
  flex: 0 0 33%;
  max-width: 420px;
  min-width: 240px;
  overflow-y: hidden;
  position: relative;
  align-self: stretch;
  background: ${props => props.theme.bg.wash};
  box-shadow: 1px 0 0 0 ${props => props.theme.bg.border};
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

export const CreateThreadComposer = styled(Link)`
  font-size: 18px;
  font-weight: 400;
  padding: 8px 16px;
  border-top: 1px solid ${props => props.theme.bg.border};
  border-bottom: 1px solid ${props => props.theme.bg.border};
  display: flex;
  color: ${props => props.theme.text.alt};
  align-items: center;
  margin: 8px 0;
  justify-content: space-between;
  background: ${props => props.theme.bg.default};
`;

export const ComposeIconContainer = styled.div`
  margin-right: 12px;
  opacity: 0.6;
  position: relative;
  top: 2px;
`;

export const ChevronIconContainer = styled.div`
  align-self: flex-end;
  display: flex;
  opacity: 0.4;
  position: relative;
  top: -4px;
`;

export const ComposerLeft = styled.div`
  display: flex;
  align-items: center;
`;

export const InboxThreadItem = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid
    ${props => (props.active ? props.theme.brand.alt : props.theme.bg.border)};
  background: ${props =>
    props.active ? props.theme.brand.alt : props.theme.bg.default};
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
  font-weight: ${props => (props.active ? '600' : '400')};
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.default};
  margin: 8px 16px 0;
  max-width: 100%;
  pointer-events: all;
  ${Truncate};
`;

export const AttachmentsContainer = styled.div`margin: 8px 16px 0;`;

export const ThreadMeta = styled.div`
  display: flex;
  margin: 8px 16px 16px;
  pointer-events: all;
`;

export const FacepileContainer = styled.div`
  display: flex;
  margin-right: 8px;
  pointer-events: all;
`;

export const ParticipantHead = styled.span`
  position: relative;
  left: -${props => props.offset * 8}px;
  border-radius: 24px;
  pointer-events: all;
  box-shadow: 0 0 0 2px
    ${props => (props.active ? props.theme.brand.alt : props.theme.bg.default)};
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
  color: ${props =>
    props.new
      ? props.active ? props.theme.text.reverse : props.theme.warn.alt
      : props.active ? props.theme.text.reverse : props.theme.text.alt};
  font-weight: ${props => (props.new ? 600 : 400)};
  position: relative;
  ${props => {
    if (props.offset > 5) {
      return `left: -24px;`;
    } else if (props.offset === 5) {
      return `left: -20px;`;
    } else if (props.offset > 1) {
      return `left: -${props.offset * 4}px;`;
    } else {
      return `left: 0;`;
    }
  }} a {
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
  pointer-events: all;
  overflow: hidden;
`;

export const CommunityAvatar = styled.img`
  width: 100%;
  height: 100%;
  pointer-events: all;
`;

export const CommunityLink = styled(Link)`
  font-size: 14px;
  font-weight: 400;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  line-height: 1.28;
  pointer-events: all;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const PillLink = styled(Link)`
  display: inline-block;
  height: 20px;
  box-shadow: 0 0 0 1px
    ${props =>
      props.active ? props.theme.text.reverse : props.theme.bg.border};
  border-radius: 4px;
  overflow: hidden;
  padding: 4px 8px;
  background: ${props =>
    props.active ? props.theme.text.reverse : props.theme.bg.wash};
  font-size: 12px;
  font-weight: 400;
  max-height: 24px;
  line-height: 1;
  pointer-events: all;
  color: ${props =>
    props.active ? props.theme.brand.alt : props.theme.text.alt};

  &:hover {
    color: ${props =>
      props.active ? props.theme.brand.alt : props.theme.text.default};
    background: ${props =>
      props.active ? props.theme.text.reverse : props.theme.bg.wash};
    box-shadow: 0 0 0 1px
      ${props =>
        props.active ? props.theme.text.reverse : props.theme.text.alt};
  }
`;

export const MiniLinkPreview = styled(Link)`
  display: flex;
  font-size: 14px;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  font-weight: ${props => (props.active ? '500' : '400')};
  margin: 0 0 8px;
  align-items: center;
  pointer-events: all;
  ${Truncate} .icon {
    margin-right: 4px;
  }

  &:hover {
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.default};
  }
`;
