import styled from 'styled-components';
import { FlexRow, FlexCol } from '../../components/globals';

export const Row = styled(FlexRow)`
  padding: 8px 16px;
  align-items: center;
  width: 100%;
  color: ${({ theme }) => theme.text.alt};

  div {
    margin-top: 2px;
    margin-right: 8px;
    color: inherit;
  }

  span {
    line-height: 1;
    color: inherit;
  }

  &:hover {
    background-color: ${({ theme }) => theme.brand.alt};
    color: ${({ theme }) => theme.text.reverse};
  }
`;

export const Col = styled(FlexCol)`
  width: 100%;

  a + a > div {
    border-top: 2px solid ${({ theme }) => theme.bg.wash};
  }
`;

export const RowLabel = styled.span`
  font-weight: 600;
`;
