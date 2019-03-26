// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { MEDIA_BREAK } from 'src/components/layout';

export const MarkdownHintContainer = styled.div`
  width: 100%;
  background: ${theme.bg.default};
`;

export const StyledMarkdownHint = styled.div`
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-start;
  margin-left: 56px;
  font-size: 11px;
  color: ${theme.text.alt};
  line-height: 1;
  padding: 6px 0;
  opacity: ${({ showHint }) => (showHint ? 1 : 0)};
  transition: opacity 200ms ease-in-out;
  b {
    font-weight: 600;
  }
  i,
  b,
  code {
    margin-right: 3px;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const Preformatted = styled.code`
  background-color: ${theme.bg.wash};
  border: 1px solid ${theme.bg.border};
  white-space: nowrap;
  border-radius: 2px;
`;
