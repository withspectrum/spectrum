// @flow
import React, { useState, useEffect } from 'react';
import compose from 'recompose/compose';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import getChannelThreads from 'shared/graphql/queries/channel/getChannelThreadConnection';
import searchThreads from 'shared/graphql/queries/search/searchThreads';
import ThreadFeed from 'src/components/threadFeed';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  PostsFeedsSelectorContainer,
  SearchInput,
} from 'src/views/community/style';
import MiniComposer from 'src/components/composerMini';

const ChannelThreadFeed = compose(getChannelThreads)(ThreadFeed);
const SearchThreadFeed = compose(searchThreads)(ThreadFeed);

type Props = {
  channel: GetChannelType,
  currentUser: ?UserInfoType,
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

export default withCurrentUser((props: Props) => {
  const { channel, currentUser } = props;
  const { channelPermissions } = channel;
  const { isMember } = channelPermissions;
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

  return (
    <React.Fragment>
      <PostsFeedsSelectorContainer>
        {/* Empty div to make Flex layout consistent with community view, which has the sort order select here */}
        <div />
        <SearchInput
          onChange={handleClientSearch}
          type="search"
          placeholder="Search"
          value={clientSearchQuery}
          data-cy="channel-search-input"
        />
      </PostsFeedsSelectorContainer>
      {currentUser && isMember && (
        <MiniComposer
          community={channel.community}
          fixedChannelId={channel.id}
          currentUser={currentUser}
        />
      )}

      {debouncedServerSearchQuery && (
        <SearchThreadFeed
          search
          viewContext="channelProfile"
          channelId={channel.id}
          queryString={debouncedServerSearchQuery}
          filter={{ channelId: channel.id }}
          channel={channel}
        />
      )}

      {!debouncedServerSearchQuery && (
        <ChannelThreadFeed
          viewContext="channelProfile"
          slug={channel.slug}
          id={channel.id}
          setThreadsStatus={false}
          isNewAndOwned={false}
          channel={channel}
        />
      )}
    </React.Fragment>
  );
});
