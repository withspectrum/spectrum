// @flow
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import ThreadFeed from 'src/components/threadFeed';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';

const CommunityThreadFeed = compose(
  connect(),
  getCommunityThreads
)(ThreadFeed);

export const PostsFeeds = (props: Props) => {
  const { community } = props;
  const [activeFeed, setActiveFeed] = useState('latest');

  return (
    <React.Fragment>
      {/* <SegmentedControl sticky={false}>
        <Segment
          isActive={activeFeed === 'latest'}
          onClick={() => setActiveFeed('latest')}
        >
          Latest
        </Segment>

        <Segment
          isActive={activeFeed === 'trending'}
          onClick={() => setActiveFeed('trending')}
        >
          Popular
        </Segment>
      </SegmentedControl> */}

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
};
