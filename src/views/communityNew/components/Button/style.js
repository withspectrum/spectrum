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
  color: ${theme.text.secondary};
  border-radius: 4px;
  padding: 10px 16px;
  background: ${theme.bg.wash};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
  -webkit-display: none;
  opacity: ${props => (props.disabled ? '0.6' : '1')};

  .icon {
    margin-right: 4px;
  }

  &:hover {
    background: ${theme.bg.border};
    color: ${theme.text.default};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${theme.bg.default}, 0 0 0 3px ${theme.bg.border};
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

  &:hover {
    border: 1px solid ${tint(theme.brand.alt, -16)};
    background: ${tint(theme.brand.alt, -8)};
    color: ${theme.text.reverse};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${theme.bg.default},
      0 0 0 3px ${hexa(theme.brand.alt, 0.24)};
  }
`;

export const StyledSmallPrimaryButton = styled(StyledPrimaryButton)`
  padding: 6px 12px;
  font-size: 15px;
`;

export const StyledOutlineButton = styled(StyledButton)`
  background: transparent;
  border: 1px solid ${theme.bg.border};

  &:hover {
    background: transparent;
    border: 1px solid ${tint(theme.bg.border, -8)};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${theme.bg.default}, 0 0 0 3px ${theme.bg.border};
  }
`;
