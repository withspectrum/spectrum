// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { OutlineButton } from 'src/components/button';
import Column from 'src/components/column';
import { MEDIA_BREAK } from 'src/components/layout';
import {
  FlexCol,
  FlexRow,
  H1,
  H3,
  Transition,
  zIndex,
  Truncate,
} from 'src/components/globals';

export const ThreadViewContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 1024px;
  background-color: ${theme.bg.wash};
  margin: ${props =>
    props.threadViewContext === 'fullscreen' ? '0 auto' : '0'};

  @media (max-width: 1024px) {
    max-height: 100%;
    flex-direction: column;
    overflow: hidden;
  }
`;

export const ThreadContentView = styled(FlexCol)`
  background-color: ${theme.bg.default};
  ${props =>
    !props.slider &&
    css`
      box-shadow: -1px 0 0 ${theme.bg.border}, 1px 0 0 ${theme.bg.border};
    `} overflow-y: auto;
  overflow-x: visible;
  max-width: 100%;
  max-height: 100%;
  flex: auto;
  display: flex;
  align-items: center;
  align-self: stretch;
  grid-template-rows: 48px 1fr 64px;
  grid-template-columns: 100%;
  grid-template-areas: 'header' 'body' 'footer';
  position: relative;
`;

export const ThreadSidebarView = styled(FlexCol)`
  background-color: ${theme.bg.wash};
  overflow: hidden;
  min-width: 320px;
  max-width: 320px;
  max-height: 100%;
  flex: auto;
  display: flex;
  align-items: center;
  align-self: stretch;
  position: relative;
  right: 1px;
  overflow-y: auto;

  @media (max-width: 1032px) {
    display: none;
  }
`;

export const Content = styled(FlexRow)`
  justify-content: center;
  align-items: flex-start;
  flex: auto;
  overflow-y: auto;
  grid-area: body;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  background: ${theme.bg.default};
`;

export const Input = styled(FlexRow)`
  flex: none;
  justify-content: center;
  grid-area: footer;
  max-width: 100%;
  align-self: stretch;

  @media (max-width: ${MEDIA_BREAK}px) {
    z-index: ${zIndex.mobileInput};
  }
`;

export const Detail = styled(Column)`
  min-width: 100%;
  margin: 0;

  ${props =>
    props.isEditing &&
    css`
      height: 100%;
      overflow-y: scroll;
    `}
`;

export const DetailViewWrapper = styled(FlexCol)`
  background-image: ${({ theme }) =>
    `linear-gradient(to right, ${theme.bg.wash}, ${theme.bg.default} 15%, ${
      theme.bg.default
    } 85%, ${theme.bg.wash})`};
  flex: auto;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: ${MEDIA_BREAK}px) {
    background-color: ${theme.bg.default};
    background-image: none;
  }
`;

export const Container = styled(FlexCol)`
  padding-top: 32px;
  width: 100%;
  justify-content: flex-start;
  align-items: stretch;
  flex: auto;
  overflow-y: scroll;

  @media (max-width: ${MEDIA_BREAK}px) {
    padding-top: 16px;
  }
`;

export const ThreadWrapper = styled(FlexCol)`
  font-size: 16px;
  flex: none;
  min-width: 320px;
  position: relative;
  background: ${theme.bg.default};
  width: 100%;
  max-width: 100%;
  /* manually nudge up 60px to cover the sliding header in the thread view */
  top: -68px;
  margin-bottom: -68px;
  z-index: 3;

  ${props =>
    props.isEditing &&
    css`
      height: 100%;
      max-height: 100%;
      position: relative;
      display: block;
      overflow: hidden;
      overflow-y: auto;
    `}

  @media (max-width: ${MEDIA_BREAK}px) {
    top: 0;
    margin-bottom: 0;
  }
`;

export const ThreadContent = styled.div`
  height: 100%;
  padding: ${props => (props.isEditing ? '0' : '16px')};

  ${props =>
    props.isEditing &&
    css`
      max-height: calc(100% - 55px);
      overflow: hidden;
      overflow-y: auto;
    `}

  @media (max-width: 1024px) {
    padding: ${props => (props.isEditing ? '0' : '16px')};
  }
`;

export const ThreadHeading = styled(H1)`
  font-size: 28px;
  font-weight: 600;
  word-break: break-word;
  margin-bottom: 16px;
`;

export const A = styled.a`
  display: flex;
`;

export const SocialShareWrapper = styled(FlexRow)`
  justify-content: space-between;
  margin-top: 20px;

  ${A}:first-child {
    margin-right: 20px;
  }

  @media (max-width: 500px) {
    flex-direction: column;

    ${A}:first-child {
      margin-right: 0;
      margin-bottom: 8px;
    }
  }
`;

export const ContextRow = styled(FlexRow)`
  justify-content: space-between;
  align-items: flex-start;
  align-content: flex-start;
`;

export const EditDone = styled.div`
  position: relative;
`;

export const DropWrap = styled(FlexCol)`
  width: 32px;
  height: 32px;
  position: relative;
  color: ${theme.text.placeholder};
  transition: ${Transition.hover.off};
  margin: 0 8px;

  &:hover {
    color: ${theme.text.secondary};
    cursor: pointer;
    transition: ${Transition.hover.on};
  }

  .flyout {
    position: absolute;
    right: auto;
    width: 200px;
  }
`;

export const FlyoutRow = styled(FlexRow)`
  width: 100%;

  button {
    width: 100%;
    justify-content: flex-start;
    border-top: 1px solid ${theme.bg.divider};
    border-radius: 0;
    transition: none;
    padding: 4px 12px;
    font-size: 13px;
    font-weight: 500;
  }

  button:hover {
    background: ${theme.bg.wash};
    border-top: 1px solid ${theme.bg.divider};
    transition: none;
  }

  &:first-of-type {
    button {
      border-top: 0;
      border-radius: 4px 4px 0 0;
    }
  }

  &:last-of-type {
    button {
      border-radius: 0 0 4px 4px;
    }
  }

  ${props =>
    props.hideBelow &&
    css`
      @media (max-width: ${props.hideBelow}px) {
        display: none;
      }
    `};

  ${props =>
    props.hideAbove &&
    css`
      @media (min-width: ${props.hideAbove}px) {
        display: none;
      }
    `};
`;

export const Byline = styled.div`
  font-weight: 400;
  color: ${theme.brand.alt};
  display: flex;
  align-items: center;
  flex: auto;
  font-size: 14px;
`;

export const BylineMeta = styled(FlexCol)`
  margin-left: 12px;
`;

export const AuthorNameLink = styled(Link)`
  display: flex;
`;
export const AuthorNameNoLink = styled.div`
  display: flex;
`;
export const AuthorName = styled(H3)`
  font-weight: 500;
  max-width: 100%;
  color: ${theme.text.default};
  margin-right: 4px;
  font-size: 14px;

  &:hover {
    color: ${theme.text.default};
  }
`;

export const AuthorUsername = styled.span`
  color: ${theme.text.alt};
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 400;
  margin-right: 4px;
  align-self: flex-end;
  word-break: break-all;
`;

export const ReputationRow = styled.div``;

export const Location = styled(FlexRow)`
  font-weight: 500;
  color: ${theme.text.alt};
  font-size: 14px;
  margin-top: -16px;
  margin-left: -16px;
  margin-bottom: 16px;
  align-self: flex-start;

  &:hover > div {
    color: ${theme.brand.alt};
  }

  > div {
    color: ${theme.text.placeholder};
  }

  > span {
    padding: 0 4px;
    color: ${theme.text.placeholder};
  }

  > a:hover {
    color: ${theme.brand.alt};
    text-decoration: underline;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const Timestamp = styled.span`
  font-weight: 400;
  margin: 8px 0;
  font-size: 16px;
  color: ${theme.text.alt};
  display: inline-block;
`;

export const ChatWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  flex: none;
  margin-top: 16px;

  @media (max-width: ${MEDIA_BREAK}px) {
    overflow-x: hidden;
  }
`;

export const NullMessagesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  flex: 1;
  color: ${theme.text.alt};
  flex-direction: column;
  width: 100%;
  background: ${theme.bg.default};

  @media (max-width: ${MEDIA_BREAK}px) {
    padding-bottom: 128px;
  }

  > .icon {
    opacity: 0.4;
  }
`;

export const NullCopy = styled.h5`
  font-size: 18px;
  font-weight: 400;
  color: ${theme.text.alt};
  margin-top: 16px;
  text-align: center;
  max-width: 600px;
`;

export const ThreadTitle = {
  fontSize: '32px',
  padding: '0',
  outline: 'none',
  border: '0',
  lineHeight: '1.4',
  fontWeight: '800',
  boxShadow: 'none',
  width: '100%',
  color: '#171A21',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  borderRadius: '12px 12px 0 0',
};

export const ThreadDescription = {
  fontSize: '16px', // has to be 16px to avoid zoom on iOS
  fontWeight: '500',
  width: '100%',
  display: 'inline-block',
  lineHeight: '1.4',
  padding: '0',
  outline: 'none',
  border: '0',
  boxShadow: 'none',
  color: '#171A21',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

export const ShareButtons = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
`;

export const ShareButton = styled.span`
  color: ${theme.text.alt};
  display: flex;
  background: none;

  a {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
  }

  &:hover {
    color: ${props =>
      props.facebook
        ? props.theme.social.facebook.default
        : props.twitter
        ? props.theme.social.twitter.default
        : props.theme.text.default};
  }
`;

export const StickyHeaderContent = styled.div`
  display: flex;
  padding: 12px 16px;
  cursor: pointer;
  max-width: 560px;

  @media (max-width: 728px) {
    padding: 16px;
    display: flex;
  }
`;

export const StickyHeaderActionsContainer = styled.div`
  padding: 12px 0;
  display: flex;
  align-items: center;
  flex: 0 1 auto;
`;

export const CommunityHeaderName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
  color: ${theme.text.default};
  line-height: 1.2;
  max-width: 100%;
  ${Truncate};
`;

export const CommunityHeaderSubtitle = styled.span`
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 4px;
  line-height: 12px;
  color: ${theme.text.alt};
  ${Truncate};

  > a {
    display: flex;
    flex: 0 0 auto;
  }

  > a:hover {
    color: ${theme.brand.default};
  }
`;

export const ThreadSubtitle = styled(CommunityHeaderSubtitle)`
  font-size: 16px;
  margin-top: 8px;
  margin-bottom: 16px;
  display: flex;
  line-height: 1.5;
  flex-wrap: wrap;

  a:hover {
    color: ${theme.text.default};
  }
`;

export const CommunityHeaderChannelTag = styled.div`
  color: ${theme.text.reverse};
  background: ${theme.warn.alt};
  border-radius: 20px;
  padding: 0 12px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;

  &:hover {
    color: ${theme.text.default};
  }

  @media (max-width: 728px) {
    display: none;
  }
`;

export const CommunityHeaderMeta = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

export const CommunityHeaderMetaCol = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  align-self: flex-start;
  margin-left: 12px;
  max-width: 100%;
  padding-right: 64px;
`;

export const PillLink = styled(Link)`
  font-size: 12px;
  box-shadow: 0 0 0 1px ${theme.bg.border};
  background: ${theme.bg.wash};
  font-weight: 400;
  color: ${theme.text.alt};
  display: flex;
  flex: none;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  padding: 4px 8px;
  margin-top: 4px;
  max-height: 24px;
  line-height: 1;
  pointer-events: auto;

  &:hover {
    color: ${theme.text.default};
  }
`;

export const PillLinkPinned = styled.div`
  background: ${theme.special.wash};
  border: 1px solid ${theme.special.border};
  color: ${theme.special.dark};
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
    `};
`;

export const SidebarChannelPill = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px 16px 16px;
`;

export const Lock = styled.span`
  margin-right: 4px;
`;
export const PinIcon = styled.span`
  margin-right: 4px;
  margin-left: -2px;
`;

export const ActionBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${theme.bg.wash};
  border: 1px solid ${theme.bg.border};
  border-left: 0;
  border-right: 0;
  padding: 6px 16px;

  @media (max-width: ${MEDIA_BREAK}px) {
    margin: 0;
    margin-top: 0;
    border-radius: 0;
    border-left: 0;
    border-right: 0;
    padding-left: 16px;
    padding-right: 8px;
  }
`;

export const FixedBottomActionBarContainer = styled(ActionBarContainer)`
  z-index: 1;
  width: 100%;
  position: sticky;
`;

export const FollowButton = styled(OutlineButton)`
  background: ${theme.bg.default};
  @media (max-width: ${MEDIA_BREAK}px) {
    display: ${props => (props.currentUser ? 'none' : 'flex')};
  }
`;

export const SidebarSection = styled.div`
  margin: 8px 16px;
  background: ${theme.bg.default};
  border: 1px solid ${theme.bg.border};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  flex: none;
  align-self: stretch;
  position: relative;

  &:first-of-type {
    margin-top: 16px;
  }
`;

export const SidebarSectionTitle = styled.h3`
  margin: 16px 16px 8px;
  font-size: 15px;
  font-weight: 500;
  color: ${theme.text.default};
`;

export const SidebarSectionBody = styled.p`
  margin: 0 16px 16px;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.text.alt};
  white-space: pre-wrap;

  a {
    color: ${theme.text.default};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SidebarSectionActions = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 16px 8px;

  button {
    width: 100%;
    margin: 4px 0;
  }
`;

export const SidebarSectionAuth = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 16px 16px;
  button {
    width: 100%;
  }
  a {
    flex: auto;
  }
  a:first-child {
    margin-bottom: 8px;
  }
`;
export const SidebarCommunityCover = styled.div`
  border-radius: 4px 4px 0 0;
  height: 72px;
  background: url("${props => props.src}") no-repeat;
  background-size: cover;
  display: block;
`;
export const SidebarCommunityProfile = styled.img`
  border-radius: 8px;
  width: 48px;
  height: 48px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 48px;
  background: ${theme.bg.default};
  border: 2px solid ${theme.bg.default};
`;
export const SidebarCommunityName = styled(SidebarSectionTitle)`
  text-align: center;
  align-self: center;
  margin-top: 32px;
  text-align: center;
`;
export const SidebarCommunityDescription = styled(SidebarSectionBody)`
  text-align: center;
  align-self: center;
`;
export const SidebarRelatedThreadList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const SidebarRelatedThread = styled.li`
  font-size: 14px;
  border-top: 1px solid ${theme.bg.wash};

  &:hover {
    a {
      background-color: ${theme.bg.wash};
    }
  }

  a {
    padding: 8px 16px;
    display: block;
  }

  &:first-of-type {
    border-top: 0;
  }

  &:last-of-type {
    a {
      padding-bottom: 12px;
      border-radius: 0 0 4px 4px;
    }
  }
`;
export const RelatedTitle = styled.p``;
export const RelatedCount = styled.p`
  font-size: 13px;
  color: ${theme.text.alt};
`;

export const Label = styled.p`
  margin-left: 8px;
`;

export const StickyHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: ${zIndex.card};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${theme.bg.border};
  flex: 0 0 64px;
  align-self: stretch;
  background: ${theme.bg.wash};
  padding-right: 16px;

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const Stretch = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-width: 1px;
  max-width: inherit;
  position: relative;
  ${props =>
    props.isModal &&
    css`
      border-left: 1px solid ${theme.bg.border};
      border-right: 1px solid ${theme.bg.border};
    `}
`;

export const LockedWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 16px;
  color: ${theme.text.secondary};
  background: ${theme.bg.wash};
  border-top: 1px solid ${theme.bg.border};

  button {
    flex: 1;
  }
`;

export const LockedText = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-left: 16px;
`;

export const TopBottomButtonContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  opacity: ${props => (props.isVisible ? '1' : '0')};
  transform: translateY(${props => (props.isVisible ? '0' : '8px')});
  transition: transform opacity 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-items: center;
  background: ${theme.bg.default};
  border: 1px solid ${theme.bg.border};
  color: ${theme.text.alt};
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 3000;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: ${MEDIA_BREAK + 72}px) {
    bottom: 84px;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;
export const TopButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  &:hover {
    color: ${theme.text.secondary};
  }
`;
export const BottomButton = styled(TopButton)`
  border-top: 1px solid ${theme.bg.border};
`;

export const BylineContainer = styled.div`
  width: calc(100% + 32px);
  margin-left: -16px;
  margin-right: -16px;
  margin-top: -16px;
  position: relative;
  z-index: 1000;
`;
