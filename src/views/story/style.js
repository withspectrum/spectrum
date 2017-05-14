import styled from 'styled-components';
import Card from '../../components/card';
import { FlexCol, FlexRow, H1 } from '../../components/globals';

export const Container = styled(Card)`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const StoryWrapper = styled(FlexCol)`
  padding: 24px 32px 16px 32px;
  font-size: 14px;
`;

export const StoryHeading = styled(H1)`

`;

export const Byline = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.brand.alt};
`;

export const StoryContent = styled.div`
  margin-top: 16px;
  font-size: 16px;
`;
