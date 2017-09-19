// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import generateMetaInfo from 'shared/generate-meta-info';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import queryString from 'query-string';
import { getEverythingThreads, getCurrentUserProfile } from './queries';
import Titlebar from '../../views/titlebar';
import NewUserOnboarding from '../../views/newUserOnboarding';
import { Column } from '../../components/column';
import Icon from '../../components/icons';
import { UserProfile } from '../../components/profile';
import DashboardThreadFeed from './components/threadFeed';
import ThreadComposer from '../../components/threadComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import CommunityList from '../user/components/communityList';
import DashboardLoading from './components/dashboardLoading';
import DashboardError from './components/dashboardError';
import DashboardThread from '../dashboardThread';
import Composer from './components/inboxComposer';
import {
  DashboardWrapper,
  InboxWrapper,
  InboxScroller,
  ThreadWrapper,
  ThreadScroller,
} from './style';

const EverythingThreadFeed = compose(connect(), getEverythingThreads)(
  DashboardThreadFeed
);

class Dashboard extends Component {
  render() {
    const { data: { user, networkStatus } } = this.props;
    const dataExists = networkStatus === 7 && user;
    const { title, description } = generateMetaInfo();
    const parsed = queryString.parse(this.props.location.search);
    const threadId = parsed.t;

    // if the query is no longer loading and we successfully returned a user from the server we can load the dashboard
    if (dataExists) {
      // if the user has set a username but hasn't joined any communities yet, we have nothing to show them on the dashboard. So instead just render the onboarding step to upsell popular communities to join
      if (user.username && user.communityConnection.edges.length === 0) {
        return (
          <NewUserOnboarding
            noCloseButton
            close={() => {}}
            currentUser={user}
          />
        );
      }

      // at this point we have succesfully validated a user, and the user has both a username and joined communities - we can show their thread feed!
      return (
        <DashboardWrapper>
          <Head title={title} description={description} />
          <Titlebar />

          <InboxWrapper>
            <InboxScroller>
              <Composer />
              <EverythingThreadFeed viewContext="dashboard" />
            </InboxScroller>
          </InboxWrapper>

          <ThreadWrapper>
            <ThreadScroller>
              <DashboardThread threadId={threadId} />
            </ThreadScroller>
          </ThreadWrapper>
        </DashboardWrapper>
      );
    }

    // loading state
    if (networkStatus !== 7)
      return <DashboardLoading title={title} description={description} />;

    // error
    if (networkStatus === 8)
      return <DashboardError title={title} description={description} />;
  }
}

export default compose(getCurrentUserProfile, pure)(Dashboard);
