import styled from 'styled-components';
import { MEDIA_BREAK, TITLEBAR_HEIGHT } from 'src/components/layout';

export const StyledAppViewWrapper = styled.div`
  display: grid;
  width: 100%;
  min-height: 100vh;
  grid-template-columns: ${props => (props.isSignedIn ? '72px 1fr' : '1fr')};
  grid-template-areas: ${props =>
    props.isSignedIn ? "'navigation main'" : "'main'"};

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: 1fr;
    grid-template-rows: ${TITLEBAR_HEIGHT}px 1fr;
    grid-template-areas:
      'titlebar'
      'main';
  }
`;
