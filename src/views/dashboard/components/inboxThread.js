import React, { Component } from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
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
  InboxClickWrapper,
  InboxThreadContent,
  ThreadTitle,
  AttachmentsContainer,
  ThreadMeta,
  MetaText,
  MetaTextPill,
  MiniLinkPreview,
} from '../style';

class InboxThread extends Component {
  render() {
    const {
      data: { attachments, participants, creator },
      data,
      active,
      hasActiveCommunity,
    } = this.props;
    const attachmentsExist = attachments && attachments.length > 0;
    const participantsExist = participants && participants.length > 0;
    const isMobile = window && window.innerWidth < 768;
    const isPinned = data.id === this.props.pinnedThreadId;

    return (
      <InboxThreadItem active={active}>
        {isMobile ? (
          <InboxLinkWrapper to={`?thread=${data.id}`} />
        ) : (
          <InboxClickWrapper
            onClick={() => this.props.dispatch(changeActiveThread(data.id))}
          />
        )}
        <InboxThreadContent>
          <ThreadCommunityInfo
            thread={data}
            active={active}
            activeCommunity={hasActiveCommunity}
            isPinned={isPinned}
          />

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
                      <Icon glyph="link" size={18} />
                      {url}
                    </MiniLinkPreview>
                  </AttachmentsContainer>
                );
              })}

          <ThreadMeta>
            {(participantsExist || creator) && (
              <Facepile
                active={active}
                participants={participants}
                creator={data.creator}
              />
            )}

            {data.messageCount > 0 ? (
              <MetaText offset={participants.length} active={active}>
                {data.messageCount > 1 ? (
                  `${data.messageCount} messages`
                ) : (
                  `${data.messageCount} message`
                )}
              </MetaText>
            ) : (
              <MetaTextPill offset={participants.length} active={active} new>
                New thread!
              </MetaTextPill>
            )}
          </ThreadMeta>
        </InboxThreadContent>
      </InboxThreadItem>
    );
  }
}

export default compose(connect(), withRouter, pure)(InboxThread);
