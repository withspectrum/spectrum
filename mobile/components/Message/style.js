// @flow
import styled from 'styled-components/native';

export const Bubble = styled.View`
  border-radius: 16px;
  align-self: ${props => (props.me ? `flex-end;` : `flex-start;`)};
  /* Android */
  elevation: 10;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 8px 16px;
  background-color: ${props =>
    props.me ? props.theme.brand.default : props.theme.generic.default};
`;
