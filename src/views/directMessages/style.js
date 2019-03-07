// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import { FlexCol, FlexRow } from '../../components/globals';

export const View = styled.main`
  grid-area: view;
  display: grid;
  grid-template-columns: minmax(320px, 400px) 1fr;
`;

export const ViewContent = styled.div`
  max-height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
`;

export const MessagesList = styled.div`
  max-height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  background: ${theme.bg.default};
  border-right: 1px solid ${theme.bg.border};

  @media (max-width: 768px) {
    min-width: 320px;
    border-right: none;
    max-width: 100%;
    display: ${props => (props.isViewingThread ? 'none' : 'flex')};
  }
`;

export const MessagesContainer = styled.div`
  max-height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  display: grid;
  grid-template-rows: 1fr 48px 25px;
  background: ${theme.bg.default};

  @media (min-width: 768px) {
    ${props =>
      props.hideOnDesktop &&
      css`
        display: none;
      `};
  }

  @media (max-width: 768px) {
    ${props =>
      props.hideOnMobile &&
      css`
        display: none;
      `};
  }
`;

export const NoThreads = MessagesContainer.extend`
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  background: #fff;

  h2 {
    max-width: 600px;
  }
`;

export const ComposeHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  justify-content: flex-end;
  padding: 8px;
  border-bottom: 1px solid ${theme.bg.border};
  color: ${theme.brand.default};

  @media (max-width: 768px) {
    display: none;
  }
`;
