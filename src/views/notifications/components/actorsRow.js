import React from 'react';
// $FlowFixMe
import { ActorPhotosContainer, ActorPhotoItem } from '../style';
import Avatar from '../../../components/avatar';

export const ActorsRow = ({ actors }) => {
  return (
    <ActorPhotosContainer>
      {actors.map(actor => {
        return (
          <ActorPhotoItem key={actor.id}>
            <Avatar
              user={actor}
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
