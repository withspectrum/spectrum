import styled from 'styled-components';
import { FlexRow, FlexCol } from '../../components/globals';

export const CoverRow = styled(FlexRow)`
  align-items: flex-start;

  > div {
    margin-top: 24px;
  }

  > .inset {
    margin-top: -36px;
  }
`;
