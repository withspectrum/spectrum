// @flow
// $FlowFixMe
import styled from 'styled-components';
// $FlowFixMe
import { Link } from 'react-router-dom';

export const Container = styled.div``;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

export const Thread = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  top: 48px;
  bottom: 0;
  width: 500px;
  background: #fff;
  z-index: 1001;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  max-width: 100%;

  @media (max-width: 768px) {
    top: -48px;
    bottom: 48px;
  }
`;

export const Close = styled(Link)`
  display: flex;
  align-items: center;
  flex: 1;
  border-bottom: 1px solid ${props => props.theme.border.default};
  padding: 8px 16px;
  flex: 1 0 auto;
  background: ${props => props.theme.bg.wash};
  max-height: 48px;
  justify-content: flex-end;
`;

export const CloseButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 32px;
`;

export const CloseLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
`;
