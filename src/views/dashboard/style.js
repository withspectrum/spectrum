// @flow
import React from 'react';
// $FlowFixMe
import styled, { css } from 'styled-components';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { zIndex, Truncate, Tooltip } from '../../components/globals';

export const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: hidden;
  flex: auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const InboxWrapper = styled.div`
  display: flex;
  flex: 0 0 25%;
  max-width: 528px;
  min-width: 320px;
  overflow-y: hidden;
  position: relative;
  align-self: stretch;
  flex-direction: column;
  background: ${props => props.theme.bg.wash};
  border-right: 1px solid ${props => props.theme.bg.border};

  @media (max-width: 768px) {
    max-width: 100%;
    flex: auto;
  }
`;

export const InboxScroller = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  position: relative;
`;

export const CommunityListWrapper = styled.div`
  display: flex;
  width: 60px;
  overflow-y: hidden;
  position: relative;
  align-self: stretch;
  flex-direction: column;
  background: ${props => props.theme.bg.wash};
  border-right: 1px solid ${props => props.theme.bg.border};
`;

export const CommunityListItem = styled.div`
  width: 40px;
  height: 40px;
  margin: 16px auto;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;

  ${props =>
    props.active &&
    css`
      box-shadow: 0 0 0 2px ${props.theme.brand.default};
    `} &:hover {
    transition: all 0.2s ease-in-out;

    ${props =>
      props.active
        ? css`
            box-shadow: 0 0 0 2px ${props.theme.brand.default};
          `
        : css`
            box-shadow: 0 0 0 2px ${props.theme.bg.border};
          `};
  }
`;

export const AllCommunityListItem = styled(CommunityListItem)`
  background: ${props => props.theme.bg.border};
`;

export const CommunityListAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  cursor: pointer;
`;

export const CommunityListScroller = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  position: relative;
`;

export const FeedHeaderContainer = styled.div`
  background: ${props => props.theme.bg.default};
  padding: 8px 16px;
  box-shadow: 0 1px 0 0 ${props => props.theme.bg.border},
    0 1px 3px rgba(0, 0, 0, 0.01);
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ThreadWrapper = styled.div`
  display: flex;
  flex: auto;
  overflow-y: hidden;
  position: relative;
  align-self: stretch;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ThreadScroller = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  position: relative;
`;

export const CreateThreadComposer = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const ComposeIconContainer = styled.div`
  position: relative;
  top: 2px;
  color: ${props => props.theme.brand.alt};
`;

export const InboxThreadItem = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid
    ${props => (props.active ? props.theme.brand.alt : props.theme.bg.border)};
  background: ${props =>
    props.active ? props.theme.brand.alt : props.theme.bg.default};
  position: relative;

  &:hover {
    background: ${props =>
      props.active ? props.theme.brand.alt : props.theme.bg.wash};
  }
`;

export const InboxLinkWrapper = styled.span`
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
  margin: 16px 16px 8px;
  max-width: 100%;
  pointer-events: auto;
  line-height: 1.4;
`;

export const AttachmentsContainer = styled.div`
  margin: 8px 16px;

  a {
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.alt};
  }

  a:hover {
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.default};
  }
`;

export const ThreadMeta = styled.div`
  display: flex;
  margin: 8px 16px 16px;
  justify-content: space-between;
`;

export const FacepileContainer = styled.div`
  display: flex;
  margin-right: 8px;
  margin-left: 8px;
  pointer-events: auto;
  order: 1;
`;

export const ParticipantHead = styled.span`
  position: relative;
  margin-left: -8px;
  border-radius: 24px;
  pointer-events: auto;
  box-shadow: 0 0 0 2px
    ${props => (props.active ? props.theme.brand.alt : props.theme.bg.default)};
  transform: translateY(0);
  transition: all 0.2s ease-in-out;
  ${Tooltip} &:hover {
    transform: translateY(-4px);
    transition: all 0.2s ease-in-out;
  }
`;

export const EmptyParticipantHead = styled(ParticipantHead)`
  background: ${props =>
    props.active ? props.theme.bg.default : props.theme.bg.wash};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  box-shadow: 0 0 0 2px
    ${props => (props.active ? props.theme.brand.alt : props.theme.bg.default)};
  width: 24px;
  height: 24px;
`;

export const MetaText = styled.span`
  font-size: 14px;
  color: ${props =>
    props.new
      ? props.active ? props.theme.text.reverse : props.theme.warn.alt
      : props.active ? props.theme.text.reverse : props.theme.text.alt};
  font-weight: ${props => (props.new ? 600 : 400)};
  order: 2;

  a {
    font-weight: 600;
  }

  a:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const MetaCommunityName = styled(Link)`
  padding-right: 8px;
  pointer-events: auto;
`;

export const CommunityInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 16px 0;

  a {
    font-size: 14px;
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.alt};
  }

  a.pill {
    font-size: 12px;
    box-shadow: 0 0 0 1px
      ${props =>
        props.active ? props.theme.text.reverse : props.theme.bg.border};
    background: ${props =>
      props.active ? 'transparent' : props.theme.bg.wash};
    font-weight: ${props => (props.active ? '500' : '400')};
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.alt};
  }

  a:hover {
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.default};
  }

  a.pill:hover {
    background: ${props =>
      props.active ? 'rgba(255,255,255,0.1)' : props.theme.bg.wash};
  }
`;

export const AvatarLink = styled(Link)`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 4px;
  pointer-events: auto;
  overflow: hidden;
`;

export const CommunityAvatar = styled.img`
  width: 100%;
  height: 100%;
  pointer-events: auto;
`;

export const CommunityLink = styled(Link)`
  font-size: 14px;
  font-weight: 400;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  line-height: 1.28;
  pointer-events: auto;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const PillLink = styled(Link)`
  display: inline-block;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  padding: 4px 8px;
  margin-right: 8px;
  font-size: 12px;
  max-height: 24px;
  line-height: 1;
  pointer-events: auto;
`;

export const MiniLinkPreview = styled(Link)`
  display: flex;
  font-size: 14px;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  font-weight: ${props => (props.active ? '500' : '400')};
  margin: 0 0 8px;
  align-items: center;
  pointer-events: auto;
  ${Truncate} .icon {
    margin-right: 4px;
  }

  &:hover {
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.default};
  }
`;
