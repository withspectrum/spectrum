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
import {
  NotificationListContainer,
  NotificationListRow,
  Message,
} from '../style';
import {
  constructLinklessMessage,
  getIconByType,
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
              <Icon glyph={getIconByType(notification.node.type)} />
              <Message>{constructLinklessMessage(notification.node)}</Message>
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
