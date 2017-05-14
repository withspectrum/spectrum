import styled from 'styled-components';

export const View = styled.div`
  display: flex;
  height: 100%;
  overflow-y: hidden;
`;

export const MessagesList = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  top: 48px;
  left: 0;
  width: 320px;
  height: calc(100% - 48px);
  background: #fff;
  box-shadow: 2px 0 0 ${props => props.theme.border.default}
`;

export const Messages = styled.div`
  position: absolute;
  width: calc(100% - 320px);
  left: 320px;
  height: calc(100% - 48px);
  overflow-x: hidden;
  overflow-y: scroll;
`;
