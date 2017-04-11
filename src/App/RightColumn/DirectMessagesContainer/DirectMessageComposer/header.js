//@flow
import React from 'react';
import {
  StyledHeader,
  PhotosContainer,
  Photo,
  Names,
  Username,
} from '../style';

export const Header = ({ recipient }: Object) => {
  const photo = recipient.photoURL;
  const name = recipient.displayName;
  const username = recipient.username;

  return (
    <StyledHeader fill>
      <PhotosContainer><Photo src={photo} /></PhotosContainer>
      <Names>{name}</Names>
      <Username>{`@${username}`}</Username>
    </StyledHeader>
  );
};
