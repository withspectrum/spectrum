// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import ChatInput from 'src/components/chatInput';
import { MobileTitlebar, DesktopTitlebar } from 'src/components/titlebar';
import { UserAvatar } from 'src/components/avatar';
import { SmallOutlineButton } from 'src/views/community/components/button';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import { ErrorBoundary } from 'src/components/error';
import Icon from 'src/components/icons';
import MessagesCheck from '../components/messagesCheck';
import { ChatInputWrapper } from '../style';

const Write = (props: Props) => {
  const { usersForMessage, hadInitialUser, setActiveStep, dispatch } = props;

  const titlebarTitle =
    usersForMessage.length > 1
      ? usersForMessage.map(user => user && user.name).join(', ')
      : usersForMessage[0].name;
  const titlebarIcon =
    usersForMessage.length === 1 ? (
      <UserAvatar user={usersForMessage[0]} size={24} />
    ) : null;

  const create = () => {};
  const toSearch = () => setActiveStep('search');

  useEffect(() => {
    if (hadInitialUser) dispatch(initNewThreadWithUser(null));
  }, []);

  return (
    <React.Fragment>
      <MobileTitlebar
        title={titlebarTitle}
        titleIcon={titlebarIcon}
        menuAction={
          !hadInitialUser ? (
            <Icon glyph={'view-back'} onClick={toSearch} />
          ) : (
            'view-back'
          )
        }
      />
      <DesktopTitlebar
        title={titlebarTitle}
        titleIcon={titlebarIcon}
        rightAction={
          !hadInitialUser && (
            <SmallOutlineButton onClick={toSearch}>Edit</SmallOutlineButton>
          )
        }
      />

      <ErrorBoundary>
        <MessagesCheck
          userIds={usersForMessage.map(({ id }) => id)}
          {...props}
        />
      </ErrorBoundary>

      <ChatInputWrapper>
        <ChatInput
          thread={'newDirectMessageThread'}
          threadType={'directMessageThread'}
          createThread={create}
        />
      </ChatInputWrapper>
    </React.Fragment>
  );
};

export default connect()(Write);
