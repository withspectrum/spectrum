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
} from '../../helpers/notifications';
import { getNotifications } from './queries';
import { UpsellSignIn } from '../../components/upsell';

const NotificationsPure = ({ data, currentUser }) => {
  // our router should prevent this from happening, but just in case
  if (!currentUser) {
    return <UpsellSignIn />;
  }

  // const { notifications: { edges } } = data;

  return (
    <AppViewWrapper>
      <Column type={'primary'}>
        {/* {edges.map(({ node: notification }) => (
          <NotificationCard key={notification.id}>
            <FlexRow center>
              <Icon glyph={getIconByType(notification.type)} />
              <Message>{constructMessage(notification)}</Message>
            </FlexRow>
            <Content>
              <ContentHeading>{notification.content.title}</ContentHeading>
              {constructContent(notification)}
            </Content>
          </NotificationCard>
        ))} */}
      </Column>
    </AppViewWrapper>
  );
};

const Notifications = compose(pure)(NotificationsPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(Notifications);
