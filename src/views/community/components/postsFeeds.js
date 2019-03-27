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

import { Link } from 'react-router-dom';
import { UserAvatar } from 'src/components/avatar';
import theme from 'shared/theme';
import { PrimaryButton } from 'src/components/button';
import OutsideClickHandler from 'src/components/outsideClickHandler';
import ConditionalWrap from 'src/components/conditionalWrap';
import ChannelSelector from 'src/components/composer/LocationSelectors/ChannelSelector';
import Icon from 'src/components/icon';
import getComposerLink from 'src/helpers/get-composer-link';

const MiniComposer = ({ currentUser, community }) => {
  const input = React.createRef();
  const [expanded, setExpanded] = React.useState(false);
  const [selectedChannelId, setSelectedChannelId] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [titleWarning, setTitleWarning] = React.useState(null);

  React.useLayoutEffect(() => {
    if (expanded && input.current) input.current.focus();
  }, [expanded]);

  const changeTitle = evt => {
    const text = evt.target.value;
    if (text.length >= 80 && !titleWarning) {
      setTitleWarning(
        'ProTip: good titles are shorter than 80 characters. Write extra information below!'
      );
    } else if (text.length < 80 && titleWarning) {
      setTitleWarning(null);
    }
    setTitle(text);
  };

  const { pathname, search } = getComposerLink({
    communityId: community.id,
    channelId: selectedChannelId,
  });

  return (
    <ConditionalWrap
      condition={expanded}
      wrap={children => (
        <OutsideClickHandler
          onOutsideClick={() => {
            if (title.trim().length === 0 && body.trim().length === 0) {
              setExpanded(false);
            }
          }}
        >
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
          <div css={{ width: '100%', margin: '0 8px' }}>
            {titleWarning && (
              <p
                css={{
                  color: theme.warn.default,
                  fontSize: '12px',
                  marginBottom: '4px',
                }}
              >
                {titleWarning}
              </p>
            )}
            <input
              css={{
                background: theme.bg.default,
                border: `1px solid ${
                  titleWarning ? theme.warn.default : theme.bg.border
                }`,
                borderRadius: '8px',
                width: '100%',
                padding: '12px',
                fontSize: '16px',
              }}
              ref={input}
              value={title}
              onChange={changeTitle}
              placeholder={`What do you want to talk about?`}
            />
          </div>
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
                borderRadius: '8px',
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                minHeight: '80px',
                marginBottom: '8px',
              }}
              value={body}
              onChange={evt => setBody(evt.target.value)}
              placeholder="More thoughts here"
            />
            <div
              css={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div css={{ display: 'flex', alignItems: 'center' }}>
                <ChannelSelector
                  id={community.id}
                  onChannelChange={id => {
                    setSelectedChannelId(id);
                  }}
                  selectedCommunityId={community.id}
                  selectedChannelId={selectedChannelId}
                  css={{ marginLeft: 0 }}
                />
                <Link
                  to={{
                    pathname,
                    search,
                    state: { modal: true },
                  }}
                  css={{
                    color: theme.text.alt,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon glyph="view" />
                </Link>
              </div>
              <PrimaryButton
                disabled={
                  title.trim().length === 0 || selectedChannelId === null
                }
              >
                Post
              </PrimaryButton>
            </div>
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
      {currentUser && (
        <MiniComposer community={community} currentUser={currentUser} />
      )}
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
