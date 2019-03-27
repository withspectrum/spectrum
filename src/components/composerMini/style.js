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
