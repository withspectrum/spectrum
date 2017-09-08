//@flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import { getEverythingThreads, getCurrentUserProfile } from './queries';
import Titlebar from '../../views/titlebar';
import NewUserOnboarding from '../../views/newUserOnboarding';
import {
  UpsellSignIn,
  UpsellToReload,
  UpsellMiniCreateCommunity,
  UpsellMiniUpgrade,
} from '../../components/upsell';
import {
  LoadingProfile,
  LoadingList,
  LoadingFeed,
  LoadingComposer,
} from '../../components/loading';
import { FlexCol } from '../../components/globals';
import { withInfiniteScroll } from '../../components/infiniteScroll';
import { Column } from '../../components/column';
import { UserProfile } from '../../components/profile';
import ThreadFeed from '../../components/threadFeed';
import ThreadComposer from '../../components/threadComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import CommunityList from '../user/components/communityList';
//$FlowFixMe
import generateMetaInfo from 'shared/generate-meta-info';

const EverythingThreadFeed = compose(getEverythingThreads)(ThreadFeed);

class DashboardPure extends Component {
  state: {
    isNewUser: boolean,
  };

  constructor(props) {
    super(props);

    this.state = {
      isNewUser: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.data.user && this.props.data.user) {
      const user = this.props.data.user;
      const communities =
        this.props.data.user && this.props.data.user.communityConnection.edges;
      const isNewUser =
        (user && communities.length <= 0) || (user && !user.username);

      this.setState({
        isNewUser,
      });
    }
  }

  graduate = () => {
    window.location.href = '/';
  };

  render() {
    const { data: { user, networkStatus } } = this.props;
    const { isNewUser } = this.state;
    const isMobile = window.innerWidth < 768;
    const dataExists = user && user.communityConnection;
    const { title, description } = generateMetaInfo();

    // Error, prompt reload
    if (networkStatus === 8) {
      return (
        <AppViewWrapper>
          <Head title={title} description={description} />
          <Titlebar noComposer />
          <Column type="primary" alignItems="center">
            <UpsellToReload />
          </Column>
        </AppViewWrapper>
      );
    }

    if (dataExists) {
      const currentUser = user;
      const communities = user.communityConnection.edges;

      return (
        <AppViewWrapper>
          <Head title={title} description={description} />
          <Titlebar />

          {currentUser.username &&
          communities.length === 0 && (
            <NewUserOnboarding
              noCloseButton
              close={() => {}}
              currentUser={currentUser}
            />
          )}

          {!isMobile && (
            <Column type="secondary">
              <UserProfile profileSize="mini" data={{ user: user }} />
              <CommunityList
                withDescription={false}
                currentUser={currentUser}
                user={user}
                communities={communities}
                networkStatus={networkStatus}
              />
              <UpsellMiniCreateCommunity largeOnly />
              {!currentUser.isPro && <UpsellMiniUpgrade largeOnly />}
            </Column>
          )}

          <Column type="primary">
            <FlexCol>
              <ThreadComposer />
              <EverythingThreadFeed viewContext="dashboard" />
            </FlexCol>
          </Column>
        </AppViewWrapper>
      );
    }

    // Got no data
    if (networkStatus !== 7) {
      return (
        <AppViewWrapper>
          <Head title={title} description={description} />
          <Titlebar noComposer />
          {!isMobile && (
            <Column type="secondary">
              <LoadingProfile />
              <LoadingList />
            </Column>
          )}
          <Column type="primary">
            {!isMobile && <LoadingComposer />}
            <LoadingFeed />
          </Column>
        </AppViewWrapper>
      );
    }
  }
}

const Dashboard = compose(getCurrentUserProfile, withInfiniteScroll, pure)(
  DashboardPure
);
export default Dashboard;
