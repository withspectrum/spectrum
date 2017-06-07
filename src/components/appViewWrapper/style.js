import styled from 'styled-components';
import { FlexRow } from '../globals';

export const Wrapper = styled(FlexRow)`
  order: 2;
  align-items: flex-start;
  justify-content: center;
  overflow-y: scroll;
  flex: 1 1 auto;

  @media (max-width: 768px) {
    padding: 0;
    flex-direction: column;
  }
`;
