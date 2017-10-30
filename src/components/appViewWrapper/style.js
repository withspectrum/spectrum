import styled from 'styled-components';
import { FlexRow } from '../globals';

export const Wrapper = styled(FlexRow)`
  order: 2;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  overflow-y: scroll;
  flex: auto;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0;
    justify-content: flex-start;
    flex-direction: column;
  }
`;
