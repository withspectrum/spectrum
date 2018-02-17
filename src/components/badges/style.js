// @flow
import styled from 'styled-components';
import { Tooltip, Gradient } from '../globals';

export const Span = styled.span`
  color: ${({ theme }) => theme.text.reverse};
  background-color: ${props => props.theme.text.alt};
  background-image: 'none';
  text-transform: uppercase;
  padding: 2px 4px;
  margin-left: 4px;
  font-size: 9px;
  font-weight: 800;
  border-radius: 4px;
  ${props => (props.tipText ? Tooltip(props) : '')};
  align-self: center;
  line-height: 1.4;
`;

export const ProBadge = styled(Span)`
  background-color: ${props => props.theme.special.default};
  background-image: ${props =>
    Gradient(props.theme.special.alt, props.theme.special.default)};
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;

export const BlockedBadge = styled(Span)`
  background-color: ${props => props.theme.warn.alt};
  background-image: ${props =>
    Gradient(props.theme.warn.alt, props.theme.warn.default)};
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;
