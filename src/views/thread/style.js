import styled, { css } from 'styled-components';
import { Avatar } from '../../components/avatar';
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

export const View = styled(FlexCol)`
  ${props =>
    !props.slider &&
    css`
      background-image: linear-gradient(to right, ${props.theme.bg
        .wash}, ${props.theme.bg.default} 10%, ${props.theme.bg
      .default} 90%, ${props.theme.bg.wash});
    `}
  flex: auto;
  align-items: stretch;
  overflow-y: scroll;

  @media (max-width: 1024px) {
    background-color: ${({ theme }) => theme.bg.default};
    background-image: none;
  }
`;

export const Content = styled(FlexRow)`
  justify-content: center;
  align-items: flex-start;
  flex: auto;
  overflow-y: scroll;
  padding-top: 32px;

  @media (max-width: 768px) {
    padding-top: 16px;
  }
`;

export const Input = styled(FlexRow)`
  flex: none;
  justify-content: center;
  z-index: 1003;
`;

export const Detail = styled(Column)`
  flex: auto;
  margin: 0;
`;

export const ChatInputWrapper = styled(Column)`
  align-self: stretch;
  align-items: stretch;
  margin: 0;
  flex: auto;

  > div {
    background-image: ${({ theme }) =>
      `linear-gradient(to right, ${hexa(theme.bg.wash, 0.01)}, ${hexa(
        theme.bg.wash,
        0.25
      )} 2%, ${hexa(theme.bg.wash, 0.25)} 98%, ${hexa(theme.bg.wash, 0.01)})`};

    > form > div {
      background-color: ${({ theme }) => theme.bg.default};
    }
  }
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
  padding: 16px 32px;
  font-size: 14px;
  flex: 1 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
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

export const EditDone = styled.div`position: relative;`;

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

export const Byline = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.brand.alt};
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  flex: auto;

  &:hover h3 {
    color: ${({ theme }) => theme.brand.alt};
  }
`;

export const BylineMeta = styled(FlexCol)`
  margin-left: 12px;

  @media (max-width: 768px) {
    margin-left: 8px;
  }
`;

export const AuthorAvatar = styled(Avatar)`
  cursor: pointer;
`;

export const AuthorName = styled(H3)`
  font-weight: 700;
  cursor: pointer;
  max-width: 100%;

  @media (max-width: 768px) {
    font-size: 14px;
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
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.text.alt};
`;

export const Edited = styled(Timestamp)`
  margin-left: 4px;
`;

export const ChatWrapper = styled.div`width: 100%;`;

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
