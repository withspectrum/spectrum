import styled from 'styled-components';
import Card from '../../components/card';
import { FlexCol, FlexRow, H1, Transition } from '../../components/globals';

export const Container = styled(Card)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const StoryWrapper = styled(FlexCol)`
  padding: 24px 32px 16px 32px;
  font-size: 14px;
`;

export const StoryHeading = styled(H1)`

`;

export const ContextRow = styled(FlexRow)`
  justify-content: space-between;
  align-items: center;
`;

export const DropWrap = styled.div`
  width: 32px;
  height: 32px;
  position: relative;
  color: ${({ theme }) => theme.text.placeholder};
  transition: ${Transition.hover.off};

  &:hover {
    color: ${({ theme }) => theme.brand.default};
    transition: ${Transition.hover.on};
  }

  .dropdown {
    opacity: 0;
    pointer-events: none;
    transition: ${Transition.hover.off};

    @media (max-width: 768px) {
      display: none;
    }
  }

  &:hover .dropdown,
  .dropdown:hover {
    opacity: 1;
    pointer-events: auto;
    transition: ${Transition.hover.on};

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

export const FlyoutRow = styled(FlexRow)`
  padding: 8px;
`;

export const Byline = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.brand.alt};
`;

export const StoryContent = styled.div`
  margin-top: 16px;
  font-size: 16px;
`;

export const ChatWrapper = styled.div`
  width: 100%;
`;
