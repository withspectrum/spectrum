// @flow
import * as React from 'react';
import replace from 'string-replace-to-array';
import { withRouter } from 'react-router';
import { Button, TextButton } from 'src/components/buttons';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import {
  LoadingProfileThreadDetail,
  LoadingListThreadDetail,
} from 'src/components/loading';
import ToggleCommunityMembership from 'src/components/toggleCommunityMembership';
import { Link } from 'react-router-dom';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { CLIENT_URL } from 'src/api/constants';
import Icon from 'src/components/icons';
import getThreadLink from 'src/helpers/get-thread-link';
import type { Dispatch } from 'redux';
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
  PillLink,
  PillLabel,
  Lock,
  SidebarChannelPill,
} from '../style';
import { ErrorBoundary } from 'src/components/error';
import type { ContextRouter } from 'react-router';
import DesktopAppUpsell from './desktopAppUpsell';

type RecommendedThread = {
  node: GetThreadType,
};
type Props = {
  ...$Exact<ContextRouter>,
  thread: GetThreadType,
  currentUser: Object,
  data: {
    threads: Array<RecommendedThread>,
  },
  toggleCommunityMembership: Function,
  dispatch: Dispatch<Object>,
};

const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;
const renderDescriptionWithLinks = text => {
  return replace(text, MARKDOWN_LINK, (fullLink, text, url) => (
    <a href={url} target="_blank" rel="noopener nofollower" key={url}>
      {text}
    </a>
  ));
};

class Sidebar extends React.Component<Props> {
  render() {
    const {
      thread,
      currentUser,
      location,
      data: { threads },
    } = this.props;

    const threadsToRender =
      threads &&
      threads.length > 0 &&
      threads
        .map(t => t.node)
        .filter(t => t.id !== thread.id)
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 5);

    const loginUrl =
      thread && thread.community
        ? thread.community.brandedLogin.isEnabled
          ? `/${thread.community.slug}/login?r=${CLIENT_URL}/${getThreadLink(
              thread
            )}`
          : `/login?r=${CLIENT_URL}/${getThreadLink(thread)}`
        : '/login';

    return (
      <ThreadSidebarView>
        <ErrorBoundary fallbackComponent={null}>
          {thread && thread.community ? (
            <React.Fragment>
              {!currentUser && (
                <SidebarSection data-cy="thread-sidebar-login">
                  <SidebarSectionTitle>
                    Join the conversation
                  </SidebarSectionTitle>
                  <SidebarSectionBody>
                    Sign in to join this conversation, and others like it, in
                    the communities you care about.
                  </SidebarSectionBody>
                  <SidebarSectionAuth>
                    <Link to={loginUrl}>
                      <Button gradientTheme={'brand'} color={'brand.default'}>
                        Sign up
                      </Button>
                    </Link>
                    <Link to={loginUrl}>
                      <TextButton gradientTheme={'text'} color={'text.alt'}>
                        Log in
                      </TextButton>
                    </Link>
                  </SidebarSectionAuth>
                </SidebarSection>
              )}

              <SidebarSection data-cy="thread-sidebar-community-info">
                <Link to={`/${thread.community.slug}`}>
                  <SidebarCommunityCover src={thread.community.coverPhoto} />
                  <SidebarCommunityProfile
                    community
                    size={48}
                    src={thread.community.profilePhoto}
                  />
                  <SidebarCommunityName>
                    {thread.community.name}
                  </SidebarCommunityName>
                </Link>

                <SidebarChannelPill>
                  <PillLink
                    to={`/${thread.community.slug}/${thread.channel.slug}`}
                  >
                    {thread.channel.isPrivate && (
                      <Lock>
                        <Icon glyph="private" size={12} />
                      </Lock>
                    )}
                    <PillLabel isPrivate={thread.channel.isPrivate}>
                      {thread.channel.name}
                    </PillLabel>
                  </PillLink>
                </SidebarChannelPill>

                <SidebarCommunityDescription>
                  {renderDescriptionWithLinks(thread.community.description)}
                </SidebarCommunityDescription>

                <SidebarSectionActions>
                  {thread.community.communityPermissions.isMember ? (
                    <Link to={`/${thread.community.slug}`}>
                      <TextButton dataCy="thread-sidebar-view-community-button">
                        View community
                      </TextButton>
                    </Link>
                  ) : currentUser ? (
                    <ToggleCommunityMembership
                      community={thread.community}
                      render={({ isLoading }) => (
                        <Button
                          gradientTheme={'success'}
                          color={'success.default'}
                          loading={isLoading}
                          dataCy="thread-sidebar-join-community-button"
                        >
                          Join community
                        </Button>
                      )}
                    />
                  ) : (
                    <Link to={loginUrl}>
                      <Button
                        gradientTheme={'success'}
                        color={'success.default'}
                        dataCy="thread-sidebar-join-login-button"
                      >
                        Join community
                      </Button>
                    </Link>
                  )}
                </SidebarSectionActions>
              </SidebarSection>
            </React.Fragment>
          ) : (
            <SidebarSection>
              <LoadingProfileThreadDetail />
            </SidebarSection>
          )}
        </ErrorBoundary>

        <DesktopAppUpsell />

        <ErrorBoundary fallbackComponent={null}>
          {Array.isArray(threadsToRender) ? (
            threadsToRender.length > 0 && (
              <SidebarSection data-cy="thread-sidebar-more-threads">
                <SidebarSectionTitle>
                  More active conversations
                </SidebarSectionTitle>
                <SidebarRelatedThreadList>
                  {threadsToRender.map(t => {
                    return (
                      <ErrorBoundary key={t.id} fallbackComponent={null}>
                        <SidebarRelatedThread key={t.id}>
                          <Link
                            to={{
                              pathname: location.pathname,
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
                      </ErrorBoundary>
                    );
                  })}
                </SidebarRelatedThreadList>
              </SidebarSection>
            )
          ) : (
            <SidebarSection>
              <LoadingListThreadDetail />
            </SidebarSection>
          )}
        </ErrorBoundary>
      </ThreadSidebarView>
    );
  }
}

export default compose(
  connect(),
  withRouter,
  getCommunityThreads
)(Sidebar);
