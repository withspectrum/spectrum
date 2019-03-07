// @flow
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import getComposerLink from 'src/helpers/get-composer-link';
import ThreadFeed from 'src/components/threadFeed';
import { SmallPrimaryButton } from './Button';
import Icon from 'src/components/icons';
import { SegmentedControl, Segment } from 'src/components/SegmentedControl';

const CommunityThreadFeed = compose(
  connect(),
  getCommunityThreads
)(ThreadFeed);

export const PostsFeeds = (props: Props) => {
  const { community } = props;
  const [activeFeed, setActiveFeed] = useState('latest');

  const { pathname, search } = getComposerLink({ communityId: community.id });

  return (
    <React.Fragment>
      <SegmentedControl>
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

        {community.communityPermissions.isMember && (
          <SmallPrimaryButton
            to={{
              pathname,
              search,
              state: { modal: true },
            }}
          >
            <Icon glyph={'post'} size={24} />
            New Post
          </SmallPrimaryButton>
        )}
      </SegmentedControl>

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
