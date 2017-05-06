import styled from 'styled-components';
import Card from '../../components/card';
import { Link } from 'react-router-dom';
import { FlexCol, H3 } from '../../components/globals';

export const StyledCard = styled(Card)`
  margin-top: 16px;
  padding: 16px 16px 16px 20px;
`;

export const ListHeading = styled(H3)`
  font-weight: 900;
  font-size: 14px;
  color: ${({ theme }) => theme.text.placeholder};
`;

export const ListContainer = styled(FlexCol)`
  margin: 8px 0 16px 0;
  width: 100%;
`;

export const MoreLink = styled(Link)`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.alt};
`;
