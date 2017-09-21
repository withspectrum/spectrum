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
  flex: auto;
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
    border-right: none;
  }
`;

export const InboxScroller = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  position: relative;
`;

export const CommunityListWrapper = styled.div`
  padding-top: 8px;
  display: flex;
  width: 65px;
  min-width: 65px;
  overflow-y: hidden;
  position: relative;
  align-self: stretch;
  flex-direction: column;
  background: ${props => props.theme.bg.wash};
  border-right: 1px solid ${props => props.theme.bg.border};
  opacity: 0.5;
  transform: translateZ(0);
  filter: grayscale(50%);
  transition: all 0.2s ease-in-out;
  box-shadow: inset -1px 0 2px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateZ(0);
    width: 256px;
    filter: grayscale(0%);
    opacity: 1;
    transition: all 0.2s ease-in-out;
    box-shadow: inset -2px 0 5px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CommunityListItem = styled.div`
  margin: 8px 14px;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  color: ${props =>
    props.active ? props.theme.brand.alt : props.theme.text.alt};
  background: ${props =>
    props.active ? props.theme.brand.alt : props.theme.bg.wash};
  padding: 2px 8px 2px 2px;

  ${props =>
    props.active &&
    css`
      img {
        border: 1px solid
          ${props => (props.active ? props.theme.bg.default : 'transparent')};
        box-shadow: 0 0 0 2px ${props.theme.brand.alt};
      }
    `} &:hover {
    transition: all 0.2s ease-in-out;
    background: ${props =>
      props.active ? props.theme.brand.alt : props.theme.bg.border};

    ${props =>
      props.active
        ? css`
            img {
              box-shadow: 0 0 0 2px ${props.theme.brand.alt};
            }
          `
        : css`
            img {
              box-shadow: 0 0 0 2px ${props.theme.bg.border};
            }
          `};
  }
`;

export const CommunityListName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.default};

  ${Truncate};
`;

export const AllCommunityListItem = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.bg.border};
`;

export const CommunityListAvatar = styled.img`
  width: 32px;
  min-width: 32px;
  height: 32px;
  display: inline-block;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-right: 16px;
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
  max-width: 840px;
  border-right: 1px solid ${props => props.theme.bg.border};

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

export const CreateThreadComposer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const ThreadComposerContainer = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.bg.border};

  @media (max-width: 768px) {
    margin: 0;
  }
`;

export const ComposeIconContainer = styled.div`
  position: relative;
  top: 2px;
  color: ${props => props.theme.text.alt};
  display: flex;
  align-items: center;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.brand.alt};
  }

  div {
    margin-right: 8px;
  }
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

export const InboxClickWrapper = styled.span`
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
  font-weight: 600;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.default};
  margin: 16px 16px 8px;
  max-width: 100%;
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

export const MetaTextPill = styled(MetaText)`
  color: ${props =>
    props.active ? props.theme.brand.alt : props.theme.text.reverse};
  background: ${props =>
    props.active ? props.theme.text.reverse : props.theme.warn.alt};
  border-radius: 20px;
  padding: 2px 12px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 800;
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

export const NullThreadFeed = styled.div`
  display: flex;
  flex: auto;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 32px;
  flex-direction: column;
`;

export const NullHeading = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  text-align: center;
  margin-bottom: 32px;
`;
