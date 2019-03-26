// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import {
  FlexRow,
  FlexCol,
  Gradient,
  Transition,
  hexa,
  Shadow,
  zIndex,
  Truncate,
} from 'src/components/globals';
import { HorizontalRule } from 'src/components/globals';
import Card from 'src/components/card';
import { SingleColumnGrid } from 'src/components/layout';
import Icon from 'src/components/icon';
import { MEDIA_BREAK } from 'src/components/layout';

export const HzRule = styled(HorizontalRule)`
  margin: 0;
`;

export const NotificationCard = styled.div`
  padding: 16px;
  width: 100%;
  padding-bottom: 24px;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  ${props =>
    props.isSeen === false &&
    css`
      box-shadow: inset 2px 0 0 ${theme.brand.default};
      background: ${hexa(theme.brand.default, 0.06)};
    `}

  &:hover {
    background: ${props =>
      props.isSeen ? theme.bg.wash : hexa(theme.brand.default, 0.06)};
  }
`;

export const SegmentedNotificationCard = styled(Card)`
  padding: 0;
  padding-top: 16px;
  transition: ${Transition.hover.off};
  border-radius: 0;
  box-shadow: ${Shadow.low} ${({ theme }) => hexa(theme.text.default, 0.1)};

  &:hover {
    transition: none;
    box-shadow: ${Shadow.high} ${({ theme }) => hexa(theme.text.default, 0.1)};
  }

  ${props =>
    props.isSeen === false &&
    css`
      border-left: 2px solid ${theme.brand.default};
      background: ${hexa(theme.brand.default, 0.06)};
    `}
`;

export const ContentHeading = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.text.default};
  margin: 8px 0;
`;

export const NotificationListContentHeading = styled(ContentHeading)`
  font-size: 16px;
`;

export const Content = styled(FlexCol)`
  margin-left: 8px;
  align-self: stretch;
`;

export const ContentWash = styled(Content)`
  margin: 0;
  background-color: ${props => hexa(props.theme.bg.wash, 0.75)};
  border-radius: ${props => (props.mini ? '0' : '0 0 8px 8px')};
  border-top: 1px solid ${theme.bg.border};
  padding: 8px;
  padding-top: 0;
`;

export const NotificationListContainer = styled(FlexCol)`
  align-self: stretch;
  max-height: 480px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const NotificationListContent = styled(Content)`
  margin-left: 0;
  padding-left: 8px;
`;

export const Message = styled.p`
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.4;
  color: inherit;
  margin-left: 16px;
  position: relative;

  a {
    font-weight: 700;
    transition: ${Transition.hover.off};
    position: relative;

    &:hover {
      color: inherit;
      transition: ${Transition.hover.on};
    }
  }
`;

export const ChatMessage = styled.p`
  position: relative;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  background-color: ${theme.generic.alt};
  background-image: ${({ theme }) =>
    Gradient(theme.generic.alt, theme.generic.default)};
  float: left;
  max-width: 75%;
  margin-top: 24px;
`;

export const NotificationListRow = styled(FlexCol)`
  padding: 16px;
  padding-top: 12px;
  border-bottom: 1px solid ${theme.bg.border};
  justify-content: center;
  align-items: flex-start;
  color: ${theme.text.default};
  position: relative;
  z-index: ${zIndex.card};
  flex: none;
  transition: ${Transition.hover.off};
  max-width: 100%;
  overflow-x: hidden;
  box-shadow: ${props =>
    !props.isSeen ? `inset 2px 0 0 0 ${props.theme.brand.alt}` : 'none'};

  &:last-of-type {
    border-bottom: 1px solid transparent;
  }

  &:hover {
    transition: ${Transition.hover.on};
    background-color: ${({ theme }) => hexa(theme.brand.wash, 0.15)};
    box-shadow: ${props =>
      !props.isSeen
        ? `inset 6px 0 0 0 ${props.theme.brand.alt}`
        : `inset 4px 0 0 0 ${props.theme.brand.alt}`};
    cursor: pointer;
  }
`;

export const SegmentedNotificationListRow = styled(NotificationListRow)`
  padding: 0;
  padding-top: 16px;
`;

export const ActorPhotosContainer = styled(FlexRow)`
  margin: 0;
  margin-left: 4px;
  max-width: 100%;
  flex-wrap: wrap;
`;

export const ActorPhotoItem = styled.div`
  margin: 2px 4px 2px 0;
`;

export const ActorPhoto = styled.img`
  width: 100%;
`;

export const ContextRow = styled(FlexRow)`
  align-items: center;

  > div + div,
  > div + p {
    margin-left: 8px;
  }
  margin-bottom: 8px;
  max-width: 100%;
  overflow: hidden;
`;

export const SuccessContext = styled(ContextRow)`
  color: ${theme.success.alt};
`;

export const SpecialContext = styled(ContextRow)`
  color: ${theme.special.default};
`;

export const ReactionContext = styled(ContextRow)`
  color: ${theme.warn.alt};
`;

export const JoinContext = styled(ContextRow)`
  color: ${theme.space.default};
`;

export const RequestContext = styled(ContextRow)`
  color: ${theme.special.alt};
`;

export const ApprovedContext = styled(ContextRow)`
  color: ${theme.success.default};
`;

export const ThreadContext = styled(ContextRow)`
  color: ${theme.brand.alt};
  margin: 0 16px;
  margin-bottom: 16px;
`;

export const ThreadReactionContext = styled(ContextRow)`
  color: ${theme.brand.alt};
`;

export const CreatedContext = styled(ContextRow)`
  color: ${theme.brand.alt};
  margin: 0 16px;
  margin-bottom: 16px;
`;

export const TextContent = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${theme.text.alt};
  pointer-events: ${props => (props.pointer ? 'all' : 'none')};
  line-height: 1.4;
  padding-right: 16px;
  margin-left: 32px;

  a {
    font-weight: 600;
    color: ${theme.text.default};

    &:hover {
      color: ${theme.brand.alt};
      text-decoration: underline;
    }
  }
`;

export const BubbleContainer = styled(FlexRow)`
  flex: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: ${props => (props.me ? 'flex-end' : 'flex-start')};
`;

export const BubbleGroupContainer = styled(FlexCol)`
  flex: none;
  max-width: 70%;
  position: relative;
  flex-direction: row;
`;

export const Timestamp = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.placeholder};
`;

export const AttachmentsWash = styled(FlexCol)`
  margin-top: 8px;
  align-self: stretch;
  flex: none;
`;

export const StickyHeader = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 16px;
  background: ${props => props.theme.bg.default};
  position: sticky;
  top: 0;
  border-bottom: 1px solid ${theme.bg.border};
  z-index: 10;

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const CloseRequest = styled(Icon)`
  margin-left: 8px;
  color: ${theme.text.placeholder};
`;

export const ButtonsRow = styled.div`
  display: flex;
  align-items: center;
  align-content: stretch;
  padding: 0 16px;

  div {
    display: flex;
    flex: 1 0 auto;
    margin-right: 8px;
  }

  div:last-child {
    margin-right: 0;
  }

  button {
    display: flex;
    flex: 1 0 auto;
  }
`;

export const ChannelCard = styled.div`
  padding: 0 16px;
  border-radius: 8px;
  box-shadow: ${Shadow.low} ${({ theme }) => hexa(theme.text.default, 0.1)};
  margin: 8px;
  background: ${theme.bg.default};
  display: flex;
  justify-content: space-between;

  a {
    display: flex;
    flex: 1 0 auto;
  }
`;

export const ChannelName = styled.p`
  display: flex;
  flex: 1 0 auto;
  padding: 16px 8px 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: ${theme.text.default};
  ${Truncate};
`;

export const ToggleNotificationsContainer = styled.div`
  display: flex;
  color: ${theme.text.alt};
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
`;

export const StyledSingleColumn = styled(SingleColumnGrid)`
  border-left: 1px solid ${theme.bg.border};
  border-right: 1px solid ${theme.bg.border};
`;
