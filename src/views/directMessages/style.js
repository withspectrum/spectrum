// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import { SecondaryColumn, MEDIA_BREAK } from 'src/components/layout';

export const View = styled.main`
  grid-area: main;
  display: grid;
  grid-template-columns: minmax(320px, 400px) 1fr;
`;

export const ViewContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1;
`;

export const MessagesList = styled.div`
  background: ${theme.bg.default};
  border-right: 1px solid ${theme.bg.border};

  @media (max-width: ${MEDIA_BREAK}px) {
    min-width: 320px;
    border-right: none;
    max-width: 100%;
    display: ${props => (props.isViewingThread ? 'none' : 'flex')};
  }
`;

export const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${theme.bg.default};
  flex: 1;
`;

export const NoThreads = styled(MessagesContainer)`
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

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const StyledSecondaryColumn = styled(SecondaryColumn)`
  border-left: 1px solid ${theme.bg.border};
  border-right: 1px solid ${theme.bg.border};
  padding-right: 0;
  padding-bottom: 0;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-left: 0;
    border-right: 0;
    display: grid;
    display: ${props => (props.shouldHideThreadList ? 'none' : 'block')};
  }
`;

export const NoCommunitySelected = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 24px;
  background: ${theme.bg.default};

  button {
    flex: 1;
  }

  @media (min-width: ${MEDIA_BREAK}px) {
    ${props =>
      props.hideOnDesktop &&
      css`
        display: none;
      `}
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const NoCommunityHeading = styled.h3`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 8px;
  color: ${theme.text.default};
`;
export const NoCommunitySubheading = styled.p`
  margin-top: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  color: ${theme.text.secondary};
  padding-right: 24px;
  margin-bottom: 24px;
`;
