import styled, { css } from 'styled-components';
import { MEDIA_BREAK } from 'src/components/layout';

export const StyledAppViewWrapper = styled.div`
  display: grid;
  grid-template-columns: ${props => (props.isSignedIn ? '72px 1fr' : '1fr')};
  grid-template-areas: ${props =>
    props.isSignedIn ? "'navigation view'" : "'view'"};
  overflow: hidden;
  overflow-y: auto;
  width: 100%;
  max-height: 100vh;

  /* 
    do not remove this.
    see src/routes.js for an explanation of what's going on here
  */
  ${props =>
    props.hasModal &&
    css`
      .view-grid {
        display: none;
      }
    `}

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: 1fr;
    grid-template-areas: 'view';
  }
`;
