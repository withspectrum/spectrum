// @flow
import styled, { css, keyframes } from 'styled-components';
import Link from 'src/components/link';
import {
  zIndex,
  Truncate,
  Tooltip,
  Shadow,
  hexa,
} from '../../components/globals';

export const DashboardWrapper = styled.main`
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
  width: 40%;
  max-width: 480px;
  min-width: 360px;
  overflow-y: hidden;
  position: relative;
  align-self: stretch;
  flex-direction: column;
  background: ${props => props.theme.bg.default};
  border-right: 1px solid ${props => props.theme.bg.border};

  @media (min-resolution: 120dpi) {
    max-width: 400px;
    min-width: 400px;
  }

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

export const Sidebar = styled.div`
  display: flex;
  width: 256px;
  min-width: 256px;
  max-width: 256px;
  position: relative;
  align-self: stretch;
  flex-direction: column;
  border-right: 1px solid ${props => props.theme.bg.border};

  @media (max-width: 1280px) {
    display: none;
  }
`;

export const SectionTitle = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  font-variant: small-caps;
  text-transform: lowercase;
  margin: 8px 16px;
  letter-spacing: 1.4px;
`;

export const ChannelsContainer = styled.div`
  grid-area: menu;
  display: flex;
  flex-direction: column;
  justify-self: stretch;
  padding: 4px;

  ${SectionTitle} {
    color: ${props => props.theme.text.placeholder};
    margin: 8px 8px 4px 8px;
  }
`;

export const CommunityListName = styled.p`
  grid-area: title;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.28;
  max-width: 164px;

  ${Truncate};
`;

export const ChannelListItem = styled.div`
  display: grid;
  font-size: 14px;
  grid-template-columns: 40px 1fr;
  grid-auto-rows: auto;
  grid-template-areas: 'icon title';
  padding: 4px 0;
  justify-items: start;
  align-items: center;
  cursor: pointer;
  font-weight: ${props => (props.active ? '500' : '400')};
  color: ${props =>
    props.active ? props.theme.text.default : props.theme.text.alt};
  ${Truncate}
  }

  > div:first-child {
    justify-self: center;
  }

  ${CommunityListName} {
    margin-left: 12px;
  }

  &:hover {
    color: ${props =>
      props.active ? props.theme.brand.alt : props.theme.text.default};
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

export const CommunityListMeta = styled.div`
  grid-area: title;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 4px;
`;

export const CommunityListItem = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  grid-auto-rows: 48px auto;
  grid-template-areas: 'icon title' 'menu menu';
  min-height: 48px;
  padding: 6px 8px;
  justify-items: start;
  align-items: center;
  cursor: pointer;
  color: ${props =>
    props.active ? props.theme.text.default : props.theme.text.alt};
  background: ${props =>
    props.active ? props.theme.bg.default : 'transparent'};

  box-shadow: ${props =>
    props.active
      ? `0 1px 0 ${props.theme.bg.border}, 0 -1px 0 ${props.theme.bg.border}`
      : 'none'};

  > ${CommunityListName} {
    margin-left: 4px;
  }

  > div:first-child,
  > img:first-child {
    justify-self: center;
  }

  ${props =>
    props.active &&
    css`
      img {
        opacity: 1;
        filter: grayscale(0%);
      }
    `};

  &:hover {
    background: ${props => props.theme.bg.default};
    color: ${props => props.theme.text.default};
    box-shadow: 0 1px 0 ${props => props.theme.bg.border},
      0 -1px 0 ${props => props.theme.bg.border};

    img {
      box-shadow: 0;
    }
  }
`;

export const CommunityListScroller = styled.div`
  grid-area: scroll;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
`;

export const CommunityListWrapper = styled.div`
  flex: auto;
  background: ${props => props.theme.bg.wash};
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr;
  grid-template-areas: 'scroll' 'fixed';
  height: 100%;
  max-height: 100%;
  min-height: 100%;
`;

export const Fixed = styled.div`
  grid-area: fixed;
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

export const CommunityListAvatar = styled.img`
  width: 32px;
  min-width: 32px;
  height: 32px;
  display: inline-block;
  border-radius: 4px;
  box-shadow: ${props => (props.active ? '0' : '0 1px 2px rgba(0, 0, 0, 0.1)')};
  ${Tooltip};
`;

export const FeedHeaderContainer = styled.div`
  background: ${props => props.theme.bg.default};
  padding: 14px 8px;
  box-shadow: ${Shadow.low} ${props => hexa(props.theme.bg.reverse, 0.15)};
  position: relative;
  z-index: ${zIndex.chrome - 1};

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
  background-color: ${props => props.theme.bg.default};

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
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
  grid-template-areas: 'center right';
  grid-column-gap: 8px;
  align-items: center;
  justify-items: center;
  padding-left: 4px;

  > button {
    grid-area: right;
  }

  @media (max-width: 1280px) {
    padding-left: 0;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: 1fr;
    grid-template-areas: 'left center right';
  }
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
  display: flex;
  flex-direction: column;
  align-self: stretch;
  position: relative;
  z-index: ${zIndex.card + 1};
  align-items: flex-start;
  pointer-events: none;
`;

export const ThreadTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.default};
  margin: 12px 16px 4px;
  max-width: 100%;
  line-height: 1.4;
`;

export const AttachmentsContainer = styled.div`
  margin: 4px 16px;
  max-width: calc(100% - 40px);

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
  align-self: stretch;
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

export const StatusText = styled.span`
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

const StatusPill = styled(StatusText)`
  color: ${props =>
    props.active ? props.theme.brand.alt : props.theme.text.reverse};
  background: ${props =>
    props.active ? props.theme.text.reverse : props.theme.brand.alt};
  border-radius: 20px;
  padding: 0 12px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

export const NewThreadPill = styled(StatusPill)`
  color: ${props =>
    props.active ? props.theme.brand.alt : props.theme.text.reverse};
  background: ${props =>
    props.active ? props.theme.text.reverse : props.theme.success.alt};
`;

export const NewMessagePill = styled(StatusText)`
  color: ${props =>
    props.active ? props.theme.brand.alt : props.theme.warn.alt};
`;

export const LockedTextPill = styled(StatusPill)`
  color: ${props =>
    props.active ? props.theme.brand.alt : props.theme.text.alt};
  background: ${props =>
    props.active ? props.theme.brand.wash : props.theme.bg.border};
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
  display: flex;
  flex: auto;
  align-items: center;
  font-size: 14px;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  font-weight: ${props => (props.active ? '500' : '400')};
  margin-bottom: 4px;
  pointer-events: auto;
  min-width: 0;

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
  background: ${props => props.theme.bg.default};
`;

export const NullHeading = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  text-align: center;
  margin-bottom: 8px;
`;

export const Lock = styled.span`
  margin-right: 4px;
`;
export const PinIcon = styled.span`
  margin-right: 4px;
  margin-left: -2px;
  display: flex;
  align-items: center;
`;

export const UpsellExploreDivider = styled.div`
  border-bottom: 1px solid ${props => props.theme.bg.border};
  display: block;
  width: 100%;
  margin: 16px 0 16px;
`;

export const SearchInputDiv = styled.div`
  align-self: stretch;
  height: 100%;
  justify-self: stretch;
`;

export const SearchInput = styled.input`
  font-size: 14px;
  width: 100%;
  height: 100%;
  color: ${props =>
    props.darkContext ? props.theme.text.placeholder : props.theme.text.alt};
  background-color: transparent;
  border: none;

  &:placeholder {
    color: ${props =>
      props.darkContext
        ? props.theme.text.border
        : props.theme.text.placeholder};
  }

  &:focus {
    color: ${props =>
      props.darkContext ? props.theme.text.reverse : props.theme.text.default};
  }
`;

export const ClearSearch = styled.span`
  width: 16px;
  height: 16px;
  opacity: ${props => (props.isVisible ? '1' : '0')};
  background: ${props => props.theme.text.placeholder};
  border-radius: 50%;
  font-size: 16px;
  color: ${props => props.theme.text.reverse};
  font-weight: 500;
  pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.text.alt};
  }

  span {
    position: relative;
    top: -2px;
  }
`;

export const SearchForm = styled.form`
  display: grid;
  height: 32px;
  min-height: 32px;
  max-height: 32px;
  color: ${props => props.theme.text.alt};
  border: 1px solid ${props => props.theme.bg.border};
  border-radius: 16px;
  grid-template-columns: 32px 1fr 32px;
  grid-template-rows: 1fr;
  grid-template-areas: 'icon input clear';
  align-items: center;
  justify-items: center;
  flex: auto;
  justify-self: stretch;
  grid-area: center;

  ${props =>
    props.darkContext &&
    css`
      border-color: transparent;
      background-color: ${props => hexa(props.theme.text.alt, 0.35)};
      color: ${props => props.theme.text.reverse};
    `};

  > div:last-of-type {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    color: ${props => props.theme.text.reverse};
    background-color: ${props => props.theme.text.alt};
    border-radius: 100%;
    padding: 4px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
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

export const SearchStringHeader = styled.div`
  background: #fff;
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.bg.border};
`;

export const Hint = styled.span`
  font-size: 16px;
  color: ${props => props.theme.text.alt};
  margin-top: 32px;
  margin-bottom: 8px;
`;

export const NarrowOnly = styled.div`
  display: none;

  @media (max-width: 1280px) {
    display: flex;
    flex: none;
    grid-area: left;
  }
`;

export const UpsellRow = styled.div`
  padding: 8px;
  display: flex;
  justify-content: space-between;
`;

export const HeaderActiveViewTitle = styled.h2`
  padding: 0 8px;
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  max-width: 384px;
  line-height: 1.2;

  ${Truncate};

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const HeaderActiveViewSubtitle = styled.h3`
  padding: 0 8px;
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  max-width: 384px;
  line-height: 1.2;

  display: flex;
  align-items: center;

  ${Truncate};

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const ContextHeaderContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 12px;
`;

export const EllipsisText = styled.div`
  ${Truncate};
`;
