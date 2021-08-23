// @flow
import React, { useState } from 'react';
import compose from 'recompose/compose';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import ThreadFeed from 'src/components/threadFeed';
import Select from 'src/components/select';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { PostsFeedsSelectorContainer } from '../style';

const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);

type Props = {
  community: GetCommunityType,
  currentUser: ?UserInfoType,
};

export const PostsFeeds = withCurrentUser((props: Props) => {
  const { community, currentUser } = props;
  const defaultFeed = !currentUser ? 'trending' : 'latest';
  const [activeFeed, setActiveFeed] = useState(defaultFeed);

  return (
    <React.Fragment>
      <PostsFeedsSelectorContainer>
        <Select
          value={activeFeed}
          onChange={e => setActiveFeed(e.target.value)}
        >
          <option key="latest" value="latest">
            Latest
          </option>
          <option key="trending" value="trending">
            Popular
          </option>
        </Select>
      </PostsFeedsSelectorContainer>

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
