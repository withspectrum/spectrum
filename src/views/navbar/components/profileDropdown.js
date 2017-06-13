// @flow
import React from 'react';
// @FlowFixMe
import { Link } from 'react-router-dom';
import Dropdown from '../../../components/dropdown';
import { UserProfileDropdownList, UserProfileDropdownListItem } from '../style';

export const ProfileDropdown = props => {
  return (
    <Dropdown width={'160px'}>
      <UserProfileDropdownList>
        <Link to={`/users/${props.user.username}/settings`}>
          <UserProfileDropdownListItem>Settings</UserProfileDropdownListItem>
        </Link>
        <UserProfileDropdownListItem onClick={props.logout}>
          Log Out
        </UserProfileDropdownListItem>
      </UserProfileDropdownList>
    </Dropdown>
  );
};
