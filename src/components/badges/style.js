// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { Gradient } from 'src/components/globals';

export const Span = styled.span`
  display: inline-block;
  color: ${theme.text.reverse};
  background-color: ${theme.text.alt};
  text-transform: uppercase;
  padding: 3px 4px;
  margin-right: 4px;
  font-size: 9px;
  font-weight: 800;
  border-radius: 4px;
  letter-spacing: 0.6px;
  line-height: 1;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.16);
  align-items: center;
  align-self: center;
`;

export const ProBadge = styled(Span)`
  background-color: ${theme.special.default};
  background-image: ${Gradient(theme.special.alt, theme.special.default)};
`;

export const TeamBadge = styled(Span)`
  background-color: ${theme.success.default};
  background-image: ${Gradient(theme.success.alt, theme.success.default)};
`;

export const BlockedBadge = styled(Span)`
  background-color: ${theme.warn.alt};
  background-image: ${Gradient(theme.warn.alt, theme.warn.default)};
`;

export const PendingBadge = styled(Span)`
  background-color: ${theme.special.alt};
  background-image: ${Gradient(theme.special.alt, theme.special.default)};
`;
