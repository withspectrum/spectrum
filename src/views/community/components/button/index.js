// @flow
import React from 'react';
import {
  A,
  StyledLink,
  StyledButton,
  StyledWhiteIconButton,
  StyledPrimaryButton,
  StyledSmallPrimaryButton,
  StyledOutlineButton,
  StyledSmallOutlineButton,
  StyledSmallHoverWarnOutlineButton,
  StyledHoverWarnOutlineButton,
  StyledPrimaryOutlineButton,
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

type To = {
  pathname?: string,
  search?: string,
  state?: Object,
};

type Props = {
  href?: string,
  to?: string | To,
  children: React$Node,
  disabled?: boolean,
  isLoading?: boolean,
};

export const Button = (props: Props) => handleLinkWrapping(StyledButton, props);

export const WhiteIconButton = (props: Props) =>
  handleLinkWrapping(StyledWhiteIconButton, props);

export const PrimaryButton = (props: Props) =>
  handleLinkWrapping(StyledPrimaryButton, props);

export const SmallPrimaryButton = (props: Props) =>
  handleLinkWrapping(StyledSmallPrimaryButton, props);

export const OutlineButton = (props: Props) =>
  handleLinkWrapping(StyledOutlineButton, props);

export const PrimaryOutlineButton = (props: Props) =>
  handleLinkWrapping(StyledPrimaryOutlineButton, props);

export const SmallOutlineButton = (props: Props) =>
  handleLinkWrapping(StyledSmallOutlineButton, props);

export const SmallHoverWarnOutlineButton = (props: Props) =>
  handleLinkWrapping(StyledSmallHoverWarnOutlineButton, props);

export const HoverWarnOutlineButton = (props: Props) =>
  handleLinkWrapping(StyledHoverWarnOutlineButton, props);
