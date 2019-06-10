// @flow
import styled, { css } from 'styled-components';
import theme from 'shared/theme';
import { Link } from 'react-router-dom';
import { Truncate, tint } from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';
import { CardStyles } from 'src/views/viewHelpers';

const listItemStyles = css`
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
export const ListItem = styled.div`
  ${listItemStyles};
`;
export const ListItemLink = styled(Link)`
  ${listItemStyles};
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

export const SidebarSection = styled.section`
  background: ${theme.bg.default};
  border: 1px solid ${theme.bg.border};
  margin-top: 24px;
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
    flex: none;
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
  display: flex;
  flex: 1 0 auto;
  padding-right: 16px;

  @media (max-width: ${MEDIA_BREAK}px) {
    font-size: 14px;
    font-weight: 600;
    color: ${theme.text.secondary};
  }
`;

export const FeedsContainer = styled.section`
  display: flex;
  flex-direction: column;
  background: ${theme.bg.default};
`;

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

export const List = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0 0 4px 4px;
  overflow: hidden;
`;

export const PrivateCommunityWrapper = styled.div`
  ${CardStyles};
  padding: 16px;
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

export const PostsFeedsSelectorContainer = styled.div`
  padding: 8px 16px;
  border-bottom: 1px solid ${theme.bg.border};
  background: ${theme.bg.wash};
  display: flex;
  justify-content: space-between;
`;

export const SearchInput = styled.input`
  font-size: 15px;
  border: none;
  border: 1px solid ${theme.bg.border};
  -webkit-appearance: none;
  border-radius: 32px;
  padding: 8px 16px;
  color: ${theme.text.default};
  font-weight: 600;
  width: 100%;
  max-width: 240px;
  transition: all 0.2s ease-in-out;

  &:focus {
    box-shadow: 0 0 0 2px ${theme.bg.default}, 0 0 0 4px ${theme.bg.border};
    transition: all 0.2s ease-in-out;
  }

  &:active {
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${tint(theme.bg.border, -24)};
    transition: box-shadow 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    font-size: 16px;
  }
`;

export const FeedsStretch = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;

  display: grid;
  grid-template-columns: minmax(min-content, 1fr);
  grid-template-rows: 1fr;
  width: 100%;
  align-items: flex-end;

  @media (max-width: ${MEDIA_BREAK}px) {
    /* account for fixed position chat input */
    padding-bottom: 56px;
    grid-template-rows: 1fr;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${theme.bg.wash};
  padding-bottom: 64px;
`;

export const NewActivityDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: ${theme.warn.default};
  align-self: center;
  margin-right: 16px;
`;
