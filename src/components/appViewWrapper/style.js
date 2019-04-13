import styled from 'styled-components';
import {
  MEDIA_BREAK,
  TITLEBAR_HEIGHT,
  NAVBAR_WIDTH,
  NAVBAR_EXPANDED_WIDTH,
  MIN_WIDTH_TO_EXPAND_NAVIGATION,
} from 'src/components/layout';

export const StyledAppViewWrapper = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: ${props =>
    props.isTwoColumn ? `${NAVBAR_WIDTH}px 1fr` : '1fr'};
  grid-template-areas: ${props =>
    props.isTwoColumn ? "'navigation main'" : "'main'"};

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: 1fr;
    grid-template-rows: ${props =>
      props.isTwoColumn ? `${TITLEBAR_HEIGHT}px 1fr` : '1fr'};
    grid-template-areas: ${props =>
      props.isTwoColumn ? "'titlebar' 'main'" : "'main'"};
  }

  @media (min-width: ${MIN_WIDTH_TO_EXPAND_NAVIGATION}px) {
    grid-template-columns: ${props =>
      props.isTwoColumn ? `${NAVBAR_EXPANDED_WIDTH}px 1fr` : '1fr'};
    grid-template-areas: ${props =>
      props.isTwoColumn ? "'navigation main'" : "'main'"};
  }
`;
