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
  border-radius: ${props => `${props.radius}px`};
  width: ${props => (props.size ? `${props.size}px` : '100%')};
  height: ${props => (props.size ? `${props.size}px` : '100%')};
  margin: ${props => (props.margin ? `${props.margin}` : '0')};
  object-fit: cover;
  background-color: ${({ theme }) => theme.generic.default};
  background-image: ${({ theme }) => Gradient(theme.generic.alt, theme.generic.default)};
`;

const StyledAvatarContainer = styled.span`
  position: relative;
  width: ${props => (props.size ? `${props.size}px` : '100%')};
  height: ${props => (props.size ? `${props.size}px` : '100%')};
  border-radius: ${props => `${props.radius}px`};
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    display: ${props => (props.isOnline ? 'inline-block' : 'none')};
    width: ${props => (props.onlineSize === 'large' ? '10px' : props.onlineSize === 'small' ? '4px' : '6px')};
    height: ${props => (props.onlineSize === 'large' ? '10px' : props.onlineSize === 'small' ? '4px' : '6px')};
    background: ${props => props.theme.pro.alt};
    border-radius: ${props => (props.onlineSize === 'large' ? '10px' : props.onlineSize === 'small' ? '4px' : '6px')};
    border: 2px solid #fff;
    bottom: 0;
    right: ${props => (props.onlineSize === 'large' ? '0' : '-4px')};
    z-index: 100;
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
