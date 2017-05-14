import styled from 'styled-components';
import Card from '../../components/card';
import { Link } from 'react-router-dom';
import { FlexCol, H3 } from '../../components/globals';

export const ListHeading = styled(H3)`
  font-weight: 800;
  font-size: 20px;
  color: ${({ theme }) => theme.text.default};
`;

export const ListContainer = styled(FlexCol)`
  margin: 8px 0 0 0;
  width: 100%;

  section + section {
    border-top: 2px solid ${({ theme }) => theme.bg.wash};
  }
`;

export const MoreLink = styled(Link)`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.alt};
`;

export const StyledCard = styled(Card)`
  padding: 16px 16px 16px 20px;
`;

export const Description = styled.p`
  margin-top: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  color: ${({ theme }) => theme.text.alt};

  &:first-of-type {
    margin-top: 0;
  }

  &:last-of-type {
    margin-bottom: 16px;
  }

  &:only-of-type {
    margin-bottom: 0;
  }
`;

export const Notice = styled(Description)`
  padding: 8px 12px;
  margin: 16px 0;
  border-radius: 4px;
  background: #FFF1CC;
  border: 1px solid #ffd566;
  color: #715818;
`;
