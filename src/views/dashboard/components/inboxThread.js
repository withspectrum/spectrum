// @flow
import React, { Component } from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
import Facepile from './facepile';
import ThreadCommunityInfo from './threadCommunityInfo';
import {
  InboxThreadItem,
  InboxLinkWrapper,
  InboxThreadContent,
  ThreadTitle,
  AttachmentsContainer,
  ThreadMeta,
  MetaText,
} from '../style';

class InboxThread extends Component {
  render() {
    const { data: { attachments, participants }, data } = this.props;
    const attachmentsExist = attachments && attachments.length > 0;
    const participantsExist = participants && participants.length > 0;

    return (
      <InboxThreadItem>
        <InboxLinkWrapper
          to={{
            pathname: window.location.pathname,
            search: `?t=${data.id}`,
          }}
        />

        <InboxThreadContent>
          <ThreadCommunityInfo thread={data} />
          <Link
            to={{
              pathname: window.location.pathname,
              search: `?thread=${data.id}`,
            }}
          >
            <ThreadTitle>{data.content.title}</ThreadTitle>
          </Link>

          {attachmentsExist &&
            attachments
              .filter(att => att.attachmentType === 'linkPreview')
              .map(att => (
                <AttachmentsContainer key={att.data.trueUrl}>
                  foo
                </AttachmentsContainer>
              ))}

          <ThreadMeta>
            {participantsExist && (
              <Facepile participants={participants} creator={data.creator} />
            )}

            {data.messageCount > 0 ? (
              <MetaText>{data.messageCount} messages</MetaText>
            ) : (
              <MetaText new>New thread!</MetaText>
            )}

            {data.creator.username && (
              <MetaText>
                <span>&nbsp;· by&nbsp;</span>
                <Link to={`/users/${data.creator.username}`}>
                  @{data.creator.username}
                </Link>
              </MetaText>
            )}
          </ThreadMeta>
        </InboxThreadContent>
      </InboxThreadItem>
    );
  }
}

export default compose(connect(), pure)(InboxThread);
