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

var isSafari =
  /constructor/i.test(window.HTMLElement) ||
  (function(p) {
    return p.toString() === '[object SafariRemoteNotification]';
  })(!window['safari'] || window['safari'].pushNotification);

const StyledAvatar = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: ${props => (props.community ? '8px' : '100%')};
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
  background-color: ${({ theme }) => theme.generic.default};
  background-image: ${({ theme }) =>
    Gradient(theme.generic.alt, theme.generic.default)};
  position: relative;
  z-index: 9;
`;

const StyledAvatarContainer = styled.object`
  position: relative;
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props => (props.community ? '8px' : '100%')};
  display: inline-block;
  overflow: hidden;
  object-fit: cover;

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

const StyledAvatarLink = styled(Link)`
  display: flex;
  flex: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const AvatarPure = (props: Object): React$Element<any> => {
  if (props.link) {
    return (
      <StyledAvatarLink to={props.link}>
        <StyledAvatarContainer
          data={optimize(props.src, {
            w: props.size,
            dpr: 2,
            format: 'png',
          })}
          // type={isSafari ? null : "image/jpg"}
          type="image/png"
          {...props}
        >
          <StyledAvatar
            {...props}
            src={
              props.community
                ? `/img/default_community.svg`
                : `/img/default_avatar.svg`
            }
          />
        </StyledAvatarContainer>
      </StyledAvatarLink>
    );
  } else {
    return (
      <StyledAvatarContainer
        data={optimize(props.src, {
          w: props.size,
          dpr: 2,
          format: 'png',
        })}
        // type={isSafari ? null : "image/jpg"}
        type="image/png"
        {...props}
      >
        <StyledAvatar {...props} src={`/img/default_avatar.svg`} />
      </StyledAvatarContainer>
    );
  }
};

export const Avatar = compose(pure)(AvatarPure);
