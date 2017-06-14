// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { ActorPhotosContainer, ActorPhotoItem, ActorPhoto } from '../style';

export const ActorsRow = ({ actors }) => {
  return (
    <ActorPhotosContainer>
      {actors.map(actor => {
        return (
          <ActorPhotoItem key={actor.id}>
            <Link to={`/users/${actor.username}`}>
              <ActorPhoto src={actor.profilePhoto} />
            </Link>
          </ActorPhotoItem>
        );
      })}
    </ActorPhotosContainer>
  );
};
