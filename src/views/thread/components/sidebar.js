// @flow
import * as React from 'react';
import { track } from '../../../helpers/events';
import { Button, TextButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { addToastWithTimeout } from '../../../actions/toasts';
import { toggleCommunityMembershipMutation } from '../../../api/community';
import { Link } from 'react-router-dom';
import { getCommunityThreads } from '../../community/queries';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import {
  SidebarSection,
  SidebarSectionTitle,
  SidebarSectionBody,
  SidebarSectionActions,
  ThreadSidebarView,
  SidebarCommunityCover,
  SidebarCommunityProfile,
  SidebarCommunityName,
  SidebarCommunityDescription,
  SidebarRelatedThreadList,
  SidebarRelatedThread,
  RelatedTitle,
  RelatedCount,
  SidebarCommunityChannels,
  PillLink,
  PillLinkPinned,
  PillLabel,
  PinIcon,
  Lock,
} from '../style';

type RecommendedThread = {
  node: {
    content: {
      title: string,
    },
    id: string,
    createdAt: string,
    creator: {
      username: string,
      name: string,
    },
    messageCount: number,
  },
};
type Props = {
  thread: {
    id: string,
    community: {
      id: string,
      name: string,
      coverPhoto: string,
      profilePhoto: string,
      description: string,
      slug: string,
      pinnedThreadId: string,
      communityPermissions: {
        isOwner: boolean,
        isModerator: boolean,
        isMember: boolean,
      },
    },
    channel: {
      name: string,
      slug: string,
      isPrivate: boolean,
      channelPermissions: {
        isOwner: boolean,
        isModerator: boolean,
        isMember: boolean,
      },
    },
  },
  currentUser: Object,
  data: {
    threads: Array<RecommendedThread>,
  },
  toggleCommunityMembership: Function,
  dispatch: Function,
};
type State = {
  isJoining: boolean,
};
class Sidebar extends React.Component<Props, State> {
  state = {
    isJoining: false,
  };

  toggleMembership = (communityId: string) => {
    const { toggleCommunityMembership, dispatch } = this.props;
    this.setState({
      isJoining: true,
    });

    toggleCommunityMembership({ communityId })
      .then(({ data: { toggleCommunityMembership } }) => {
        const isMember =
          toggleCommunityMembership.communityPermissions.isMember;

        track('community', isMember ? 'joined' : 'unjoined', null);

        const str = isMember
          ? `Joined ${toggleCommunityMembership.name}!`
          : `Left ${toggleCommunityMembership.name}.`;

        const type = isMember ? 'success' : 'neutral';
        dispatch(addToastWithTimeout(type, str));

        this.setState({
          isJoining: false,
        });
      })
      .catch(err => {
        this.setState({
          isJoining: false,
        });

        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { thread, currentUser, data: { threads } } = this.props;
    const isPinned = thread.id === thread.community.pinnedThreadId;
    const threadsToRender =
      threads &&
      threads.length > 0 &&
      threads
        .map(t => t.node)
        .filter(t => t.id !== thread.id)
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 5);

    return (
      <ThreadSidebarView>
        <SidebarSection>
          <Link to={`/${thread.community.slug}`}>
            <SidebarCommunityCover src={thread.community.coverPhoto} />
            <SidebarCommunityProfile src={thread.community.profilePhoto} />
            <SidebarCommunityName>{thread.community.name}</SidebarCommunityName>
          </Link>
          <SidebarCommunityChannels>
            <PillLink to={`/${thread.community.slug}/${thread.channel.slug}`}>
              {thread.channel.isPrivate && (
                <Lock>
                  <Icon glyph="private" size={12} />
                </Lock>
              )}
              <PillLabel isPrivate={thread.channel.isPrivate}>
                {thread.channel.name}
              </PillLabel>
            </PillLink>

            {isPinned && (
              <PillLinkPinned>
                <PinIcon>
                  <Icon glyph="pin-fill" size={12} />
                </PinIcon>
                <PillLabel>Pinned</PillLabel>
              </PillLinkPinned>
            )}
          </SidebarCommunityChannels>
          <SidebarCommunityDescription>
            {thread.community.description}
          </SidebarCommunityDescription>

          <SidebarSectionActions>
            {thread.community.communityPermissions.isMember ? (
              <Link to={`/${thread.community.slug}`}>
                <TextButton>View community</TextButton>
              </Link>
            ) : currentUser ? (
              <Button
                gradientTheme={'success'}
                color={'success.default'}
                onClick={() => this.toggleMembership(thread.community.id)}
              >
                Join community
              </Button>
            ) : (
              <Link to={`/login?r=${window.location}`}>
                <Button gradientTheme={'success'} color={'success.default'}>
                  Join community
                </Button>
              </Link>
            )}
          </SidebarSectionActions>
        </SidebarSection>

        {threadsToRender &&
          threadsToRender.length > 0 && (
            <SidebarSection>
              <SidebarSectionTitle>More conversations</SidebarSectionTitle>
              <SidebarRelatedThreadList>
                {threadsToRender.map(t => {
                  return (
                    <SidebarRelatedThread key={t.id}>
                      <Link
                        to={{
                          pathname: window.location.pathname,
                          search: `?thread=${t.id}`,
                        }}
                      >
                        <RelatedTitle>{t.content.title}</RelatedTitle>
                        <RelatedCount>
                          {t.messageCount.toLocaleString()}{' '}
                          {t.messageCount === 1 ? 'message' : 'messages'}
                        </RelatedCount>
                      </Link>
                    </SidebarRelatedThread>
                  );
                })}
              </SidebarRelatedThreadList>
            </SidebarSection>
          )}
      </ThreadSidebarView>
    );
  }
}

export default compose(
  connect(),
  toggleCommunityMembershipMutation,
  getCommunityThreads
)(Sidebar);
