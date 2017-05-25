import styled from 'styled-components';
import { FlexRow } from '../globals';

export const Wrapper = styled(FlexRow)`
  padding: 32px 0;
  align-items: flex-start;
  justify-content: center;

  @media(max-width: 768px) {
    padding: 0;
  }
`;
