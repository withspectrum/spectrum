// @flow
import React from 'react';
// $FlowFixMe
import styled from 'styled-components';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Icon from '../icons';
import { IconButton } from '../buttons';
import { ProfileHeaderAction } from './style';

const PhotoContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${props => (props.large ? '256px' : '96px')};
  background-color: ${({ theme }) => theme.brand.default};
  background-image: url(${props => props.coverURL});
  background-size: cover;
  border-radius: ${props => (props.large ? '12px' : '12px 12px 0 0')};
`;

const CoverAction = styled(ProfileHeaderAction)`
  position: absolute;
  top: 12px;
  right: 12px;
`;

export const CoverPhoto = (props: Object) => {
  if (props.user) {
    return (
      <PhotoContainer coverURL={props.user.coverPhoto}>
        {props.currentUser && props.currentUser.id === props.user.id
          ? <Link to={`../users/${props.user.username}/settings`}>
              <CoverAction
                glyph="settings"
                color="space.soft"
                hoverColor="text.reverse"
                tipText={`Edit profile`}
                tipLocation={'left'}
              />
            </Link>
          : <CoverAction
              glyph="message-fill"
              color="text.reverse"
              hoverColor="text.reverse"
              // onClick={() => props.initMessage()}
              tipText={`Message ${props.user.name}`}
              tipLocation={'left'}
            />}
        {props.children}
      </PhotoContainer>
    );
  } else {
    return (
      <PhotoContainer large coverURL="">
        {props.children}
      </PhotoContainer>
    );
  }
};
