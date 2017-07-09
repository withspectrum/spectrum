// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { ActorPhotosContainer, ActorPhotoItem } from '../style';
import { Avatar } from '../../../components/avatar';

export const ActorsRow = ({ actors }) => {
  return (
    <ActorPhotosContainer>
      {actors.map(actor => {
        return (
          <ActorPhotoItem key={actor.id}>
            <Avatar
              size={32}
              radius={32}
              isOnline={actor.isOnline}
              src={actor.profilePhoto}
              link={actor.username ? `/users/${actor.username}` : null}
              role="presentation"
            />
          </ActorPhotoItem>
        );
      })}
    </ActorPhotosContainer>
  );
};
