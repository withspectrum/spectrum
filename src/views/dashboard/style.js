import styled from 'styled-components';
import Card from '../../components/card';
import { Link } from 'react-router-dom';
import { FlexCol, FlexRow, H3, Transition } from '../../components/globals';

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
  margin-top: 8px;
  align-items: stretch;
  width: 100%;

  a + a {
    border-top: 2px solid ${({ theme }) => theme.bg.wash};
  }
`;

export const MoreLink = styled(Link)`
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.text.alt};
  transition: ${Transition.hover.off};

  &:hover {
    color: ${({ theme }) => theme.brand.alt};
  }
`;

export const ListFooter = styled(FlexRow)`
  border-top: 2px solid ${({ theme }) => theme.bg.wash};
  justify-content: space-between;
  width: 100%;
`;
