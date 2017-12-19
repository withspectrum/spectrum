// @flow
// $FlowFixMe
import styled, { css, keyframes } from 'styled-components';
// $FlowFixMe
import Link from 'src/components/link';
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
  width: 100%;
  box-shadow: 1px 0 0 ${props => props.theme.bg.border};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const InboxWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 400px;
  min-width: 400px;
  overflow-y: hidden;
  position: relative;
  align-self: stretch;
  flex-direction: column;
  background: ${props => props.theme.bg.wash};
  border-right: 1px solid ${props => props.theme.bg.border};

  @media (max-width: 768px) {
    max-width: 100%;
    min-width: 100%;
    flex: auto;
    border-right: none;
  }
`;

export const InboxScroller = styled.div`
  width: 100%;
  overflow-y: auto;
  position: relative;
  flex: 1;
`;

export const CommunityListWrapper = styled.div`
  display: flex;
  width: 72px;
  min-width: 72px;
  overflow-y: hidden;
  overflow-x: visible;
  position: relative;
  align-self: stretch;
  flex-direction: column;
  background: ${props => props.theme.bg.wash};
  border-right: 1px solid ${props => props.theme.bg.border};
  transform: translateZ(0);
  transition: ${Transition.hover.off};
  padding-bottom: 48px;

  .channelsContainer {
    max-height: 0;
    padding: 0;
    transition-delay: 1s;
    transform: translateZ(0);
    transition: ${Transition.hover.off};

    .divider {
      max-width: 0;
      border-top: 1px solid ${props => props.theme.bg.wash};
      height: 0;
      margin: 12px 0 8px -28px;
      position: relative;
      right: -20px;
      transition-delay: 1s;
      transition: ${Transition.hover.on};
    }
  }

  .communityListText {
    opacity: 0;
    transform: translateZ(0);
    transition: ${Transition.hover.off};
  }

  img {
    opacity: 0.4;
    filter: grayscale(60%);
    transition: ${Transition.hover.on};
  }

  &:hover {
    transform: translateZ(0);
    width: 256px;
    min-width: 256px;
    transition: ${Transition.hover.on};
    transition-delay: 1s;

    .channelsContainer {
      max-height: 1000px;
      padding: 8px 8px 12px;
      transform: translateZ(0);
      transition: ${Transition.hover.on};
      transition-delay: 1s;

      .divider {
        max-width: 230px;
        border-top: 1px solid ${props => props.theme.bg.border};
        height: 1px;
        transition-delay: 1s;
        transition: ${Transition.hover.on};
      }
    }

    .communityListText {
      opacity: 1;
      transform: translateZ(0);
      transition: ${Transition.hover.on};
      transition-delay: 1s;
    }

    img {
      filter: grayscale(0%);
      opacity: 1;
      transition: ${Transition.hover.on};
    }
  }

  @media (max-width: 956px) {
    display: none;
  }
`;

export const CommunityListItem = styled.div`
  margin: 4px 12px;
  min-width: 48px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
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

export const CommunityListPadding = styled.div`
  display: flex;
  padding: 6px;
  min-width: 48px;
`;

export const Fixed = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 -1px 0 ${props => props.theme.bg.border};

  &:hover {
    color: ${props => props.theme.brand.alt};
    background: ${props => props.theme.bg.default};

    div {
      color: ${props => props.theme.brand.alt};
      background: ${props => props.theme.bg.default};
    }
  }
`;

export const ExploreCommunityListItem = styled(CommunityListItem)`
  color: ${props => props.theme.text.alt};
  margin: 1px 12px;
  margin-top: 0 !important; //need to override the first child selector above
  padding: 6px;
  border-radius: ${props => (props.upsell ? '4px' : '0')};

  ${Truncate} &:hover {
    color: ${props =>
      props.upsell ? props.theme.text.default : props.theme.brand.alt};
    border: 1px solid
      ${props => (props.upsell ? props.theme.bg.border : 'transparent')};

    div {
      color: ${props => props.theme.brand.alt};
    }
  }
`;

export const CommunityListText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100%;
  white-space: nowrap;
`;

export const CommunityListName = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-left: 12px;
  line-height: 1.28;
  max-width: 164px;

  ${Truncate};
`;

export const CommunityListReputation = styled.div`
  margin-left: 12px;
  line-height: 1.2;
  color: ${props => props.theme.text.alt};
  width: 100%;
  font-size: 12px;

  > div {
    > div {
      flex-basis: 16px;
      width: 16px;
      height: 16px;
      min-width: 16px;
      min-height: 16px;
    }

    > span {
      font-size: 12px;
    }
  }
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
  ${Truncate};
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
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  padding-bottom: 16px;
`;

export const FeedHeaderContainer = styled.div`
  background: ${props => props.theme.bg.default};
  padding: 14px 8px;
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
  overflow-y: auto;
  position: relative;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
      ${props =>
        props.active ? props.theme.brand.alt : props.theme.bg.border};
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
  font-size: 16px;
  font-weight: 500;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.default};
  margin: 12px 16px;
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

export const EmptyParticipantHead = styled.span`
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
  max-width: 24px;
  max-height: 24px;
  pointer-events: auto;
  position: relative;
  margin-left: -8px;
  border-radius: 24px;
  transform: translateY(0);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    transition: transform 0.2s ease-in-out;
  }
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
  display: flex;
  align-items: center;
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
  background: ${props => props.theme.special.wash};
  border: 1px solid ${props => props.theme.special.border};
  color: ${props => props.theme.special.dark};
  display: flex;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  padding: 0 8px;
  margin-right: 8px;
  font-size: 12px;
  max-height: 24px;
  line-height: 1.5;
  .icon {
    top: -1px;
  }
`;

export const PillLabel = styled.span`
  overflow: hidden;
  max-width: 128px;
  text-overflow: ellipsis;
  display: inline-block;
  white-space: nowrap;
`;

export const MiniLinkPreview = styled.a`
  display: inline-block;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  font-weight: ${props => (props.active ? '500' : '400')};
  margin-bottom: 8px;
  pointer-events: auto;
  max-width: 100%;
  ${Truncate};

  .icon {
    margin-right: 4px;
  }

  &:hover {
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.default};
  }
`;

export const NullThreadFeed = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 32px;
  flex-direction: column;
  background: ${props => props.theme.bg.wash};
`;

export const NullHeading = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  text-align: center;
  margin-bottom: 8px;
`;

export const Lock = styled.span`margin-right: 4px;`;
export const PinIcon = styled.span`
  margin-right: 4px;
  margin-left: -2px;
  display: flex;
  align-items: center;
`;

export const ChannelsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ChannelListItem = styled.div`
  font-size: 14px;
  padding-left: 36px;
  margin-top: 4px;
  font-weight: ${props => (props.active ? '500' : '400')};
  color: ${props =>
    props.active ? props.theme.text.default : props.theme.text.alt};
  ${Truncate} .icon {
    position: relative;
    top: 4px;
    left: -2px;
  }

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const ChannelListDivider = styled.div``;

const placeHolderShimmer = keyframes`
	0%{
			transform: translateX(-200%) translateY(0%);
			background-size: 100%;
			opacity: 1;
	}
	100%{
			transform: translateX(200%) translateY(0%);
			background-size: 500%;
			opacity: 0;
	}
`;

export const LoadingContainer = styled.div`
  display: flex;
  padding: 0 8px;
  flex-direction: column;
  margin-left: 36px;
  overflow: hidden;
`;

export const LoadingBar = styled.div`
  width: ${props => `${props.width}px`};
  height: 4px;
  border-radius: 4px;
  margin-top: 8px;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.bg.wash} 10%,
    ${({ theme }) => hexa(theme.generic.default, 0.65)} 20%,
    ${({ theme }) => theme.bg.wash} 30%
  );
  animation-name: ${placeHolderShimmer};
`;

export const UpsellExploreDivider = styled.div`
  border-bottom: 1px solid ${props => props.theme.bg.border};
  display: block;
  width: 100%;
  margin: 16px 0 16px;
`;

export const SearchWrapper = styled.div`
  color: ${props => props.theme.text.alt};
  display: flex;
  align-items: center;
  flex: ${props => (props.isOpen ? 'auto' : '0 0 40px')};
  overflow: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: all 0.2s;
  margin-right: 8px;
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translate(-4px, -50%);
    cursor: pointer;
    border-radius: 40px;
  }
`;

export const SearchInput = styled.input`
  padding: 6px 8px;
  padding-left: 40px;
  font-size: 16px;
  border-radius: 40px;
  display: flex;
  flex: 1;
  transition: all 0.2s;
  border: 1px solid
    ${props => (props.isOpen ? props.theme.bg.border : 'transparent')};
  color: ${props => props.theme.text.alt};
  padding-right: 40px;

  &:focus {
    background: ${props => props.theme.bg.wash};
    color: ${props => props.theme.text.default};
    border: 1px solid ${props => props.theme.bg.border};
  }
`;

export const ClearSearch = styled.span`
  width: 24px;
  height: 24px;
  opacity: ${props => (props.isVisible ? '1' : '0')};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.bg.border};
  border-radius: 50%;
  font-size: 20px;
  position: absolute;
  right: 1px;
  top: 50%;
  color: ${props => props.theme.text.alt};
  transform: translate(-4px, -50%);
  font-weight: 500;
  pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.text.alt};
    color: ${props => props.theme.text.reverse};
  }

  span {
    position: relative;
    top: -2px;
  }
`;

export const SearchStringHeader = styled.div`
  background: #fff;
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.bg.border};
`;

export const SearchForm = styled.form`
  display: flex;
  flex: 1;
`;

export const OutlineButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  font-size: 14px;
  font-weight: 700;
  border: 2px solid ${props => props.theme.text.alt};
  color: ${props => props.theme.text.alt};
  border-radius: 8px;
  padding: 4px 12px 4px 6px;

  span {
    margin-left: 8px;
  }
`;

export const Hint = styled.span`
  font-size: 16px;
  color: ${props => props.theme.text.alt};
  margin-top: 32px;
  margin-bottom: 8px;
`;
