import styled from 'styled-components';
import { FlexCol, FlexRow, H3, H4, P } from '../../components/globals';

export const Wrapper = styled(FlexCol)`
  flex: 0 0 auto;
  padding: 8px 0;
  justify-content: center;

  &:hover h3 {
    color: ${({ theme }) => theme.brand.alt};
  }
`;

export const Col = styled(FlexCol)`
  flex: 1;
`;

export const Row = styled(FlexRow)`
  flex: 0 0 auto;
  align-items: center;

  a {
    display: flex;
    align-items: center;
  }
`;

export const Heading = styled(H3)`
  font-weight: 700;
`;

export const Meta = styled(H4)`
  font-weight: 400;
  color: ${({ theme }) => theme.text.alt};
`;

export const Description = styled(P)`
  margin-top: 8px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.default};
`;

export const ActionContainer = styled.div`
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
`;
