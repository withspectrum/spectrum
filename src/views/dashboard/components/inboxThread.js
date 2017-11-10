import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Icon from '../../../components/icons';
import Facepile from './facepile';
import truncate from 'shared/truncate';
import ThreadCommunityInfo, { WaterCoolerPill } from './threadCommunityInfo';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import {
  InboxThreadItem,
  InboxLinkWrapper,
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
      hasActiveChannel,
    } = this.props;
    const attachmentsExist = attachments && attachments.length > 0;
    const participantsExist = participants && participants.length > 0;
    const isPinned = data.id === this.props.pinnedThreadId;

    return (
      <InboxThreadItem active={active}>
        <InboxLinkWrapper
          to={{
            pathname: window.location.pathname,
            search:
              window.innerWidth < 768 ? `?thread=${data.id}` : `?t=${data.id}`,
          }}
          onClick={() =>
            window.innerWidth > 768 &&
            this.props.dispatch(changeActiveThread(data.id))}
        />
        <InboxThreadContent>
          <ThreadCommunityInfo
            thread={data}
            active={active}
            activeCommunity={hasActiveCommunity}
            activeChannel={hasActiveChannel}
            isPinned={isPinned}
          />

          <ThreadTitle active={active}>
            {truncate(data.content.title, 80)}
          </ThreadTitle>

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
                {data.messageCount > 1
                  ? `${data.messageCount} messages`
                  : `${data.messageCount} message`}
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

export default compose(connect(), withRouter)(InboxThread);

class WatercoolerThreadPure extends React.Component {
  render() {
    const {
      data: { attachments, participants, creator, community, messageCount, id },
      active,
    } = this.props;
    const participantsExist = participants && participants.length > 0;

    return (
      <InboxThreadItem
        active={active}
        style={{ marginBottom: '16px', borderBottom: '1px solid #DFE7EF' }}
      >
        <InboxLinkWrapper
          to={{
            pathname: window.location.pathname,
            search: window.innerWidth < 768 ? `?thread=${id}` : `?t=${id}`,
          }}
          onClick={() =>
            window.innerWidth > 768 &&
            this.props.dispatch(changeActiveThread(id))}
        />
        <InboxThreadContent>
          <WaterCoolerPill active={active} />
          <ThreadTitle active={active}>
            The {community.name} Watercooler
          </ThreadTitle>

          <ThreadMeta>
            {(participantsExist || creator) && (
                <Facepile
                  active={active}
                  participants={participants}
                  creator={creator}
                />
              )}

            {messageCount > 0 && (
              <MetaText offset={participants.length} active={active}>
                {messageCount > 1
                  ? `${messageCount} messages`
                  : `${messageCount} message`}
              </MetaText>
            )}
          </ThreadMeta>
        </InboxThreadContent>
      </InboxThreadItem>
    );
  }
}

export const WatercoolerThread = compose(connect(), withRouter)(
  WatercoolerThreadPure
);
