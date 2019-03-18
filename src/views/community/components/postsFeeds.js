// @flow
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import ThreadFeed from 'src/components/threadFeed';
import Select from 'src/components/select';
import { withCurrentUser } from 'src/components/withCurrentUser';

const CommunityThreadFeed = compose(
  connect(),
  getCommunityThreads
)(ThreadFeed);

export const PostsFeeds = withCurrentUser((props: Props) => {
  const { community, currentUser } = props;
  const [activeFeed, setActiveFeed] = useState(
    !currentUser ? 'trending' : 'latest'
  );

  return (
    <React.Fragment>
      <Select value={activeFeed} onChange={e => setActiveFeed(e.target.value)}>
        <option key="latest" value="latest">
          Latest
        </option>
        <option key="trending" value="trending">
          Trending
        </option>
      </Select>
      <CommunityThreadFeed
        viewContext="communityProfile"
        slug={community.slug}
        id={community.id}
        setThreadsStatus={false}
        isNewAndOwned={false}
        community={community}
        pinnedThreadId={community.pinnedThreadId}
        sort={activeFeed}
      />
    </React.Fragment>
  );
});
