// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { Link } from 'react-router-dom';
import { tint, hexa } from 'src/components/globals';

export const A = styled.a`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const StyledLink = styled(Link)`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const StyledButton = styled.button`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.text.default};
  border-radius: 24px;
  padding: 10px 16px;
  background: ${theme.bg.wash};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
  -webkit-display: none;
  opacity: ${props => (props.disabled ? '0.6' : '1')};
  line-height: 1.2;
  transition: box-shadow 0.2s ease-in-out;

  .icon {
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
  background-color: ${theme.bg.default};
  padding: 0;
  color: ${theme.text.default};
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

export const StyledSmallPrimaryButton = styled(StyledPrimaryButton)`
  padding: 6px 12px;
  font-size: 15px;
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

export const StyledSmallOutlineButton = styled(StyledOutlineButton)`
  padding: 6px 12px;
  font-size: 15px;
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

export const StyledSmallHoverWarnOutlineButton = styled(
  StyledHoverWarnOutlineButton
)`
  padding: 6px 12px;
  font-size: 15px;
`;
