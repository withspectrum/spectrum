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
import { Gradient, zIndex } from '../globals';
import { optimize } from '../../helpers/images';

const StyledAvatarFallback = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: ${props => (props.community ? `8px` : '100%')};
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
  background-color: ${({ theme }) => theme.generic.default};
  background-image: ${({ theme }) =>
    Gradient(theme.generic.alt, theme.generic.default)};
  position: relative;
  z-index: ${zIndex.avatar - 1};
`;

const StyledAvatarStatus = styled.div`
  position: relative;
  display: inline-block;
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props => (props.community ? `8px` : '100%')};
  border: none;

  &:after {
    content: '';
    position: absolute;
    display: ${props => (props.isOnline ? 'inline-block' : 'none')};
    width: ${props => (props.onlineSize === 'large' ? '8px' : '6px')};
    height: ${props => (props.onlineSize === 'large' ? '8px' : '6px')};
    background: ${props => props.theme.pro.alt};
    border-radius: 100%;
    border: 2px solid ${props => props.theme.text.reverse};
    bottom: ${props =>
      props.onlineSize === 'large'
        ? '0'
        : props.onlineSize === 'small' ? '-1px' : '1px'};
    right: ${props =>
      props.onlineSize === 'large'
        ? '0'
        : props.onlineSize === 'small' ? '-6px' : '-3px'};
    z-index: ${zIndex.avatar};
  }
`;

const StyledAvatar = styled.object`
  position: relative;
  display: inline-block;
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props => (props.community ? `8px` : '100%')};
  object-fit: cover;
`;

const StyledAvatarLink = styled(Link)`
  display: flex;
  flex: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
`;

const AvatarWithFallback = ({ style, ...props }) => (
  <StyledAvatarStatus size={props.size || 32} {...props}>
    <StyledAvatar
      data={optimize(props.src, { w: props.size, dpr: 2, format: 'png' })}
      type="image/png"
      size={props.size || 32}
      style={style}
      {...props}
    >
      <StyledAvatarFallback
        {...props}
        src={
          props.community
            ? `/img/default_community.svg`
            : `/img/default_avatar.svg`
        }
      />
    </StyledAvatar>
  </StyledAvatarStatus>
);

const AvatarPure = (props: Object): React$Element<any> => {
  if (props.link && !props.noLink) {
    return (
      <StyledAvatarLink to={props.link}>
        <AvatarWithFallback {...props} />
      </StyledAvatarLink>
    );
  } else {
    return <AvatarWithFallback {...props} />;
  }
};

export const Avatar = compose(pure)(AvatarPure);
