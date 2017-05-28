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
  height: ${props => (props.large ? '240px' : '96px')};
  background-color: ${({ theme }) => theme.brand.default};
  background-image: url(${props => props.coverURL});
  background-size: cover;
  border-radius: ${props => (props.large ? '12px' : '12px 12px 0 0')};
`;

const CoverAction = styled(ProfileHeaderAction)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

export const CoverPhoto = (props: Object) => {
  if (props.user) {
    return (
      <PhotoContainer coverURL="">
        {props.currentUser && props.currentUser.id === props.user.id
          ? <Link to={`../users/${props.currentUser.username}/settings`}>
              <CoverAction
                glyph="settings"
                color="space.soft"
                hoverColor="text.reverse"
                tipText={`Edit profile`}
                tipLocation={'top-left'}
              />
            </Link>
          : <CoverAction
              glyph="message-new"
              color="text.reverse"
              hoverColor="text.reverse"
              // onClick={() => props.initMessage()}
              tipText={`Message ${props.user.name}`}
              tipLocation={'top-left'}
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
