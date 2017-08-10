// @flow
import styled from 'styled-components';

export const FullscreenViewContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  z-index: 1010;
  overflow-y: scroll;
  padding-top: 32px;
`;

export const Close = styled.div`
  color: ${props => props.theme.text.default};
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
`;
