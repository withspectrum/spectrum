// @flow
import React, { useState, useEffect } from 'react';
import compose from 'recompose/compose';
import { debounce } from 'src/helpers/utils';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import searchThreads from 'shared/graphql/queries/search/searchThreads';
import ThreadFeed from 'src/components/threadFeed';
import Select from 'src/components/select';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { PostsFeedsSelectorContainer, SearchInput } from '../style';

const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);
const SearchThreadFeed = compose(searchThreads)(ThreadFeed);

type Props = {
  community: GetCommunityType,
  currentUser: ?UserInfoType,
};

const useScrollPersistance = (key: string) => {
  useEffect(() => {
    // On mount, if we have a last scroll position scroll there
    const last = sessionStorage ? sessionStorage.getItem(key) : null;
    if (last) {
      const elem = document.getElementById('main');
      if (elem) {
        elem.scrollTop = Number(last);
        setTimeout(() => {
          elem.scrollTop = Number(last);
        });
      }
    }

    // On unmount, store the current scroll position and set it to 0
    return () => {
      const elem = document.getElementById('main');
      if (elem) {
        if (sessionStorage) {
          sessionStorage.setItem(key, elem.scrollTop.toString());
        }
        elem.scrollTop = 0;
      }
    };
  }, []);
};

// @see https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

export const PostsFeeds = withCurrentUser((props: Props) => {
  const { community, currentUser } = props;
  const defaultFeed = !currentUser ? 'trending' : 'latest';
  const [activeFeed, setActiveFeed] = useState(defaultFeed);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [serverSearchQuery, setServerSearchQuery] = useState('');

  const debouncedServerSearchQuery = useDebounce(serverSearchQuery, 500);

  const search = (query: string) => {
    const sanitized = query.toLowerCase().trim();
    setServerSearchQuery(sanitized);
  };

  const handleClientSearch = (e: any) => {
    setClientSearchQuery(e.target.value);
    search(e.target.value);
  };

  useScrollPersistance('last-community-post-feed-scroll-position');

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

        <SearchInput
          onChange={handleClientSearch}
          type="search"
          placeholder="Search"
          value={clientSearchQuery}
        />
      </PostsFeedsSelectorContainer>
      {debouncedServerSearchQuery && (
        <SearchThreadFeed
          search
          viewContext="communityProfile"
          communityId={community.id}
          queryString={debouncedServerSearchQuery}
          filter={{ communityId: community.id }}
          community={community}
          pinnedThreadId={community.pinnedThreadId}
        />
      )}

      {!debouncedServerSearchQuery && (
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
      )}
    </React.Fragment>
  );
});
