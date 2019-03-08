import styled from 'styled-components';
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

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: 1fr;
    grid-template-areas: 'view';
  }
`;
