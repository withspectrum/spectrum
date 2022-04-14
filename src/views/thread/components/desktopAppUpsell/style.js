// @flow
import styled from 'styled-components';
import { theme } from 'shared/theme';

export const Container = styled.div`
  padding: 16px;

  a,
  button {
    width: 100%;
  }
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
  font-size: 15px;
  color: ${theme.text.secondary};
  margin-bottom: 16px;
`;
