// @flow
import * as React from 'react';
import ListCardItemDirectMessageThread from './messageThreadListItem';
import InfiniteList from 'src/components/infiniteScroll';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { LoadingDM } from 'src/components/loading';
import { ThreadsListScrollContainer } from './style';

type Props = {
  threads: Array<?Object>,
  currentUser: ?Object,
  active: string,
  fetchMore: Function,
  hasNextPage: boolean,
  isFetchingMore: boolean,
  isLoading: boolean,
};

type State = {
  scrollElement: any,
};

class ThreadsList extends React.Component<Props, State> {
  state = {
    scrollElement: null,
  };

  componentDidMount() {
    const scrollElement = document.getElementById('scroller-for-dm-threads');
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement,
    });
  }

  render() {
    const {
      threads,
      currentUser,
      active,
      fetchMore,
      hasNextPage,
      isLoading,
      isFetchingMore,
    } = this.props;
    const { scrollElement } = this.state;

    if (isLoading) {
      return (
        <div>
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
          <LoadingDM />
        </div>
      );
    }

    if (!threads || threads.length === 0) {
      return null;
    }

    const uniqueThreads = deduplicateChildren(threads, 'id');

    return (
      <ThreadsListScrollContainer id={'scroller-for-dm-threads'}>
        <InfiniteList
          pageStart={0}
          loadMore={fetchMore}
          isLoadingMore={isFetchingMore}
          hasMore={hasNextPage}
          loader={<LoadingDM />}
          useWindow={false}
          initialLoad={false}
          scrollElement={scrollElement}
          threshold={30}
          className={'scroller-for-community-dm-threads-list'}
        >
          {uniqueThreads.map(thread => {
            if (!thread) return null;
            return (
              <ListCardItemDirectMessageThread
                thread={thread}
                key={thread.id}
                currentUser={currentUser}
                active={active === thread.id}
              />
            );
          })}
        </InfiniteList>
      </ThreadsListScrollContainer>
    );
  }
}

export default ThreadsList;
