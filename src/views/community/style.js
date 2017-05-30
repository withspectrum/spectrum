import styled from 'styled-components';
import { IconButton } from '../../components/buttons';
import { FlexRow, FlexCol } from '../../components/globals';

export const CoverRow = styled(FlexRow)`
  align-items: flex-start;

  > div {
    margin-top: 24px;
  }

  > .inset {
    margin-top: -64px;
  }
`;

export const CoverColumn = styled(FlexCol)`
  width: 90%;
  max-width: 1024px;
`;

export const CoverButton = styled(IconButton)`
  position: absolute;
  right: 16px;
  top: 16px;
  flex: 0 0 auto;
`;
