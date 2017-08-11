// @flow
// $FlowFixMe
import styled from 'styled-components';
import { Button } from '../../components/buttons';
import { Shadow, hexa } from '../../components/globals';

export const OnboardingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;

export const OnboardingContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  padding: 32px;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
`;

export const OnboardingNav = styled.div`
  display: flex;
  flex: none;
  justify-content: space-between;
  align-self: flex-end;
  width: 100%;
  border-top: 2px solid ${props => props.theme.border.default};
  background: ${props => props.theme.bg.default};
  padding: 16px;
  position: relative;
  z-index: 3;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${props => props.theme.text.alt};
`;

export const Title = styled.h1`
  color: ${props => props.theme.text.default};
  width: 100%;
  line-height: 1.2;
  padding: 0;
  text-align: center;
  letter-spacing: 0.2px;
  font-size: 40px;
  font-weight: 900;
  letter-spacing: 0.3px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;
export const Subtitle = styled.h2`
  width: 100%;
  max-width: 640px;
  color: ${props => props.theme.text.alt};
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  margin-bottom: 16px;
  padding: 0 32px;
  text-align: center;
`;

export const Emoji = styled.h3`
  font-size: 64px;
  margin-bottom: 16px;
`;

export const ContinueButton = styled(Button)`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.text.reverse};
  padding: 16px 88px;
  max-width: 100%;
  box-shadow: ${props =>
    `${Shadow.high} ${hexa(props.theme.bg.reverse, 0.15)}`};
  margin-top: 16px;
`;
