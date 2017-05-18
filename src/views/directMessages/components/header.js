//@flow
import React from 'react';
import { StyledHeader, PhotosContainer, Photo, Names, Username } from './style';

const Header = ({ group, currentUser }) => {
  const trimmedUsers = group.users.filter(user => user.uid !== currentUser.uid);

  const photos = trimmedUsers.map(user => (
    <Photo key={user.uid} src={user.photoURL} />
  ));

  const names = trimmedUsers.map(user => user.displayName).join(', ');
  const username = trimmedUsers.length === 1 ? trimmedUsers[0].username : '';

  return (
    <StyledHeader>
      <PhotosContainer>{photos}</PhotosContainer>
      <Names>{names}</Names>
      <Username>
        {username && `@${username}`}
      </Username>
    </StyledHeader>
  );
};

export default Header;
