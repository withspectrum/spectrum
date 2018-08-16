// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
// $FlowFixMe
import { addToastWithTimeout } from 'src/actions/toasts';
import Link from 'src/components/link';
import { timeDifference } from 'shared/time-difference';
import { renderAvatars } from './avatars';
import archiveDirectMessageThreadMutation from 'shared/graphql/mutations/directMessageThread/archiveDirectMessageThread';
import unarchiveDirectMessageThreadMutation from 'shared/graphql/mutations/directMessageThread/unarchiveDirectMessageThread';
import type { GetDirectMessageThreadType } from 'shared/graphql/queries/directMessageThread/getDirectMessageThread';
import {
  ArchiveUnarchiveCTA,
  Wrapper,
  WrapperLink,
  Row,
  Meta,
  MessageGroupTextContainer,
  MessageGroupByline,
  Usernames,
  Timestamp,
  GearButton,
} from './style';

type Props = {
  active: boolean,
  currentUser: Object,
  thread: GetDirectMessageThreadType,
};

class ListCardItemDirectMessageThread extends Component<Props> {
  handleGearClick = e => {
    e.stopPropagation(); // We need this since the whole wrapper is clickable
    e.preventDefault();
  };

  handleArchiveDMThread = e => {
    e.stopPropagation();
    e.preventDefault();
    const { thread: { id: threadId }, dispatch } = this.props;

    this.props
      .archiveDirectMessageThread(threadId)
      .then(({ data }) => {
        dispatch(addToastWithTimeout('success', 'Message archived!'));

        return;
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  handleUnarchiveDMThread = e => {
    e.stopPropagation();
    e.preventDefault();
    const { thread: { id: threadId }, dispatch } = this.props;

    this.props
      .unarchiveDirectMessageThread(threadId)
      .then(({ data }) => {
        dispatch(addToastWithTimeout('success', 'Message unarchived!'));

        return;
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { thread, currentUser, active } = this.props;

    // convert the server time to an iso timestamp
    const timestamp = new Date(thread.threadLastActive).getTime();

    // get the difference in a readable format (e.g 'a week ago')
    const threadTimeDifference = timeDifference(Date.now(), timestamp);

    // filter currentUser out
    const participants = thread.participants.filter(
      user => user.userId !== currentUser.id
    );
    // concat a string of users' names for thread messages
    let participantsArray =
      participants.length > 1
        ? participants
            .map(user => user.name)
            .join(', ')
            .replace(/,(?!.*,)/gim, ' and')
        : participants[0].name;
    // pass participants to a helper function to generate the avatar displays
    const avatars = renderAvatars(participants);

    const currentParticipant = thread.participants.filter(
      user => user.userId === currentUser.id
    )[0];

    const currentParticipantLastActiveTimestamp = new Date(
      currentParticipant.lastSeen
    ).getTime();

    let isUnread = currentParticipantLastActiveTimestamp < timestamp;
    isUnread = active ? false : isUnread;

    const isArchived = Boolean(this.props.thread.archivedAt);

    return (
      <Wrapper active={active} isUnread={isUnread}>
        <WrapperLink to={`/messages/${thread.id}`}>
          <Row>
            {avatars}
            <MessageGroupTextContainer>
              <MessageGroupByline>
                <Usernames isUnread={isUnread}>
                  <p>{participantsArray}</p>
                </Usernames>
                <Timestamp className="message-thread-item" isUnread={isUnread}>
                  {threadTimeDifference}
                </Timestamp>
                {!isArchived && (
                  <ArchiveUnarchiveCTA onClick={this.handleArchiveDMThread}>
                    Archive
                  </ArchiveUnarchiveCTA>
                )}
                {isArchived && (
                  <ArchiveUnarchiveCTA onClick={this.handleUnarchiveDMThread}>
                    Unarchive
                  </ArchiveUnarchiveCTA>
                )}
                {/**
                  Add this when we have the dropdown/popover component and remove line 113-122
                  https://github.com/withspectrum/spectrum/pull/2992#issuecomment-388686504
                  <GearButton onClick={this.handleGearClick} />
                */}
              </MessageGroupByline>
              <Meta isUnread={isUnread} nowrap>
                {thread.snippet}
              </Meta>
            </MessageGroupTextContainer>
          </Row>
        </WrapperLink>
      </Wrapper>
    );
  }
}

export default compose(
  connect(),
  archiveDirectMessageThreadMutation,
  unarchiveDirectMessageThreadMutation
)(ListCardItemDirectMessageThread);
