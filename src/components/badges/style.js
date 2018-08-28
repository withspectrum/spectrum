// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { Tooltip, Gradient } from '../globals';

export const Span = styled.span`
  display: flex;
  color: ${theme.text.reverse};
  background-color: ${theme.text.alt};
  text-transform: uppercase;
  padding: 3px 4px;
  margin-left: 4px;
  font-size: 9px;
  font-weight: 800;
  border-radius: 4px;
  ${props => (props.tipText ? Tooltip(props) : '')};
  letter-spacing: 0.6px;
  line-height: 1;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.16);
  align-items: center;
  align-self: center;
`;

export const ProBadge = styled(Span)`
  background-color: ${theme.special.default};
  background-image: ${props =>
    Gradient(props.theme.special.alt, props.theme.special.default)};
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;

export const TeamBadge = styled(Span)`
  background-color: ${theme.success.default};
  background-image: ${props =>
    Gradient(props.theme.success.alt, props.theme.success.default)};
`;

export const BlockedBadge = styled(Span)`
  background-color: ${theme.warn.alt};
  background-image: ${props =>
    Gradient(props.theme.warn.alt, props.theme.warn.default)};
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;

export const PendingBadge = styled(Span)`
  background-color: ${theme.special.alt};
  background-image: ${props =>
    Gradient(props.theme.special.alt, props.theme.special.default)};
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;

export const DefaultPaymentMethodBadge = styled(Span)`
  background-color: ${theme.space.default};
  background-image: ${props =>
    Gradient(props.theme.space.default, props.theme.space.default)};
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    cursor: pointer;
  }
`;
