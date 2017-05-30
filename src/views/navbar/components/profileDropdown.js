// @flow
import React from 'react';
import { logout } from '../../../actions/authentication';
import Dropdown from '../../../components/dropdown';
import { Button } from '../../../components/buttons';
import { DropdownFooter } from '../style';

export const ProfileDropdown = () => {
  return (
    <Dropdown width={'240px'}>

      <DropdownFooter>
        <Button color={'warn'} onClick={() => logout()}>Log Out</Button>
      </DropdownFooter>
    </Dropdown>
  );
};
