// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { type History, type Match } from 'react-router';
import { connect } from 'react-redux';
import generateMetaInfo from 'shared/generate-meta-info';
import { Link } from 'react-router-dom';
import Head from 'src/components/head';
import ThreadFeed from 'src/components/threadFeed';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import { UserProfile } from 'src/components/profile';
import { NullState } from 'src/components/upsell';
import { UserProfileCard } from 'src/components/Entities';
import { MobileUserTitlebar } from 'src/components/mobileTitlebar';
import {
  PrimaryButton,
  OutlineButton,
} from 'src/views/Community/components/Button';
import CommunityList from './components/communityList';
import Search from './components/search';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  getUserByMatch,
  type GetUserType,
} from 'shared/graphql/queries/user/getUser';
import getUserThreads from 'shared/graphql/queries/user/getUserThreadConnection';
import { ErrorView, LoadingView } from 'src/views/ViewHelpers';
import { CoverPhoto } from 'src/components/profile/coverPhoto';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import type { Dispatch } from 'redux';
import {
  Grid,
  Meta,
  Content,
  Extras,
  ColumnHeading,
  MetaMemberships,
} from './style';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import { ErrorBoundary } from 'src/components/error';
import { openModal } from 'src/actions/modals';
import { isAdmin } from 'src/helpers/is-admin';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
} from 'src/components/Layout';
import {
  SidebarSection,
  SidebarSectionHeader,
  SidebarSectionHeading,
} from 'src/views/Community/style';

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
    selectedView: 'participant',
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

  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    this.props.history.push('/messages/new');
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
      const { title, description } = generateMetaInfo({
        type: 'user',
        data: {
          name: user.name,
          username: user.username,
          description: user.description,
        },
      });

      const nullHeading = `${user.name} hasn’t ${
        selectedView === 'creator' ? 'created' : 'joined'
      } any conversations yet.`;

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
          <ViewGrid data-cy="user-view">
            <MobileUserTitlebar user={user} />

            <SecondaryPrimaryColumnGrid>
              <SecondaryColumn>
                <UserProfileCard user={user} />

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
                    segmentLabel="participant"
                    onClick={() => this.handleSegmentClick('participant')}
                    isActive={selectedView === 'participant'}
                  >
                    Conversations
                  </Segment>

                  <Segment
                    segmentLabel="creator"
                    onClick={() => this.handleSegmentClick('creator')}
                    isActive={selectedView === 'creator'}
                  >
                    Author
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

                {!hasThreads && <NullState bg="null" heading={nullHeading} />}
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
  connect()
)(UserView);
