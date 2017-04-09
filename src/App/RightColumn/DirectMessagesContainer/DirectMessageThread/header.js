//@flow
import React from 'react';
import {
  StyledHeader,
  PhotosContainer,
  Photo,
  Names,
  Username,
} from '../style';

export const Header = ({ users }: Object) => {
  const photos = users.map(user => (
    <Photo key={user.uid} src={user.photoURL} />
  ));
  const names = users.map(user => user.displayName).join(',');
  const username = users.length === 1 ? users[0].username : '';

  return (
    <StyledHeader>
      <PhotosContainer>{photos}</PhotosContainer>
      <Names>{names}</Names>
      <Username>{`@${username}`}</Username>
    </StyledHeader>
  );
};
