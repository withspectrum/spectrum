import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from '../../components/card';
import Markdown from '../../components/markdown';
import { FlexCol, FlexRow, H1, Transition } from '../../components/globals';

export const Container = styled(Card)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media (max-width: 768px) {
    min-height: 100vh;
  }
`;

export const ThreadWrapper = styled(FlexCol)`
  padding: 24px 32px 16px 32px;
  font-size: 14px;
`;

export const ThreadHeading = styled(H1)`

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
  display: block;
  margin-bottom: 16px;

  &:hover {
    text-decoration: underline;
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

  @media (max-width: 768px) {
    padding-bottom: 112px;
  }
`;

export const ThreadTitle = {
  fontSize: '20px',
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

  @media (max-width: 768px) {
    position: fixed;
    bottom: 48px;
    left: 0;
    right: 0;
  }
`;
