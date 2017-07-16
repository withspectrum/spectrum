// @flow
// $FlowFixMe
import styled from 'styled-components';
import {
  FlexRow,
  FlexCol,
  Gradient,
  Transition,
  hexa,
  Shadow,
} from '../../components/globals';
import { HorizontalRule } from '../../components/globals';
import Card from '../../components/card';

export const HzRule = styled(HorizontalRule)`
  margin: 0;
`;

export const NotificationCard = styled(Card)`
  padding: 16px;
  padding-bottom: 24px;
  overflow: hidden;
  transition: ${Transition.hover.off};

  &:hover {
    transition: none;
    box-shadow: ${Shadow.high} ${({ theme }) => hexa(theme.text.default, 0.1)};
  }
`;

export const SegmentedNotificationCard = styled(Card)`
  padding: 0;
  padding-top: 16px;
  transition: ${Transition.hover.off};

  &:hover {
    transition: none;
    box-shadow: ${Shadow.high} ${({ theme }) => hexa(theme.text.default, 0.1)};
  }
`;

export const ContentHeading = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.default};
  margin: 8px 0;
`;

export const NotificationListContentHeading = styled(ContentHeading)`
  font-size: 16px;
`;

export const Content = styled(FlexCol)`
  margin-left: 40px;
  align-self: stretch;
`;

export const ContentWash = styled(Content)`
  margin: 0;
  background-color: ${props => hexa(props.theme.bg.wash, 0.75)};
  border-radius: ${props => (props.mini ? '0' : '0 0 12px 12px')};
  border-top: 2px solid ${props => props.theme.bg.wash};
  padding: 16px;
  padding-top: 8px;
`;

export const NotificationListContainer = styled(FlexCol)`
  align-self: stretch;
  max-height: 480px;
  overflow-y: scroll;
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
  background-color: ${({ theme }) => theme.generic.alt};
  background-image: ${({ theme }) =>
    Gradient(theme.generic.alt, theme.generic.default)};
  float: left;
  max-width: 75%;
  margin-top: 24px;
`;

export const NotificationListRow = styled(FlexCol)`
  padding: 16px;
  padding-top: 12px;
  border-bottom: 2px solid ${({ theme }) => theme.bg.wash};
  justify-content: center;
  align-items: flex-start;
  color: ${({ theme }) => theme.text.default};
  position: relative;
  z-index: 2;
  flex: none;
  transition: ${Transition.hover.off};
  max-width: 100%;
  overflow-x: hidden;

  &:last-of-type {
    border-bottom: 2px solid transparent;
  }

  &:hover {
    transition: ${Transition.hover.on};
    background-color: ${({ theme }) => hexa(theme.space.soft, 0.15)};
    box-shadow: inset 8px 0 0 0 ${({ theme }) => theme.brand.alt};
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
  overflow-x: hidden;
`;

export const ActorPhotoItem = styled.div`margin-right: 4px;`;

export const ActorPhoto = styled.img`width: 100%;`;

export const ContextRow = styled(FlexRow)`
  align-items: center;

  > div + div, > div + p {
    margin-left: 8px;
  }
  margin-bottom: 8px;
`;

export const SuccessContext = styled(ContextRow)`
  color: ${({ theme }) => theme.success.default};
`;

export const ReactionContext = styled(ContextRow)`
  color: ${({ theme }) => theme.warn.default};
`;

export const JoinContext = styled(ContextRow)`
  color: ${({ theme }) => theme.success.alt};
`;

export const ThreadContext = styled(ContextRow)`
  color: ${({ theme }) => theme.brand.default};
  margin: 0 16px;
  margin-bottom: 16px;
`;

export const CreatedContext = styled(ContextRow)`
  color: ${({ theme }) => theme.brand.default};
  margin: 0 16px;
  margin-bottom: 16px;
`;

export const TextContent = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  pointer-events: ${props => (props.pointer ? 'all' : 'none')};
  line-height: 1.4;

  a {
    font-weight: 600;
    color: ${props => props.theme.text.default};

    &:hover {
      color: ${props => props.theme.brand.alt};
      text-decoration: underline;
    }
  }
`;

export const BubbleContainer = styled(FlexRow)`
  flex: none;
  justify-content: ${props => (props.me ? 'flex-end' : 'flex-start')};
`;

export const BubbleGroupContainer = styled(FlexCol)`
  flex: none;
  max-width: 70%;
  position: relative;
`;

export const Timestamp = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.placeholder};
`;

export const AttachmentsWash = styled(FlexCol)`
  margin-top: 8px;
  align-self: stretch;
  flex: none;
`;
