// @flow
// $FlowFixMe
import styled from 'styled-components';
import { zIndex } from 'src/components/globals';

export const Title = styled.h1`
  color: ${props => props.theme.text.default};
  width: 100%;
  font-weight: 600;
  font-size: 32px;
  line-height: 1.25;
  margin-top: 24px;
  margin-bottom: 8px;
  padding: 0;
  text-align: center;
`;

export const Subtitle = styled.h2`
  width: 100%;
  color: ${props => props.theme.text.alt};
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  margin-bottom: 16px;
  padding: 0 32px;
  text-align: center;

  b {
    font-weight: 700;
  }

  a {
    color: ${props => props.theme.brand.default};
  }

  li {
    margin-top: 8px;
    list-style-type: none;
  }
`;

export const LoginImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  margin-top: 32px;
`;

export const SignupFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  font-weight: 500;
  border-top: 2px solid ${props => props.theme.bg.wash};
  margin-top: 40px;
  width: 100%;
`;

export const SigninLink = styled.span`
  color: ${props => props.theme.brand.default};
  margin-left: 6px;
  cursor: pointer;
`;

export const FullscreenContent = styled.div`
  width: 100%;
  max-width: 768px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 32px 16px;
  flex: 1 0 auto;
`;

export const CodeOfConduct = styled.p`
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  border-radius: 8px;
  margin-top: 64px;
  margin-left: 32px;
  margin-right: 32px;
  text-align: center;
  position: relative;
  z-index: ${zIndex.card + 1};

  a {
    color: ${props => props.theme.brand.default};
    font-weight: 600;
  }
`;
