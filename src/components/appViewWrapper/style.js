import styled from 'styled-components';
import { MEDIA_BREAK } from 'src/views/communityNew/style';

export const StyledAppViewWrapper = styled.div`
  display: grid;
  grid-template-columns: ${props =>
    props.isSignedIn ? `72px minmax(100%, 1fr)` : 'minMax(100%, 1fr)'};
  grid-template-areas: 'navigation' 'view';
  overflow: hidden;
  overflow-y: auto;
  width: 100%;

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: minmax(100%, 1fr);
  }
`;
