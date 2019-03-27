// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { Link } from 'react-router-dom';
import { tint, hexa } from 'src/components/globals';

export const A = styled.a`
  display: flex;
  align-items: center;
  flex: none;
`;

export const StyledLink = styled(Link)`
  display: flex;
  flex: none;
  align-items: center;
`;

export const StyledButton = styled.button`
  font-size: ${props => (props.size === 'small' ? '15px' : '16px')};
  font-weight: 600;
  color: ${theme.text.default};
  border-radius: 32px;
  padding: ${props => (props.size === 'small' ? '6px 12px' : '10px 16px')};
  background: ${theme.bg.wash};
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-display: none;
  opacity: ${props => (props.disabled ? '0.6' : '1')};
  line-height: 1.2;
  transition: box-shadow 0.2s ease-in-out;

  .icon:not(:first-child):not(:last-child) {
    margin-right: 4px;
  }

  &:hover {
    background: ${theme.bg.border};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${theme.bg.default}, 0 0 0 4px ${theme.bg.border};
    transition: box-shadow 0.2s ease-in-out;
  }

  &:active {
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${tint(theme.bg.border, -24)};
    transition: box-shadow 0.2s ease-in-out;
  }
`;

export const StyledWhiteIconButton = styled(StyledButton)`
  background-color: transparent;
  padding: 0;
  color: ${theme.text.default};

  .icon {
    margin-right: 0;
  }
`;

export const StyledPrimaryButton = styled(StyledButton)`
  background-color: ${theme.brand.alt};
  background-image: ${`linear-gradient(to bottom, ${theme.brand.alt}, ${tint(
    theme.brand.alt,
    -8
  )})`};
  color: ${theme.text.reverse};
  border: 1px solid ${tint(theme.brand.alt, -8)};
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    border: 1px solid ${tint(theme.brand.alt, -16)};
    background: ${tint(theme.brand.alt, -8)};
    color: ${theme.text.reverse};
  }

  &:focus {
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.brand.alt, 0.24)};
  }

  &:active {
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.brand.alt, 0.64)};
  }
`;

export const StyledWarnButton = styled(StyledPrimaryButton)`
  background-color: ${theme.warn.default};
  background-image: ${`linear-gradient(to bottom, ${theme.warn.default}, ${tint(
    theme.warn.default,
    -8
  )})`};
  border: 1px solid ${tint(theme.warn.default, -8)};

  &:hover {
    border: 1px solid ${tint(theme.warn.default, -16)};
    background: ${tint(theme.warn.default, -8)};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.warn.default, 0.24)};
  }

  &:active {
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.warn.default, 0.64)};
  }
`;

export const StyledWhiteButton = styled(StyledButton)`
  background-color: ${theme.bg.default};
  color: ${theme.text.secondary};
  border: 0;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    border: 0;
    background: ${theme.bg.default};
    color: ${theme.text.default};
  }

  &:focus {
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.bg.default, 0.24)};
  }

  &:active {
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.bg.default, 0.64)};
  }
`;

export const StyledOutlineButton = styled(StyledButton)`
  background: transparent;
  border: 1px solid ${theme.bg.border};
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    background: transparent;
    border: 1px solid ${tint(theme.bg.border, -8)};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${theme.bg.default}, 0 0 0 4px ${theme.bg.border};
    transition: box-shadow 0.2s ease-in-out;
  }

  &:active {
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${tint(theme.bg.border, -24)};
    transition: box-shadow 0.2s ease-in-out;
  }
`;

export const StyledPrimaryOutlineButton = styled(StyledOutlineButton)`
  background: transparent;
  border: 1px solid ${theme.brand.alt};
  color: ${theme.brand.alt};
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    background: ${hexa(theme.brand.alt, 0.04)};
    border: 1px solid ${tint(theme.brand.alt, -8)};
    color: ${tint(theme.brand.alt, -8)};
  }

  &:focus {
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.brand.alt, 0.16)};
  }

  &:active {
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.brand.alt, 0.48)};
  }
`;

export const StyledWhiteOutlineButton = styled(StyledOutlineButton)`
  background: transparent;
  border: 1px solid ${theme.bg.default};
  color: ${theme.bg.default};
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    background: ${hexa(theme.bg.default, 0.04)};
    border: 1px solid ${theme.bg.default};
    color: ${theme.bg.default};
  }

  &:focus {
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.bg.default, 0.16)};
  }

  &:active {
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.bg.default, 0.48)};
  }
`;

export const StyledHoverWarnOutlineButton = styled(StyledOutlineButton)`
  &:hover {
    background: ${theme.warn.default};
    border: 1px solid ${theme.warn.default};
    color: ${theme.text.reverse};
  }

  &:active {
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.warn.default, 0.48)};
  }
`;

export const StyledTextButton = styled(StyledOutlineButton)`
  border: 0;

  &:hover {
    background: transparent;
    border: 0;
  }

  &:focus {
    box-shadow: 0 0 0 2px ${theme.bg.default}, 0 0 0 4px ${theme.bg.border};
    transition: box-shadow 0.2s ease-in-out;
  }

  &:active {
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${tint(theme.bg.border, -24)};
    transition: box-shadow 0.2s ease-in-out;
  }
`;

export const StyledFacebookButton = styled(StyledPrimaryButton)`
  background-color: ${theme.social.facebook.default};
  background-image: none;
  border: 1px solid ${tint(theme.social.facebook.default, -8)};

  &:hover {
    border: 1px solid ${tint(theme.social.facebook.default, -16)};
    background: ${tint(theme.social.facebook.default, -8)};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.social.facebook.default, 0.24)};
  }

  &:active {
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.social.facebook.default, 0.64)};
  }
`;

export const StyledTwitterButton = styled(StyledPrimaryButton)`
  background-color: ${theme.social.twitter.default};
  background-image: none;
  border: 1px solid ${tint(theme.social.twitter.default, -8)};

  &:hover {
    border: 1px solid ${tint(theme.social.twitter.default, -16)};
    background: ${tint(theme.social.twitter.default, -8)};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.social.twitter.default, 0.24)};
  }

  &:active {
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${hexa(theme.social.twitter.default, 0.64)};
  }
`;
