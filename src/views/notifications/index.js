//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import Icon from '../../components/icons';
import { Column } from '../../components/column';
import { FlexRow } from '../../components/globals';
import AppViewWrapper from '../../components/appViewWrapper';
import { displayLoadingScreen } from '../../components/loading';
import { NotificationCard, Content, ContentHeading, Message } from './style';
import {
  constructMessage,
  constructContent,
  getIconByType,
  getColorByType,
} from '../../helpers/notifications';
import { getNotifications } from './queries';

const NotificationsPure = ({ data, currentUser }) => {
  if (!currentUser) {
    window.location.href = '/';
    return null;
  }

  const { notifications: { edges } } = data;

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

const Notifications = compose(getNotifications, displayLoadingScreen, pure)(
  NotificationsPure
);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(Notifications);
