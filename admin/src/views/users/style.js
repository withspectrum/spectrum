import styled from 'styled-components';
import { FlexCol, FlexRow } from '../../components/globals';

export const View = styled(FlexRow)`
  align-items: stretch;
  background: #fff;
  flex: auto;

  @media( max-width: 768px) {
    flex-direction: column;
    flex: auto;
  }
`;

export const ViewContent = styled(FlexCol)`
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow-y: scroll;
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
    flex: auto;
    min-width: 320px;
    border-right: none;
    max-width: 100%;
  }
`;

export const MessagesContainer = styled(FlexCol)`
  flex: auto;
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
