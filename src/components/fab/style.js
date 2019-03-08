// @flow
import styled, { css } from 'styled-components';
import theme from 'shared/theme';
import { Link } from 'react-router-dom';
import { tint } from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';

const styles = css`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  color: ${theme.text.reverse};
  background: ${theme.brand.default};
  transition: box-shadow 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);

  &:hover {
    background: ${tint(theme.brand.default, 4)};
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.24);
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;
export const StyledFab = styled.div`
  ${styles};
`;

export const StyledLinkFab = styled(Link)`
  ${styles};
`;
