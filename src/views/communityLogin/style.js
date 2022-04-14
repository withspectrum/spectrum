// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { zIndex } from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';

export const Title = styled.h1`
  color: ${theme.text.default};
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
  color: ${theme.text.alt};
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  margin-bottom: 16px;
  padding: 0 32px;
  text-align: center;
  white-space: pre-wrap;

  b {
    font-weight: 700;
  }

  a {
    color: ${theme.brand.default};
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
  color: ${theme.text.alt};
  font-weight: 500;
  border-top: 2px solid ${theme.bg.wash};
  margin-top: 40px;
  width: 100%;
`;

export const SigninLink = styled.span`
  color: ${theme.brand.default};
  margin-left: 6px;
  cursor: pointer;
`;

export const FullscreenContent = styled.div`
  width: 100%;
  max-width: ${MEDIA_BREAK}px;
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
  color: ${theme.text.alt};
  border-radius: 8px;
  margin-top: 64px;
  margin-left: 32px;
  margin-right: 32px;
  text-align: center;
  position: relative;
  z-index: ${zIndex.card + 1};

  a {
    color: ${theme.brand.default};
    font-weight: 600;
  }
`;
