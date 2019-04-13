// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { hexa, tint } from 'src/components/globals';
import { Link } from 'react-router-dom';

export const HasNextPage = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: ${theme.bg.default};
  width: 100%;
`;

export const NextPageButton = styled.span`
  display: flex;
  flex: 1;
  margin-top: 16px;
  justify-content: center;
  padding: 8px;
  background: ${hexa(theme.brand.default, 0.04)};
  color: ${tint(theme.brand.default, -8)};
  border-top: 1px solid ${hexa(theme.brand.default, 0.06)};
  border-bottom: 1px solid ${hexa(theme.brand.default, 0.06)};
  font-size: 15px;
  font-weight: 500;
  position: relative;
  min-height: 40px;
  width: 100%;

  &:hover {
    color: ${theme.brand.default};
    cursor: pointer;
    background: ${hexa(theme.brand.default, 0.08)};
  }
`;
