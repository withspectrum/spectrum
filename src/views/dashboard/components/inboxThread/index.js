// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Avatar from 'src/components/avatar';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import truncate from 'shared/truncate';
import Header from './header';
import { changeActiveThread } from 'src/actions/dashboardFeed';
import type { ThreadInfoType } from 'shared/graphql/fragments/thread/threadInfo';
import type { Dispatch } from 'redux';
import {
  InboxThreadItem,
  InboxLinkWrapper,
  InboxThreadContent,
  ThreadTitle,
  AvatarLink,
} from './style';
import {
  TextRow,
  AuthorAvatarContainer,
  MetaSubtitle,
  MetaSubtitleText,
} from './header/style';
import ThreadActivity from './activity';
import { ErrorBoundary } from 'src/components/error';

type Props = {
  active: boolean,
  dispatch: Dispatch<Object>,
  hasActiveChannel: ?Object,
  hasActiveCommunity: ?Object,
  history: Object,
  location: Object,
  match: Object,
  staticContext: ?string,
  data: ThreadInfoType,
  viewContext?: ?string,
  currentUser: ?Object,
};

class InboxThread extends React.Component<Props> {
  render() {
    const {
      data,
      location,
      active,
      hasActiveCommunity,
      hasActiveChannel,
      viewContext,
      currentUser,
    } = this.props;

    return (
      <ErrorBoundary fallbackComponent={null}>
        <InboxThreadItem active={active}>
          <InboxLinkWrapper
            to={{
              pathname: location.pathname,
              search:
                // TODO(@mxstbr): Fix this to not use window.innerWidth
                // which breaks SSR rehydration on mobile devices
                window.innerWidth < 768 || viewContext
                  ? `?thread=${data.id}`
                  : `?t=${data.id}`,
            }}
            onClick={e =>
              window.innerWidth > 768 &&
              !viewContext &&
              !e.metaKey &&
              this.props.dispatch(changeActiveThread(data.id))
            }
          />

          <InboxThreadContent>
            {!hasActiveCommunity &&
              !hasActiveChannel && (
                <AvatarLink to={`/${data.community.slug}`}>
                  <Avatar
                    community={data.community}
                    src={`${data.community.profilePhoto}`}
                    size={'32'}
                  />
                </AvatarLink>
              )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <ErrorBoundary fallbackComponent={null}>
                <Header
                  thread={data}
                  active={active}
                  activeCommunity={hasActiveCommunity}
                  activeChannel={hasActiveChannel}
                  currentUser={currentUser}
                />
              </ErrorBoundary>

              <ThreadTitle active={active}>
                {truncate(data.content.title, 80)}
              </ThreadTitle>

              <TextRow>
                {hasActiveChannel && (
                  <AuthorAvatarContainer>
                    <Avatar
                      src={data.author.user.profilePhoto}
                      size={'16'}
                      user={data.author.user}
                      link={
                        data.author.user.username &&
                        `/users/${data.author.user.username}`
                      }
                    />
                  </AuthorAvatarContainer>
                )}

                {data.author.user.username ? (
                  <MetaSubtitle
                    active={active}
                    to={`/users/${data.author.user.username}`}
                  >
                    {data.author.user.name}
                  </MetaSubtitle>
                ) : (
                  <MetaSubtitleText active={active}>
                    {data.author.user.name}
                  </MetaSubtitleText>
                )}
              </TextRow>

              <ErrorBoundary fallbackComponent={null}>
                <ThreadActivity
                  thread={data}
                  active={active}
                  currentUser={currentUser}
                />
              </ErrorBoundary>
            </div>
          </InboxThreadContent>
        </InboxThreadItem>
      </ErrorBoundary>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowFixMe
  connect(map),
  withRouter
)(InboxThread);
