import React, { Component } from 'react';
//$FlowFixMe
import styled from 'styled-components';
//$FlowFixMe
import compose from 'recompose/compose';
// NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
// I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside
import InfiniteList from 'react-infinite-scroller-with-scroll-element';
import { connect } from 'react-redux';
import { ImportSlackWithoutCard } from '../../views/communitySettings/components/importSlack';
import { EmailInvitesWithoutCard } from '../../views/communitySettings/components/emailInvites';
import Share from '../../views/newCommunity/components/share';
import ThreadFeedCard from '../threadFeedCard';
import { Card } from '../card';
import { NullCard } from '../upsell';
import { LoadingThread } from '../loading';
import { Divider } from './style';
import NewActivityIndicator from '../../components/newActivityIndicator';
import ViewError from '../viewError';

const NullState = () => (
  <NullCard
    bg="post"
    heading={`Sorry, no threads here yet...`}
    copy={`But you could start one!`}
  />
);

const UpsellState = ({ community }) => {
  return (
    <NullCard
      bg="onboarding"
      repeat
      heading={'Every community has to start somewhere...'}
      copy={`${community.name} just needs more friends - invite people to your community to get a conversation started!`}
    >
      <Share community={community} onboarding={false} />
      <Divider />
      <EmailInvitesWithoutCard community={community} />
      <Divider />
      <ImportSlackWithoutCard community={community} id={community.id} />
    </NullCard>
  );
};

const Threads = styled.div`
  min-width: 100%;

  button {
    align-self: center;
    margin: auto;
  }

  @media (max-width: 768px) {
  }
`;

/*
  The thread feed always expects a prop of 'threads' - this means that in
  the Apollo query contructor, you will need to map a new prop called 'threads'
  to return whatever threads we're fetching (community -> threadsConnection)

  See 'views/community/queries.js' for an example of the prop mapping in action
*/
class ThreadFeedPure extends Component {
  state: {
    scrollElement: any,
    subscription: ?Function,
  };

  constructor() {
    super();
    this.state = {
      scrollElement: null,
      subscription: null,
    };
  }

  subscribe = () => {
    this.setState({
      subscription:
        this.props.data.subscribeToUpdatedThreads &&
        this.props.data.subscribeToUpdatedThreads(),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      subscription();
    }
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidMount() {
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement: document.getElementById('scroller-for-thread-feed'),
    });
    this.subscribe();
  }

  render() {
    const {
      data: { threads, networkStatus, error },
      viewContext,
      newActivityIndicator,
    } = this.props;
    const { scrollElement } = this.state;
    const dataExists = threads && threads.length > 0;
    const isCommunityMember =
      this.props.community &&
      (this.props.community.communityPermissions.isMember ||
        this.props.community.communityPermissions.isOwner ||
        this.props.community.communityPermissions.isModerator) &&
      !this.props.community.communityPermissions.isBlocked;

    const threadNodes = dataExists
      ? threads.slice().map(thread => thread.node)
      : [];

    if (dataExists) {
      return (
        <Threads>
          {newActivityIndicator && (
            <NewActivityIndicator elem="scroller-for-thread-feed" />
          )}
          <InfiniteList
            pageStart={0}
            loadMore={this.props.data.fetchMore}
            hasMore={this.props.data.hasNextPage}
            loader={<LoadingThread />}
            useWindow={false}
            initialLoad={false}
            scrollElement={scrollElement}
            threshold={750}
          >
            {threadNodes.map(thread => {
              return (
                <ThreadFeedCard
                  key={thread.id}
                  data={thread}
                  viewContext={viewContext}
                  isPinned={thread.id === this.props.pinnedThreadId}
                />
              );
            })}
          </InfiniteList>
        </Threads>
      );
    }

    if (networkStatus <= 2) {
      return (
        <Threads>
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
          <LoadingThread />
        </Threads>
      );
    }

    if (networkStatus === 8 || error) {
      return (
        <Card>
          <ViewError
            heading={'We ran into an issue loading the feed'}
            subheading={
              'Try refreshing the page below. If you’re still seeing this error, you can email us at hi@spectrum.chat.'
            }
            refresh
          />
        </Card>
      );
    }

    // if there are no threads, tell the parent container so that we can render upsells to community owners in the parent container
    if (this.props.setThreadsStatus) {
      this.props.setThreadsStatus();
    }
    if (this.props.isNewAndOwned) {
      return <UpsellState community={this.props.community} />;
    } else if (isCommunityMember || this.props.viewContext === 'channel') {
      return <NullState />;
    } else {
      return null;
    }
  }
}

const map = state => ({
  newActivityIndicator: state.newActivityIndicator.hasNew,
});
const ThreadFeed = compose(connect(map))(ThreadFeedPure);

export default ThreadFeed;
