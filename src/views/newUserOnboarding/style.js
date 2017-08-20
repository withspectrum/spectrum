// @flow
// $FlowFixMe
import styled from 'styled-components';
import { Button } from '../../components/buttons';
import { Shadow, hexa, zIndex } from '../../components/globals';

export const OnboardingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-y: scroll;
  padding-top: 32px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;

export const OnboardingContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  padding: 32px;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
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
  margin: 32px auto 0;
`;

export const CreateUpsellContainer = styled.div`
  margin-top: 32px;
  background: ${props => props.theme.bg.wash};
  padding: ${props => (props.extra ? '32px 32px 116px' : '32px')};
  border-top: 2px solid ${props => props.theme.border.default};
  width: calc(100% + 64px);
  margin-bottom: -32px;
  margin-left: -32px;
  margin-right: -32px;
`;

export const StickyRow = styled.div`
  width: 100%;
  flex: 1 0 100%;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  padding: 16px;
  position: fixed;
  bottom: ${props => (props.hasJoined ? '0' : '-200px')};
  opacity: ${props => (props.hasJoined ? '1' : '0')};
  pointer-events: ${props => (props.hasJoined ? 'auto' : 'none')};
  left: 0;
  right: 0;
  background: ${props => props.theme.bg.default};
  border-top: 2px solid ${props => props.theme.border.default};
  z-index: ${zIndex.fullscreen + 1};
  transition: all 0.3s ease-in-out;
  -webkit-transform: translate3d(0, 0, 0);
`;
