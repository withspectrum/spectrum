// @flow
import React from 'react';
import { MobileTitlebar, DesktopTitlebar } from 'src/components/titlebar';
import { SmallPrimaryButton } from 'src/views/community/components/button';
import UsersSearch from '../components/usersSearch';
import SelectedUserPill from '../components/selectedUserPill';
import { SelectedPillsWrapper } from '../style';

const Search = (props: Props) => {
  const { usersForMessage, setUsersForMessage, setActiveStep } = props;

  const toWrite = () => setActiveStep('write');

  return (
    <React.Fragment>
      <MobileTitlebar
        title={'New message'}
        menuAction={'view-back'}
        rightAction={
          <SmallPrimaryButton
            disabled={!usersForMessage || usersForMessage.length === 0}
            onClick={toWrite}
          >
            Next
          </SmallPrimaryButton>
        }
      />
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

export default Search;
