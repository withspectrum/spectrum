//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { Link } from 'react-router-dom';

import { getEverythingThreads, getCurrentUserProfile } from './queries';
import Titlebar from '../../views/titlebar';
import { UpsellSignIn, NullCard } from '../../components/upsell';
import { Button } from '../../components/buttons';
import { displayLoadingScreen } from '../../components/loading';
import { Column } from '../../components/column';
import { UserProfile } from '../../components/profile';
import ThreadFeed from '../../components/threadFeed';
import ThreadComposer from '../../components/threadComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import CommunityList from '../user/components/communityList';

const EverythingThreadFeed = compose(getEverythingThreads)(ThreadFeed);

const DashboardPure = props => {
  const { data: { user, error } } = props;

  if (error) {
    return (
      <AppViewWrapper>
        <Titlebar />
        <Column type="primary" alignItems="center">
          <NullCard
            bg="error"
            heading="Whoops! Something broke the home page."
            copy="Mind reloading?"
          >
            <Button icon="view-reload" onClick={() => location.reload(true)}>
              Reload
            </Button>
          </NullCard>
        </Column>
      </AppViewWrapper>
    );
  } else if (user && user !== null) {
    const currentUser = user;
    const communities = user.communityConnection.edges;
    return (
      <AppViewWrapper>
        <Titlebar />

        <Column type="secondary">
          <UserProfile profileSize="mini" data={{ user: user }} />
          {user &&
            communities &&
            <CommunityList
              withDescription={false}
              currentUser={currentUser}
              user={user}
              communities={communities}
            />}
        </Column>

        {user &&
          communities &&
          <Column type="primary">
            <ThreadComposer />
            <EverythingThreadFeed viewContext="dashboard" />
          </Column>}
        {/* {user &&
          !communities &&
          <Column type="primary">
            <NullCard
              bg="chat"
              heading={`It's dangerous to go alone...`}
              copy={`So let's find you some communities to join!`}
            >
              <Link to={`/explore`}>
                <Button icon="explore">Browse communities</Button>
              </Link>
            </NullCard>
          </Column>} */}
      </AppViewWrapper>
    );
  } else {
    return (
      <AppViewWrapper>
        <Titlebar />
        <Column type="primary" alignItems="center">
          <UpsellSignIn />
        </Column>
      </AppViewWrapper>
    );
  }
};

/*
  This is bad, but necessary for now!
  I'm wrapping DashboardPure in a query for getCurrentUserProfile so that I
  can store the user in localStorage and redux for any downstream actions
*/
const Dashboard = compose(getCurrentUserProfile, displayLoadingScreen, pure)(
  DashboardPure
);
export default Dashboard;
