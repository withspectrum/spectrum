// @flow
import React, { Component } from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
import { openModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import { setThreadLockMutation } from '../mutations';
import { deleteThreadMutation } from '../../../api/thread';
import Icon from '../../../components/icons';
import Flyout from '../../../components/flyout';
import { IconButton, Button } from '../../../components/buttons';
import Editor, {
  fromPlainText,
  toJSON,
  toPlainText,
  toState,
} from '../../../components/editor';
import { LinkPreview } from '../../../components/linkPreview';
import { ThreadTitle, ThreadDescription } from '../style';
// $FlowFixMe
import Textarea from 'react-textarea-autosize';
import {
  ThreadWrapper,
  ThreadHeading,
  Byline,
  ThreadContent,
  ContextRow,
  DropWrap,
  FlyoutRow,
  EditDone,
} from '../style';

class ThreadDetailPure extends Component {
  state: {
    isEditing: boolean,
    body: string,
    title: string,
    linkPreview: Object,
    linkPreviewTrueUrl: string,
    linkPreviewLength: number,
    fetchingLinkPreview: boolean,
  };

  constructor(props) {
    super(props);

    const { thread } = props;

    this.state = {
      isEditing: false,
      body: fromPlainText(thread.content.body),
      title: thread.content.title,
      linkPreview: thread.attachments.length > 0 ? thread.attachments[0] : null,
      linkPreviewTrueUrl: thread.attachments.length > 0
        ? thread.attachments[0].trueUrl
        : '',
      linkPreviewLength: thread.attachments.length > 0 ? 1 : 0,
      fetchingLinkPreview: false,
    };

    console.log(this.state);
  }

  threadLock = () => {
    const { setThreadLock, dispatch, thread } = this.props;
    const value = !thread.isLocked;
    const threadId = thread.id;

    setThreadLock({
      threadId,
      value,
    })
      .then(({ data: { setThreadLock } }) => {
        if (setThreadLock.isLocked) {
          dispatch(addToastWithTimeout('neutral', 'Thread locked.'));
        } else {
          dispatch(addToastWithTimeout('success', 'Thread unlocked!'));
        }
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  triggerDelete = e => {
    e.preventDefault();
    const { thread, dispatch } = this.props;

    const threadId = thread.id;
    const isChannelOwner = thread.channel.channelPermissions.isOwner;
    const isCommunityOwner =
      thread.channel.community.communityPermissions.isOwner;

    let message;

    if (isCommunityOwner && !thread.isCreator) {
      message = `You are about to delete another person's thread. As the owner of the ${thread.channel.community.name} community, you have permission to do this. The thread creator will be notified that this thread was deleted.`;
    } else if (isChannelOwner && !thread.isCreator) {
      message = `You are about to delete another person's thread. As the owner of the ${thread.channel} channel, you have permission to do this. The thread creator will be notified that this thread was deleted.`;
    } else if (thread.isCreator) {
      message = 'Are you sure you want to delete this thread?';
    } else {
      message = 'Are you sure you want to delete this thread?';
    }

    return dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: threadId,
        entity: 'thread',
        message,
      })
    );
  };

  toggleEdit = () => {
    const { isEditing } = this.state;
    this.setState({
      isEditing: !isEditing,
    });
  };

  changeTitle = e => {
    const title = e.target.value;
    this.setState({
      title,
    });
  };

  changeBody = state => {
    this.setState({
      body: state,
    });
  };

  removeLinkPreview = () => {
    this.setState({
      linkPreview: null,
      linkPreviewTrueUrl: '',
    });
  };

  render() {
    const { currentUser, thread } = this.props;
    const { isEditing, linkPreview, linkPreviewTrueUrl } = this.state;

    let body = thread.content.body;
    if (thread.type === 'SLATE') {
      body = toPlainText(toState(JSON.parse(body)));
    }

    const isChannelOwner = thread.channel.channelPermissions.isOwner;
    const isCommunityOwner =
      thread.channel.community.communityPermissions.isOwner;

    return (
      <ThreadWrapper>
        <ContextRow>
          <Byline to={`/users/${thread.creator.username}`}>
            {thread.creator.name}
          </Byline>
          {currentUser &&
            (thread.isCreator || isChannelOwner || isCommunityOwner) &&
            !isEditing &&
            <DropWrap>
              <Icon glyph="settings" />
              <Flyout>
                {(isChannelOwner || isCommunityOwner) &&
                  <FlyoutRow>
                    <IconButton
                      glyph="freeze"
                      hoverColor="space.light"
                      tipText={
                        thread.isLocked ? 'Unfreeze chat' : 'Freeze chat'
                      }
                      tipLocation="top-left"
                      onClick={this.threadLock}
                    />
                  </FlyoutRow>}
                {(thread.isCreator || isChannelOwner || isCommunityOwner) &&
                  <FlyoutRow>
                    <IconButton
                      glyph="delete"
                      hoverColor="warn.alt"
                      tipText="Delete thread"
                      tipLocation="top-left"
                      onClick={this.triggerDelete}
                    />
                  </FlyoutRow>}
                {thread.isCreator &&
                  <FlyoutRow>
                    <IconButton
                      glyph="edit"
                      hoverColor="text.alt"
                      tipText="Edit"
                      tipLocation="top-left"
                      onClick={this.toggleEdit}
                    />
                  </FlyoutRow>}
              </Flyout>
            </DropWrap>}

          {isEditing &&
            <EditDone>
              <Button onClick={this.toggleEdit}>Save</Button>
            </EditDone>}
        </ContextRow>

        {!isEditing &&
          <span>
            <ThreadHeading>
              {thread.content.title}
            </ThreadHeading>
            <ThreadContent>{body}</ThreadContent>

            {thread.attachments &&
              thread.attachments.length > 0 &&
              <LinkPreview
                trueUrl={thread.attachments[0].data.trueUrl}
                data={JSON.parse(thread.attachments[0].data)}
                size={'small'}
                editable={false}
                margin={'16px 0 0 0'}
              />}
          </span>}

        {isEditing &&
          <span>
            <Textarea
              onChange={this.changeTitle}
              style={ThreadTitle}
              value={this.state.title}
              placeholder={'A title for your thread...'}
              ref="titleTextarea"
              autoFocus
            />

            <Editor
              onChange={this.changeBody}
              onKeyDown={this.listenForUrl}
              state={this.state.body}
              style={ThreadDescription}
              ref="bodyTextarea"
              placeholder="Write more thoughts here, add photos, and anything else!"
            />

            {linkPreview &&
              <LinkPreview
                data={linkPreview}
                size={'large'}
                remove={this.removeLinkPreview}
                editable={true}
                trueUrl={linkPreviewTrueUrl}
              />}
          </span>}
      </ThreadWrapper>
    );
  }
}

const ThreadDetail = compose(
  setThreadLockMutation,
  deleteThreadMutation,
  withRouter,
  pure
)(ThreadDetailPure);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(ThreadDetail);
