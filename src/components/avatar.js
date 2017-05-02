// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';

const StyledAvatar = styled.img`
  border-radius: ${props => `${props.radius}px`};
  width: ${props => (props.size ? `${props.size}px` : '100%')};
  height: ${props => (props.size ? `${props.size}px` : '100%')};
  margin: ${props => (props.margin ? `${props.margin}` : '0')};
`;

const AvatarPure = (props: Object): React$Element<any> => (
  <StyledAvatar {...props} />
);

export const Avatar = compose(pure)(AvatarPure);
