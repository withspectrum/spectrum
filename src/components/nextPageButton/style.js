// @flow
import theme from 'shared/theme';
import styled from 'styled-components';

export const HasNextPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NextPageButton = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 8px;
  background: ${theme.bg.wash};
  color: ${theme.text.alt};
  font-size: 14px;
  font-weight: 500;
  position: relative;
  min-height: 40px;

  &:hover {
    color: ${theme.brand.default};
    cursor: pointer;
    background: rgba(56, 24, 229, 0.1);
  }
`;
