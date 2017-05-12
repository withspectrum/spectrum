// @flow
// $FlowFixMe
import styled from 'styled-components';
import { Card } from '../card';

export const UpsellSignInContainer = styled(Card)`
  padding: 16px 16px 28px;
  margin-bottom: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.h1`
  color: ${props => props.theme.text.default};
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.25;
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-size: 24px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

export const Subtitle = styled.h2`
color: ${props => props.theme.text.default};
font-weight: 400;
font-size: 0.875rem;
line-height: 1.4;
margin-bottom: 24px;
padding: 0 24px;
font-size: 18px;
line-height: 24px;
color: inherit;
font-weight: 500;
text-align: center;
`;

export const BGOne = styled.img`
  position: absolute;
  z-index: 1;
  width: 80px;
  opacity: 0.1;
  right: 0;
  top: 0;
`;

export const BGTwo = styled.img`
  position: absolute;
  z-index: 1;
  opacity: 0.1;
  left: 0;
  top: 0;
  width: 80px;
`;
