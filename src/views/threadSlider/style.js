// @flow
// $FlowFixMe
import styled from 'styled-components';

export const Container = styled.div``;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

export const Thread = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 500px;
  background: #fff;
  z-index: 1001;
`;
