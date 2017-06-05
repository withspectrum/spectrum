//@flow
import React from 'react';
import Titlebar from '../../titlebar';
import { StyledHeader, PhotosContainer, Photo, Names, Username } from './style';

const Header = ({ thread, currentUser }) => {
  const trimmedUsers = thread.participants.filter(
    user => user.userId !== currentUser.id
  );

  const photos = trimmedUsers.map(user => (
    <Photo key={user.id} src={user.profilePhoto} />
  ));

  const names = trimmedUsers.map(user => user.name).join(', ');
  const username = trimmedUsers.length === 1 ? trimmedUsers[0].username : '';

  return (
    <StyledHeader>
      <Titlebar
        title={names}
        subtitle={'Messages with'}
        provideBack={true}
        backRoute={`/messages`}
        noComposer
      />
      <PhotosContainer>{photos}</PhotosContainer>
      <Names>{names}</Names>
      <Username>
        {username && `@${username}`}
      </Username>
    </StyledHeader>
  );
};

export default Header;
