// @flow
// $FlowFixMe
import styled, { css } from 'styled-components';
import { Card } from '../card';

const containerBase = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const UpsellSignInContainer = styled(Card)`
  padding: 16px 16px 28px;
  margin-bottom: 16px;
  ${containerBase}
`;

export const UpsellJoinContainer = styled(Card)`
  padding: 16px 16px 28px;
  margin-top: 16px;
  ${containerBase}
`;

export const UpsellFourOhFourContainer = styled(Card)`
  padding: 32px;
  margin: 32px auto;
  width: 100%;
  max-width: 560px;
  overflow: hidden;
  ${containerBase}
`;

export const Title = styled.h1`
  color: ${props => props.theme.text.default};
  width: 100%;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.25;
  margin: 8px 0;
  padding: 0;
  font-weight: 700;
  font-size: 24px;
  text-align: center;
`;

export const Subtitle = styled.h2`

width: 100%;
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

  b {
    font-weight: 600
  }

  a {
    color: ${props => props.theme.brand.default}
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    margin: 0 8px;
  }
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

export const FourOhFourImage = styled.img`
  position: absolute;
  z-index: 1;
  opacity: 0.2;
  right: -32px;
  bottom: -96px;
  width: 200px;
`;
