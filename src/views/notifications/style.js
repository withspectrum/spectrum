// @flow
// $FlowFixMe
import styled from 'styled-components';
import {
  FlexRow,
  FlexCol,
  Gradient,
  Transition,
} from '../../components/globals';
import Card from '../../components/card';

export const NotificationCard = styled(Card)`
  padding: 16px;
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

export const StatusBar = styled(FlexRow)`
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border-radius: 12px 12px 0 0;
  background-color: ${({ theme }) => theme.brand.alt};
  background-image: ${({ theme }) => Gradient(theme.brand.alt, theme.brand.default)};
`;

export const Content = styled.div`
  font-size: 0.875rem;
  line-height: 1.4;
  margin-left: 40px;
  width: 100%;
`;

export const NotificationListContainer = styled(FlexCol)`
  align-self: stretch;
  max-height: 480px;
  overflow-y: scroll;
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

    &:hover{
      color: inherit;
      transition: ${Transition.hover.on};
    }
  }
`;

export const ChatMessage = styled.p`
  position: relative;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.generic.alt};
  background-image: ${({ theme }) => Gradient(theme.generic.alt, theme.generic.default)};
  float: left;
  max-width: 75%;
  margin-top: 24px;

  &:before {
    content: attr(data-from);
    position: absolute;
    left: 16px;
    bottom: calc(100% + 4px);
    font-size: 11px;
    color: ${({ theme }) => theme.text.alt};
    font-weight: 600;
  }
`;

export const NotificationListRow = styled.div`
  padding: 12px 16px 16px;
  border-bottom: 2px solid ${({ theme }) => theme.bg.wash};
  justify-content: center;
  align-items: flex-start;
  color: ${({ theme }) => theme.text.default};
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  flex: 1 0 auto;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background-color: #FAFCFD;
    cursor: pointer;
  }
`;

export const ActorPhotosContainer = styled.ul`
  list-style-type: none;
  margin: 0;
`;

export const ActorPhotoItem = styled.li`
  display: inline-block;
  margin-right: 4px;
  border: 1px solid rgba(0,0,0,0.05);
  width: 24px;
  height: 24px;
  border-radius: 24px;
  overflow: hidden;
`;

export const ActorPhoto = styled.img`
  width: 100%;
`;

export const ContextRow = styled(FlexRow)`
  color: ${({ theme }) => theme.success.default};
  align-items: center;
`;

export const TextContent = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  pointer-events: ${props => (props.pointer ? 'all' : 'none')};
  line-height: 1.4;
  margin-left: 8px;

  a {
    font-weight: 600;
    color: ${props => props.theme.text.default};
  }
`;

export const BubbleContainer = styled.div`
  display: flex;
  justify-content: ${props => (props.me ? 'flex-end' : 'flex-start')};
`;

export const BubbleGroupContainer = styled.div`
  display: flex;
  flex: 0 0 auto;
  max-width: 70%;
  align-self: ${props => (props.me ? 'flex-end' : 'flex-start')};
  position: relative;
`;

export const Timestamp = styled.span`
  font-weight: 500;
  color: ${props => props.theme.text.placeholder};
`;

export const AttachmentsWash = styled(FlexCol)`
  align-self: stretch;
  margin-top: 8px;
  padding: 16px;
  border-radius: ${props => (props.mini ? '0' : '0 0 12px 12px')};
  border-top: 2px solid ${props => props.theme.bg.wash};
`;
