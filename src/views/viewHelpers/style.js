// @flow
import styled, { css } from 'styled-components';
import theme from 'shared/theme';
import { MEDIA_BREAK } from 'src/components/layout';

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

export const ActionsRow = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 32px;

  button {
    display: flex;
    flex: 1 0 auto;
    width: 100%;
  }
`;

export const CardStyles = css`
  background: ${theme.bg.default};
  border: 1px solid ${theme.bg.border};
  border-radius: 4px;
`;

export const Card = styled.div`
  ${CardStyles};
  padding: 16px;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid ${theme.bg.border};
  }
`;

export const Stretch = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
