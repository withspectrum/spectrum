// @flow
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import Dropdown from '../../../components/dropdown';
import { openModal } from 'src/actions/modals';
import { SERVER_URL } from '../../../api/constants';
import Badge from 'src/components/badges';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';

const UserProfileDropdown = styled(Dropdown)`
  width: 200px;
`;

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

type ProfileProps = {
  user: UserInfoType,
  dispatch: Function,
};

export const ProfileDropdown = connect()((props: ProfileProps) => {
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
        {!props.user.isPro && (
          <UserProfileDropdownListItem
            onClick={() =>
              props.dispatch(openModal('UPGRADE_MODAL', { user: props.user }))
            }
          >
            Upgrade to <Badge type="pro" />
          </UserProfileDropdownListItem>
        )}
        <Link to={`/about`}>
          <UserProfileDropdownListItem>
            About Spectrum
          </UserProfileDropdownListItem>
        </Link>
        <Link to={`/support`}>
          <UserProfileDropdownListItem>Support</UserProfileDropdownListItem>
        </Link>

        <a href={`${SERVER_URL}/auth/logout`}>
          <UserProfileDropdownListItem>Log Out</UserProfileDropdownListItem>
        </a>
      </UserProfileDropdownList>
    </UserProfileDropdown>
  );
});
