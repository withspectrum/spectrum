// @flow
import * as React from 'react';
import replace from 'string-replace-to-array';
import { Button, TextButton } from '../../../components/buttons';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import {
  LoadingProfileThreadDetail,
  LoadingListThreadDetail,
} from '../../../components/loading';
import ToggleCommunityMembership from '../../../components/toggleCommunityMembership';
import Link from 'src/components/link';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import {
  SidebarSection,
  SidebarSectionTitle,
  SidebarSectionBody,
  SidebarSectionActions,
  SidebarSectionAuth,
  ThreadSidebarView,
  SidebarCommunityCover,
  SidebarCommunityProfile,
  SidebarCommunityName,
  SidebarCommunityDescription,
  SidebarRelatedThreadList,
  SidebarRelatedThread,
  RelatedTitle,
  RelatedCount,
} from '../style';

type RecommendedThread = {
  node: GetThreadType,
};
type Props = {
  thread: GetThreadType,
  currentUser: Object,
  data: {
    threads: Array<RecommendedThread>,
  },
  toggleCommunityMembership: Function,
  dispatch: Function,
  threadViewLoading?: boolean,
};

class Sidebar extends React.Component<Props> {
  render() {
    const {
      threadViewLoading,
      thread,
      currentUser,
      data: { threads },
    } = this.props;

    if (threadViewLoading) {
      return (
        <ThreadSidebarView>
          <SidebarSection>
            <LoadingProfileThreadDetail />
          </SidebarSection>
          <SidebarSection>
            <LoadingListThreadDetail />
          </SidebarSection>
        </ThreadSidebarView>
      );
    }

    const threadsToRender =
      threads &&
      threads.length > 0 &&
      threads
        .map(t => t.node)
        .filter(t => t.id !== thread.id)
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 5);
    const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;
    const renderDescriptionWithLinks = text => {
      return replace(text, MARKDOWN_LINK, (fullLink, text, url) => (
        <a href={url} target="_blank" rel="noopener nofollower" key={url}>
          {text}
        </a>
      ));
    };

    return (
      <ThreadSidebarView>
        {!currentUser && (
          <SidebarSection>
            <SidebarSectionTitle>Join the conversation</SidebarSectionTitle>
            <SidebarSectionBody>
              Sign in to join this conversation, and others like it, in the
              communities you care about.
            </SidebarSectionBody>
            <SidebarSectionAuth>
              <Link to={`/login?r=${window.location}`}>
                <Button gradientTheme={'brand'} color={'brand.default'}>
                  Sign up
                </Button>
              </Link>
              <Link to={`/login?r=${window.location}`}>
                <TextButton gradientTheme={'text'} color={'text.alt'}>
                  Log in
                </TextButton>
              </Link>
            </SidebarSectionAuth>
          </SidebarSection>
        )}

        <SidebarSection>
          <Link to={`/${thread.community.slug}`}>
            <SidebarCommunityCover src={thread.community.coverPhoto} />
            <SidebarCommunityProfile
              community
              size={48}
              src={thread.community.profilePhoto}
            />
            <SidebarCommunityName>{thread.community.name}</SidebarCommunityName>
          </Link>

          <SidebarCommunityDescription>
            {renderDescriptionWithLinks(thread.community.description)}
          </SidebarCommunityDescription>

          <SidebarSectionActions>
            {thread.community.communityPermissions.isMember ? (
              <Link to={`/${thread.community.slug}`}>
                <TextButton>View community</TextButton>
              </Link>
            ) : currentUser ? (
              <ToggleCommunityMembership
                community={thread.community}
                render={({ isLoading }) => (
                  <Button
                    gradientTheme={'success'}
                    color={'success.default'}
                    loading={isLoading}
                  >
                    Join community
                  </Button>
                )}
              />
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

export default compose(connect(), getCommunityThreads)(Sidebar);
