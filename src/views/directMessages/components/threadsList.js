// @flow
import * as React from 'react';
import ListCardItemDirectMessageThread from './messageThreadListItem';
import InfiniteList from 'react-infinite-scroller-with-scroll-element';
import { LoadingDM } from 'src/components/loading';
import { ThreadsListScrollContainer } from './style';
import { fetchMoreOnInfiniteScrollLoad } from 'src/helpers/infiniteScroll';

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

  componentDidUpdate(prevProps: Props) {
    const scrollElement = document.getElementById('scroller-for-dm-threads');
    const curr = this.props;

    // prevents duplicate queries with the same cursor id
    if (curr.threads.length === prevProps.threads.length) return;

    if (
      fetchMoreOnInfiniteScrollLoad(
        scrollElement,
        'scroller-for-community-dm-threads-list'
      ) &&
      curr.fetchMore &&
      curr.hasNextPage &&
      !curr.isFetchingMore
    ) {
      return curr.fetchMore();
    }
  }

  render() {
    const {
      threads,
      currentUser,
      active,
      fetchMore,
      hasNextPage,
      isLoading,
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

    return (
      <ThreadsListScrollContainer id={'scroller-for-dm-threads'}>
        <InfiniteList
          pageStart={0}
          loadMore={fetchMore}
          hasMore={hasNextPage}
          loader={<LoadingDM />}
          useWindow={false}
          initialLoad={false}
          scrollElement={scrollElement}
          threshold={30}
          className={'scroller-for-community-dm-threads-list'}
        >
          {threads.map(thread => {
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
