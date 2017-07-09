//@flow
import React from 'react';
import {
  StyledHeader,
  PhotosContainer,
  Photo,
  Names,
  Username,
  PhotoWrapper,
} from './style';

const Header = ({ thread, currentUser }) => {
  const trimmedUsers = thread.participants.filter(
    user => user.userId !== currentUser.id
  );

  const photos = trimmedUsers.map(user =>
    <PhotoWrapper key={user.id}>
      <Photo
        size={60}
        radius={60}
        isOnline={user.isOnline}
        onlineSize={'large'}
        src={user.profilePhoto}
        link={user.username ? `/users/${user.username}` : null}
      />
    </PhotoWrapper>
  );

  const names = trimmedUsers.map(user => user.name).join(', ');
  const username =
    trimmedUsers.length === 1 && trimmedUsers[0].username
      ? trimmedUsers[0].username
      : '';

  return (
    <StyledHeader>
      <PhotosContainer>
        {photos}
      </PhotosContainer>
      <Names>
        {names}
      </Names>
      <Username>
        {username && `@${username}`}
      </Username>
    </StyledHeader>
  );
};

export default Header;
