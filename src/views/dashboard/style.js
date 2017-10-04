// @flow
// $FlowFixMe
import styled, { css } from 'styled-components';
// $FlowFixMe
import { Link } from 'react-router-dom';
import {
  zIndex,
  Truncate,
  Tooltip,
  Transition,
  Shadow,
  hexa,
} from '../../components/globals';

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
  width: 100%;
  max-width: 440px;
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
  width: 100%;
  overflow-y: scroll;
  position: relative;
`;

export const CommunityListWrapper = styled.div`
  display: flex;
  width: 256px;
  min-width: 256px;
  overflow-y: hidden;
  position: relative;
  align-self: stretch;
  flex-direction: column;
  background: ${props => props.theme.bg.wash};
  border-right: 1px solid ${props => props.theme.bg.border};
  transform: translateZ(0);
  transition: ${Transition.hover.off};
  padding-bottom: 48px;

  img {
    opacity: 0.4;
    filter: grayscale(60%);
    transition: ${Transition.hover.on};
  }

  &:hover {
    transform: translateZ(0);
    // width: 256px;
    transition: ${Transition.hover.on};

    img {
      filter: grayscale(0%);
      opacity: 1;
      transition: ${Transition.hover.on};
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CommunityListItem = styled.div`
  padding: 6px;
  margin: 4px 12px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  color: ${props =>
    props.active ? props.theme.text.default : props.theme.text.alt};
  background: ${props =>
    props.active ? props.theme.bg.default : props.theme.bg.wash};
  border: 1px solid
    ${props => (props.active ? props.theme.bg.border : 'transparent')};

  a {
    display: flex;
    align-items: center;
  }

  &:first-of-type {
    margin-top: 16px;
  }

  ${props =>
    props.active &&
    css`
      img {
        opacity: 1;
        filter: grayscale(0%);
      }
    `} &:hover {
    border: 1px solid ${props => props.theme.bg.border};
    background: ${props => props.theme.bg.default};
    color: ${props => props.theme.text.default};

    img {
      box-shadow: 0;
    }
  }
`;

export const ExploreCommunityListItem = styled(CommunityListItem)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 255px;
  color: ${props => props.theme.text.alt};
  box-shadow: 0 -1px 0 ${props => props.theme.bg.border};
  margin: 0;
  padding: 8px 16px;
  border-radius: 0;

  &:hover {
    color: ${props => props.theme.brand.alt};
    background: ${props => props.theme.bg.default};
    border: 1px solid transparent;

    div {
      color: ${props => props.theme.brand.alt};
    }
  }
`;

export const CommunityListText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${Truncate};
`;

export const CommunityListName = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-left: 12px;
  line-height: 1.28;

  ${Truncate};
`;

export const CommunityListReputation = styled.p`
  font-size: 13px;
  font-weight: 400;
  margin-left: 12px;
  line-height: 1.28;
  color: ${props => props.theme.text.alt};

  ${Truncate};
`;

export const AllCommunityListItem = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.active ? props.theme.bg.default : props.theme.bg.wash};
  color: ${props =>
    props.active ? props.theme.brand.alt : props.theme.text.alt};
`;

export const ExploreListItem = styled(AllCommunityListItem)`
  width: 32px;
  height: 32px;
  background: none;
  margin-right: 3px;
  border-radius: 0;
`;

export const CommunityListAvatar = styled.img`
  width: 32px;
  min-width: 32px;
  height: 32px;
  display: inline-block;
  border-radius: 4px;
  box-shadow: ${props => (props.active ? '0' : '0 1px 2px rgba(0, 0, 0, 0.1)')};
`;

export const CommunityListScroller = styled.div`
  width: 100%;
  overflow-y: scroll;
  position: relative;
  padding-bottom: 16px;
`;

export const FeedHeaderContainer = styled.div`
  background: ${props => props.theme.bg.default};
  padding: 8px;
  box-shadow: ${Shadow.low} ${props => hexa(props.theme.bg.reverse, 0.15)};
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
  width: 100%;
  overflow-y: scroll;
  position: relative;
`;

export const HeaderWrapper = styled.div`
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
  color: ${props => props.theme.brand.alt};
  display: flex;
  align-items: center;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.brand.default};
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

  &:first-of-type {
    border-top: none;
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
  margin: 12px 16px 8px;
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
  margin: 10px 16px 16px;
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
  max-width: 24px;
  max-height: 24px;
  pointer-events: auto;
  box-shadow: 0 0 0 2px
    ${props => (props.active ? props.theme.brand.alt : props.theme.bg.default)};
  transform: translateY(0);
  transition: transform 0.2s ease-in-out;
  ${Tooltip} &:hover {
    transform: translateY(-4px);
    transition: transform 0.2s ease-in-out;
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
  position: relative;
  top: 4px;

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
  padding: 0 12px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

export const MetaCommunityName = styled(Link)`
  padding-right: 8px;
  pointer-events: auto;
  white-space: nowrap;
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

export const PillLinkPinned = styled.div`
  background: #fff1cc;
  border: 1px solid #ffd566;
  color: #715818;
  display: flex;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  padding: 4px 8px;
  margin-right: 8px;
  font-size: 12px;
  max-height: 24px;
  line-height: 1;

  .icon {
    top: -1px;
  }
`;

export const PillLabel = styled.span`
  ${props =>
    props.isPrivate &&
    css`
      position: relative;
      top: -2px;
    `};
`;

export const MiniLinkPreview = styled(Link)`
  display: inline-block;
  font-size: 14px;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  font-weight: ${props => (props.active ? '500' : '400')};
  margin: 0 0 8px;
  pointer-events: auto;
  max-width: calc(100%);
  ${Truncate} .icon {
    margin-right: 4px;
    position: relative;
    top: 4px;
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

export const Lock = styled.span`margin-right: 4px;`;
export const PinIcon = styled.span`
  margin-right: 4px;
  margin-left: -2px;
`;

export const UserProfileContainer = styled.div`
  display: flex;
  padding: 16px 16px 12px;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  align-items: center;
`;

export const UserProfileText = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  flex: auto;
  margin-left: 14px;
  justify-content: center;
`;

export const UserProfileName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  line-height: 1.28;
  ${Truncate};
`;

export const UserProfileNameLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  line-height: 1.28;
  ${Truncate};
`;

export const UserProfileReputation = styled.div`
  display: flex;
  color: ${props => props.theme.text.alt};
  font-size: 13px;
  line-height: 1.28;
  ${Truncate};
`;

export const UserProfileSettingsLink = styled(Link)`
  color: ${props => props.theme.text.alt};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;
