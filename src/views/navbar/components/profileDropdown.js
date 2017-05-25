// @flow
import React, { Component } from 'react';
import Dropdown from '../../../components/dropdown';
import { Button } from '../../../components/buttons';
import { DropdownFooter } from '../style';

export const ProfileDropdown = () => {
  return (
    <Dropdown width={'240px'}>

      <DropdownFooter>
        <Button color={'warn'}>Log Out</Button>
      </DropdownFooter>
    </Dropdown>
  );
};
