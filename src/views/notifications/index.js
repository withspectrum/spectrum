//@flow
import React from 'react';
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import Icon from '../../components/icons';
import { Column } from '../../components/column';
import {
  DashboardContainer,
  NotificationCard,
  NotificationBody,
  Content,
  ContentHeading,
  Message,
  HorizontalRuleWithIcon,
  ChatMessage,
} from './style';

const data = [
  {
    threadID: 'asdflkjasdflkjadflkj',
    activityType: 'new-story',
    community: 'Spectrum',
    frequency: 'General',
    threadName: '📍 New features: Highlight new stories, fix scrolling position, and more!',
    threadContent: "Today we shipped a bunch of new features for y'all! The first is highlighting stories. We think the most valuable piece of data is that there is...",
    triggerMessage: '',
    read: false,
    sender: 'Max Stoiber',
    timestamp: 1489352567485,
  },
  {
    threadID: 'asdflkjasdflkjadflk',
    activityType: 'new-message',
    content: "I've had like 2 drops in ~50 hours. Not perfect by any means 😭",
    community: 'Spectrum',
    frequency: 'General',
    threadName: 'How bout dat Zelda tho?',
    threadContent: 'some content',
    triggerMessage: "OMG. It's so tough to get Dinayru's horn!",
    read: false,
    sender: 'Bryn Jackson',
    timestamp: 1490994669642,
  },
  {
    threadID: 'asdflkjasdflkjadfl',
    activityType: 'new-story',
    community: 'Spectrum',
    frequency: 'General',
    threadName: '📍 New features: Highlight new stories, fix scrolling position, and more!',
    threadContent: "Today we shipped a bunch of new features for y'all!",
    triggerMessage: '',
    read: true,
    sender: 'Brian Lovin',
    timestamp: 1489352567484,
  },
];

const getIconByType = notification => {
  switch (notification.activityType) {
    case 'new-story':
      return 'write';
    case 'new-message':
      return 'messages';
    default:
      return 'notification';
  }
};

const getColorByType = notification => {
  switch (notification.activityType) {
    case 'new-story':
      return 'success.default';
    case 'new-message':
      return 'warn.alt';
    default:
      return;
  }
};

const constructMessage = notification => {
  const {
    activityType,
    sender,
    community,
    frequency,
    threadID,
    threadName,
  } = notification;
  switch (activityType) {
    case 'new-story':
      return (
        <span>
          <Link to={`/@${sender}`}>{sender}</Link>
          {' '}
          posted a new thread in
          {' '}
          <Link to={`/${community}/${frequency}`}>{community}/{frequency}</Link>
          :
        </span>
      );
    case 'new-message':
      return (
        <span>
          <Link to={`/@${sender}`}>{sender}</Link>
          {' '}
          replied to your
          {' '}
          <Link to={`/thread/${threadID}`}>thread</Link>
          :
        </span>
      );
    default:
      return;
  }
};

const constructContent = notification => {
  const {
    activityType,
    sender,
    community,
    frequency,
    threadID,
    threadName,
    threadContent,
    triggerMessage,
  } = notification;
  switch (activityType) {
    case 'new-story':
      return <p>{threadContent}</p>;
    case 'new-message':
      return (
        <div>
          <HorizontalRuleWithIcon>
            <hr />
            <Icon
              icon={'messages'}
              color="border.default"
              hoverColor="border.default"
            />
            <hr />
          </HorizontalRuleWithIcon>
          <ChatMessage data-from={sender}>
            {triggerMessage}
          </ChatMessage>
        </div>
      );
    default:
      return;
  }
};

const NotificationsPure = () => (
  <DashboardContainer justifyContent={'center'} alignContent={'flex-start'}>

    <Column type={'primary'}>
      {data.map(notification => (
        <NotificationCard key={notification.timestamp.toString()}>
          <FlexRow center>
            <Icon
              icon={getIconByType(notification)}
              color={getColorByType(notification)}
              hoverColor={getColorByType(notification)}
            />
            <Message>{constructMessage(notification)}</Message>
          </FlexRow>
          <Content>
            <ContentHeading>{notification.threadName}</ContentHeading>
            {constructContent(notification)}
          </Content>
        </NotificationCard>
      ))}
    </Column>
  </DashboardContainer>
);

const Notifications = compose(pure)(NotificationsPure);

export default Notifications;
