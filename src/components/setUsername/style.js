// @flow
import styled from 'styled-components';

export const Container = styled.div`
  margin: 0 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-width: 320px;
`;

export const Row = styled.div`
  display: flex;
`;

export const Loading = styled.span`
  position: absolute;
  left: 226px;
  top: 33px;
`;

export const Action = styled.div`
  margin-top: 14px;
  margin-left: 8px;
`;
