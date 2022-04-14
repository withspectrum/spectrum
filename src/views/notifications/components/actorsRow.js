// @flow
import React from 'react';
import { ActorPhotosContainer, ActorPhotoItem } from '../style';
import { UserAvatar } from 'src/components/avatar';

export const ActorsRow = ({ actors }: { actors: Array<Object> }) => {
  if (!actors || actors.length === 0) return null;

  return (
    <ActorPhotosContainer>
      {actors.map(actor => {
        return (
          <ActorPhotoItem key={actor.id}>
            <UserAvatar user={actor} size={32} />
          </ActorPhotoItem>
        );
      })}
    </ActorPhotosContainer>
  );
};
