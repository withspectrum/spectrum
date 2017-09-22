// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import generateMetaInfo from 'shared/generate-meta-info';
// $FlowFixMe
import queryString from 'query-string';
// $FlowFixMe
import { connect } from 'react-redux';
import { getEverythingThreads, getCurrentUserProfile } from './queries';
import { getCommunityThreads } from '../../views/community/queries';
import Titlebar from '../../views/titlebar';
import NewUserOnboarding from '../../views/newUserOnboarding';
import { Column } from '../../components/column';
import Icon from '../../components/icons';
import { UserProfile } from '../../components/profile';
import DashboardThreadFeed from './components/threadFeed';
import ThreadComposer from '../../components/threadComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import DashboardLoading from './components/dashboardLoading';
import DashboardError from './components/dashboardError';
import NewActivityIndicator from './components/newActivityIndicator';
import DashboardThread from '../dashboardThread';
import Composer from './components/inboxComposer';
import CommunityList from './components/communityList';
import {
  Wrapper,
  InboxWrapper,
  InboxScroller,
  CommunityListWrapper,
  CommunityListScroller,
  FeedHeaderContainer,
  ThreadWrapper,
  ThreadScroller,
  ThreadComposerContainer,
} from './style';

const EverythingThreadFeed = compose(connect(), getEverythingThreads)(
  DashboardThreadFeed
);

const CommunityThreadFeed = compose(connect(), getCommunityThreads)(
  DashboardThreadFeed
);

const DashboardWrapper = props => <Wrapper>{props.children}</Wrapper>;

class Dashboard extends Component {
  render() {
    const {
      data: { user, networkStatus },
      newActivityIndicator,
      activeThread,
      activeCommunity,
      composerIsOpen,
    } = this.props;
    const dataExists = networkStatus === 7 && user;
    const { title, description } = generateMetaInfo();

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
      const communities = user.communityConnection.edges.map(c => c.node);
      const activeCommunityObject = communities.filter(
        c => c.id === activeCommunity
      )[0];

      return (
        <DashboardWrapper>
          <Head title={title} description={description} />
          <Titlebar />

          <CommunityListWrapper>
            <CommunityListScroller>
              <CommunityList
                communities={communities}
                user={user}
                activeCommunity={activeCommunity}
              />
            </CommunityListScroller>
          </CommunityListWrapper>

          <InboxWrapper>
            <FeedHeaderContainer>
              <Composer />
            </FeedHeaderContainer>
            {newActivityIndicator && (
              <NewActivityIndicator elem="scroller-for-inbox" />
            )}
            {composerIsOpen && (
              <ThreadComposerContainer>
                <ThreadComposer
                  activeCommunity={
                    activeCommunityObject && activeCommunityObject.slug
                  }
                  activeChannel={'general'}
                  isInbox
                />
              </ThreadComposerContainer>
            )}
            <InboxScroller id="scroller-for-inbox">
              {!activeCommunity ? (
                <EverythingThreadFeed selectedId={activeThread} />
              ) : (
                <CommunityThreadFeed
                  id={activeCommunity}
                  selectedId={activeThread}
                  hasActiveCommunity={activeCommunity}
                  community={activeCommunityObject}
                  pinnedThreadId={activeCommunityObject.pinnedThreadId}
                />
              )}
            </InboxScroller>
          </InboxWrapper>

          <ThreadWrapper>
            <ThreadScroller id="scroller-for-inbox-thread-view">
              <DashboardThread threadId={activeThread} />
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

    return null;
  }
}

const map = state => ({
  newActivityIndicator: state.newActivityIndicator.hasNew,
  activeThread: state.dashboardFeed.activeThread,
  activeCommunity: state.dashboardFeed.activeCommunity,
  composerIsOpen: state.composer.isOpen,
});
export default compose(connect(map), getCurrentUserProfile, pure)(Dashboard);
