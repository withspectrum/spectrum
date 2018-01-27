import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import generateMetaInfo from 'shared/generate-meta-info';
import Link from 'src/components/link';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import Column from '../../components/column';
import ThreadFeed from '../../components/threadFeed';
import { track } from '../../helpers/events';
import { UserProfile } from '../../components/profile';
import { LoadingScreen } from '../../components/loading';
import { NullState } from '../../components/upsell';
import { Button, ButtonRow } from '../../components/buttons';
import CommunityList from './components/communityList';
import Search from './components/search';
import { getUserThreads, getUser } from './queries';
import ViewError from '../../components/viewError';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import Titlebar from '../titlebar';
import {
  SegmentedControl,
  DesktopSegment,
  MobileSegment,
} from '../../components/segmentedControl';

const ThreadFeedWithData = compose(connect(), getUserThreads)(ThreadFeed);
const ThreadParticipantFeedWithData = compose(connect(), getUserThreads)(
  ThreadFeed
);

type Props = {
  match: {
    params: {
      username: string,
    },
  },
  currentUser: Object,
  data: {
    user: Object,
  },
  isLoading: boolean,
  hasError: boolean,
  queryVarIsChanging: boolean,
};

type State = {
  hasNoThreads: boolean,
  selectedView: 'participant' | 'creator',
};

class UserView extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { hasThreads: true, selectedView: 'participant' };
  }

  componentDidMount() {
    track('user', 'profile viewed', null);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.data.user) return;
    // track when a new profile is viewed without the component having been remounted
    if (prevProps.data.user.id !== this.props.data.user.id) {
      track('user', 'profile viewed', null);
    }
  }

  hasNoThreads = () => this.setState({ hasThreads: false });
  hasThreads = () => this.setState({ hasThreads: true });

  handleSegmentClick = label => {
    if (this.state.selectedView === label) return;

    return this.setState({
      selectedView: label,
      hasThreads: true,
    });
  };

  render() {
    const {
      data: { user },
      isLoading,
      hasError,
      queryVarIsChanging,
      match: { params: { username } },
      currentUser,
    } = this.props;
    const { hasThreads, selectedView } = this.state;

    if (queryVarIsChanging) {
      return <LoadingScreen />;
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

      const communities =
        user.communityConnection.edges.length > 0
          ? user.communityConnection.edges.map(c => c.node)
          : [];

      const nullHeading = `${
        user.firstName ? user.firstName : user.name
      } hasn’t ${
        selectedView === 'creator' ? 'created' : 'joined'
      } any conversations yet.`;

      const Feed =
        selectedView === 'creator'
          ? ThreadFeedWithData
          : ThreadParticipantFeedWithData;

      return (
        <AppViewWrapper data-e2e-id="user-view">
          <Head
            title={title}
            description={description}
            image={user.profilePhoto}
          />
          <Titlebar
            title={user.name}
            subtitle={'Posts By'}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <Column type="secondary">
            <UserProfile
              data={{ user }}
              username={username}
              profileSize="full"
            />
            <CommunityList
              currentUser={currentUser}
              user={user}
              communities={communities}
            />
          </Column>

          <Column type="primary" alignItems="center">
            <SegmentedControl style={{ margin: '-16px 0 16px' }}>
              <DesktopSegment
                segmentLabel="search"
                onClick={() => this.handleSegmentClick('search')}
                selected={selectedView === 'search'}
              >
                Search
              </DesktopSegment>

              <DesktopSegment
                segmentLabel="participant"
                onClick={() => this.handleSegmentClick('participant')}
                selected={selectedView === 'participant'}
              >
                Replies
              </DesktopSegment>

              <DesktopSegment
                segmentLabel="creator"
                onClick={() => this.handleSegmentClick('creator')}
                selected={selectedView === 'creator'}
              >
                Threads
              </DesktopSegment>
              <MobileSegment
                segmentLabel="search"
                onClick={() => this.handleSegmentClick('search')}
                selected={selectedView === 'search'}
              >
                Search
              </MobileSegment>
              <MobileSegment
                segmentLabel="participant"
                onClick={() => this.handleSegmentClick('participant')}
                selected={selectedView === 'participant'}
              >
                Replies
              </MobileSegment>
              <MobileSegment
                segmentLabel="creator"
                onClick={() => this.handleSegmentClick('creator')}
                selected={selectedView === 'creator'}
              >
                Threads
              </MobileSegment>
            </SegmentedControl>

            {hasThreads &&
              (selectedView === 'creator' ||
                selectedView === 'participant') && (
                <Feed
                  userId={user.id}
                  username={username}
                  viewContext="profile"
                  hasNoThreads={this.hasNoThreads}
                  hasThreads={this.hasThreads}
                  kind={selectedView}
                />
              )}

            {selectedView === 'search' && <Search user={user} />}

            {!hasThreads && <NullState bg="null" heading={nullHeading} />}
          </Column>
        </AppViewWrapper>
      );
    }

    if (isLoading) {
      return <LoadingScreen />;
    }

    if (hasError) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={`User not found`}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <ViewError
            heading={`We ran into an error loading this user.`}
            refresh
          />
        </AppViewWrapper>
      );
    }

    if (!user) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={`User not found`}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <ViewError heading={`We couldn’t find anyone with this username.`}>
            <ButtonRow>
              <Link to={`/`}>
                <Button large>Take me home</Button>
              </Link>
            </ButtonRow>
          </ViewError>
        </AppViewWrapper>
      );
    }
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(connect(map), getUser, viewNetworkHandler)(UserView);
