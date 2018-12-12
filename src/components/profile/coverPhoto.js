import React from 'react';
import theme from 'shared/theme';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ProfileHeaderAction } from './style';

const PhotoContainer = styled.div`
  grid-area: cover;
  position: relative;
  width: 100%;
  flex: 0 0 ${props => (props.large ? '320px' : '96px')};
  background-color: ${theme.bg.reverse};
  background-image: ${props =>
    props.coverURL ? `url(${props.coverURL})` : 'none'};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: ${props => (props.large ? '0' : '12px 12px 0 0')};

  @media (max-width: 768px) {
    flex: 0 0 ${props => (props.large ? '160px' : '64px')};
    border-radius: 0;
  }
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
        {props.currentUser && props.currentUser.id === props.user.id ? (
          <Link to={`../users/${props.user.username}/settings`}>
            <CoverAction
              glyph="settings"
              color="text.reverse"
              opacity="0.5"
              hoverColor="text.reverse"
              tipText={`Edit profile`}
              tipLocation={'left'}
            />
          </Link>
        ) : props.currentUser ? (
          <CoverAction
            glyph="message-fill"
            color="text.reverse"
            hoverColor="text.reverse"
            onClick={props.onClick}
            tipText={`Message ${props.user.name}`}
            tipLocation={'left'}
          />
        ) : null}
        {props.children}
      </PhotoContainer>
    );
  } else {
    return (
      <PhotoContainer large coverURL={props.src}>
        {props.children}
      </PhotoContainer>
    );
  }
};
