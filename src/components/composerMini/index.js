// @flow
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import compose from 'recompose/compose';
import { Link, withRouter } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { UserAvatar } from 'src/components/avatar';
import theme from 'shared/theme';
import { PrimaryButton, TextButton } from 'src/components/button';
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
} from 'src/helpers/thread-draft-handling';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import type { History } from 'react-router-dom';
import { DISCARD_DRAFT_MESSAGE } from 'src/components/composer';
import { openModal } from 'src/actions/modals';
import { Container, BodyContainer } from './style';

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
  const titleWarningText =
    'Tip: good titles are shorter than 80 characters. Add more details below.';
  useEffect(() => {
    if (title.length >= 80 && !titleWarning) {
      setTitleWarning(titleWarningText);
    } else if (title.length < 80 && titleWarning) {
      setTitleWarning(null);
    }
  }, []);

  useEffect(() => {
    bodyRef.current = body;
  }, [body]);

  useLayoutEffect(() => {
    if (expanded && titleEditor.current) titleEditor.current.focus();
  }, [expanded]);

  const changeTitle = evt => {
    const title = evt.target.value;
    if (title.length >= 80 && !titleWarning) {
      setTitleWarning(titleWarningText);
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

  const handleCancel = () => {
    const composerHasContent = body || title;

    if (!composerHasContent) {
      return setExpanded(false);
    }

    dispatch(
      openModal('CLOSE_COMPOSER_CONFIRMATION_MODAL', {
        message: DISCARD_DRAFT_MESSAGE,
        closeComposer: async () => {
          await storeDraftThread({ title: '', body: '' });
          await setBody('');
          await setTitle('');
          await setExpanded(false);
        },
      })
    );
  };

  const publish = () => {
    if (!title.trim() || (!fixedChannelId && !selectedChannelId)) {
      return;
    }

    setIsLoading(true);

    const thread = {
      channelId: fixedChannelId || selectedChannelId,
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
      .then(async ({ data }) => {
        setIsLoading(false);
        dispatch(addToastWithTimeout('success', 'Thread published!'));
        await storeDraftThread({ title: '', body: '' });
        await setBody('');
        await setTitle('');
        await setExpanded(false);
        return history.push({
          pathname: getThreadLink(data.publishThread),
          state: { modal: true },
        });
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
    <Container
      data-cy={expanded ? 'mini-composer-expanded' : 'mini-composer-collapsed'}
    >
      {!expanded && (
        <div
          tabIndex={-1}
          css={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            background: 'transparent',
            zIndex: 9999,
            cursor: 'pointer',
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
              data-cy="mini-composer-warning"
              css={{
                color: theme.warn.default,
                fontSize: '12px',
                marginBottom: '4px',
                fontWeight: '500',
              }}
            >
              {titleWarning}
            </p>
          )}
          <input
            data-cy="mini-composer-title"
            tabIndex={1}
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
            placeholder="What's on your mind?"
          />
        </div>
        {!expanded && <PrimaryButton tabIndex={-1}>Post</PrimaryButton>}
      </div>
      {expanded && (
        <BodyContainer>
          <Dropzone
            accept={['image/gif', 'image/jpeg', 'image/png', 'video/mp4']}
            disableClick
            multiple={false}
            onDropAccepted={uploadFiles}
            style={{ lineHeight: '1.4' }}
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
                  data-cy="mini-composer-body"
                  tabIndex={2}
                  style={{
                    background: theme.bg.default,
                    border: `1px solid ${theme.bg.border}`,
                    borderRadius: '8px',
                    width: '100%',
                    lineHeight: '1.4',
                    input: {
                      fontSize: '16px',
                      minHeight: '80px',
                      padding: '12px',
                    },
                    highlighter: {
                      minHeight: '80px',
                    },
                    suggestions: {
                      marginTop: '35px',
                    },
                  }}
                  inputRef={bodyEditor}
                  value={body}
                  onChange={changeBody}
                  placeholder="(Optional) Add more details..."
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
                  tabIndex={3}
                />
              )}
              {fixedChannelId && (
                <ChannelSelector
                  id={community.id}
                  selectedCommunityId={community.id}
                  selectedChannelId={fixedChannelId}
                  disabled
                  css={{ marginLeft: 0 }}
                  tabIndex={3}
                />
              )}
              <Tooltip content="Open in fullscreen">
                <span style={{ marginLeft: '8px' }}>
                  <Link
                    data-cy="mini-composer-fullscreen"
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
            <div style={{ display: 'flex' }}>
              <TextButton
                tabIndex={0}
                style={{ marginRight: '8px' }}
                onClick={handleCancel}
                data-cy="mini-composer-cancel"
              >
                Cancel
              </TextButton>
              <PrimaryButton
                tabIndex={4}
                data-cy="mini-composer-post"
                disabled={
                  isLoading ||
                  title.trim().length === 0 ||
                  (!fixedChannelId && !selectedChannelId)
                }
                onClick={publish}
              >
                {isLoading ? 'Posting...' : 'Post'}
              </PrimaryButton>
            </div>
          </div>
        </BodyContainer>
      )}
    </Container>
  );
};

export default compose(
  connect(),
  uploadImageMutation,
  publishThreadMutation,
  withRouter
)(MiniComposer);
