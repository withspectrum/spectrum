// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setTitlebarProps } from 'src/actions/titlebar';
import { DesktopTitlebar } from 'src/components/titlebar';
import { SmallPrimaryButton } from 'src/views/community/components/button';
import UsersSearch from '../components/usersSearch';
import SelectedUserPill from '../components/selectedUserPill';
import { SelectedPillsWrapper } from '../style';

const Search = (props: Props) => {
  const {
    usersForMessage,
    setUsersForMessage,
    setActiveStep,
    dispatch,
  } = props;

  const toWrite = () => setActiveStep('write');

  useEffect(() => {
    dispatch(
      setTitlebarProps({
        title: 'New message',
        leftAction: 'view-back',
        rightAction: (
          <SmallPrimaryButton
            disabled={!usersForMessage || usersForMessage.length === 0}
            onClick={toWrite}
          >
            Next
          </SmallPrimaryButton>
        ),
      })
    );
  });

  return (
    <React.Fragment>
      <DesktopTitlebar
        title={'New message'}
        rightAction={
          <SmallPrimaryButton
            disabled={!usersForMessage || usersForMessage.length === 0}
            onClick={toWrite}
          >
            Next
          </SmallPrimaryButton>
        }
      />
      {usersForMessage && usersForMessage.length > 0 && (
        <SelectedPillsWrapper>
          {usersForMessage.map(
            user =>
              user && <SelectedUserPill key={user.id} user={user} {...props} />
          )}
        </SelectedPillsWrapper>
      )}
      <UsersSearch
        usersForMessage={usersForMessage}
        setUsersForMessage={setUsersForMessage}
      />
    </React.Fragment>
  );
};

export default connect()(Search);
