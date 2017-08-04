import React from 'react';
import styled from 'styled-components';
import { FlexRow } from '../globals';

const StyledGrid = styled(FlexRow)`
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;

  > * {
    max-width: calc(50% - 8px);
    margin: 0;
    margin-bottom: 16px;

    + div,
    + span {
      margin-top: 0;
    }
  }
`;

const Grid = props =>
  <StyledGrid>
    {props.children}
  </StyledGrid>;

export default Grid;
