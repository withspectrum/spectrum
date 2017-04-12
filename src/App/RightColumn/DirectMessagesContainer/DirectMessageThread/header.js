//@flow
import React from 'react';
import Badge from '../../../../shared/Badge';
import {
  StyledHeader,
  PhotosContainer,
  Photo,
  Names,
  Username,
} from '../style';

export const Header = ({ users, openUpgradeModal }) => {
  const checkPro = (user: Object): boolean => {
    return user.subscriptions ? true : false;
  };

  const checkAdmin = (userId: string): boolean => {
    const adminIds = [
      'VToKcde16dREgDkXcDl3hhcrFN33',
      'gVk5mYwccUOEKiN5vtOouqroGKo1',
      '01p2A7kDCWUjGj6zQLlMQUOSQL42',
    ];

    return adminIds.includes(userId);
  };

  const photos = users.map(user => (
    <Photo key={user.uid} src={user.photoURL} />
  ));
  const names = users.map(user => user.displayName).join(',');
  const username = users.length === 1 ? users[0].username : '';
  const isPro = checkPro(users[0]);
  const isAdmin = checkAdmin(users[0].uid);

  return (
    <StyledHeader>
      <PhotosContainer>{photos}</PhotosContainer>
      <Names>{names}</Names>
      <Username>
        {username && `@${username}`}
        {username && isAdmin && <Badge type="admin" />}
        {username &&
          isPro &&
          <Badge
            type="pro"
            tipText="Beta Supporter"
            tipLocation="top-right"
            onClick={openUpgradeModal}
          />}
      </Username>
    </StyledHeader>
  );
};
