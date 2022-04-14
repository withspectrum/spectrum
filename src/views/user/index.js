// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import querystring from 'query-string';
import {
  withRouter,
  type History,
  type Location,
  type Match,
} from 'react-router';
import { connect } from 'react-redux';
import generateMetaInfo from 'shared/generate-meta-info';
import Head from 'src/components/head';
import ThreadFeed from 'src/components/threadFeed';
import { UserProfileCard } from 'src/components/entities';
import { setTitlebarProps } from 'src/actions/titlebar';
import CommunityList from './components/communityList';
import Search from './components/search';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { UserAvatar } from 'src/components/avatar';
import {
  getUserByMatch,
  type GetUserType,
} from 'shared/graphql/queries/user/getUser';
import getUserThreads from 'shared/graphql/queries/user/getUserThreadConnection';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import type { Dispatch } from 'redux';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
} from 'src/components/layout';
import {
  SidebarSection,
  SidebarSectionHeader,
  SidebarSectionHeading,
} from 'src/views/community/style';
import {
  NullColumn,
  NullColumnHeading,
  NullColumnSubheading,
} from 'src/components/threadFeed/style';
import { PrimaryOutlineButton } from 'src/components/button';
import Icon from 'src/components/icon';
import { MobileUserAction } from 'src/components/titlebar/actions';
import { FeedsContainer } from './style';
import { InfoContainer } from 'src/views/community/style';

const ThreadFeedWithData = compose(
  connect(),
  getUserThreads
)(ThreadFeed);
const ThreadParticipantFeedWithData = compose(
  connect(),
  getUserThreads
)(ThreadFeed);

type Props = {
  match: Match,
  currentUser: Object,
  data: {
    user: GetUserType,
  },
  isLoading: boolean,
  queryVarIsChanging: boolean,
  dispatch: Dispatch<Object>,
  history: History,
  location: Location,
};

type State = {
  hasNoThreads: boolean,
  hasThreads: boolean,
};

class UserView extends React.Component<Props, State> {
  state = {
    hasNoThreads: false,
    hasThreads: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    if (this.props.data && this.props.data.user) {
      this.setDefaultTab();

      return dispatch(
        setTitlebarProps({
          title: this.props.data.user.name,
          titleIcon: (
            <UserAvatar
              isClickable={false}
              showOnlineStatus={false}
              user={this.props.data.user}
              size={24}
            />
          ),
          rightAction: <MobileUserAction user={this.props.data.user} />,
        })
      );
    }
  }

  setDefaultTab = () => {
    const { location, history } = this.props;
    const { search } = location;
    const { tab } = querystring.parse(search);
    if (!tab)
      history.replace({
        ...location,
        search: querystring.stringify({ tab: 'posts' }),
      });
  };

  componentDidUpdate(prevProps: Props) {
    const { dispatch } = this.props;

    if (!prevProps.data || !this.props.data) return;

    if (!prevProps.data.user && this.props.data.user) {
      this.setDefaultTab();

      return dispatch(
        setTitlebarProps({
          title: this.props.data.user.name,
          titleIcon: (
            <UserAvatar
              isClickable={false}
              showOnlineStatus={false}
              user={this.props.data.user}
              size={24}
            />
          ),
          rightAction: <MobileUserAction user={this.props.data.user} />,
        })
      );
    }
    // track when a new profile is viewed without the component having been remounted
    if (
      prevProps.data.user &&
      this.props.data.user &&
      prevProps.data.user.id !== this.props.data.user.id
    ) {
      this.setDefaultTab();
      return dispatch(
        setTitlebarProps({
          title: this.props.data.user.name,
          titleIcon: (
            <UserAvatar
              isClickable={false}
              showOnlineStatus={false}
              user={this.props.data.user}
              size={24}
            />
          ),
          rightAction: <MobileUserAction user={this.props.data.user} />,
        })
      );
    }
  }

  hasNoThreads = () => this.setState({ hasThreads: false });
  hasThreads = () => this.setState({ hasThreads: true });

  handleSegmentClick = (tab: string) => {
    const { history, location } = this.props;
    return history.replace({
      ...location,
      search: querystring.stringify({ tab }),
    });
  };

  render() {
    const {
      data: { user },
      isLoading,
      queryVarIsChanging,
      match: {
        params: { username },
      },
      location,
      currentUser,
    } = this.props;
    const { hasThreads } = this.state;

    const { search } = location;
    const { tab } = querystring.parse(search);
    const selectedView = tab;

    if (queryVarIsChanging) {
      return <LoadingView />;
    }

    if (user && user.id) {
      const isCurrentUser = currentUser && user.id === currentUser.id;
      const { title, description } = generateMetaInfo({
        type: 'user',
        data: {
          name: user.name,
          username: user.username,
          description: user.description,
        },
      });

      const Feed =
        selectedView === 'posts'
          ? ThreadFeedWithData
          : ThreadParticipantFeedWithData;

      return (
        <React.Fragment>
          <Head
            title={title}
            description={description}
            image={user.profilePhoto}
            type="profile"
          >
            <meta property="profile:last_name" content={user.name} />
            <meta property="profile:username" content={user.username} />
          </Head>

          <ViewGrid data-cy="user-view">
            <SecondaryPrimaryColumnGrid>
              <SecondaryColumn>
                <SidebarSection>
                  <UserProfileCard user={user} />
                </SidebarSection>

                <SidebarSection>
                  <SidebarSectionHeader>
                    <SidebarSectionHeading>Communities</SidebarSectionHeading>
                  </SidebarSectionHeader>

                  <CommunityList
                    currentUser={currentUser}
                    user={user}
                    id={user.id}
                  />
                </SidebarSection>
              </SecondaryColumn>
              <PrimaryColumn>
                <FeedsContainer>
                  <SegmentedControl>
                    <Segment
                      onClick={() => this.handleSegmentClick('posts')}
                      isActive={selectedView === 'posts'}
                      data-cy="user-posts-tab"
                    >
                      Posts
                    </Segment>

                    <Segment
                      onClick={() => this.handleSegmentClick('activity')}
                      isActive={selectedView === 'activity'}
                      data-cy="user-activity-tab"
                    >
                      Activity
                    </Segment>

                    <Segment
                      onClick={() => this.handleSegmentClick('info')}
                      hideOnDesktop
                      isActive={selectedView === 'info'}
                      data-cy="user-info-tab"
                    >
                      Info
                    </Segment>

                    <Segment
                      onClick={() => this.handleSegmentClick('search')}
                      isActive={selectedView === 'search'}
                      data-cy="user-search-tab"
                    >
                      Search
                    </Segment>
                  </SegmentedControl>

                  {hasThreads &&
                    (selectedView === 'posts' ||
                      selectedView === 'activity') && (
                      <Feed
                        userId={user.id}
                        username={username}
                        viewContext={
                          selectedView === 'activity'
                            ? 'userProfileReplies'
                            : 'userProfile'
                        }
                        hasNoThreads={this.hasNoThreads}
                        hasThreads={this.hasThreads}
                        kind={
                          selectedView === 'posts' ? 'creator' : 'participant'
                        }
                        id={user.id}
                      />
                    )}

                  {selectedView === 'search' && <Search user={user} />}

                  {selectedView === 'info' && (
                    <InfoContainer>
                      <SidebarSection>
                        <UserProfileCard user={user} />
                      </SidebarSection>

                      <SidebarSection>
                        <SidebarSectionHeader>
                          <SidebarSectionHeading>
                            Communities
                          </SidebarSectionHeading>
                        </SidebarSectionHeader>

                        <CommunityList
                          currentUser={currentUser}
                          user={user}
                          id={user.id}
                        />
                      </SidebarSection>
                    </InfoContainer>
                  )}

                  {!hasThreads &&
                    (selectedView === 'posts' ||
                      selectedView === 'activity') && (
                      <NullColumn>
                        <span>
                          <NullColumnHeading>No posts yet</NullColumnHeading>
                          <NullColumnSubheading>
                            Posts will show up here as they are published and
                            when conversations are joined.
                          </NullColumnSubheading>
                          {isCurrentUser && (
                            <PrimaryOutlineButton
                              to={{
                                pathname: '/new/thread',
                                state: { modal: true },
                              }}
                            >
                              <Icon glyph={'post'} size={24} />
                              New post
                            </PrimaryOutlineButton>
                          )}
                        </span>
                      </NullColumn>
                    )}
                </FeedsContainer>
              </PrimaryColumn>
            </SecondaryPrimaryColumnGrid>
          </ViewGrid>
        </React.Fragment>
      );
    }

    if (isLoading) {
      return <LoadingView />;
    }

    if (!user) {
      return (
        <ErrorView
          heading={'We couldn’t find a user with this username'}
          subheading={
            'You may be trying to view a profile that is deleted, or Spectrum is just having a hiccup. If you think something has gone wrong, please contact us.'
          }
        />
      );
    }

    return <ErrorView />;
  }
}

export default compose(
  getUserByMatch,
  withCurrentUser,
  viewNetworkHandler,
  withRouter,
  connect()
)(UserView);
