import styled from 'styled-components';
import ChatInput from '../../components/chatInput';
import { FlexCol, FlexRow } from '../../components/globals';

export const View = styled(FlexRow)`
  align-items: stretch;
  flex: 0 0 auto;
  height: calc(100vh - 48px);
  background: #fff;

  @media( max-width: 768px) {
    height: calc(100vh - 96px);
  }
`;

export const ViewContent = styled(FlexCol)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow-y: scroll;
  max-height: ${props => (props.moved ? 'calc(100% - 96px)' : 'calc(100% - 48px)')};
  align-items: center;
  align-content: flex-start;
`;

export const MessagesList = styled(FlexCol)`
  overflow-y: scroll;
  overflow-x: hidden;
  max-width: 400px;
  flex: 0 0 25%;
  min-width: 320px;
  background: ${props => props.theme.bg.default};
  border-right: 2px solid ${props => props.theme.border.default};

  @media (max-width: 768px) {
    flex: 0 0 100%;
    min-width: 320px;
    border-right: none;
    max-width: 100%;
  }
`;

export const MessagesContainer = styled(FlexCol)`
  flex: 1 1 auto;

  @media (max-width: 768px) {
    flex: 0 0 100%;
  }
`;

export const ComposeHeader = styled(FlexRow)`
  justify-content: flex-end;
  padding: 8px;
  border-bottom: 2px solid ${props => props.theme.border.default};
  color: ${props => props.theme.brand.default};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const FlexChatInput = styled(ChatInput)`
  flex: 0 0 auto;
`;
