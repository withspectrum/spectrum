// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// $FlowFixMe
import { addToastWithTimeout } from 'src/actions/toasts';
import Link from 'src/components/link';
import EditDropdown from 'src/views/channelSettings/components/editDropdown';
import {
  Dropdown,
  DropdownAction,
  DropdownSection,
  DropdownSectionTitle,
  DropdownSectionText,
  DropdownSectionSubtitle,
  DropdownSectionDivider,
} from 'src/components/settingsViews/style';
import Icon from 'src/components/icons';
import { timeDifference } from 'shared/time-difference';
import { renderAvatars } from './avatars';
import archiveDirectMessageThreadMutation from 'shared/graphql/mutations/directMessageThread/archiveDirectMessageThread';
import unarchiveDirectMessageThreadMutation from 'shared/graphql/mutations/directMessageThread/unarchiveDirectMessageThread';
import leaveDirectMessageThreadMutation from 'shared/graphql/mutations/directMessageThread/leaveDirectMessageThread';
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
  dispatch: Function,
  setActiveThread: Function,
  archiveDirectMessageThread: (threadId: string) => Promise<any>,
  unarchiveDirectMessageThread: (threadId: string) => Promise<any>,
  leaveDirectMessageThread: (threadId: string) => Promise<any>,
  history: Object,
};

class ListCardItemDirectMessageThread extends Component<Props> {
  handleGearClick = e => {
    e.stopPropagation(); // We need this since the whole wrapper is clickable
    e.preventDefault();
  };

  handleArchiveDMThread = e => {
    e.stopPropagation();
    e.preventDefault();
    const {
      thread: { id: threadId },
      dispatch,
    } = this.props;

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
    const {
      thread: { id: threadId },
      dispatch,
    } = this.props;

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

  handleLeaveDMThread = e => {
    e.stopPropagation();
    e.preventDefault();
    const {
      thread: { id: threadId },
      dispatch,
    } = this.props;

    this.props
      .leaveDirectMessageThread(threadId)
      .then(({ data }) => {
        dispatch(
          addToastWithTimeout(
            'success',
            'Left direct message thread successfully.'
          )
        );
        this.props.setActiveThread('new');
        this.props.history.push('/messages/new');
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
                <EditDropdown
                  render={() => (
                    <Dropdown>
                      <DropdownSection
                        onClick={
                          isArchived
                            ? this.handleUnarchiveDMThread
                            : this.handleArchiveDMThread
                        }
                      >
                        <DropdownAction>
                          <Icon glyph={'archive-action'} size={'32'} />
                        </DropdownAction>
                        <DropdownSectionText>
                          {isArchived ? (
                            <DropdownSectionTitle>
                              Unarchive
                            </DropdownSectionTitle>
                          ) : (
                            <DropdownSectionTitle>Archive</DropdownSectionTitle>
                          )}
                        </DropdownSectionText>
                      </DropdownSection>
                      <DropdownSection onClick={this.handleLeaveDMThread}>
                        <DropdownAction>
                          <Icon glyph={'door-leave'} size={'32'} />
                        </DropdownAction>
                        <DropdownSectionText>
                          <DropdownSectionTitle>Leave</DropdownSectionTitle>
                        </DropdownSectionText>
                      </DropdownSection>
                    </Dropdown>
                  )}
                />
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
  unarchiveDirectMessageThreadMutation,
  withRouter,
  leaveDirectMessageThreadMutation
)(ListCardItemDirectMessageThread);
