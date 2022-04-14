// @flow
import styled from 'styled-components';
import { Shadow, hexa } from '../../../../components/globals';

export const ListCard = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg.default};
  border-radius: 12px;
  box-shadow: ${Shadow.low} ${({ theme }) => hexa(theme.text.placeholder, 0.25)};
  position: relative;
  width: 100%;
  max-width: 100%;
  background-clip: padding-box;
  overflow: visible;
  flex: auto;
  margin: 16px;
  padding: 32px 16px;

  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
    padding: 16px 0px;
    margin: 0;
    margin-top: 16px;
  }
`;

export const Label = styled.h1`
  color: ${({ theme }) => theme.text.default};
  font-size: 32px;
  margin: 0 16px;
  margin-bottom: 24px;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const CommunityItem = styled.div`
  border-bottom: 1px solid ${props => props.theme.bg.border};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1 0 auto;
  max-width: 100%;

  &:last-of-type {
    border-bottom: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
