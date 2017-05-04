import styled from 'styled-components';
import Card from '../card';

export const StyledStoryFeedCard = styled(Card)`
  padding: 16px;
  margin-bottom: 16px;
`;

export const Title = styled.h2`
  font-weight: 800;
  font-size: 20px;
  line-height: 1.4;
  color: ${props => props.theme.text.default};
  margin-bottom: 16px;
`;

export const Description = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: ${props => props.theme.text.default};
`;

export const Meta = styled.span`

`;
