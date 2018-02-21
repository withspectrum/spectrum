// @flow
import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 16px 48px 32px 48px;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin: 16px 0 8px;
  text-align: center;
`;

export const Subtitle = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  text-align: center;
  margin-bottom: 16px;
`;
