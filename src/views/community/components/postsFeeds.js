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

import { Link, withRouter } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { UserAvatar } from 'src/components/avatar';
import theme from 'shared/theme';
import { PrimaryButton } from 'src/components/button';
import OutsideClickHandler from 'src/components/outsideClickHandler';
import ConditionalWrap from 'src/components/conditionalWrap';
import ChannelSelector from 'src/components/composer/LocationSelectors/ChannelSelector';
import Icon from 'src/components/icon';
import getComposerLink from 'src/helpers/get-composer-link';
import getThreadLink from 'src/helpers/get-thread-link';
import { addToastWithTimeout } from 'src/actions/toasts';
import { DropImageOverlay } from 'src/components/composer/style';
import uploadImageMutation from 'shared/graphql/mutations/uploadImage';
import MentionsInput from 'src/components/mentionsInput';
import publishThreadMutation from 'shared/graphql/mutations/thread/publishThread';

const MiniComposer = compose(
  connect(),
  uploadImageMutation,
  publishThreadMutation,
  withRouter
)(
  ({
    currentUser,
    community,
    dispatch,
    uploadImage,
    publishThread,
    history,
  }) => {
    const titleEditor = React.createRef();
    const bodyEditor = React.createRef();
    const [expanded, setExpanded] = React.useState(false);
    const [selectedChannelId, setSelectedChannelId] = React.useState(null);
    const [title, setTitle] = React.useState('');
    const [body, setBody] = React.useState('');
    const bodyRef = React.useRef(body);
    const [titleWarning, setTitleWarning] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
      bodyRef.current = body;
    }, [body]);

    React.useLayoutEffect(() => {
      if (expanded && titleEditor.current) titleEditor.current.focus();
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

    const uploadFiles = files => {
      if (!bodyEditor.current || !files[0]) return;

      const uploading = `![Uploading ${files[0].name}...]()`;
      let caretPos = bodyEditor.current.selectionStart;
      setIsLoading(true);
      setBody(
        bodyRef.current.substring(0, caretPos) +
          uploading +
          bodyRef.current.substring(
            bodyEditor.current.selectionEnd,
            body.length
          )
      );
      caretPos = caretPos + uploading.length;
      bodyEditor.current.selectionStart = caretPos;
      bodyEditor.current.selectionEnd = caretPos;
      bodyEditor.current.focus();

      return uploadImage({
        image: files[0],
        type: 'threads',
      })
        .then(({ data }) => {
          setIsLoading(false);
          setBody(
            bodyRef.current.replace(
              uploading,
              `![${files[0].name}](${data.uploadImage})`
            )
          );
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
          setBody(bodyRef.current.replace(uploading, ''));
          dispatch(
            addToastWithTimeout(
              'error',
              `Uploading image failed - ${err.message}`
            )
          );
        });
    };

    const publish = () => {
      if (!title.trim() || !selectedChannelId) {
        return;
      }

      setIsLoading(true);

      const thread = {
        channelId: selectedChannelId,
        communityId: community.id,
        type: 'TEXT',
        content: {
          title: title.trim(),
          // workaround react-mentions bug by replacing @[username] with @username
          // @see withspectrum/spectrum#4587
          body: body.replace(/@\[([a-z0-9_-]+)\]/g, '@$1'),
        },
      };

      publishThread(thread)
        .then(({ data }) => {
          setIsLoading(false);
          dispatch(addToastWithTimeout('success', 'Thread published!'));
          history.push(getThreadLink(data.publishThread));
        })
        .catch(err => {
          setIsLoading(false);
          dispatch(addToastWithTimeout('error', err.message));
        });
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
                ref={titleEditor}
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
              <Dropzone
                accept={['image/gif', 'image/jpeg', 'image/png', 'video/mp4']}
                disableClick
                multiple={false}
                onDropAccepted={uploadFiles}
              >
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div
                    {...getRootProps({
                      refKey: 'ref',
                    })}
                    css={{ width: '100%', position: 'relative' }}
                  >
                    <input {...getInputProps()} />
                    <MentionsInput
                      style={{
                        background: theme.bg.default,
                        border: `1px solid ${theme.bg.border}`,
                        borderRadius: '8px',
                        width: '100%',
                        marginBottom: '8px',
                        input: {
                          fontSize: '16px',
                          minHeight: '80px',
                          padding: '12px',
                        },
                      }}
                      ref={bodyEditor}
                      value={body}
                      onChange={evt => setBody(evt.target.value)}
                      placeholder="Elaborate here if necessary (optional)"
                    />

                    <DropImageOverlay visible={isDragActive} />
                  </div>
                )}
              </Dropzone>
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
                    isLoading ||
                    title.trim().length === 0 ||
                    selectedChannelId === null
                  }
                  onClick={publish}
                >
                  {isLoading ? 'Loading...' : 'Post'}
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </ConditionalWrap>
    );
  }
);

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
