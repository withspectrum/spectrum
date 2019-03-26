// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { isDesktopApp } from 'src/helpers/desktop-app-utils';

export const MIN_NAVBAR_WIDTH = isDesktopApp() ? 80 : 72;
export const MAX_NAVBAR_WIDTH = 256;

export const MIN_PRIMARY_COLUMN_WIDTH = 600;
export const MAX_PRIMARY_COLUMN_WIDTH = 1280;

export const MIN_SECONDARY_COLUMN_WIDTH = 240;
export const MAX_SECONDARY_COLUMN_WIDTH = 320;

export const COL_GAP = 0;
export const TITLEBAR_HEIGHT = isDesktopApp() ? 82 : 62;
export const MIN_MAX_WIDTH =
  MIN_PRIMARY_COLUMN_WIDTH + MIN_SECONDARY_COLUMN_WIDTH + COL_GAP;
export const MAX_MAX_WIDTH =
  MAX_PRIMARY_COLUMN_WIDTH + MAX_SECONDARY_COLUMN_WIDTH;

export const MIN_SINGLE_COLUMN_WIDTH = MIN_MAX_WIDTH;
export const MAX_SINGLE_COLUMN_WIDTH = MAX_MAX_WIDTH;
// add 144 (72 * 2) to account for the left side nav
export const MEDIA_BREAK =
  MIN_PRIMARY_COLUMN_WIDTH +
  MIN_SECONDARY_COLUMN_WIDTH +
  COL_GAP +
  MIN_NAVBAR_WIDTH * 2;

/* 
  do not remove this className.
  see `src/routes.js` for an explanation of what's going on here
*/
export const ViewGrid = styled.main.attrs({
  id: 'main',
  className: 'view-grid',
})`
  display: grid;
  grid-area: main;
  max-height: 100vh;
  overflow: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background: transparent; /* make scrollbar transparent */
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    max-height: calc(100vh - ${TITLEBAR_HEIGHT}px);
  }
`;

/*
┌──┬────────┬──┐
│  │   xx   │  │
│  │        │  │
│  │   xx   │  │
│  │        │  │
│  │   xx   │  │
└──┴────────┴──┘
*/
export const SingleColumnGrid = styled.div`
  display: grid;
  justify-self: center;
  grid-template-columns: minmax(${MIN_MAX_WIDTH}px, ${MAX_MAX_WIDTH}px);
  background: ${theme.bg.default};

  @media (max-width: ${MEDIA_BREAK}px) {
    width: 100%;
    max-width: 100%;
    grid-template-columns: 1fr;
    border-left: 0;
    border-right: 0;
  }
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
  justify-self: flex-start;
  grid-template-columns: minmax(
      ${MIN_PRIMARY_COLUMN_WIDTH}px,
      ${MAX_PRIMARY_COLUMN_WIDTH}px
    ) minmax(${MIN_SECONDARY_COLUMN_WIDTH}px, ${MAX_SECONDARY_COLUMN_WIDTH});
  grid-template-rows: 100%;
  grid-template-areas: 'primary secondary';
  grid-gap: ${COL_GAP}px;
  max-width: ${MAX_MAX_WIDTH}px;

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
  justify-self: flex-start;
  grid-template-columns: minmax(
      ${MIN_SECONDARY_COLUMN_WIDTH}px,
      ${MAX_SECONDARY_COLUMN_WIDTH}px
    ) minmax(${MIN_PRIMARY_COLUMN_WIDTH}px, ${MAX_PRIMARY_COLUMN_WIDTH}px);
  grid-template-rows: 100%;
  grid-template-areas: 'secondary primary';
  grid-gap: ${COL_GAP}px;
  max-width: ${MAX_MAX_WIDTH}px;

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-gap: 0;
    min-width: 100%;
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
export const CenteredGrid = styled.div`
  display: grid;
  justify-self: center;
  grid-template-columns: minmax(${MIN_MAX_WIDTH}px, ${MAX_MAX_WIDTH}px);
  align-self: center;
  max-width: ${MAX_PRIMARY_COLUMN_WIDTH}px;
  grid-template-columns: minmax(
    ${MIN_PRIMARY_COLUMN_WIDTH}px,
    ${MAX_PRIMARY_COLUMN_WIDTH}px
  );

  @media (max-width: ${MEDIA_BREAK}px) {
    align-self: flex-start;
    width: 100%;
    max-width: 100%;
    grid-template-columns: 1fr;
    height: calc(100vh - ${TITLEBAR_HEIGHT}px);
  }
`;

export const PrimaryColumn = styled.section`
  border-right: 1px solid ${theme.bg.border};
  border-bottom: 1px solid ${theme.bg.border};
  border-radius: 0 0 4px 4px;
  height: 100%;
  max-width: ${MAX_PRIMARY_COLUMN_WIDTH}px;
  grid-area: primary;
  display: grid;
  grid-template-rows: 1fr;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    grid-column-start: 1;
    max-width: 100%;
    height: calc(100vh - ${TITLEBAR_HEIGHT}px);
  }
`;

export const SecondaryColumn = styled.section`
  height: 100vh;
  overflow: hidden;
  overflow-y: auto;
  position: sticky;
  top: 0;
  padding-bottom: 48px;
  border-right: 1px solid ${theme.bg.border};
  grid-area: secondary;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background: transparent; /* make scrollbar transparent */
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    height: calc(100vh - ${TITLEBAR_HEIGHT}px);
    display: none;
  }
`;

export const ChatInputWrapper = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 3000;

  @media (max-width: ${MEDIA_BREAK}px) {
    width: 100vw;
    position: fixed;
    bottom: 0;
    left: 0;
  }
`;
