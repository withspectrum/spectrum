import styled from 'styled-components';
import { FlexContainer } from '../flexbox';

export const Wrapper = styled(FlexContainer)`
  padding: 32px 0;

  @media(max-width: 768px) {
    padding: 0;
  }
`;
