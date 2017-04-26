//@flow
import React from 'react';
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import Card from '../../components/card';
import Icon from '../../components/icons';
import { FlexCol, FlexRow } from '../../components/globals';
import { Column } from '../../components/column';
import {
  DashboardContainer,
  NotificationCard,
  NotificationBody,
  StatusBar,
  Content,
  Message,
  Status,
} from './style';

const data = [
  {
    threadID: 'asdflkjasdflkjadflkj',
    activityType: 'new-story',
    content: 'New features: Highlight new stories, fix scrolling position, and more!',
    community: 'Spectrum',
    frequency: 'General',
    threadName: 'New features: Highlight new stories, fix scrolling position, and more!',
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
    read: false,
    sender: 'Bryn Jackson',
    timestamp: 1490994669642,
  },
  {
    threadID: 'asdflkjasdflkjadfl',
    activityType: 'new-story',
    content: 'New features: Highlight new stories, fix scrolling position, and more!',
    community: 'Spectrum',
    frequency: 'General',
    threadName: 'New features: Highlight new stories, fix scrolling position, and more!',
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
      return 'send';
    default:
      return;
  }
};

const getStatusByType = notification => {
  switch (notification.activityType) {
    case 'new-story':
      return `New Story!`;
    case 'new-message':
      return `New Message!`;
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
          <Link to={`/${community}/${frequency}`}>{frequency}</Link>
          !
        </span>
      );
    case 'new-message':
      return (
        <span>
          <Link to={`/@${sender}`}>{sender}</Link>
          {' '}
          replied to your thread
          {' '}
          <Link to={`/thread/${threadID}`}>{threadName}</Link>!
        </span>
      );
      `${sender} replied to your thread "${threadName}"`;
    default:
      return;
  }
};

data.map(notification => console.log('notification: ', notification));

const NotificationsPure = () => (
  <DashboardContainer justifyContent={'center'} alignContent={'flex-start'}>

    <Column type={'primary'}>
      {data.map(notification => (
        <NotificationCard key={notification.timestamp.toString()}>
          <StatusBar>
            <Icon
              icon={getIconByType(notification)}
              color={'text.reverse'}
              hoverColor={'text.reverse'}
            />
            <span />
            <Status>{getStatusByType(notification)}</Status>
          </StatusBar>
          <NotificationBody>
            <Message>{constructMessage(notification)}</Message>
            <Content>{notification.content}</Content>
          </NotificationBody>
        </NotificationCard>
      ))}
    </Column>
  </DashboardContainer>
);

const Notifications = compose(pure)(NotificationsPure);

export default Notifications;
