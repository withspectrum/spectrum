import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import generateMetaInfo from 'shared/generate-meta-info';
// $FlowFixMe
import { connect } from 'react-redux';
import { removeItemFromStorage } from '../../helpers/localStorage';
import { getEverythingThreads } from './queries';
import { getCommunityThreads } from '../../views/community/queries';
import { getChannelThreads } from '../../views/channel/queries';
import { getCurrentUserProfile } from '../../api/user';
import Titlebar from '../../views/titlebar';
import NewUserOnboarding from '../../views/newUserOnboarding';
import DashboardThreadFeed from './components/threadFeed';
import Head from '../../components/head';
import DashboardLoading from './components/dashboardLoading';
import DashboardError from './components/dashboardError';
import NewActivityIndicator from './components/newActivityIndicator';
import DashboardThread from '../dashboardThread';
import Header from './components/threadSelectorHeader';
import CommunityList from './components/communityList';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import {
  Wrapper,
  InboxWrapper,
  InboxScroller,
  CommunityListWrapper,
  CommunityListScroller,
  FeedHeaderContainer,
  ThreadWrapper,
  ThreadScroller,
} from './style';

const EverythingThreadFeed = compose(connect(), getEverythingThreads)(
  DashboardThreadFeed
);

const CommunityThreadFeed = compose(connect(), getCommunityThreads)(
  DashboardThreadFeed
);

const ChannelThreadFeed = compose(connect(), getChannelThreads)(
  DashboardThreadFeed
);

const DashboardWrapper = props => <Wrapper>{props.children}</Wrapper>;

class Dashboard extends Component {
  state: {
    isHovered: boolean,
  };

  constructor() {
    super();

    this.state = {
      isHovered: false,
    };
  }

  setHover = () => {
    setTimeout(() => {
      this.setState({
        isHovered: true,
      });
    }, 1000);
  };

  removeHover = () => {
    this.setState({
      isHovered: false,
    });
  };

  render() {
    const {
      data: { user },
      newActivityIndicator,
      activeThread,
      activeCommunity,
      activeChannel,
      isLoading,
      hasError,
    } = this.props;
    const { isHovered } = this.state;
    const { title, description } = generateMetaInfo();

    if (user) {
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
        <DashboardWrapper data-e2e-id="inbox-view">
          <Head title={title} description={description} />
          <Titlebar />
          <CommunityListWrapper
            onMouseEnter={this.setHover}
            onMouseLeave={this.removeHover}
          >
            <CommunityListScroller>
              <CommunityList
                isHovered={isHovered}
                communities={communities}
                user={user}
                activeCommunity={activeCommunity}
                activeChannel={activeChannel}
              />
            </CommunityListScroller>
          </CommunityListWrapper>

          <InboxWrapper>
            <FeedHeaderContainer>
              <Header />
            </FeedHeaderContainer>
            {newActivityIndicator && (
              <NewActivityIndicator elem="scroller-for-inbox" />
            )}
            <InboxScroller id="scroller-for-inbox">
              {!activeCommunity ? (
                <EverythingThreadFeed selectedId={activeThread} />
              ) : activeChannel ? (
                <ChannelThreadFeed
                  id={activeChannel}
                  selectedId={activeThread}
                  hasActiveCommunity={activeCommunity}
                  hasActiveChannel={activeChannel}
                  community={activeCommunityObject}
                  pinnedThreadId={
                    activeCommunityObject &&
                    activeCommunityObject.pinnedThreadId
                  }
                  channelId={activeChannel}
                />
              ) : (
                <CommunityThreadFeed
                  id={activeCommunity}
                  selectedId={activeThread}
                  hasActiveCommunity={activeCommunity}
                  community={activeCommunityObject}
                  pinnedThreadId={
                    activeCommunityObject &&
                    activeCommunityObject.pinnedThreadId
                  }
                />
              )}
            </InboxScroller>
          </InboxWrapper>

          <ThreadWrapper>
            <ThreadScroller id="scroller-for-inbox-thread-view">
              <DashboardThread
                threadId={activeThread}
                activeCommunity={
                  activeCommunityObject && activeCommunityObject.slug
                }
                activeChannel={activeChannel}
              />
            </ThreadScroller>
          </ThreadWrapper>
        </DashboardWrapper>
      );
    }

    // loading state
    if (isLoading)
      return <DashboardLoading title={title} description={description} />;

    if (hasError)
      return (
        <DashboardError
          title={title}
          description={description}
          error={hasError}
        />
      );

    // if the user reached here it most likely that they have a user in localstorage but we weren't able to auth them - either because of a bad session token or otherwise. In this case we should clear local storage and load the home page to get them to log in again
    removeItemFromStorage('spectrum');
    window.location.href = '/';
    return null;
  }
}

const map = state => ({
  newActivityIndicator: state.newActivityIndicator.hasNew,
  activeThread: state.dashboardFeed.activeThread,
  activeCommunity: state.dashboardFeed.activeCommunity,
  activeChannel: state.dashboardFeed.activeChannel,
});
export default compose(connect(map), getCurrentUserProfile, viewNetworkHandler)(
  Dashboard
);
