//@flow
import React from 'react';
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
import Icon from '../../components/icons';
import { Column } from '../../components/column';
import { FlexRow } from '../../components/globals';
import Loading from '../../components/loading';
import {
  DashboardContainer,
  NotificationCard,
  Content,
  ContentHeading,
  Message,
  HorizontalRuleWithIcon,
  ChatMessage,
} from './style';
import { getNotifications } from './queries';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const icons = {
  NEW_STORY: 'write',
  NEW_MESSAGE: 'messages',
  default: 'notification',
};

const colors = {
  NEW_STORY: 'success.default',
  NEW_MESSAGE: 'warn.alt',
};

const getIconByType = type => {
  return icons[type] || icons.default;
};

const getColorByType = type => {
  return colors[type];
};

const constructMessage = notification => {
  const { type, sender, community, frequency, story } = notification;
  switch (type) {
    case 'NEW_STORY':
      return (
        <span>
          <Link to={`/@${sender.username}`}>{sender.displayName}</Link>
          {' '}posted a new thread in{' '}
          <Link to={`/${community.slug}/${frequency.slug}`}>
            {community.name}/{frequency.name}
          </Link>
          :
        </span>
      );
    case 'NEW_MESSAGE':
      return (
        <span>
          <Link to={`/@${sender.username}`}>{sender.displayName}</Link>
          {' '}replied to your{' '}
          <Link to={`/story/${story.id}`}>thread</Link>:
        </span>
      );
    default:
      return;
  }
};

const constructContent = notification => {
  const { type, sender, content } = notification;
  switch (type) {
    case 'NEW_STORY':
      return <p>{content.excerpt}</p>;
    case 'NEW_MESSAGE':
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
          <ChatMessage data-from={sender.displayName}>
            {content.excerpt}
          </ChatMessage>
        </div>
      );
    default:
      return;
  }
};

const NotificationsPure = props => {
  const { data: { notifications: { edges } } } = props;
  return (
    <DashboardContainer justifyContent={'center'} alignContent={'flex-start'}>
      <Column type={'primary'}>
        {edges.map(({ node: notification }) => (
          <NotificationCard key={notification.id}>
            <FlexRow center>
              <Icon
                icon={getIconByType(notification.type)}
                color={getColorByType(notification.type)}
                hoverColor={getColorByType(notification.type)}
              />
              <Message>{constructMessage(notification)}</Message>
            </FlexRow>
            <Content>
              <ContentHeading>{notification.content.title}</ContentHeading>
              {constructContent(notification)}
            </Content>
          </NotificationCard>
        ))}
      </Column>
    </DashboardContainer>
  );
};

const Notifications = compose(getNotifications, displayLoadingState, pure)(
  NotificationsPure
);

export default Notifications;
