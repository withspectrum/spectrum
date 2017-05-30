// @flow
import React from 'react';
import { logout } from '../../../actions/authentication';
import Dropdown from '../../../components/dropdown';
import { UserProfileDropdownList, UserProfileDropdownListItem } from '../style';

export const ProfileDropdown = props => {
  return (
    <Dropdown width={'160px'}>
      <UserProfileDropdownList>
        <UserProfileDropdownListItem
          onClick={() => props.history.push(`/users/${props.user.username}`)}
        >
          Settings
        </UserProfileDropdownListItem>
        <UserProfileDropdownListItem onClick={() => logout()}>
          Log Out
        </UserProfileDropdownListItem>
      </UserProfileDropdownList>
    </Dropdown>
  );
};
