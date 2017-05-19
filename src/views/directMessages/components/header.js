//@flow
import React from 'react';
import { StyledHeader, PhotosContainer, Photo, Names, Username } from './style';

const Header = ({ thread, currentUser }) => {
  const trimmedUsers = thread.participants.filter(
    user => user.id !== currentUser.id
  );

  const photos = trimmedUsers.map(user => (
    <Photo key={user.id} src={user.profilePhoto} />
  ));

  const names = trimmedUsers.map(user => user.name).join(', ');
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
