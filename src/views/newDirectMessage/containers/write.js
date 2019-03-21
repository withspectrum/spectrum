// @flow
import React, { useEffect, useState } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import createDirectMessageThreadMutation from 'shared/graphql/mutations/directMessageThread/createDirectMessageThread';
import { addToastWithTimeout } from 'src/actions/toasts';
import { setTitlebarProps } from 'src/actions/titlebar';
import ChatInput from 'src/components/chatInput';
import { DesktopTitlebar } from 'src/components/titlebar';
import { UserAvatar } from 'src/components/avatar';
import { OutlineButton } from 'src/components/button';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import { ErrorBoundary } from 'src/components/error';
import MessagesCheck from '../components/messagesCheck';
import { ChatInputWrapper } from 'src/components/layout';
import MessagesSubscriber from '../components/messagesSubscriber';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';

type Props = {
  usersForMessage: Array<UserInfoType>,
  hadInitialUser?: boolean,
  setActiveStep: Function,
  dispatch: Function,
  createDirectMessageThread: Function,
};

const Write = (props: Props) => {
  const {
    usersForMessage,
    hadInitialUser,
    setActiveStep,
    dispatch,
    createDirectMessageThread,
  } = props;

  const [existingThreadId, setExistingThreadId] = useState(null);

  const titlebarTitle =
    usersForMessage.length > 1
      ? usersForMessage.map(user => user && user.name).join(', ')
      : usersForMessage[0].name;
  const titleIcon =
    usersForMessage.length === 1 ? (
      <UserAvatar user={usersForMessage[0]} size={24} />
    ) : null;

  const toSearch = () => setActiveStep('search');
  useEffect(() => {
    dispatch(
      setTitlebarProps({
        title: titlebarTitle,
        titleIcon: titleIcon,
        leftAction: 'view-back',
      })
    );
    if (hadInitialUser) dispatch(initNewThreadWithUser(null));
  }, []);

  const createThread = ({ messageBody, messageType, file }) => {
    const input = {
      participants: usersForMessage.map(user => user && user.id),
      message: {
        messageType: messageType,
        threadType: 'directMessageThread',
        content: {
          body: messageBody || '',
        },
        file: file && file,
      },
    };

    return createDirectMessageThread(input)
      .then(({ data: { createDirectMessageThread } }) => {
        if (!createDirectMessageThread) {
          return dispatch(
            addToastWithTimeout(
              'error',
              'Failed to create direct message thread, please try again!'
            )
          );
        }

        setExistingThreadId(createDirectMessageThread.id);
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  return (
    <React.Fragment>
      <DesktopTitlebar
        data-cy="write-direct-message-titlebar"
        title={titlebarTitle}
        titleIcon={titleIcon}
        rightAction={
          !hadInitialUser && (
            <OutlineButton size={'small'} onClick={toSearch}>
              Edit
            </OutlineButton>
          )
        }
      />

      {existingThreadId ? (
        <MessagesSubscriber id={existingThreadId} />
      ) : (
        <ErrorBoundary>
          <MessagesCheck
            userIds={usersForMessage.map(user => user && user.id)}
            onExistingThreadId={setExistingThreadId}
            {...props}
          />
        </ErrorBoundary>
      )}

      <ChatInputWrapper>
        <ChatInput
          threadId={existingThreadId || 'newDirectMessageThread'}
          threadType={'directMessageThread'}
          createThread={createThread}
        />
      </ChatInputWrapper>
    </React.Fragment>
  );
};

export default compose(
  createDirectMessageThreadMutation,
  connect()
)(Write);
