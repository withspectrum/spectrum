import styled from 'styled-components';
import Card from '../card';

export const StyledCommunityProfileCard = styled(Card)`
  padding: 16px;
  margin-bottom: 16px;
  flex-direction: column;
`;

export const Title = styled.h2`
  font-weight: 700;
  font-size: 14px;
  line-height: 1.4;
  color: ${props => props.theme.text.default};
`;

export const Description = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: ${props => props.theme.text.alt};
`;
