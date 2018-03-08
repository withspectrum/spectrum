// @flow
import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 16px;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin: 0;
`;

export const Subtitle = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  margin-bottom: 16px;
`;
