//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';

import Icon from '../../../components/icons';
import { Loading } from '../../../components/loading';
import { FlexCol } from '../../../components/globals';
import {
  NotificationListContainer,
  NotificationListRow,
  NotificationListContent,
  NotificationListContentHeading,
  Message,
} from '../style';
import {
  constructLinklessMessage,
  getIconByType,
  getColorByType,
} from '../../../helpers/notifications';
import { getNotifications } from '../queries';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const NotificationListPure = props => {
  const { data: { notifications: { edges } } } = props;
  return (
    <NotificationListContainer>
      {edges.map((notification, i) => {
        return (
          <Link key={i} to={`/story/${notification.node.story.id}`}>
            <NotificationListRow>
              <Icon
                icon={getIconByType(notification.node.type)}
                color={getColorByType(notification.node.type)}
                hoverColor={getColorByType(notification.node.type)}
              />
              <FlexCol>
                <Message>{constructLinklessMessage(notification.node)}</Message>
                <NotificationListContent>
                  <NotificationListContentHeading>
                    {notification.node.content.title}
                  </NotificationListContentHeading>
                </NotificationListContent>
              </FlexCol>
            </NotificationListRow>
          </Link>
        );
      })}
    </NotificationListContainer>
  );
};

const NotificationList = compose(getNotifications, displayLoadingState, pure)(
  NotificationListPure
);

export default NotificationList;
