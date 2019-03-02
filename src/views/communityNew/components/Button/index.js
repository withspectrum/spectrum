// @flow
import React from 'react';
import {
  A,
  StyledLink,
  StyledButton,
  StyledPrimaryButton,
  StyledSmallPrimaryButton,
  StyledOutlineButton,
} from './style';

const handleLinkWrapping = (Component, props) => {
  const { href, to, children, disabled, isLoading, ...rest } = props;
  const button = (
    <Component disabled={disabled || isLoading} {...rest}>
      {children}
    </Component>
  );

  if (href)
    return (
      <A href={href} target="_blank" rel="noopener noreferrer">
        {button}
      </A>
    );
  if (to) return <StyledLink to={to}>{button}</StyledLink>;
  return button;
};

export const Button = props => handleLinkWrapping(StyledButton, props);

export const PrimaryButton = props =>
  handleLinkWrapping(StyledPrimaryButton, props);
export const SmallPrimaryButton = props =>
  handleLinkWrapping(StyledSmallPrimaryButton, props);

export const OutlineButton = props =>
  handleLinkWrapping(StyledOutlineButton, props);
