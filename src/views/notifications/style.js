import styled from 'styled-components';
import { FlexContainer } from '../../components/flexbox';
import { FlexCol, FlexRow, Gradient } from '../../components/globals';
import Card from '../../components/card';

export const DashboardContainer = styled(FlexContainer)`
  margin-top: 32px;
`;

export const NotificationCard = styled(Card)`
  margin-bottom: 16px;
`;

export const Status = styled.h2`
  margin-left: 8px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.reverse};
`;

export const StatusBar = styled(FlexRow)`
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border-radius: 12px 12px 0 0;
  background-color: ${({ theme }) => theme.brand.alt};
  background-image: ${({ theme }) => Gradient(theme.brand.alt, theme.brand.default)};
`;

export const NotificationBody = styled(FlexCol)`
  margin: 12px 16px;
`;

export const Content = styled.p`
  font-size: 0.875rem;
  line-height: 1.4;
  margin-top: 8px;
`;

export const Message = styled(Content)`
  font-weight: 700;
`;
