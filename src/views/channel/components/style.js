// @flow
import styled from 'styled-components';
import { Card } from '../../../components/card';

export const PendingUserNotificationContainer = styled(Card)`
  width: 100%;
  margin-top: 16px;
  display: flex;
  align-items: center;
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};

  a {
    padding: 16px;
  }
`;

export const PendingUserCount = styled.span`
  padding: 4px 8px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  margin-right: 12px;
  background: ${props => props.theme.warn.default};
`;
