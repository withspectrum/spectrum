// @flow
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import compose from 'recompose/compose';
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
import Tooltip from 'src/components/tooltip';
import publishThreadMutation from 'shared/graphql/mutations/thread/publishThread';
import {
  getDraftThread,
  storeDraftThread,
  clearDraftThread,
} from 'src/helpers/thread-draft-handling';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import type { History } from 'react-router-dom';

type Props = {
  community: CommunityInfoType,
  selectedChannelId?: string,
  fixedChannelId?: string,
  // Injected
  dispatch: Function,
  uploadImage: Function,
  publishThread: Function,
  history: History,
  currentUser: Object,
};

const MiniComposer = ({
  currentUser,
  community,
  dispatch,
  uploadImage,
  publishThread,
  history,
  selectedChannelId: defaultSelectedChannel,
  fixedChannelId,
}: Props) => {
  const titleEditor = useRef();
  const bodyEditor = useRef();
  const [selectedChannelId, setSelectedChannelId] = useState(
    defaultSelectedChannel
  );
  const draftThread = getDraftThread();
  const [expanded, setExpanded] = useState(
    !!draftThread.title || !!draftThread.body
  );
  const [title, setTitle] = useState(draftThread.title || '');
  const [body, setBody] = useState(draftThread.body || '');
  const bodyRef = useRef(body);
  const [titleWarning, setTitleWarning] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    bodyRef.current = body;
  }, [body]);

  useLayoutEffect(() => {
    if (expanded && titleEditor.current) titleEditor.current.focus();
  }, [expanded]);

  const changeTitle = evt => {
    const title = evt.target.value;
    if (title.length >= 80 && !titleWarning) {
      setTitleWarning(
        'ProTip: good titles are shorter than 80 characters. Write extra information below!'
      );
    } else if (title.length < 80 && titleWarning) {
      setTitleWarning(null);
    }
    setTitle(title);
    storeDraftThread({
      title,
    });
  };

  const changeBody = evt => {
    const body = evt.target.value;
    setBody(body);
    storeDraftThread({
      body,
    });
  };

  const uploadFiles = files => {
    const currentBodyEditor = bodyEditor.current;
    if (!currentBodyEditor || !files[0]) return;

    const uploading = `![Uploading ${files[0].name}...]()`;
    let caretPos = currentBodyEditor.selectionStart;
    setIsLoading(true);
    setBody(
      bodyRef.current.substring(0, caretPos) +
        uploading +
        bodyRef.current.substring(currentBodyEditor.selectionEnd, body.length)
    );
    caretPos = caretPos + uploading.length;
    currentBodyEditor.selectionStart = caretPos;
    currentBodyEditor.selectionEnd = caretPos;
    currentBodyEditor.focus();

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
    channelId: fixedChannelId || selectedChannelId,
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
              placeholder="What do you want to talk about?"
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
                  css={{
                    width: '100%',
                    position: 'relative',
                    marginBottom: '8px',
                  }}
                >
                  <input {...getInputProps()} />
                  <MentionsInput
                    style={{
                      background: theme.bg.default,
                      border: `1px solid ${theme.bg.border}`,
                      borderRadius: '8px',
                      width: '100%',
                      input: {
                        fontSize: '16px',
                        minHeight: '80px',
                        padding: '12px',
                      },
                    }}
                    inputRef={bodyEditor}
                    value={body}
                    onChange={changeBody}
                    placeholder="Elaborate here if necessary (optional)"
                  />

                  <DropImageOverlay
                    css={{
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                    visible={isDragActive}
                  />
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
                {!fixedChannelId && (
                  <ChannelSelector
                    id={community.id}
                    onChannelChange={id => {
                      setSelectedChannelId(id);
                    }}
                    selectedCommunityId={community.id}
                    selectedChannelId={selectedChannelId}
                    css={{ marginLeft: 0 }}
                  />
                )}
                <Tooltip content="Open in fullscreen">
                  <span style={{ marginLeft: '8px' }}>
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
                      <Icon size={24} glyph="expand" />
                    </Link>
                  </span>
                </Tooltip>
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
};

export default compose(
  connect(),
  uploadImageMutation,
  publishThreadMutation,
  withRouter
)(MiniComposer);
