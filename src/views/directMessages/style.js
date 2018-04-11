// @flow
import styled, { css } from 'styled-components';
import { FlexCol, FlexRow } from '../../components/globals';

export const View = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  background: #fff;
  flex: auto;
  max-height: calc(100% - 48px);

  @media (max-width: 768px) {
    flex-direction: column;
    flex: auto;
  }
`;

export const ViewContent = styled(FlexCol)`
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow-y: auto;
  align-items: center;
  align-content: flex-start;
`;

export const MessagesList = styled(FlexCol)`
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 400px;
  flex: 0 0 25%;
  min-width: 320px;
  background: ${props => props.theme.bg.default};
  border-right: 1px solid ${props => props.theme.bg.border};

  @media (max-width: 768px) {
    flex: auto;
    min-width: 320px;
    border-right: none;
    max-width: 100%;
    display: ${props => (props.isViewingThread ? 'none' : 'flex')};
  }
`;

export const MessagesContainer = styled(FlexCol)`
  flex: auto;

  @media (max-width: 768px) {
    max-height: 100%;
    ${props =>
      props.hideOnMobile &&
      css`
        display: none;
      `};
  }
`;

export const ComposeHeader = styled(FlexRow)`
  justify-content: flex-end;
  padding: 8px;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  color: ${props => props.theme.brand.default};

  @media (max-width: 768px) {
    display: none;
  }
`;
