// @flow
import React from 'react';
// @FlowFixMe
import styled from 'styled-components';
// @FlowFixMe
import { Link } from 'react-router-dom';
import Dropdown from '../../../components/dropdown';

const UserProfileDropdown = styled(Dropdown)`width: 160px;`;

const UserProfileDropdownList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const UserProfileDropdownListItem = styled.li`
  font-size: 14px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  border-bottom: 2px solid ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
  justify-content: center;

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.text.default};
    background: ${props => props.theme.bg.wash};
  }
`;

type ProfileProps = Object;

export const ProfileDropdown = (props: ProfileProps) => {
  return (
    <UserProfileDropdown className={'dropdown'}>
      <UserProfileDropdownList>
        {props.user.username && (
          <Link rel="nofollow" to={`/users/${props.user.username}/settings`}>
            <UserProfileDropdownListItem>
              My Settings
            </UserProfileDropdownListItem>
          </Link>
        )}
        {/* <UserProfileDropdownListItem onClick={props.logout}>
          Log Out
        </UserProfileDropdownListItem> */}
      </UserProfileDropdownList>
    </UserProfileDropdown>
  );
};
