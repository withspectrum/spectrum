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
import Icon from '../../../components/icons';
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
  MiniLinkPreview,
} from '../style';

class InboxThread extends Component {
  render() {
    const { data: { attachments, participants }, data, active } = this.props;
    const attachmentsExist = attachments && attachments.length > 0;
    const participantsExist = participants && participants.length > 0;

    return (
      <InboxThreadItem active={active}>
        <InboxLinkWrapper
          to={{
            pathname: window.location.pathname,
            search:
              window.innerWidth < 768 ? `?thread=${data.id}` : `?t=${data.id}`,
          }}
        />

        <InboxThreadContent>
          <ThreadCommunityInfo thread={data} active={active} />
          <Link
            to={{
              pathname: window.location.pathname,
              search:
                window.innerWidth < 768
                  ? `?thread=${data.id}`
                  : `?t=${data.id}`,
            }}
          >
            <ThreadTitle active={active}>{data.content.title}</ThreadTitle>
          </Link>

          {attachmentsExist &&
            attachments
              .filter(att => att.attachmentType === 'linkPreview')
              .map(att => (
                <AttachmentsContainer
                  active={active}
                  key={JSON.parse(att.data).trueUrl}
                >
                  <MiniLinkPreview
                    active={active}
                    to={JSON.parse(att.data).trueUrl}
                    target="_blank"
                  >
                    <Icon glyph="link" size={16} />
                    {JSON.parse(att.data).trueUrl}
                  </MiniLinkPreview>
                </AttachmentsContainer>
              ))}

          <ThreadMeta>
            {participantsExist && (
              <Facepile
                active={active}
                participants={participants}
                creator={data.creator}
              />
            )}

            {data.messageCount > 0 ? (
              <MetaText offset={participants.length} active={active}>
                {data.messageCount > 1
                  ? `${data.messageCount} messages`
                  : `${data.messageCount} message`}
              </MetaText>
            ) : (
              <MetaText offset={participants.length} active={active} new>
                New thread!
              </MetaText>
            )}
          </ThreadMeta>
        </InboxThreadContent>
      </InboxThreadItem>
    );
  }
}

export default compose(connect(), pure)(InboxThread);
