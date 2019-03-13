// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { type History, type Match } from 'react-router';
import { connect } from 'react-redux';
import generateMetaInfo from 'shared/generate-meta-info';
import Head from 'src/components/head';
import ThreadFeed from 'src/components/threadFeed';
import { UserProfileCard } from 'src/components/entities';
import { MobileUserTitlebar } from 'src/components/titlebar';
import CommunityList from './components/communityList';
import Search from './components/search';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  getUserByMatch,
  type GetUserType,
} from 'shared/graphql/queries/user/getUser';
import getUserThreads from 'shared/graphql/queries/user/getUserThreadConnection';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import type { Dispatch } from 'redux';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import { openModal } from 'src/actions/modals';
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
import { PrimaryButton } from 'src/views/community/components/button';
import Icon from 'src/components/icons';

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
};

type State = {
  hasNoThreads: boolean,
  selectedView: string,
  hasThreads: boolean,
};

class UserView extends React.Component<Props, State> {
  state = {
    hasNoThreads: false,
    selectedView: 'creator',
    hasThreads: true,
  };

  componentDidMount() {}

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.data.user) return;
    if (!this.props.data.user) return;
    // track when a new profile is viewed without the component having been remounted
    if (prevProps.data.user.id !== this.props.data.user.id) {
    }
  }

  hasNoThreads = () => this.setState({ hasThreads: false });
  hasThreads = () => this.setState({ hasThreads: true });

  handleSegmentClick = (label: string) => {
    if (this.state.selectedView === label) return;

    return this.setState({
      selectedView: label,
      hasThreads: true,
    });
  };

  initReport = () => {
    const {
      data: { user },
      dispatch,
    } = this.props;
    return dispatch(openModal('REPORT_USER_MODAL', { user }));
  };

  initBan = () => {
    const {
      data: { user },
      dispatch,
    } = this.props;
    return dispatch(openModal('BAN_USER_MODAL', { user }));
  };

  render() {
    const {
      data: { user },
      isLoading,
      queryVarIsChanging,
      match: {
        params: { username },
      },
      currentUser,
    } = this.props;
    const { hasThreads, selectedView } = this.state;

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
        selectedView === 'creator'
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
          <MobileUserTitlebar currentUser={currentUser} user={user} />

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
                <SegmentedControl>
                  <Segment
                    segmentLabel="creator"
                    onClick={() => this.handleSegmentClick('creator')}
                    isActive={selectedView === 'creator'}
                  >
                    Posts
                  </Segment>

                  <Segment
                    segmentLabel="participant"
                    onClick={() => this.handleSegmentClick('participant')}
                    isActive={selectedView === 'participant'}
                  >
                    Activity
                  </Segment>

                  <Segment
                    onClick={() => this.handleSegmentClick('search')}
                    isActive={selectedView === 'search'}
                  >
                    Search
                  </Segment>
                </SegmentedControl>

                {hasThreads &&
                  (selectedView === 'creator' ||
                    selectedView === 'participant') && (
                    <Feed
                      userId={user.id}
                      username={username}
                      viewContext={
                        selectedView === 'participant'
                          ? 'userProfileReplies'
                          : 'userProfile'
                      }
                      hasNoThreads={this.hasNoThreads}
                      hasThreads={this.hasThreads}
                      kind={selectedView}
                      id={user.id}
                    />
                  )}

                {selectedView === 'search' && <Search user={user} />}

                {!hasThreads && (
                  <NullColumn>
                    <span>
                      <NullColumnHeading>No posts yet</NullColumnHeading>
                      <NullColumnSubheading>
                        Posts will show up here as they are published and when
                        conversations are joined.
                      </NullColumnSubheading>
                      {isCurrentUser && (
                        <PrimaryButton
                          to={{
                            pathname: '/new/thread',
                            state: { modal: true },
                          }}
                        >
                          <Icon glyph={'post'} size={24} />
                          New post
                        </PrimaryButton>
                      )}
                    </span>
                  </NullColumn>
                )}
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
          titlebarTitle={'Profile'}
          heading={'We couldn’t find a user with this username'}
          subheading={
            'You may be trying to view a profile that is deleted, or Spectrum is just having a hiccup. If you think something has gone wrong, please contact us.'
          }
        />
      );
    }

    return <ErrorView titlebarTitle={'Profile'} />;
  }
}

export default compose(
  getUserByMatch,
  withCurrentUser,
  viewNetworkHandler,
  connect()
)(UserView);
