// @flow
import styled from 'styled-components';
import { Tooltip } from '../globals';

export const Span = styled.span`
  color: ${({ theme }) => theme.text.reverse};
  background-color: ${props => props.theme.text.alt};
  text-transform: uppercase;
  padding: 2px 6px 1px;
  margin-left: 4px;
  font-size: 9px;
  font-weight: 900;
  border-radius: 4px;
  ${props => (props.tipText ? Tooltip(props) : '')};
  letter-spacing: 0.6px;
  align-self: center;
  line-height: 1.4;
`;

export const ProBadge = styled(Span)`
  background-color: ${props => props.theme.special.default};
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;

export const TeamBadge = styled(Span)`
  background-color: ${props => props.theme.success.default};
`;

export const BlockedBadge = styled(Span)`
  background-color: ${props => props.theme.warn.alt};
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;

export const PendingBadge = styled(Span)`
  background-color: ${props => props.theme.special.alt};
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;

export const DefaultPaymentMethodBadge = styled(Span)`
  background-color: ${props => props.theme.space.alt};
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    cursor: pointer;
  }
`;
