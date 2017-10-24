import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import Avatar from '../../components/avatar';
import Column from '../../components/column';
import {
  FlexCol,
  FlexRow,
  H1,
  H3,
  H4,
  Transition,
  zIndex,
} from '../../components/globals';

export const View = styled(FlexCol)`
  background-color: ${({ theme }) => theme.bg.wash};
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
  flex: auto;
  display: flex;
  align-items: center;
  align-self: stretch;
  grid-template-rows: 48px 1fr 64px;
  grid-template-columns: 100%;
  grid-template-areas: 'header' 'body' 'footer';
`;

export const Content = styled(FlexRow)`
  background-color: ${({ theme }) => theme.bg.default};
  box-shadow: -1px 0 0 ${props => props.theme.bg.border},
    1px 0 0 ${props => props.theme.bg.border};
  justify-content: center;
  align-items: flex-start;
  flex: auto;
  overflow-y: scroll;
  grid-area: body;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding-top: 16px;
  }
`;

export const Input = styled(FlexRow)`
  flex: none;
  justify-content: center;
  z-index: ${zIndex.chatInput};
  grid-area: footer;
  width: 100%;
  max-width: 1024px;

  @media (max-width: 768px) {
    z-index: ${zIndex.mobileInput};
  }
`;

export const Detail = styled(Column)`
  flex: auto;
  margin: 0;
  max-width: 100%;
`;

export const ChatInputWrapper = styled(FlexCol)`
  align-self: stretch;
  align-items: stretch;
  margin: 0;
  flex: auto;
  position: relative;
`;

export const DetailViewWrapper = styled(FlexCol)`
  background-image: ${({ theme }) =>
    `linear-gradient(to right, ${theme.bg.wash}, ${theme.bg
      .default} 15%, ${theme.bg.default} 85%, ${theme.bg.wash})`};
  flex: auto;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 768px) {
    background-color: ${({ theme }) => theme.bg.default};
    background-image: none;
  }
`;

export const Container = styled(FlexCol)`
  padding-top: 32px;
  width: 100%;
  justify-content: flex-start;
  align-items: stretch;
  flex: auto;
  overflow-y: scroll;

  @media (max-width: 768px) {
    padding-top: 16px;
  }
`;

export const ThreadWrapper = styled(FlexCol)`
  font-size: 16px;
  flex: none;
  min-width: 320px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ThreadContent = styled.div`padding: 32px;`;

export const ThreadHeading = styled(H1)`
  font-size: 24px;
  font-weight: 500;

  @media (max-width: 768px) {
    margin-top: 8px;
  }
`;

export const ContextRow = styled(FlexRow)`
  justify-content: space-between;
  align-items: flex-start;
  align-content: flex-start;
`;

export const EditDone = styled.div`position: relative;`;

export const DropWrap = styled(FlexCol)`
  width: 32px;
  height: 32px;
  position: relative;
  color: ${({ theme }) => theme.text.placeholder};
  transition: ${Transition.hover.off};

  &:hover {
    color: ${({ theme }) => theme.bg.border};
    transition: ${Transition.hover.on};
  }

  .flyout {
    opacity: 0;
    pointer-events: none;
    transition: ${Transition.hover.off};
  }

  &:hover .flyout,
  .flyout:hover,
  &:active .flyout,
  &.open > .flyout {
    opacity: 1;
    pointer-events: auto;
    transition: ${Transition.hover.on};
  }
`;

export const FlyoutRow = styled(FlexRow)`padding: 8px;`;

export const Byline = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.brand.alt};
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  flex: auto;
`;

export const BylineMeta = styled(FlexRow)`margin-left: 12px;`;

export const AuthorAvatar = styled(Avatar)`cursor: pointer;`;

export const AuthorName = styled(H3)`
  font-weight: 400;
  cursor: pointer;
  max-width: 100%;
  color: ${props => props.theme.text.alt};
  margin-right: 8px;
  font-size: 14px;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const AuthorUsername = styled(H4)`
  color: ${({ theme }) => theme.text.alt};
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const Location = styled(FlexRow)`
  font-weight: 500;
  color: ${({ theme }) => theme.text.alt};
  font-size: 14px;
  margin-top: -16px;
  margin-left: -16px;
  margin-bottom: 16px;
  align-self: flex-start;

  &:hover > div {
    color: ${({ theme }) => theme.brand.alt};
  }

  > div {
    color: ${({ theme }) => theme.text.placeholder};
  }

  > span {
    padding: 0 4px;
    color: ${({ theme }) => theme.text.placeholder};
  }

  > a:hover {
    color: ${({ theme }) => theme.brand.alt};
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Timestamp = styled.span`
  font-weight: 400;
  margin: 8px 0;
  color: ${({ theme }) => theme.text.alt};
  display: inline-block;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const Edited = styled(Timestamp)`margin-left: 4px;`;

export const ChatWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  flex: none;
`;

export const ThreadTitle = {
  fontSize: '32px',
  padding: '0',
  outline: 'none',
  border: '0',
  lineHeight: '1.4',
  fontWeight: '800',
  boxShadow: 'none',
  width: '100%',
  color: '#171A21',
  whiteSpace: 'pre-wrap',
  borderRadius: '12px 12px 0 0',
};

export const ThreadDescription = {
  fontSize: '16px',
  fontWeight: '500',
  width: '100%',
  display: 'inline-block',
  lineHeight: '1.5',
  padding: '0',
  outline: 'none',
  border: '0',
  boxShadow: 'none',
  color: '#171A21',
  whiteSpace: 'pre-wrap',
};

export const ShareLinks = styled.div`
  display: flex;
  margin-top: 24px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ShareButtons = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    margin-top: 24px;
    margin-bottom: 8px;
  }
`;

export const ShareLink = styled.span`
  color: ${props => props.theme.text.alt};
  display: flex;
  align-items: center;
  margin-right: 12px;
  cursor: pointer;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    margin-right: 4px;
  }

  &:hover {
    color: ${props =>
      props.facebook
        ? props.theme.social.facebook.default
        : props.twitter
          ? props.theme.social.twitter.default
          : props.theme.text.default};
  }
`;

export const ShareButton = styled.span`
  display: flex;
  color: ${props => props.theme.text.alt};
  background: ${props => props.theme.bg.wash};
  border: 1px solid ${props => props.theme.bg.border};
  flex: 1;

  a {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 4px 0;
  }

  &:hover {
    background: ${props =>
      props.facebook
        ? props.theme.social.facebook.default
        : props.twitter
          ? props.theme.social.twitter.default
          : props.theme.text.default};
    border: 1px solid
      ${props =>
        props.facebook
          ? props.theme.social.facebook.default
          : props.twitter
            ? props.theme.social.twitter.default
            : props.theme.text.default};
    color: ${props => props.theme.text.reverse};
  }

  &:first-of-type {
    border-radius: 4px 0 0 4px;
    border-right: 0;
  }

  &:last-of-type {
    border-radius: 0 4px 4px 0;
    border-left: 0;
  }
`;

export const CommunityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  padding: 11px 16px;
  flex: auto;
`;
export const CommunityHeaderName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text.default};
  margin-left: 16px;
  margin-right: 8px;
`;
export const CommunityHeaderChannelTag = styled.div`
  color: ${props => props.theme.text.reverse};
  background: ${props => props.theme.warn.alt};
  border-radius: 20px;
  padding: 0 12px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const CommunityHeaderMeta = styled.div`
  display: flex;
  align-items: center;
`;

export const CommunityHeaderLink = styled(Link)`
  display: flex;
  align-items: center;
  flex: auto;
`;

export const PillLink = styled(Link)`
  font-size: 12px;
  box-shadow: 0 0 0 1px ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.wash};
  font-weight: ${props => '400'};
  color: ${props => props.theme.text.alt};
  display: inline-block;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  padding: 4px 8px;
  margin-right: 8px;
  max-height: 24px;
  line-height: 1;
  pointer-events: auto;

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const PillLinkPinned = styled.div`
  background: ${props => props.theme.special.wash};
  border: 1px solid ${props => props.theme.special.border};
  color: ${props => props.theme.special.dark};
  display: flex;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  padding: 4px 8px;
  margin-right: 8px;
  font-size: 12px;
  max-height: 24px;
  line-height: 1;

  .icon {
    top: -1px;
  }
`;

export const PillLabel = styled.span`
  ${props =>
    props.isPrivate &&
    css`
      position: relative;
      top: -2px;
    `};
`;

export const Lock = styled.span`margin-right: 4px;`;
export const PinIcon = styled.span`
  margin-right: 4px;
  margin-left: -2px;
`;

export const ActionBar = styled.div`
  display: flex;
  width: 100%;
  background: ${props => props.theme.bg.wash};
  padding: 16px 32px;
  border-top: 1px solid ${props => props.theme.bg.border};
  border-bottom: 1px solid ${props => props.theme.bg.border};
`;
