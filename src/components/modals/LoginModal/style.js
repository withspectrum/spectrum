// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { zIndex } from 'src/components/globals';

export const Container = styled.div`
  padding: 0 16px;
`;

export const CodeOfConduct = styled.p`
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.alt};
  margin-top: 16px;
  margin-bottom: 16px;
  position: relative;
  z-index: ${zIndex.card + 1};

  a {
    color: ${theme.brand.default};
    font-weight: 600;
  }
`;
