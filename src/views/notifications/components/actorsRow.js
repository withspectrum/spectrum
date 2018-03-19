// @flow
import React from 'react';
import { ActorPhotosContainer, ActorPhotoItem } from '../style';
import Avatar from '../../../components/avatar';

export const ActorsRow = ({ actors }: { actors: Array<Object> }) => {
  if (!actors || actors.length === 0) return null;

  return (
    <ActorPhotosContainer>
      {actors.map(actor => {
        return (
          <ActorPhotoItem key={actor.id}>
            <Avatar
              user={actor}
              size={'32'}
              radius={'32'}
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
