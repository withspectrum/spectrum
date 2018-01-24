// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
import { Gradient } from '../globals';

const StyledAvatar = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: ${props => `${props.radius}px`};
  width: 100%;
  height: 100%;
  margin: ${props => (props.margin ? `${props.margin}` : '0')};
  object-fit: cover;
  background-color: ${({ theme }) => theme.generic.default};
  background-image: ${({ theme }) =>
    Gradient(theme.generic.alt, theme.generic.default)};
  position: relative;
  z-index: 9;
`;

const StyledAvatarContainer = styled.object`
  position: relative;
  width: ${props => (props.size ? `${props.size}px` : '100%')};
  height: ${props => (props.size ? `${props.size}px` : '100%')};
  border-radius: ${props => `${props.radius}px`};
  display: inline-block;

  &:after {
    content: '';
    position: absolute;
    display: ${props => (props.isOnline ? 'inline-block' : 'none')};
    width: ${props =>
      props.onlineSize === 'large'
        ? '10px'
        : props.onlineSize === 'small' ? '4px' : '6px'};
    height: ${props =>
      props.onlineSize === 'large'
        ? '10px'
        : props.onlineSize === 'small' ? '4px' : '6px'};
    background: ${props => props.theme.special.default};
    border-radius: ${props =>
      props.onlineSize === 'large'
        ? '10px'
        : props.onlineSize === 'small' ? '4px' : '6px'};
    border: 2px solid ${props => props.theme.text.reverse};
    bottom: 0;
    right: ${props => (props.onlineSize === 'large' ? '0' : '-4px')};
    z-index: 10;
  }
`;

const AvatarPure = (props: Object): React$Element<any> => (
  <StyledAvatarContainer {...props}>
    <StyledAvatar {...props} />
  </StyledAvatarContainer>
);

// TODO: handle fallback/loading images more gracefully, like so (make StyledAvatar an object tag)
// <StyledAvatar {...props}>
//   <img src={props.defaultImage ? props.defaultImage : '/public/img/default_avatar.svg'} />
// </StyledAvatar>

export const Avatar = compose(pure)(AvatarPure);
