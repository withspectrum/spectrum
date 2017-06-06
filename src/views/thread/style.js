import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from '../../components/card';
import Markdown from '../../components/markdown';
import Column from '../../components/column';
import {
  FlexCol,
  FlexRow,
  H1,
  H3,
  H4,
  Transition,
  hexa,
} from '../../components/globals';

export const RouteWrapper = styled(FlexRow)`
  flex: 1 1 auto;
  align-items: flex-start;
`;

export const DetailViewWrapper = styled(FlexRow)`
  background-image: ${({ theme }) => `linear-gradient(to right, ${theme.bg.wash}, ${theme.bg.default} 15%, ${theme.bg.default} 85%, ${theme.bg.wash})`};
  flex: 1 1 auto;
  justify-content: center;
  align-items: flex-start;

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
  flex: 1 1 auto;
  overflow-y: scroll;

  @media (max-width: 768px) {

    padding-top: 16px;
  }
`;

export const DetailColumn = styled(Column)`
  align-self: stretch;
  margin: 0;
`;

export const ThreadWrapper = styled(FlexCol)`
  padding: 16px 32px;
  font-size: 14px;
  flex: 1 0 auto;
`;

export const ThreadHeading = styled(H1)`
  font-size: 32px;

  @media (max-width: 768px) {
    margin-top: 8px;
  }
`;

export const ContextRow = styled(FlexRow)`
  justify-content: space-between;
  align-items: flex-start;
  align-content: flex-start;
`;

export const EditDone = styled.div`
  position: relative;
`;

export const DropWrap = styled(FlexCol)`
  width: 32px;
  height: 32px;
  position: relative;
  color: ${({ theme }) => theme.text.placeholder};
  transition: ${Transition.hover.off};

  &:hover {
    color: ${({ theme }) => theme.border.default};
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

export const FlyoutRow = styled(FlexRow)`
  padding: 8px;
`;

export const Byline = styled(Link)`
  font-weight: 500;
  color: ${({ theme }) => theme.brand.alt};
  display: flex;
  margin-bottom: 16px;
  align-items: center;

  &:hover h3{
    color: ${({ theme }) => theme.brand.alt};
  }
`;

export const BylineMeta = styled(FlexCol)`
  margin-left: 16px;

  @media (max-width: 768px) {
    margin-left: 8px;
  }
`;

export const AuthorAvatar = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 100%;
  object-fit: cover;
  cursor: pointer;
  box-shadow: 0 0 2px 0 ${({ theme }) => hexa(theme.text.default, 0.2)};

  @media (max-width: 768px) {
    height: 40px;
    width: 40px;
  }
`;

export const AuthorName = styled(H3)`
  font-weight: 700;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const AuthorUsername = styled(H4)`
  color: ${({ theme }) => theme.text.alt};
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const Location = styled(FlexRow)`
  font-weight: 500;
  color: ${({ theme }) => theme.text.alt};
  font-size: 14px;
  margin-top: 8px;

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

export const Edited = styled.div`
  display: block;
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.text.alt};
`;

export const ChatWrapper = styled.div`
  width: 100%;
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

export const ThreadContent = styled(Markdown)`
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.5rem;
`;

export const ChatInputWrapper = styled(FlexCol)`
  width: 100%;
  align-items: stretch;
  flex: 0 0 auto;

  > div {
    ${/* background-color: ${({ theme }) => theme.bg.default}; */ ''}
    background-image: ${({ theme }) => `linear-gradient(to right, ${hexa(theme.bg.wash, 0.01)}, ${hexa(theme.bg.wash, 0.25)} 2%, ${hexa(theme.bg.wash, 0.25)} 98%, ${hexa(theme.bg.wash, 0.01)})`};

    > form > div {
      background-color: ${({ theme }) => theme.bg.default};
    }
  }
`;
