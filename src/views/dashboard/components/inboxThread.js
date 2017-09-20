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
import { withRouter } from 'react-router';
import Icon from '../../../components/icons';
import Facepile from './facepile';
import ThreadCommunityInfo from './threadCommunityInfo';
import { changeActiveThread } from '../../../actions/dashboardFeed';
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
    const {
      data: { attachments, participants },
      data,
      active,
      location,
      hasActiveCommunity,
    } = this.props;
    const attachmentsExist = attachments && attachments.length > 0;
    const participantsExist = participants && participants.length > 0;

    return (
      <InboxThreadItem active={active}>
        <InboxLinkWrapper
          onClick={() => this.props.dispatch(changeActiveThread(data.id))}
        />
        <InboxThreadContent>
          {!hasActiveCommunity && (
            <ThreadCommunityInfo thread={data} active={active} />
          )}

          <ThreadTitle active={active}>{data.content.title}</ThreadTitle>

          {attachmentsExist &&
            attachments
              .filter(att => att.attachmentType === 'linkPreview')
              .map(att => {
                const attData = JSON.parse(att.data);
                const url = attData.trueUrl || attData.url;
                if (!url) return null;

                return (
                  <AttachmentsContainer active={active} key={url}>
                    <MiniLinkPreview to={url} target="_blank">
                      <Icon glyph="link" size={16} />
                      {url}
                    </MiniLinkPreview>
                  </AttachmentsContainer>
                );
              })}

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

export default compose(connect(), withRouter, pure)(InboxThread);
