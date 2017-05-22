import styled from 'styled-components';
import Card from '../../components/card';
import { Link } from 'react-router-dom';
import { FlexCol, FlexRow, H3 } from '../../components/globals';

export const ListHeading = styled(H3)`
  font-weight: 900;
  font-size: 14px;
  color: ${({ theme }) => theme.text.placeholder};
`;

export const ListContainer = styled(FlexCol)`
  margin: 8px 0 0 0;
  width: 100%;
  align-items: stretch;

  a + a {
    border-top: 2px solid ${({ theme }) => theme.bg.wash};
  }
`;

export const MoreLink = styled(Link)`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.alt};
`;

export const StyledCard = styled(Card)`
  margin-top: 16px;
  padding: 16px 16px 16px 20px;
`;

export const ListFooter = styled(FlexRow)`
  padding-top: 16px;
  border-top: 2px solid ${({ theme }) => theme.bg.wash};
  justify-content: space-between;
  width: 100%;
`;
