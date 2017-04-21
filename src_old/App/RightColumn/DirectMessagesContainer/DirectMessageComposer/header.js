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

export const Header = ({ recipient }: Object) => {
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

  const photo = recipient.photoURL;
  const name = recipient.displayName;
  const username = recipient.username;
  const isPro = checkPro(recipient);
  const isAdmin = checkAdmin(recipient.uid);

  return (
    <StyledHeader fill>
      <PhotosContainer><Photo src={photo} /></PhotosContainer>
      <Names>{name}</Names>
      <Username>
        {`@${username}`}
        {isAdmin && <Badge type="admin" />}
        {isPro &&
          <Badge type="pro" tipText="Beta Supporter" tipLocation="top-right" />}
      </Username>
    </StyledHeader>
  );
};
