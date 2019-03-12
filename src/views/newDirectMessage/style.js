// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { zIndex, hexa } from 'src/components/globals';
import { MEDIA_BREAK, MAX_WIDTH } from 'src/components/layout';

export const Container = styled.div`
  grid-area: view;
  display: flex;
  justify-content: center;
  z-index: ${zIndex.slider + 1};
  position: sticky;
  top: 0;
  align-items: center;
  justify-content: center;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.24);
  z-index: ${zIndex.slider + 2};
`;

export const ComposerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  max-height: 90vh;
  width: 100%;
  max-width: 500px;
  border-radius: 4px;
  background: ${theme.bg.wash};
  z-index: ${zIndex.slider + 3};
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;

  @media (max-width: ${MEDIA_BREAK}px) {
    max-height: 100vh;
    max-width: 100vw;
    position: fixed;
    top: 0;
    height: 100vh;
    border-radius: 0;
  }
`;

export const CloseButton = styled.span`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.bg.reverse};
  color: ${theme.text.reverse};
  z-index: ${zIndex.slider + 4};
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const ChatInputWrapper = styled.div`
  bottom: 0;
  width: calc(100% + 2px); /* hide left and right borders */
  position: sticky;
  left: -1px;
  border-radius: 0 0 4px 4px;
  z-index: 100;
`;

export const MessagesScrollWrapper = styled.div`
  /* height of container minus titlebar minus chat input */
  height: 100%;
  max-height: calc(100% - 62px - 58px);
  overflow: hidden;
  overflow-y: scroll;
  background: ${theme.bg.default};
`;

export const LoadingMessagesWrapper = styled(MessagesScrollWrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.bg.wash};
`;

export const NullMessagesWrapper = styled(MessagesScrollWrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.bg.wash};
`;

export const SearchInputWrapper = styled.div`
  background: ${theme.bg.default};
  border-bottom: 1px solid ${theme.bg.border};
`;

export const SearchInput = styled.input`
  background: ${theme.bg.default};
  font-size: 16px; /* has to be 16px to avoid zoom on iOS */
  display: block;
  width: 100%;
  padding: 16px;
`;

export const SearchResultsWrapper = styled.div`
  /* height of container minus titlebart */
  height: 100%;
  max-height: calc(100% - 62px);
  overflow: hidden;
  overflow-y: scroll;
  background: ${theme.bg.default};
`;

export const SelectedPillsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid ${theme.bg.border};
  padding: 12px 16px;
  padding-bottom: 4px;
  align-items: center;
  flex: none;
`;

export const Pill = styled.div`
  display: flex;
  border-radius: 24px;
  align-items: center;
  justify-content: space-between;
  color: ${theme.brand.default};
  padding: 2px;
  padding-right: 6px;
  background: ${hexa(theme.brand.default, 0.04)};
  margin-right: 8px;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${hexa(theme.brand.default, 0.08)};
  }

  img {
    margin-right: 12px;
  }

  .icon {
    margin-left: 8px;
  }
`;

export const PillAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 12px;
`;
