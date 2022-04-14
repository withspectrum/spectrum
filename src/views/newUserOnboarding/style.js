// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { PrimaryButton, TextButton } from 'src/components/button';
import { MEDIA_BREAK } from 'src/components/layout';

export const ContinueButton = styled(PrimaryButton)`
  font-size: 17px;
  font-weight: 600;
  padding: 12px 16px;
  flex: 1;
  max-width: 100%;
  margin: 16px auto 64px;
`;

export const LogOutButton = styled(TextButton)`
  flex: 1;
  color: ${theme.text.alt};
`;
export const Emoji = styled.span`
  font-size: 40px;
  margin-bottom: 16px;
`;

export const Heading = styled.h3`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 8px;
  color: ${theme.text.default};
`;

export const Description = styled.p`
  margin-top: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  color: ${theme.text.secondary};
  padding-right: 24px;
`;

export const Card = styled.div`
  background: ${theme.bg.wash};
  padding: 16px;
  text-align: center;
  max-width: 480px;
  justify-self: center;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid ${theme.bg.border};
  }
`;
