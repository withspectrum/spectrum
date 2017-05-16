import styled from 'styled-components';

export const View = styled.div`
  display: flex;
  height: 100%;
  overflow-y: hidden;
  background: #fff;
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

export const MessagesContainer = styled.div`
  position: absolute;
  /* 322px to account for 2px box shadow on the sidebar */
  width: calc(100% - 322px);
  left: 322px;
  height: calc(100% - 48px);
  overflow-x: hidden;
  overflow-y: scroll;
  background: #fff;
`;

export const ComposeHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px;
  border-bottom: 2px solid ${props => props.theme.border.default};
  color: ${props => props.theme.brand.default};
`;
