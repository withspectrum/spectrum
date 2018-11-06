// @flow
import styled from 'styled-components';
import { theme } from 'shared/theme';

export const Container = styled.div``;

export const Card = styled.div`
  padding: 16px;
  background: ${theme.bg.default};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const AppIcon = styled.img`
  width: 36px;
  height: 36px;
  margin-top: 4px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

export const Title = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.text.default};
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.text.alt};
  margin-bottom: 16px;
`;
