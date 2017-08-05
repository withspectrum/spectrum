import styled from 'styled-components';
import { FlexRow } from '../globals';

export const Wrapper = styled(FlexRow)`
  order: 2;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  overflow-y: scroll;
  flex: auto;

  @media (max-width: 768px) {
    padding: 0;
    justify-content: flex-start;
    flex-direction: column;
  }
`;
