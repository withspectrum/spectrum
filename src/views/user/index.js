import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import generateMetaInfo from 'shared/generate-meta-info';
import { Link } from 'react-router-dom';
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
import { getUserThreads, getUser } from './queries';
import ViewError from '../../components/viewError';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import Titlebar from '../titlebar';

const ThreadFeedWithData = compose(connect(), getUserThreads)(ThreadFeed);

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
};

class UserView extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { hasThreads: true };
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

  render() {
    const {
      data: { user },
      isLoading,
      hasError,
      queryVarIsChanging,
      match: { params: { username } },
      currentUser,
    } = this.props;
    const { hasThreads } = this.state;

    if (queryVarIsChanging) {
      return <LoadingScreen />;
    }

    if (user) {
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
            {hasThreads ? (
              <ThreadFeedWithData
                userId={user.id}
                username={username}
                viewContext="profile"
                hasNoThreads={this.hasNoThreads}
                hasThreads={this.hasThreads}
              />
            ) : (
              <NullState
                bg="message"
                heading={`${user.firstName
                  ? user.firstName
                  : user.name} hasn’t posted anything yet.`}
              />
            )}
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
