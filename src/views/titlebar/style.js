// @flow
// $FlowFixMe
import styled from 'styled-components';
import { hexa, Shadow } from '../../components/globals';

export const TitleBar = styled.section`
  width: 100%;
  display: flex;
  background-color: ${({ theme }) => theme.bg.reverse};
  color: ${({ theme }) => theme.text.reverse};
  height: 48px;
  ${/* position: fixed;
  top: 0;
  left: 0;
  right: 0; */ ''}
  order: 0;
  flex: 0 0 48px;
  z-index: 10;
  box-shadow: ${Shadow.mid} ${({ theme }) => hexa(theme.bg.reverse, 0.15)};
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const Text = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  align-content: center;
  align-items: center;
  max-width: calc(100% - 96px);
`;

export const Title = styled.h3`
  font-size: ${props => (props.large ? '18px' : '14px')};
  font-weight: 800;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  white-space: nowrap;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => hexa(theme.text.reverse, 0.75)};
  font-size: 12px;
  letter-spacing: 0.2px;
  font-weight: 600;
  line-height: 1.4;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  white-space: nowrap;
`;

export const Spacer = styled.span`
  width: 32px;
  height: 32px;
`;
