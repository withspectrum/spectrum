import React from 'react';
import styled from 'styled-components';

const GridReset = styled.div`
  display: grid;
  margin: 0;
  padding: 0;
  max-height: 100%;
  max-width: 100%;
`;

// Describes a layout with a fixed 48px tall row called "header" at the top and a "body" row that fills the rest of the vertical space within the parent.
export const HeaderGrid = styled(GridReset)`
  grid-template-rows: 48px 1fr;
  grid-template-columns: 100%;
  grid-template-areas: 'header' 'body';
`;

// Describes a layout with a fixed 48px tall row called "footer" at the bottom and a "body" row that fills the rest of the vertical space within the component.
export const FooterGrid = styled(GridReset)`
  overflow: hidden;
  grid-template-rows: 1fr 64px;
  grid-template-columns: 100%;
  grid-template-areas: 'body' 'footer';
`;

// Describes a layout with a 320 - 480px wide "master" column on the left and a "detail" column that fills the rest of the horizontal space within the component.
export const MasterDetailGrid = styled(GridReset)`
  grid-template-rows: 100%;
  grid-template-columns: minmax(320px, 480px) 1fr;
  grid-template-areas: 'master detail';
`;
