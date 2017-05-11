//@flow
import React from 'react';
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
import { LoadingCard } from '../../components/loading';
import AppViewWrapper from '../../components/appViewWrapper';
import { NotificationCard, Content, ContentHeading, Message } from './style';
import {
  constructMessage,
  constructContent,
  getIconByType,
  getColorByType,
} from '../../helpers/notifications';
import { getNotifications } from './queries';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

const NotificationsPure = props => {
  const { data: { notifications: { edges } } } = props;
  return (
    <AppViewWrapper>
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
    </AppViewWrapper>
  );
};

const Notifications = compose(getNotifications, displayLoadingState, pure)(
  NotificationsPure
);

export default Notifications;
