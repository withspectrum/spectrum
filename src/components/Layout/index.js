// @flow
import styled from 'styled-components';

export const NAVBAR_WIDTH = 72;
export const PRIMARY_COLUMN_WIDTH = 600;
export const SECONDARY_COLUMN_WIDTH = 340;
export const COL_GAP = 16;
export const MAX_WIDTH =
  PRIMARY_COLUMN_WIDTH + SECONDARY_COLUMN_WIDTH + COL_GAP;
export const SINGLE_COLUMN_WIDTH = MAX_WIDTH;
// add 144 (72 * 2) to account for the left side nav
export const MEDIA_BREAK =
  PRIMARY_COLUMN_WIDTH + SECONDARY_COLUMN_WIDTH + COL_GAP + 144;

export const ViewGrid = styled.div.attrs({ id: 'main' })`
  display: grid;
  grid-area: view;
  height: 100vh;
  max-height: 100vh;
`;

export const SingleColumnGrid = styled.div`
  display: grid;
  justify-self: center;
  grid-template-columns: 1fr;
  max-width: ${MAX_WIDTH}px;
`;

/*
┌──┬────┬─┬─┬──┐
│  │ xx │ │x│  │
│  │    │ │ │  │
│  │ xx │ │x│  │
│  │    │ │ │  │
│  │ xx │ │x│  │
└──┴────┴─┴─┴──┘
*/
export const PrimarySecondaryColumnGrid = styled.div`
  display: grid;
  justify-self: center;
  grid-template-columns: ${PRIMARY_COLUMN_WIDTH}px ${SECONDARY_COLUMN_WIDTH}px;
  grid-template-rows: 100%;
  grid-gap: ${COL_GAP}px;
  max-width: ${MAX_WIDTH}px;

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;
    grid-gap: 0;
    min-width: 100%;
  }
`;

/*
┌──┬─┬─┬────┬──┐
│  │x│ │ xx │  │
│  │ │ │    │  │
│  │x│ │ xx │  │
│  │ │ │    │  │
│  │x│ │ xx │  │
└──┴─┴─┴────┴──┘
*/
export const SecondaryPrimaryColumnGrid = styled.div`
  display: grid;
  justify-self: center;
  grid-template-columns: ${SECONDARY_COLUMN_WIDTH}px ${PRIMARY_COLUMN_WIDTH}px;
  grid-template-rows: 100%;
  grid-gap: ${COL_GAP}px;
  max-width: ${MAX_WIDTH}px;

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;
    grid-gap: 0;
    max-width: 100%;
  }
`;

/*
┌─────────────┐
│             │
│    ┌───┐    │
│    │ x │    │
│    └───┘    │
│             │
└─────────────┘
*/
export const CenteredGrid = styled(SingleColumnGrid)`
  align-self: center;
  max-width: ${PRIMARY_COLUMN_WIDTH}px;

  @media (max-width: ${PRIMARY_COLUMN_WIDTH + NAVBAR_WIDTH}px) {
    align-self: start;
  }
`;
