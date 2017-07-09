// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { Gradient, Tooltip } from '../globals';
import { optimize } from '../../helpers/images';

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

  &:after {
    content: ' ';
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-image: url(/img/default_avatar.svg);
  }
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
        ? '8px'
        : props.onlineSize === 'small' ? '4px' : '6px'};
    height: ${props =>
      props.onlineSize === 'large'
        ? '8px'
        : props.onlineSize === 'small' ? '4px' : '6px'};
    background: ${props => props.theme.pro.alt};
    border-radius: 100%;
    border: 2px solid ${props => props.theme.text.reverse};
    bottom: ${props => (props.onlineSize === 'large' ? '0' : '-1px')};
    right: ${props => (props.onlineSize === 'large' ? '0' : '-4px')};
    z-index: 10;
  }
`;

const AvatarPure = (props: Object): React$Element<any> => {
  if (props.link) {
    return (
      <Link to={props.link}>
        <StyledAvatarContainer {...props}>
          <StyledAvatar
            {...props}
            src={optimize(props.src, {
              w: props.size,
              dpr: 2,
            })}
          />
        </StyledAvatarContainer>
      </Link>
    );
  } else {
    return (
      <StyledAvatarContainer {...props}>
        <StyledAvatar
          {...props}
          src={optimize(props.src, {
            w: props.size,
            dpr: 2,
          })}
        />
      </StyledAvatarContainer>
    );
  }
};

export const Avatar = compose(pure)(AvatarPure);
