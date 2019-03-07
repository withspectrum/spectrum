// @flow
import styled, { css } from 'styled-components';
import theme from 'shared/theme';
import { Link } from 'react-router-dom';
import { tint, Truncate } from 'src/components/globals';
import {
  PRIMARY_COLUMN_WIDTH,
  MEDIA_BREAK,
  MAX_WIDTH,
  SECONDARY_COLUMN_WIDTH,
} from 'src/components/Layout';
import { CardStyles } from 'src/views/ViewHelpers';

export const OneColumnGrid = styled.section`
  display: grid;
  grid-template-columns: ${PRIMARY_COLUMN_WIDTH}px;
  grid-template-rows: 100%;
  max-width: ${MAX_WIDTH}px;

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;
    grid-gap: 0;
  }
`;

export const ListItem = styled(Link)`
  padding: 12px 12px 12px 16px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${theme.bg.divider};

  &:last-of-type {
    border-bottom: 0;
  }

  &:hover {
    background: ${theme.bg.wash};
  }

  .icon {
    color: ${theme.text.alt};
  }
`;

export const ListItemContent = styled.div`
  display: flex;
  align-items: center;

  .icon {
    color: ${theme.text.secondary};
    margin-right: 6px;
    position: relative;
    top: 1px;
  }
`;

export const ListItemLabel = styled.div`
  color: ${theme.text.default};
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  vertical-align: middle;
  display: flex;
  align-items: center;
  display: inline-block;
  ${Truncate};
`;

export const Main = styled.section`
  background: ${theme.bg.default};
  border-left: 1px solid ${theme.bg.border};
  border-right: 1px solid ${theme.bg.border};
  border-bottom: 1px solid ${theme.bg.border};
  border-radius: 0 0 4px 4px;
  height: 100%;
  min-width: 100%;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
  }
`;

export const Sidebar = styled.section`
  height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  position: sticky;
  top: 0;
  padding-bottom: 64px;
  padding-right: 16px;

  @media (max-width: ${MEDIA_BREAK}px) {
    height: auto;
    display: none;
  }
`;

export const SidebarSection = styled.section`
  background: ${theme.bg.default};
  border: 1px solid ${theme.bg.border};
  margin-top: 16px;
  border-radius: 4px;

  @media (max-width: ${MEDIA_BREAK}px) {
    border: 0;
    margin-top: 0;

    &:last-of-type {
      border-bottom: 1px solid ${theme.bg.border};
    }

    &:not(:first-of-type) {
      border-top: 1px solid ${theme.bg.border};
    }
  }
`;

export const SidebarSectionHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.bg.border};
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  position: sticky;
  top: 0;
  background: ${theme.bg.default};
  z-index: 11;
  border-radius: 4px 4px 0 0;

  a {
    display: flex;
    align-items: center;
    color: ${theme.text.alt};

    &:hover {
      color: ${theme.text.default};
    }
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    z-index: 1;
    background: ${theme.bg.wash};
    border-bottom: 1px solid ${theme.bg.border};
    padding: 24px 16px 8px 16px;
    position: relative;
  }
`;

export const SidebarSectionHeading = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${theme.text.default};

  @media (max-width: ${MEDIA_BREAK}px) {
    font-size: 14px;
    font-weight: 600;
    color: ${theme.text.secondary};
  }
`;

export const FeedsContainer = styled.section``;

export const Row = styled.div`
  display: flex;
`;

export const ToggleNotificationsContainer = styled.div`
  display: flex;
  color: ${theme.text.alt};
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
`;

export const Name = styled.div`
  color: ${theme.text.default};
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  vertical-align: middle;
  display: flex;
  align-items: center;
  display: inline-block;
  ${Truncate};
`;

export const NameWarn = styled.div`
  color: ${theme.warn.default};
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  vertical-align: middle;
  display: flex;
  align-items: center;
  display: inline-block;
  ${Truncate};
`;

export const CenteredContainer = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

export const WatercoolerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WatercoolerMessages = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (max-width: ${MEDIA_BREAK}px) {
    overflow-x: hidden;
  }
`;

export const WatercoolerChatInput = styled.div`
  position: sticky;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const PreviousMessagesLoading = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: ${theme.bg.default};
  color: ${theme.text.secondary};
  min-height: 48px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0 0 4px 4px;
  overflow: hidden;
`;

export const PrivateCommunityWrapper = styled.div`
  ${CardStyles};
`;

export const ActionsRow = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 32px;

  button {
    display: flex;
    flex: 1 0 auto;
    width: 100%;
  }
`;

export const Emoji = styled.span`
  font-size: 40px;
  margin-bottom: 16px;
`;

export const Heading = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${theme.text.default};
`;
export const Description = styled.p`
  margin-top: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  color: ${theme.text.secondary};
`;
