// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Checkbox } from 'src/components/formElements';
import WebPushManager from 'src/helpers/web-push-manager';
import { track } from 'src/helpers/events';
import { addToastWithTimeout } from 'src/actions/toasts';
import { subscribeToWebPush } from 'shared/graphql/subscriptions';
import { ListContainer, Notice } from 'src/components/listItems/style';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';
import { EmailListItem } from '../style';

type State = {
  webPushBlocked: boolean,
  subscription: ?any,
};

type Props = {
  subscribeToWebPush: Function,
  dispatch: Function,
  smallOnly?: boolean,
  largeOnly?: boolean,
};

class NotificationSettings extends React.Component<Props, State> {
  state = {
    webPushBlocked: false,
    subscription: null,
  };

  componentDidMount() {
    WebPushManager.getPermissionState().then(result => {
      if (result === 'denied') {
        this.setState({
          webPushBlocked: true,
        });
      }
    });
    WebPushManager.getSubscription().then(subscription => {
      this.setState({
        subscription: subscription || false,
      });
    });
  }

  subscribeToWebPush = () => {
    track('browser push notifications', 'prompt triggered');
    WebPushManager.subscribe()
      .then(subscription => {
        track('browser push notifications', 'subscribed');
        this.setState({
          subscription,
          webPushBlocked: false,
        });
        return this.props.subscribeToWebPush(subscription);
      })
      .catch(err => {
        track('browser push notifications', 'blocked');
        return this.props.dispatch(
          addToastWithTimeout(
            'error',
            "Oops, we couldn't enable browser notifications for you. Please try again!"
          )
        );
      });
  };

  unsubscribeFromWebPush = () => {
    track('browser push notifications', 'unsubscription triggered');
    WebPushManager.unsubscribe()
      .then(result => {
        if (result) {
          track('browser push notifications', 'unsubscribe');
          this.setState({
            subscription: false,
          });
        } else {
          return this.props.dispatch(
            addToastWithTimeout(
              'error',
              "Oops, we couldn't disable browser notifications for you. Please try again!"
            )
          );
        }
      })
      .catch(() => {
        return this.props.dispatch(
          addToastWithTimeout(
            'error',
            "Oops, we couldn't disable browser notifications for you. Please try again!"
          )
        );
      });
  };

  render() {
    const { webPushBlocked, subscription } = this.state;
    const onChange = !subscription
      ? this.subscribeToWebPush
      : this.unsubscribeFromWebPush;

    return (
      <SectionCard
        smallOnly={this.props.smallOnly}
        largeOnly={this.props.largeOnly}
      >
        <SectionTitle>Notification Preferences</SectionTitle>
        <ListContainer>
          <EmailListItem>
            {subscription !== null && (
              <Checkbox
                checked={!!subscription}
                disabled={webPushBlocked}
                onChange={onChange}
              >
                Enable browser push notifications
              </Checkbox>
            )}
            {webPushBlocked && (
              <Notice>
                <strong>
                  You have blocked browser push notifications on this device!
                </strong>{' '}
                Unblock them by following{' '}
                <a href="https://support.sendpulse.com/456261-How-to-Unblock-Web-Push-Notifications">
                  these steps
                </a>.
              </Notice>
            )}
          </EmailListItem>
        </ListContainer>
      </SectionCard>
    );
  }
}

export default compose(subscribeToWebPush, connect())(NotificationSettings);
