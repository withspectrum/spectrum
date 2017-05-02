import styled from 'styled-components';
import { Wrapper } from '../../../shared/Card/style';
import {
  H2,
  P,
  Button,
  TextButton,
  FlexRow,
  Gradient,
} from '../../../shared/Globals';

export const HighlightedCard = styled(Wrapper)`
  background-color: ${props => props.theme.brand.alt};
  background-image: ${props => Gradient(props.theme.brand.alt, props.theme.brand.default)};
  color: ${props => props.theme.text.reverse};
  padding: 24px;
`;

export const Header = styled(H2)`
  color: ${props => props.theme.text.reverse};
  font-weight: 800;
`;

export const Copy = styled(P)`
  color: ${props => props.theme.text.reverse};
  font-weight: 500;
  font-size: 16px;
  margin-top: 8px;
`;

export const Question = styled(Copy)`
  font-weight: 700;
  font-size: 16px;
  margin-top: 16px;
`;

export const ButtonRow = styled(FlexRow)`
  justify-content: flex-end;
  margin-top: 32px;
`;

export const Confirm = styled(Button)`
  background-color: ${props => props.theme.bg.default};
  background-image: none;
  color: ${props => props.theme.brand.default};
`;

export const Cancel = styled(TextButton)`
  color: ${props => props.theme.text.reverse};
  margin-right: 8px;
`;
