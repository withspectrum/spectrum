// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { MEDIA_BREAK } from 'src/components/layout';

export const Container = styled.div`
  border-bottom: 1px solid ${theme.bg.border};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 12px 20px 12px 12px;
  position: relative;

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const BodyContainer = styled.div`
  width: 100%;
  padding-left: 48px;
  padding-right: 8px;
  margin-top: 8px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  div,
  textarea {
    line-height: 1.4 !important;
    word-break: break-word;
  }
`;
