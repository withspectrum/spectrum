// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { UserAvatar } from 'src/components/avatar';
import { MEDIA_BREAK, TITLEBAR_HEIGHT } from 'src/components/layout';
import {
  Truncate,
  FlexCol,
  FlexRow,
  H3,
  H4,
  P,
  hexa,
  zIndex,
} from 'src/components/globals';

export const ThreadsListScrollContainer = styled.div`
  height: calc(100vh - ${TITLEBAR_HEIGHT}px);
  background: ${theme.bg.default};
`;

export const Wrapper = styled(FlexCol)`
  flex: 0 0 auto;
  justify-content: center;
  max-width: 100%;
  min-height: 64px;
  position: relative;
  background: ${props =>
    props.active
      ? theme.bg.wash
      : props.isUnread
      ? hexa(theme.brand.default, 0.04)
      : theme.bg.default};
  border-bottom: 1px solid ${theme.bg.divider};
  box-shadow: ${props =>
    props.active
      ? `inset 2px 0 0 ${props.theme.text.placeholder}`
      : props.isUnread
      ? `inset 2px 0 0 ${props.theme.brand.default}`
      : 'none'};

  &:hover {
    cursor: pointer;
    background: ${theme.bg.wash};
  }
`;

export const WrapperLink = styled(Link)`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 16px 12px 16px 16px;
`;

export const Col = styled(FlexCol)`
  flex: 1;
`;

export const Row = styled(FlexRow)`
  flex: 1 0 auto;
  align-items: center;
  max-width: 100%;

  a {
    display: flex;
    align-items: center;
  }
`;

export const Heading = styled(H3)`
  font-weight: 700;
`;

export const Meta = styled(H4)`
  font-size: 15px;
  font-weight: 400;
  color: ${theme.text.alt};

  ${props => (props.nowrap ? Truncate() : '')};
`;

export const Description = styled(P)`
  margin-top: 8px;
  font-weight: 400;
  color: ${theme.text.default};
`;

export const MessageGroupTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 calc(100% - 64px);
  overflow: hidden;
  position: relative;
  top: -1px;
`;

export const MessageGroupByline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;

export const Usernames = styled.span`
  display: flex;
  overflow: hidden;
  flex-wrap: nowrap;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: ${theme.text.default};
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1px;
  font-size: 15px;
  flex: 1 1 100%;

  p {
    ${Truncate()};
  }
`;

export const Timestamp = styled.span`
  font-size: 14px;
  text-align: right;
  color: ${theme.text.alt};
  padding-right: 4px;
  display: inline-block;
  flex: 1 0 auto;
  margin-left: 8px;
`;

export const Snippet = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: ${theme.text.secondary};
  padding-right: 4px;
  display: inline-block;
  line-height: 1.3;
  margin-top: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AvatarContainer = styled.div`
  margin-right: 16px;
  width: 44px;
  height: 44px;
  position: relative;

  img {
    box-shadow: 0 0 0 2px #fff;
  }
`;

export const TwoAvatarContainer = styled(AvatarContainer)`
  width: 60px;
  height: 60px;
  position: relative;

  span {
    margin: 1px;

    &:first-child {
      position: absolute;
      z-index: ${zIndex.avatar};
      top: 4px;
      left: 0;
    }

    &:last-child {
      position: absolute;
      z-index: ${zIndex.avatar + 1};
      bottom: 4px;
      right: 0;
    }
  }
`;

export const TwoAvatarWrap = styled(AvatarContainer)`
  &:first-child {
    position: absolute;
    z-index: ${zIndex.avatar};
    top: 4px;
    left: 0;
    width: 34px;
    height: 34px;
  }

  &:last-child {
    position: absolute;
    z-index: ${zIndex.avatar + 1};
    bottom: 4px;
    right: 0;
    margin: 0;
    width: 34px;
    height: 34px;
  }
`;

export const ThreeAvatarContainer = styled(AvatarContainer)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  img {
    margin: 1px;

    &:last-child {
      margin-top: 0;
    }
  }
`;

export const Remainder = styled.span`
  border-radius: 19px;
  width: 19px;
  height: 19px;
  padding: 0 2px;
  font-size: 9px;
  font-weight: 700;
  color: ${theme.text.alt};
  background: ${theme.bg.wash};
  margin: 2px 1px 1px 2px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ComposerInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  display: block;
`;

export const Grow = styled.div`
  position: relative;
  flex: 1 1 auto;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  height: 100%;
`;

export const ComposerInput = styled.input`
  font-size: 16px;
  padding: 15px 16px;
  width: 100%;
  border-bottom: 1px solid ${theme.bg.border};
  position: relative;
  z-index: ${zIndex.search};

  @media (max-width: ${MEDIA_BREAK}px) {
    padding: 20px 16px;
  }
`;

export const SearchSpinnerContainer = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  z-index: ${zIndex.loading};
`;

export const SearchResultsDropdown = styled.ul`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: ${props => (props.moved ? '104px' : '60px')};
  left: 8px;
  display: inline-block;
  width: 320px;
  max-height: 420px;
  overflow-y: auto;
  z-index: ${zIndex.dropDown};

  @media (max-width: ${MEDIA_BREAK}px) {
    width: 100%;
    left: 0;
    border-radius: 0 0 8px 8px;
  }
`;

export const SearchResult = styled.li`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${theme.bg.border};
  background: ${props => (props.focused ? props.theme.bg.wash : '#fff')};
  width: 100%;
  ${Truncate()} padding: 8px 16px 8px 8px;

  &:only-child {
    border-bottom: none;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${theme.bg.wash};
    cursor: pointer;
  }
`;

export const SearchResultImage = styled(UserAvatar)``;

export const SearchResultTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  margin-left: 12px;
`;

export const SearchResultDisplayName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.text.default};
  line-height: 1.4;
`;

export const SearchResultUsername = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${theme.text.alt};
  line-height: 1.4;
`;

export const SearchResultNull = styled.p`
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.text.alt};
`;

export const SelectedUsersPills = styled.ul`
  position: relative;
  width: 100%;
  font-size: 16px;
  padding: 9px 12px;
  width: 100%;
  background: #fff;
`;

export const Pill = styled.li`
  list-style-type: none;
  display: inline-block;
  font-size: 14px;
  background: ${props =>
    props.selected
      ? props.theme.brand.default
      : hexa(props.theme.brand.default, 0.1)};
  box-shadow: inset 0 0 1px rgba(123, 22, 255, 0.15);
  color: ${props =>
    props.selected ? props.theme.bg.default : props.theme.brand.default};
  border-radius: 4px;
  padding: 2px 12px;
  margin-right: 4px;
`;

export const StyledHeader = styled.div`
  display: flex;
  flex: ${props => (props.fill ? '1 0 auto' : '0 0 auto')};
  justify-content: center;
  align-items: center;
  align-self: ${props => (props.fill ? 'center' : 'flex-start')};
  flex-direction: column;
  width: 100%;
  background: ${props => (props.wash ? props.theme.bg.wash : '#fff')};
  padding: 32px;
  padding-bottom: 0;
`;

export const PhotosContainer = styled.div`
  display: block;
  padding: 8px 0;
`;

export const PhotoWrapper = styled.span`
  margin: 0 6px;
  display: inline-block;
`;

export const Photo = styled(UserAvatar)`
  border: 1px solid #fff;
`;

export const Names = styled.h2`
  display: block;
  font-weight: 800;
  font-size: 24px;
  color: ${theme.text.default};
  text-align: center;
  line-height: 1.4;
`;

export const Username = styled.h3`
  display: block;
  font-weight: 500;
  font-size: 14px;
  color: ${theme.text.alt};
  margin: 0;
  display: flex;
`;

export const MessagesScrollWrapper = styled.div`
  width: 100%;
  padding-top: 24px;
`;
