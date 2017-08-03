// @flow
import styled from 'styled-components';
import { Shadow, hexa } from '../../../../components/globals';

export const ListCard = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg.default};
  border-radius: 12px;
  box-shadow: ${Shadow.low} ${({ theme }) =>
      hexa(theme.text.placeholder, 0.25)};
  position: relative;
  width: 100%;
  max-width: 100%;
  background-clip: padding-box;
  overflow: visible;
  flex: 0 1 auto;
  margin: 16px;

  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
  }
`;

export const Label = styled.h1`
  color: ${({ theme }) => theme.text.default};
  margin-left: 16px;
  margin-top: 24px;
  font-size: 32px;
  margin-bottom: 16px;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const CommunityItem = styled.div`
  border-bottom: 2px solid ${props => props.theme.bg.wash};

  &:last-of-type {
    border-bottom: 0;
  }
`;
