import React from 'react';
import styled from 'styled-components';
import { FlexRow } from '../globals';

const StyledGrid = styled(FlexRow)`
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;

  > * {
    flex: 0 0 calc(50% - 8px);
    margin: 0;
    margin-bottom: 16px;

    + div,
    + span {
      margin-top: 0;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    flex: auto;

    > * {
      max-width: none;
      margin: 0;

      + div,
      + span {
        margin-top: 2px;
      }
    }
  }
`;

const Grid = props =>
  <StyledGrid>
    {props.children}
  </StyledGrid>;

export default Grid;
