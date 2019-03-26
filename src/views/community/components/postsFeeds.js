// @flow
import React, { useState, useEffect } from 'react';
import compose from 'recompose/compose';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import getCommunityThreads from 'shared/graphql/queries/community/getCommunityThreadConnection';
import searchThreads from 'shared/graphql/queries/search/searchThreads';
import ThreadFeed from 'src/components/threadFeed';
import Select from 'src/components/select';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { PostsFeedsSelectorContainer, SearchInput } from '../style';

import { UserAvatar } from 'src/components/avatar';
import theme from 'shared/theme';
import { PrimaryButton } from 'src/components/button';
import OutsideClickHandler from 'src/components/outsideClickHandler';
import ConditionalWrap from 'src/components/conditionalWrap';

const MiniComposer = ({ currentUser }) => {
  const input = React.createRef();
  const [expanded, setExpanded] = React.useState(false);

  React.useLayoutEffect(() => {
    if (expanded && input.current) input.current.focus();
  }, [expanded]);

  return (
    <ConditionalWrap
      condition={expanded}
      wrap={children => (
        <OutsideClickHandler onOutsideClick={() => setExpanded(false)}>
          {children}
        </OutsideClickHandler>
      )}
    >
      <div
        css={{
          borderBottom: `1px solid ${theme.bg.border}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          padding: '12px 20px 12px 12px',
          position: 'relative',
        }}
      >
        {!expanded && (
          <div
            css={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              background: 'transparent',
              zIndex: 9999,
              cursor: 'pointer',
              tabIndex: 0,
            }}
            onClick={() => setExpanded(true)}
          />
        )}
        <div
          css={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
          }}
        >
          <UserAvatar
            isClickable={false}
            showHoverProfile={false}
            showOnlineStatus={false}
            user={currentUser}
            size={40}
          />
          <input
            css={{
              background: theme.bg.default,
              border: `1px solid ${theme.bg.border}`,
              borderRadius: '5px',
              width: '100%',
              margin: '0 8px',
              padding: '8px 12px',
              fontSize: '16px',
              minHeight: '40px',
            }}
            ref={input}
            placeholder={`What do you want to talk about?`}
          />
          {!expanded && <PrimaryButton>Post</PrimaryButton>}
        </div>
        {expanded && (
          <div
            css={{
              width: '100%',
              paddingLeft: '48px',
              paddingRight: '8px',
              marginTop: '8px',
              fontSize: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <textarea
              css={{
                background: theme.bg.default,
                border: `1px solid ${theme.bg.border}`,
                borderRadius: '5px',
                width: '100%',
                padding: '8px 12px',
                fontSize: '16px',
                minHeight: '80px',
                marginBottom: '8px',
              }}
              placeholder="More thoughts here"
            />
            <PrimaryButton>Post</PrimaryButton>
          </div>
        )}
      </div>
    </ConditionalWrap>
  );
};

const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);
const SearchThreadFeed = compose(searchThreads)(ThreadFeed);

type Props = {
  community: GetCommunityType,
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
      {currentUser && <MiniComposer currentUser={currentUser} />}
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
