// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { addToastWithTimeout } from '../../../actions/toasts';
import Icon from '../../../components/icons';
import compose from 'recompose/compose';
import { Button, TextButton, IconButton } from '../../../components/buttons';
import Flyout from '../../../components/flyout';
import { track } from '../../../helpers/events';
import { toggleThreadNotificationsMutation } from '../mutations';
import { toJSON } from 'shared/draft-utils';
import {
  FollowButton,
  ShareButtons,
  ShareButton,
  ActionBarContainer,
  FlyoutRow,
  DropWrap,
  EditDone,
  Label,
} from '../style';

type Props = {
  thread: {
    id: string,
    isCreator: boolean,
    content: {
      title: string,
    },
    creator: {
      contextPermissions: {
        reputation: number,
        isMember: boolean,
        isOwner: boolean,
      },
    },
    channel: {
      channelPermissions: {
        isMember: boolean,
        isOwner: boolean,
        isModerator: boolean,
      },
    },
    community: {
      name: string,
      pinnedThreadId: string,
      communityPermissions: {
        isMember: boolean,
        isOwner: boolean,
      },
    },
  },
  currentUser: Object,
  isEditing: boolean,
  dispatch: Function,
  toggleThreadNotifications: Function,
  toggleEdit: Function,
  saveEdit: Function,
  togglePinThread: Function,
  pinThread: Function,
  triggerDelete: Function,
  threadLock: Function,
  isSavingEdit: boolean,
};
type State = {
  notificationStateLoading: boolean,
  flyoutOpen: boolean,
};
class ActionBar extends React.Component<Props, State> {
  state = {
    notificationStateLoading: false,
    flyoutOpen: false,
  };

  toggleFlyout = val => {
    if (val) {
      return this.setState({ flyoutOpen: val });
    }

    if (this.state.flyoutOpen === false) {
      return this.setState({ flyoutOpen: true });
    } else {
      return this.setState({ flyoutOpen: false });
    }
  };

  copyLink = () => {
    try {
      // creating new textarea element and giveing it id 't'
      let t = document.createElement('input');
      t.id = 't';
      // Optional step to make less noise in the page, if any!
      // $FlowIssue
      t.style.height = 0;
      // You have to append it to your page somewhere, I chose <body>
      // $FlowIssue
      document.body.appendChild(t);
      // Copy whatever is in your div to our new textarea
      t.value = `https://spectrum.chat/thread/${this.props.thread.id}`;
      // Now copy whatever inside the textarea to clipboard
      let selector = document.querySelector('#t');
      // $FlowIssue
      selector.select();
      document.execCommand('copy');
      // Remove the textarea
      // $FlowIssue
      document.body.removeChild(t);
      this.props.dispatch(
        addToastWithTimeout('success', 'Copied to clipboard')
      );
    } catch (err) {
      return;
    }
  };

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
          track('thread', 'notifications turned on', null);
          dispatch(addToastWithTimeout('success', 'Notifications activated!'));
        } else {
          track('thread', 'notifications turned off', null);
          dispatch(addToastWithTimeout('neutral', 'Notifications turned off'));
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
    const { thread, currentUser, isEditing, isSavingEdit } = this.props;
    const { notificationStateLoading, flyoutOpen } = this.state;
    const isChannelMember = thread.channel.channelPermissions.isMember;
    const isChannelOwner = thread.channel.channelPermissions.isOwner;
    const isCommunityOwner = thread.community.communityPermissions.isOwner;
    const authorIsCommunityOwner =
      thread.creator.contextPermissions &&
      thread.creator.contextPermissions.isOwner;
    const isPinned = thread.community.pinnedThreadId === thread.id;

    if (isEditing) {
      return (
        <ActionBarContainer>
          <div style={{ display: 'flex' }} />
          <div style={{ display: 'flex' }}>
            <EditDone>
              <TextButton onClick={this.props.toggleEdit}>Cancel</TextButton>
            </EditDone>
            <EditDone>
              <Button loading={isSavingEdit} onClick={this.props.saveEdit}>
                Save
              </Button>
            </EditDone>
          </div>
        </ActionBarContainer>
      );
    } else {
      return (
        <ActionBarContainer>
          <div style={{ display: 'flex' }}>
            {currentUser && (
              <FollowButton
                icon={
                  thread.receiveNotifications
                    ? 'notification-fill'
                    : 'notification'
                }
                tipText={
                  thread.receiveNotifications
                    ? 'Turn off notifications'
                    : 'Get notified about replies'
                }
                tipLocation={'top-right'}
                loading={notificationStateLoading}
                onClick={this.toggleNotification}
              >
                {thread.receiveNotifications
                  ? 'Following conversation'
                  : 'Follow conversation'}
              </FollowButton>
            )}

            <ShareButtons>
              <ShareButton
                facebook
                tipText={'Share on Facebook'}
                tipLocation={'top-right'}
              >
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://spectrum.chat/thread/${thread.id}&t=${thread
                    .content.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon glyph={'facebook'} size={24} />
                </a>
              </ShareButton>

              <ShareButton
                twitter
                tipText={'Share on Twitter'}
                tipLocation={'top-right'}
              >
                <a
                  href={`https://twitter.com/share?text=${thread.content
                    .title} on @withspectrum&url=https://spectrum.chat/thread/${thread.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon glyph={'twitter'} size={24} />
                </a>
              </ShareButton>

              <ShareButton
                onClick={this.copyLink}
                tipText={'Copy link'}
                tipLocation={'top-right'}
              >
                <a>
                  <Icon glyph={'link'} size={24} />
                </a>
              </ShareButton>
            </ShareButtons>
          </div>

          <div style={{ display: 'flex' }}>
            {currentUser &&
              isChannelMember &&
              (isChannelOwner || isCommunityOwner || thread.isCreator) && (
                <DropWrap className={flyoutOpen ? 'open' : ''}>
                  <IconButton
                    glyph="settings"
                    tipText={'Thread settings'}
                    tipLocation={'top-left'}
                    onClick={this.toggleFlyout}
                  />
                  <Flyout>
                    {window.innerWidth < 1024 && (
                      <FlyoutRow>
                        <TextButton
                          icon={
                            thread.receiveNotifications
                              ? 'notification-fill'
                              : 'notification'
                          }
                          hoverColor={'text.default'}
                          onClick={this.toggleNotification}
                        >
                          {thread.receiveNotifications
                            ? 'Unfollow conversation'
                            : 'Follow conversation'}
                        </TextButton>
                      </FlyoutRow>
                    )}

                    {thread.isCreator && (
                      <FlyoutRow>
                        <TextButton
                          icon="edit"
                          hoverColor="text.alt"
                          tipText="Edit"
                          tipLocation="top-left"
                          onClick={this.props.toggleEdit}
                          hoverColor={'text.default'}
                        >
                          <Label>Edit</Label>
                        </TextButton>
                      </FlyoutRow>
                    )}

                    {isCommunityOwner &&
                      !thread.channel.isPrivate && (
                        <FlyoutRow>
                          <TextButton
                            icon={isPinned ? 'pin-fill' : 'pin'}
                            hoverColor={
                              isPinned ? 'warn.default' : 'special.default'
                            }
                            tipText={
                              isPinned
                                ? 'Un-pin thread'
                                : `Pin in ${thread.community.name}`
                            }
                            tipLocation="top-left"
                            onClick={this.props.togglePinThread}
                          >
                            <Label>{isPinned ? 'Unpin' : 'Pin'}</Label>
                          </TextButton>
                        </FlyoutRow>
                      )}

                    {(isChannelOwner || isCommunityOwner) && (
                        <FlyoutRow>
                          <TextButton
                            icon="freeze"
                            hoverColor="space.alt"
                            tipText={
                              thread.isLocked ? 'Unfreeze chat' : 'Freeze chat'
                            }
                            tipLocation="top-left"
                            onClick={this.props.threadLock}
                          >
                            <Label>
                              {thread.isLocked ? 'Unfreeze' : 'Freeze'}
                            </Label>
                          </TextButton>
                        </FlyoutRow>
                      )}

                    {(thread.isCreator ||
                      isChannelOwner ||
                      isCommunityOwner) && (
                        <FlyoutRow>
                          <TextButton
                            icon="delete"
                            hoverColor="warn.alt"
                            tipText="Delete thread"
                            tipLocation="top-left"
                            onClick={this.props.triggerDelete}
                          >
                            <Label>Delete</Label>
                          </TextButton>
                        </FlyoutRow>
                      )}
                  </Flyout>
                </DropWrap>
              )}
          </div>
          {flyoutOpen && (
            <div
              style={{
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: 'transparent',
                zIndex: 3002,
              }}
              onClick={() =>
                setTimeout(() => {
                  this.toggleFlyout(false);
                })}
            />
          )}
        </ActionBarContainer>
      );
    }
  }
}

export default compose(connect(), toggleThreadNotificationsMutation)(ActionBar);
