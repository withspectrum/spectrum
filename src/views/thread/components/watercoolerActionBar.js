// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Clipboard from 'react-clipboard.js';
import { addToastWithTimeout } from 'src/actions/toasts';
import { openModal } from 'src/actions/modals';
import Icon from 'src/components/icon';
import compose from 'recompose/compose';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import toggleThreadNotificationsMutation from 'shared/graphql/mutations/thread/toggleThreadNotifications';
import type { Dispatch } from 'redux';
import { Button } from 'src/components/button';
import { LikeButton } from 'src/components/threadLikes';
import {
  ShareButtons,
  ShareButton,
  WatercoolerActionBarContainer,
} from '../style';

type Props = {
  thread: GetThreadType,
  currentUser: Object,
  dispatch: Dispatch<Object>,
  toggleThreadNotifications: Function,
};

type State = {
  notificationStateLoading: boolean,
};

class WatercoolerActionBar extends React.Component<Props, State> {
  state = { notificationStateLoading: false };

  toggleNotification = () => {
    const { thread, dispatch, toggleThreadNotifications } = this.props;
    const threadId = thread.id;

    this.setState({
      notificationStateLoading: true,
    });

    toggleThreadNotifications({
      threadId,
    })
      .then(({ data: { toggleThreadNotifications } }) => {
        this.setState({
          notificationStateLoading: false,
        });

        if (toggleThreadNotifications.receiveNotifications) {
          return dispatch(
            addToastWithTimeout('success', 'Notifications activated!')
          );
        } else {
          return dispatch(
            addToastWithTimeout('neutral', 'Notifications turned off')
          );
        }
      })
      .catch(err => {
        this.setState({
          notificationStateLoading: true,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { thread, currentUser } = this.props;
    const { notificationStateLoading } = this.state;

    return (
      <WatercoolerActionBarContainer>
        <div style={{ display: 'flex' }}>
          <LikeButton thread={thread} tipLocation={'bottom-right'} />

          {!thread.channel.isPrivate && (
            <ShareButtons>
              <ShareButton
                facebook
                tipText={'Share'}
                tipLocation={'top-left'}
                data-cy="thread-facebook-button"
              >
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://spectrum.chat/thread/${
                    thread.id
                  }&t=${thread.content.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon glyph={'facebook'} />
                </a>
              </ShareButton>

              <ShareButton
                twitter
                tipText={'Tweet'}
                tipLocation={'top-left'}
                data-cy="thread-tweet-button"
              >
                <a
                  href={`https://twitter.com/share?text=${
                    thread.content.title
                  } on @withspectrum&url=https://spectrum.chat/thread/${
                    thread.id
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon glyph={'twitter'} />
                </a>
              </ShareButton>

              <Clipboard
                style={{ background: 'none' }}
                data-clipboard-text={`https://spectrum.chat/thread/${
                  thread.id
                }`}
                onSuccess={() =>
                  this.props.dispatch(
                    addToastWithTimeout('success', 'Copied to clipboard')
                  )
                }
              >
                <ShareButton
                  tipText={'Copy link'}
                  tipLocation={'top-left'}
                  data-cy="thread-copy-link-button"
                >
                  <a>
                    <Icon glyph={'link'} />
                  </a>
                </ShareButton>
              </Clipboard>
            </ShareButtons>
          )}
        </div>

        {currentUser ? (
          <Button
            tipText={
              thread.receiveNotifications
                ? 'Turn off notifications'
                : 'Get notified about replies'
            }
            tipLocation={'top-right'}
            loading={notificationStateLoading}
            onClick={this.toggleNotification}
            data-cy="thread-notifications-toggle"
          >
            <Icon
              glyph={
                thread.receiveNotifications
                  ? 'notification-fill'
                  : 'notification'
              }
            />
            {thread.receiveNotifications ? 'Subscribed' : 'Get notifications'}
          </Button>
        ) : (
          <Button
            tipText={'Get notified about replies'}
            tipLocation={'top-right'}
            data-cy="thread-notifications-login-capture"
            onClick={() =>
              this.props.dispatch(openModal('CHAT_INPUT_LOGIN_MODAL', {}))
            }
          >
            <Icon glyph="notification" />
            Notify me
          </Button>
        )}
      </WatercoolerActionBarContainer>
    );
  }
}

export default compose(
  connect(),
  toggleThreadNotificationsMutation
)(WatercoolerActionBar);
