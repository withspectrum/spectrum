import styled from 'styled-components';
import Card from '../../components/card';
import { Link } from 'react-router-dom';
import { FlexCol, FlexRow, H3, H4, P } from '../../components/globals';

export const StyledCard = styled(Card)`
  margin-top: 16px;
  padding: 16px;
`;

export const ListHeading = styled(H3)`
  font-weight: 900;
  color: ${({ theme }) => theme.text.placeholder};
`;

export const ListContainer = styled(FlexCol)`
  margin: 8px 0;
  width: 100%;
`;

export const ItemWrapper = styled(FlexCol)`
  flex: 0 0 auto;
  padding: 8px 0;
  border-bottom: 2px solid ${({ theme }) => theme.bg.wash};

  &:last-of-type {
    border-bottom: none;
  }
`;

export const ItemCol = styled(FlexCol)`
  flex: 1;
`;

export const ItemRow = styled(FlexRow)`
  flex: 0 0 auto;
  align-items: center;
`;

export const ItemHeading = styled(H3)`
  font-weight: 700;
`;

export const ItemMeta = styled(H4)`
  font-weight: 400;
  color: ${({ theme }) => theme.text.alt};
`;

export const ItemDescription = styled(P)`
  margin-top: 8px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.default};
`;

export const ActionContainer = styled.div`
  flex: 0 0 auto;
`;

export const MoreLink = styled(Link)`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.alt};
`;
