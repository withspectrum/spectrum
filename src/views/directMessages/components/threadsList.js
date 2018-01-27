// @flow
import * as React from 'react';
import ListCardItemDirectMessageThread from './messageThreadListItem';
import InfiniteList from 'react-infinite-scroller-with-scroll-element';
import { LoadingDM } from '../../../components/loading';
import { ThreadsListScrollContainer } from './style';

type Props = {
  threads: ?Array<?Object>,
  currentUser: ?Object,
  active: string,
  fetchMore: Function,
  hasNextPage: boolean,
};

type State = {
  scrollElement: any,
};

class ThreadsList extends React.Component<Props, State> {
  state = {
    scrollElement: null,
  };

  componentDidMount() {
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement: document.getElementById('scroller-for-dm-threads'),
    });
  }

  render() {
    const { threads, currentUser, active, fetchMore, hasNextPage } = this.props;
    const { scrollElement } = this.state;

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
