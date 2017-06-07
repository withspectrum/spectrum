import styled from 'styled-components';
import { FlexCol, FlexRow } from '../../components/globals';

export const View = styled(FlexRow)`
  align-items: stretch;
  background: #fff;

  @media( max-width: 768px) {
    flex-direction: column;
    flex: auto;
  }
`;

export const ViewContent = styled(FlexCol)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow-y: scroll;
  max-height: ${props =>
    props.moved ? 'calc(100% - 96px)' : 'calc(100% - 48px)'};
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
    flex: 1 1 auto;
    min-width: 320px;
    border-right: none;
    max-width: 100%;
  }
`;

export const MessagesContainer = styled(FlexCol)`
  flex: 1 1 auto;
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
